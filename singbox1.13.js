const { name, type = "0", rules: rules_file } = $arguments;

let config = JSON.parse($files[0]);

// 自定义规则插入（不变）
if (rules_file) {
  try {
    let customRulesRaw = await produceArtifact({ type: "file", name: rules_file });
    if (customRulesRaw) {
      let customRules = JSON.parse(customRulesRaw);
      let idx = config.route.rules.findIndex(r => r.clash_mode === "global");
      if (idx !== -1) {
        const existingRulesStr = new Set(config.route.rules.map(r => JSON.stringify(r)));
        customRules = customRules.filter(r => !existingRulesStr.has(JSON.stringify(r)));
        config.route.rules.splice(idx + 1, 0, ...customRules);
      } else {
        config.route.rules.push(...customRules);
      }
    }
  } catch (e) {}
}

// 拉取节点
let proxies = await produceArtifact({
  name,
  type: /^1$|col/i.test(type) ? "collection" : "subscription",
  platform: "sing-box",
  produceType: "internal",
});

// 节点去重
const existingTags = config.outbounds.map(o => o.tag);
proxies = proxies.filter(p => !existingTags.includes(p.tag));

config.outbounds.push(...proxies);

const allTags = proxies.map(p => p.tag);
const terminalTags = proxies.filter(p => !p.detour).map(p => p.tag);

// ── 新增：地区关键词映射 ──────────────────────────────
const regionGroups = [
  { tag: "Auto-HK", keywords: ["香港", "Hong Kong", "HK", "🇭🇰"] },
  { tag: "Auto-SG", keywords: ["新加坡", "Singapore", "SG", "🇸🇬"] },
  { tag: "Auto-TW", keywords: ["台湾", "Taiwan", "TW", "🇹🇼"] },
  { tag: "Auto-US", keywords: ["美国", "United States", "US", "USA", "🇺🇸"] },
  { tag: "Auto-JP", keywords: ["日本", "Japan", "JP", "🇯🇵"] },
];

// 按地区过滤终端节点，注入到地区 urltest 分组
regionGroups.forEach(({ tag, keywords }) => {
  const group = config.outbounds.find(o => o.tag === tag);
  if (!group || !Array.isArray(group.outbounds)) return;

  const matched = terminalTags.filter(t =>
    keywords.some(kw => t.includes(kw))
  );
  group.outbounds.push(...matched);
});

// 把地区组 tag 注入到 Default 分组（排在现有 outbounds 最前面）
const defaultGroup = config.outbounds.find(o => o.tag === "Default");
if (defaultGroup && Array.isArray(defaultGroup.outbounds)) {
  const regionTags = regionGroups.map(r => r.tag);
  // 只插入模板里实际存在的地区组
  const validRegionTags = regionTags.filter(t =>
    config.outbounds.some(o => o.tag === t)
  );
  defaultGroup.outbounds.unshift(...validRegionTags);
}
// ── 新增结束 ─────────────────────────────────────────

// 遍历分组追加节点（原有逻辑不变）
config.outbounds.forEach(group => {
  if (!Array.isArray(group.outbounds) || group.tag === "Direct-Out") return;

  // 地区组已单独处理，跳过避免混入全部节点
  if (regionGroups.some(r => r.tag === group.tag)) return;

  if (group.tag === "Relay") {
    group.outbounds.push(...terminalTags);
  } else {
    group.outbounds.push(...allTags);
  }
});

// 分组内去重
config.outbounds.forEach(group => {
  if (Array.isArray(group.outbounds)) {
    group.outbounds = [...new Set(group.outbounds)];
  }
});

$content = JSON.stringify(config, null, 2);