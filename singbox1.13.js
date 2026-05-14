const { name, type = "0", rules: rules_file } = $arguments;

// 1. 读取模板
let config = JSON.parse($files[0]);

// 2. 先追加自定义规则
if (rules_file) {
  try {
    let customRulesRaw = await produceArtifact({
      type: "file",
      name: rules_file,
    });
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

// 3. 拉取节点
let proxies = await produceArtifact({
  name,
  type: /^1$|col/i.test(type) ? "collection" : "subscription",
  platform: "sing-box",
  produceType: "internal",
});

// 4. 去重已有节点 tag
const existingTags = config.outbounds.map(o => o.tag);
proxies = proxies.filter(p => !existingTags.includes(p.tag));

// 5. 添加新节点到 outbounds
config.outbounds.push(...proxies);

// 6. 准备 tag 列表
const allTags = proxies.map(p => p.tag);
const terminalTags = proxies.filter(p => !p.detour).map(p => p.tag);

// ── 新增：地区测速组定义 ──────────────────────────────
const regionGroups = [
  { tag: "Auto-HK", keywords: ["香港", "Hong Kong", "HK", "🇭🇰"] },
  { tag: "Auto-SG", keywords: ["新加坡", "Singapore", "SG", "🇸🇬"] },
  { tag: "Auto-TW", keywords: ["台湾", "Taiwan", "TW", "🇹🇼"] },
  { tag: "Auto-US", keywords: ["美国", "United States", "US", "USA", "🇺🇸"] },
  { tag: "Auto-JP", keywords: ["日本", "Japan", "JP", "🇯🇵"] },
];
const regionTags = regionGroups.map(r => r.tag);

// 如果模板里没有这些地区组，则动态创建并插入到 Auto 分组之前
regionGroups.forEach(({ tag, keywords }) => {
  if (!config.outbounds.find(o => o.tag === tag)) {
    const autoIdx = config.outbounds.findIndex(o => o.tag === "Auto");
    const newGroup = {
      tag,
      type: "urltest",
      outbounds: [],
      url: "https://www.gstatic.com/generate_204",
      interval: "3m",
      tolerance: 50,
    };
    if (autoIdx !== -1) {
      config.outbounds.splice(autoIdx, 0, newGroup);
    } else {
      config.outbounds.push(newGroup);
    }
  }
});

// 把对应地区的终端节点注入各地区测速组
regionGroups.forEach(({ tag, keywords }) => {
  const group = config.outbounds.find(o => o.tag === tag);
  if (!group) return;
  const matched = terminalTags.filter(t =>
    keywords.some(kw => t.includes(kw))
  );
  group.outbounds.push(...matched);
});

// 将 Auto 改为 selector，outbounds 只保留五个地区组
const autoGroup = config.outbounds.find(o => o.tag === "Auto");
if (autoGroup) {
  autoGroup.type = "selector";
  autoGroup.outbounds = [...regionTags];
}
// ── 新增结束 ─────────────────────────────────────────

// 7. 遍历分组追加节点
config.outbounds.forEach(group => {
  if (!Array.isArray(group.outbounds) || group.tag === "Direct-Out") return;

  // Auto 和地区组已单独处理，跳过
  if (group.tag === "Auto" || regionTags.includes(group.tag)) return;

  if (group.tag === "Relay") {
    group.outbounds.push(...terminalTags);
  } else {
    group.outbounds.push(...allTags);
  }
});

// 8. 分组内去重
config.outbounds.forEach(group => {
  if (Array.isArray(group.outbounds)) {
    group.outbounds = [...new Set(group.outbounds)];
  }
});

// 9. 输出最终配置
$content = JSON.stringify(config, null, 2);
