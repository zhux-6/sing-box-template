

function main(config) {

    // ════════════════════════════════════════════════════════
    //  § 1  节点分类
    // ════════════════════════════════════════════════════════
    const valid = (config.proxies || [])
        .map(p => p.name)
        .filter(n => !/(官网|流量|重置|过期|中国|Russia|Direct|剩余|到期|套餐)/i.test(n));

    const sg = valid.filter(n => /(🇸🇬|SG|Singapore|新加坡|Maglev)/i.test(n));
    const jp = valid.filter(n => /(🇯🇵|JP|Japan|日本)/i.test(n));
    const us = valid.filter(n => /(🇺🇸|US|USA|United.?States|美国)/i.test(n));
    const hk = valid.filter(n => /(🇭🇰|HK|Hong.?Kong|香港)/i.test(n));
    const tw = valid.filter(n => /(🇹🇼|TW|Taiwan|台湾)/i.test(n));



    // ════════════════════════════════════════════════════════
    //  § 2  全局基础参数
    // ════════════════════════════════════════════════════════
    config.mode                          = "rule";
    config["tcp-concurrent"]             = true;
    config["unified-delay"]              = true;
    config["find-process-mode"]          = "strict";
    config["geodata-mode"]               = true;
    config["global-client-fingerprint"]  = "chrome";
    config["keep-alive-idle"]            = 15;
    config["keep-alive-interval"]        = 15;

    // ════════════════════════════════════════════════════════
    //  § 3  TUN 虚拟网卡
    // ════════════════════════════════════════════════════════
    config.tun = {
        enable: true,
        stack: "mixed",
        "auto-route": true,
        "auto-detect-interface": true,
        "strict-route": true,
        "dns-hijack": ["any:53", "tcp://any:53"],
        mtu: 1500
    };
// ════════════════════════════════════════════════════════
//  § 4  流量嗅探 【最终优化版 · 已修复所有隐患】
// ════════════════════════════════════════════════════════
    config.sniffer = {
        enable: true,
        "parse-pure-ip": true,
        "override-destination": true,
        sniff: {
            HTTP : { ports: [80, 8080, 8880, 2052, 2082, 2086, 2095] },
            TLS  : { ports: [443, 8443, 2053, 2083, 2087, 2096] },
            QUIC : { ports: [443,8443] }
        },
        "skip-domain": [
            "Mijia Cloud",
            "+.apple.com", "+.qq.com", "+.weixin.qq.com", "+.wechat.com",
            "+.baidu.com", "+.dingtalk.com", "+.feishu.cn", "+.larksuite.com",
            "+.steamcontent.com.cn", "*.battlenet.com.cn", "+.nintendo.net",
            "+.playstation.net", "xbox.*.microsoft.com"
        ]
    };

    // ════════════════════════════════════════════════════════
//  § 5  DNS 配置 【终极防泄露 · 毕业优化版】
// ════════════════════════════════════════════════════════
    config.dns = {
        enable: true,
        listen: ':53',
        "enhanced-mode": 'fake-ip',
        "fake-ip-range": '198.18.0.1/16',
        "fake-ip-filter-mode": 'blacklist',
        "prefer-h3": false,
        "respect-rules": true,
        "use-hosts": true,
        "use-system-hosts": false,
        ipv6: false,
        "direct-nameserver-follow-policy": true,

        "fake-ip-filter": [
            '*.lan',
            '*.local',
            '*.localdomain',
            'localhost',
            '*.localhost',
            '::1',
            'localhost.ptlogin2.qq.com',
            'www.msftconnecttest.com',
            'www.msftncsi.com',
            '*.msftconnecttest.com',
            '*.msftncsi.com',
            'connectivitycheck.gstatic.com',
            'detectportal.firefox.com',
            'captive.apple.com',
            'time.*.com',
            'time.*.gov',
            'time.*.edu.cn',
            'ntp.*.com',
            '*.time.edu.cn',
            '*.ntp.org.cn',
            '+.pool.ntp.org',
            'time.windows.com',
            'time.nist.gov',
            'stun.*.*',
            'stun.*.*.*',
            '+.stun.*.*',
            '+.stun.*.*.*',
            '+.srv.nintendo.net',
            '*.n.n.srv.nintendo.net',
            '+.stun.playstation.net',
            'xbox.*.*.microsoft.com',
            '*.*.xboxlive.com',
            'speedtest.cros.wr.pvp.net',
            '*.square-enix.com',
            '*.finalfantasyxiv.com',
            '+.battlenet.com.cn',
            '+.blizzard.cn',
            '*.steamcontent.com.cn',
            '+.market.xiaomi.com',
            '+.xiaomi.com',
            'music.163.com',
            '*.music.163.com',
            '*.126.net',
            '*.127.net',
            '*.netease.com',
            '*.bilibili.com',
            '*.bilivideo.com',
            '*.bilivideo.cn',
            '*.mcdn.bilivideo.cn',
            '*.iqiyi.com',
            '*.iqiyipic.com',
            '+.bank.com',
            '+.gov.cn',
            '+.edu.cn',
            'www.baidu.com',
            '+.alipay.com',
            '+.alipayobjects.com',
            '+.wechat.com',
            '+.wx.qq.com',
            '+.weixin.qq.com',
            '+.qq.com',
            '+.tencent.com',
            '+.dingtalk.com',
            '+.feishu.cn',
            '+.larksuite.com',
            '*.cdn.qq.com',
            '*.cdn.aliyun.com',
            '+.douyin.com',
            '+.douyinvod.com',
            '+.weibo.com',
            '+.weibo.cn',
            '+.zhihu.com',
            '+.taobao.com',
            '+.tmall.com',
            '+.alibaba.com',
            '+.jd.com',
            '+.360buy.com',
            '+.meituan.com',
            '+.dianping.com',
            '+.didi.com',
            'github.com',
            '+.github.com'
        ],

        "default-nameserver": [
            '223.5.5.5',
            '119.29.29.29'
        ],

        "nameserver": [
            'https://dns.cloudflare.com/dns-query',
            'https://dns.google/dns-query'
        ],

        "proxy-server-nameserver": [
            'https://dns.alidns.com/dns-query',
            'https://1.0.0.1/dns-query'
        ],

        "direct-nameserver": [
            '223.5.5.5',
            '119.29.29.29'
        ],

        "nameserver-policy": {
            "+.microsoft.com,microsoft.com,+.phone.link,+.yourphone.microsoft.com,+.aka.ms,+.devices.microsoft.com,+.prod.devices.microsoft.com,+.azureedge.net,+.azure.com,+.login.microsoftonline.com,+.login.microsoft.com,+.msauth.net,+.msidentity.com": [
                'https://1.0.0.1/dns-query',
                'https://dns.google/dns-query'
            ],
            "geosite:cn,private": [
                '223.5.5.5',
                '119.29.29.29'
            ],
            "geosite:steam@cn": [
                '223.5.5.5',
                '119.29.29.29'
            ],
            "geosite:geolocation-!cn": [
                'https://dns.cloudflare.com/dns-query',
                'https://dns.google/dns-query'
            ]
        },

        "fallback": [
            'https://1.0.0.1/dns-query',
            'https://dns.google/dns-query'
        ],

        "fallback-filter": {
            geoip: true,
            "geoip-code": 'CN',
            ipcidr: [
                '240.0.0.0/4',
                '0.0.0.0/32',
                '127.0.0.1/32'
            ]
        }
    };


    const rp = (behavior, repo, file) => ({
        type: "http", behavior,
        url: `https://cdn.jsdelivr.net/gh/${repo}`,
        path: `./ruleset/${file}.yaml`,
        interval: 86400
    });
    const bm7 = (path, file, b = "classical") =>
        rp(b, `blackmatrix7/ios_rule_script@master/rule/Clash/${path}`, file);
    const ls  = (name, b = "domain") =>
        rp(b, `Loyalsoldier/clash-rules@release/${name}.txt`, name);

    config["rule-providers"] = {
        reject:     ls("reject"),
        openai:     bm7("OpenAI/OpenAI",       "opiena"),
        claude:     bm7("Claude/Claude",        "claude"),
        gemini:     bm7("Gemini/Gemini",        "gemini"),
        telegram:   ls("telegramcidr", "ipcidr"),
        twitter:    bm7("Twitter/Twitter",      "twitter"),
        discord:    bm7("Discord/Discord",      "discord"),
        instagram:  bm7("Instagram/Instagram",  "instagram"),
        facebook:   bm7("Facebook/Facebook",    "facebook"),
        zoom:       bm7("Zoom/Zoom",            "zoom"),
        youtube:    bm7("YouTube/YouTube",      "youtube"),
        netflix:    bm7("Netflix/Netflix",      "netflix"),
        disney:     bm7("Disney/Disney",        "disney"),
        twitch:     bm7("Twitch/Twitch",        "twitch"),
        tiktok:     bm7("TikTok/TikTok",        "tiktok"),
        bilibili:   bm7("BiliBili/BiliBili",    "bilibili"),
        spotify:    bm7("Spotify/Spotify",      "spotify"),
        microsoft:  bm7("Microsoft/Microsoft",  "microsoft", "domain"),
        apple:      ls("apple"),
        google:     ls("google"),
        github:     bm7("GitHub/GitHub",        "github"),
        docker:     bm7("Docker/Docker",        "docker"),
        steam:      bm7("Steam/Steam",          "steam"),
        paypal:     bm7("PayPal/PayPal",        "paypal"),
        amazon:     bm7("Amazon/Amazon",        "amazon"),
        proxy:      ls("proxy"),
        direct:     ls("direct"),
        private:    ls("private"),
        cncidr:     ls("cncidr",   "ipcidr"),
        lancidr:    ls("lancidr",  "ipcidr")
    };

    const urlTG = (name, proxies, interval = 300, tol = 50) => ({
        name, type: "url-test",
        url: "https://www.gstatic.com/generate_204",
        interval, tolerance: tol, lazy: true,
        proxies
    });

    config["proxy-groups"] = [

        // ── 7.1  地区自动优选（纯 SG / 单地区）──────────────
        //urlTG("♻️ 自动优选", autoPool),
        ...(sg.length ? [urlTG("🇸🇬 新加坡", sg)] : []),
        ...(jp.length ? [urlTG("🇯🇵 日本",   jp)] : []),
        ...(us.length ? [urlTG("🇺🇸 美国",   us)] : []),
        ...(hk.length ? [urlTG("🇭🇰 香港",   hk)] : []),
        ...(tw.length ? [urlTG("🇹🇼 台湾",   tw)] : []),

        // ── 7.2  推送专用（SG 低延迟，短间隔）────────────────
        urlTG("📩 推送专用", sg.length ? sg : valid, 120, 30),

        // ── 7.3  AI 自动（consistent-hashing）────────────────
        //       load-balance → 同目标域名始终走同节点
        //       例：api.openai.com → US-A / api.anthropic.com → US-B
        {
            name: "🔀 AI自动",
            type: "load-balance",
            strategy: "consistent-hashing",
            url: "https://www.gstatic.com/generate_204",
            interval: 300, lazy: true,
            proxies: us.length ? us : (sg.length ? sg : valid)
        },

        // ── 7.4  手动 Select 组 ───────────────────────────
        {
            name: "🚀 节点选择", type: "select",
            proxies: [
               // "♻️ 自动优选",
                ...(sg.length ? ["🇸🇬 新加坡"] : []),
                ...(jp.length ? ["🇯🇵 日本"]   : []),
                ...(us.length ? ["🇺🇸 美国"]   : []),
                ...(hk.length ? ["🇭🇰 香港"]   : []),
                ...(tw.length ? ["🇹🇼 台湾"]   : []),
                "DIRECT"
            ]
        },
        {
            name: "🤖 AI 服务", type: "select",
            proxies: [
                "🔀 AI自动",
                ...(us.length ? ["🇺🇸 美国"]   : []),
                ...(sg.length ? ["🇸🇬 新加坡"] : []),
               // "♻️ 自动优选",
                "🚀 节点选择"
            ]
        },
        {
            name: "💬 社交通讯", type: "select",
            proxies: [
                ...(sg.length ? ["🇸🇬 新加坡"] : []),
                ...(jp.length ? ["🇯🇵 日本"]   : []),
                //"♻️ 自动优选",
                 "🚀 节点选择"
            ]
        },
        {
            name: "📹 视频会议", type: "select",
            proxies: [
                ...(sg.length ? ["🇸🇬 新加坡"] : []),
                ...(jp.length ? ["🇯🇵 日本"]   : []),
               // "♻️ 自动优选",
                 "🚀 节点选择"
            ]
        },
        {
            name: "📺 流媒体", type: "select",
            proxies: [
                ...(sg.length ? ["🇸🇬 新加坡"] : []),
                ...(jp.length ? ["🇯🇵 日本"]   : []),
                ...(us.length ? ["🇺🇸 美国"]   : []),
               // "♻️ 自动优选",
                "🚀 节点选择"
            ]
        },
        {
            name: "🎵 国际音乐", type: "select",
            proxies: [
                ...(sg.length ? ["🇸🇬 新加坡"] : []),
                ...(jp.length ? ["🇯🇵 日本"]   : []),
                //"♻️ 自动优选", 
                "🚀 节点选择"
            ]
        },
        {
            name: "🖥️ 微软服务", type: "select",
            proxies: [
                "DIRECT",
                ...(sg.length ? ["🇸🇬 新加坡"] : []),
                //"♻️ 自动优选",
                 "🚀 节点选择"
            ]
        },
        {
            name: "🍎 苹果服务", type: "select",
            proxies: [
                "DIRECT",
                ...(sg.length ? ["🇸🇬 新加坡"] : []),
                "🚀 节点选择"
            ]
        },
        {
            name: "🎮 游戏平台", type: "select",
            proxies: [
                "DIRECT",
                ...(sg.length ? ["🇸🇬 新加坡"] : []),
                ...(jp.length ? ["🇯🇵 日本"]   : []),
               // "♻️ 自动优选",
                "🚀 节点选择"
            ]
        },
        {
            name: "🔧 开发工具", type: "select",
            proxies: [
                ...(sg.length ? ["🇸🇬 新加坡"] : []),
                ...(jp.length ? ["🇯🇵 日本"]   : []),
               // "♻️ 自动优选",
                "🚀 节点选择"
            ]
        },
        {
            name: "📰 学术新闻与云服务", type: "select",
            proxies: [
                ...(us.length ? ["🇺🇸 美国"]   : []),
                ...(sg.length ? ["🇸🇬 新加坡"] : []),
               // "♻️ 自动优选",
                "🚀 节点选择"
            ]
        },
        {
            name: "🛒 海外购物", type: "select",
            proxies: [
                ...(us.length ? ["🇺🇸 美国"]   : []),
                ...(sg.length ? ["🇸🇬 新加坡"] : []),
                //"♻️ 自动优选",
                 "🚀 节点选择"
            ]
        },

        { name: "Kazumi",      type: "select", proxies: ["🚀 节点选择", "DIRECT"] },
        { name: "🐟 漏网之鱼", type: "select", proxies: ["🚀 节点选择", "DIRECT"] },
        { name: "🛑 广告拦截", type: "select", proxies: ["REJECT", "DIRECT", "🚀 节点选择"] }
    ];

    // ════════════════════════════════════════════════════════
    //  § 8  Rules（优先级：精确 > 宽泛 | 直连 > 代理）
    // ════════════════════════════════════════════════════════
    config.rules = [

        // ═══ ① 本地回环 / 局域网（不可修改）═══════════════
        "IP-CIDR,127.0.0.0/8,DIRECT,no-resolve",
        "IP-CIDR,::1/128,DIRECT,no-resolve",
        "IP-CIDR,192.168.0.0/16,DIRECT,no-resolve",
        "IP-CIDR,10.0.0.0/8,DIRECT,no-resolve",
        "IP-CIDR,172.16.0.0/12,DIRECT,no-resolve",
        "IP-CIDR,169.254.0.0/16,DIRECT,no-resolve",
        "IP-CIDR,224.0.0.0/4,DIRECT,no-resolve",
        "DOMAIN,localhost,DIRECT",
        "DOMAIN-SUFFIX,localhost,DIRECT",
        "DST-PORT,18789,DIRECT",
        "RULE-SET,private,DIRECT",
        "RULE-SET,lancidr,DIRECT,no-resolve",

        // ═══ ② 进程直连（国内 App，代理反而触发风控）════════
        "PROCESS-NAME,kazumi.exe,Kazumi",
        "PROCESS-NAME,com.microsoft.appmanager,🖥️ 微软服务",
        "PROCESS-NAME,WeChat.exe,DIRECT",
        "PROCESS-NAME,WeChatApp.exe,DIRECT",
        "PROCESS-NAME,QQ.exe,DIRECT",
        "PROCESS-NAME,TIM.exe,DIRECT",
        "PROCESS-NAME,DingTalk.exe,DIRECT",
        "PROCESS-NAME,lark.exe,DIRECT",
        "PROCESS-NAME,Feishu.exe,DIRECT",
        "PROCESS-NAME,NeteaseMusic.exe,DIRECT",
        "PROCESS-NAME,cloudmusic.exe,DIRECT",
        "PROCESS-NAME,QQMusic.exe,DIRECT",
        // ↑ ADD 国内 App 进程直连 ↑

        // ═══ ③ 广告拦截 ═══════════════════════════════════
        "RULE-SET,reject,🛑 广告拦截",

        // ═══ ④ 国内直连（必须在境外规则前）═════════════════
        "RULE-SET,bilibili,DIRECT",
        // ↑ ADD 国内直连服务 ↑

        // ═══ ⑤ AI 服务 ═══════════════════════════════════
        "RULE-SET,openai,🤖 AI 服务",
        "RULE-SET,claude,🤖 AI 服务",
        "RULE-SET,gemini,🤖 AI 服务",
        "DOMAIN-KEYWORD,grok,🤖 AI 服务",
        "DOMAIN-SUFFIX,x.ai,🤖 AI 服务",
        "DOMAIN-SUFFIX,perplexity.ai,🤖 AI 服务",
        "DOMAIN-SUFFIX,poe.com,🤖 AI 服务",
        "DOMAIN-SUFFIX,midjourney.com,🤖 AI 服务",
        "DOMAIN-SUFFIX,stability.ai,🤖 AI 服务",
        "DOMAIN-SUFFIX,replicate.com,🤖 AI 服务",
        "DOMAIN-SUFFIX,huggingface.co,🤖 AI 服务",
        "DOMAIN-SUFFIX,cohere.com,🤖 AI 服务",
        "DOMAIN-SUFFIX,together.ai,🤖 AI 服务",
        "DOMAIN-SUFFIX,groq.com,🤖 AI 服务",
        "DOMAIN-SUFFIX,mistral.ai,🤖 AI 服务",
        "DOMAIN-SUFFIX,copilot.microsoft.com,🤖 AI 服务",
        // ↑ ADD 新 AI 工具 ↑

        // ═══ ⑥ 社交通讯 ═════════════════════════════════
        "RULE-SET,telegram,💬 社交通讯",
        "RULE-SET,twitter,💬 社交通讯",
        "RULE-SET,discord,💬 社交通讯",
        "RULE-SET,instagram,💬 社交通讯",
        "RULE-SET,facebook,💬 社交通讯",
        "DOMAIN-SUFFIX,reddit.com,💬 社交通讯",
        "DOMAIN-SUFFIX,redd.it,💬 社交通讯",
        "DOMAIN-SUFFIX,whatsapp.com,💬 社交通讯",
        "DOMAIN-SUFFIX,whatsapp.net,💬 社交通讯",
        "DOMAIN-SUFFIX,signal.org,💬 社交通讯",
        "DOMAIN-SUFFIX,line.me,💬 社交通讯",
        "DOMAIN-SUFFIX,line-scdn.net,💬 社交通讯",
        "DOMAIN-SUFFIX,snapchat.com,💬 社交通讯",
        "DOMAIN-SUFFIX,pinterest.com,💬 社交通讯",
        "DOMAIN-SUFFIX,tumblr.com,💬 社交通讯",
        "DOMAIN-SUFFIX,threads.net,💬 社交通讯",
        "DOMAIN-SUFFIX,bsky.app,💬 社交通讯",
        // ↑ ADD 新社交平台 ↑

        // ═══ ⑦ 国际流媒体 ═══════════════════════════════
        "RULE-SET,netflix,📺 流媒体",
        "RULE-SET,disney,📺 流媒体",
        "RULE-SET,youtube,📺 流媒体",
        "RULE-SET,twitch,📺 流媒体",
        "RULE-SET,tiktok,📺 流媒体",
        "DOMAIN-SUFFIX,primevideo.com,📺 流媒体",
        "DOMAIN-SUFFIX,hulu.com,📺 流媒体",
        "DOMAIN-SUFFIX,max.com,📺 流媒体",
        "DOMAIN-SUFFIX,hbomax.com,📺 流媒体",
        "DOMAIN-SUFFIX,crunchyroll.com,📺 流媒体",
        "DOMAIN-SUFFIX,funimation.com,📺 流媒体",
        "DOMAIN-SUFFIX,viu.com,📺 流媒体",
        "DOMAIN-SUFFIX,dazn.com,📺 流媒体",
        "DOMAIN-SUFFIX,peacocktv.com,📺 流媒体",
        "DOMAIN-SUFFIX,paramountplus.com,📺 流媒体",
        "DOMAIN-SUFFIX,appletvplus.com,📺 流媒体",
        // ↑ ADD 新流媒体 ↑

        // ═══ ⑧ 国际音乐 ═════════════════════════════════
        "RULE-SET,spotify,🎵 国际音乐",
        "DOMAIN-SUFFIX,tidal.com,🎵 国际音乐",
        "DOMAIN-SUFFIX,soundcloud.com,🎵 国际音乐",
        "DOMAIN-SUFFIX,last.fm,🎵 国际音乐",
        "DOMAIN-SUFFIX,bandcamp.com,🎵 国际音乐",
        "DOMAIN-SUFFIX,deezer.com,🎵 国际音乐",
        "DOMAIN-SUFFIX,applemusic.com,🎵 国际音乐",
        // ↑ ADD 新音乐平台 ↑

        // ═══ ⑨ 视频会议 ═════════════════════════════════
        "RULE-SET,zoom,📹 视频会议",
        "DOMAIN-SUFFIX,zoom.us,📹 视频会议",
        "DOMAIN-SUFFIX,zoomgov.com,📹 视频会议",
        "DOMAIN-SUFFIX,webex.com,📹 视频会议",
        "DOMAIN-SUFFIX,bluejeans.com,📹 视频会议",
        "DOMAIN-SUFFIX,goto.com,📹 视频会议",
        "DOMAIN-SUFFIX,gotomeeting.com,📹 视频会议",
        // ↑ ADD 新会议软件 ↑

        // ═══ ⑩ 微软 / 苹果 ═════════════════════════════
        "DOMAIN-SUFFIX,phone.link,🖥️ 微软服务",
        "DOMAIN-SUFFIX,aka.ms,🖥️ 微软服务",
        "DOMAIN-SUFFIX,yourphone.microsoft.com,🖥️ 微软服务",
        "DOMAIN-SUFFIX,devices.microsoft.com,🖥️ 微软服务",
        "DOMAIN-SUFFIX,prod.devices.microsoft.com,🖥️ 微软服务",
        "DOMAIN-SUFFIX,azureedge.net,🖥️ 微软服务",
        "DOMAIN-SUFFIX,azure.com,🖥️ 微软服务",
        "DOMAIN-SUFFIX,sharepoint.com,🖥️ 微软服务",
        "DOMAIN-SUFFIX,onedrive.live.com,🖥️ 微软服务",
        "DOMAIN-KEYWORD,yourphone,🖥️ 微软服务",
        "DOMAIN-KEYWORD,link-to-windows,🖥️ 微软服务",
        "DOMAIN-KEYWORD,microsoft,🖥️ 微软服务",
        "RULE-SET,microsoft,🖥️ 微软服务",
        "RULE-SET,apple,🍎 苹果服务",
        // ↑ ADD 新微软/苹果域名 ↑

        // ═══ ⑪ 游戏平台 ═════════════════════════════════
        "DOMAIN-SUFFIX,steamcontent.com.cn,DIRECT",
        "DOMAIN-SUFFIX,battlenet.com.cn,DIRECT",
        "DOMAIN-SUFFIX,blizzard.cn,DIRECT",
        "RULE-SET,steam,🎮 游戏平台",
        "DOMAIN-SUFFIX,epicgames.com,🎮 游戏平台",
        "DOMAIN-SUFFIX,ea.com,🎮 游戏平台",
        "DOMAIN-SUFFIX,origin.com,🎮 游戏平台",
        "DOMAIN-SUFFIX,ubisoft.com,🎮 游戏平台",
        "DOMAIN-SUFFIX,ubi.com,🎮 游戏平台",
        "DOMAIN-SUFFIX,gog.com,🎮 游戏平台",
        "DOMAIN-SUFFIX,riotgames.com,🎮 游戏平台",
        "DOMAIN-SUFFIX,rockstargames.com,🎮 游戏平台",
        "DOMAIN-SUFFIX,bethesda.net,🎮 游戏平台",
        "DOMAIN-SUFFIX,hltv.org,🚀 节点选择",
        // ↑ ADD 新游戏平台 ↑

        // ═══ ⑫ 开发工具 ═════════════════════════════════
        "RULE-SET,github,🔧 开发工具",
        "RULE-SET,docker,🔧 开发工具",
        "DOMAIN-SUFFIX,github.io,🔧 开发工具",
        "DOMAIN-SUFFIX,githubcopilot.com,🔧 开发工具",
        "DOMAIN-SUFFIX,raw.githubusercontent.com,🔧 开发工具",
        "DOMAIN-SUFFIX,gist.github.com,🔧 开发工具",
        "DOMAIN-SUFFIX,npmjs.com,🔧 开发工具",
        "DOMAIN-SUFFIX,npmjs.org,🔧 开发工具",
        "DOMAIN-SUFFIX,yarnpkg.com,🔧 开发工具",
        "DOMAIN-SUFFIX,pypi.org,🔧 开发工具",
        "DOMAIN-SUFFIX,pythonhosted.org,🔧 开发工具",
        "DOMAIN-SUFFIX,rust-lang.org,🔧 开发工具",
        "DOMAIN-SUFFIX,crates.io,🔧 开发工具",
        "DOMAIN-SUFFIX,pkg.go.dev,🔧 开发工具",
        "DOMAIN-SUFFIX,go.dev,🔧 开发工具",
        "DOMAIN-SUFFIX,rubygems.org,🔧 开发工具",
        "DOMAIN-SUFFIX,packagist.org,🔧 开发工具",
        "DOMAIN-SUFFIX,gradle.org,🔧 开发工具",
        "DOMAIN-SUFFIX,maven.org,🔧 开发工具",
        "DOMAIN-SUFFIX,gitlab.com,🔧 开发工具",
        "DOMAIN-SUFFIX,bitbucket.org,🔧 开发工具",
        "DOMAIN-SUFFIX,vercel.app,🔧 开发工具",
        "DOMAIN-SUFFIX,netlify.com,🔧 开发工具",
        "DOMAIN-SUFFIX,heroku.com,🔧 开发工具",
        "DOMAIN-SUFFIX,cloudflare.com,🔧 开发工具",
        "DOMAIN-SUFFIX,workers.dev,🔧 开发工具",
        "DOMAIN-SUFFIX,pages.dev,🔧 开发工具",
        "DOMAIN-SUFFIX,notion.so,🔧 开发工具",
        "DOMAIN-SUFFIX,figma.com,🔧 开发工具",
        "DOMAIN-SUFFIX,linear.app,🔧 开发工具",
        "DOMAIN-SUFFIX,jira.com,🔧 开发工具",
        "DOMAIN-SUFFIX,atlassian.com,🔧 开发工具",
        "DOMAIN-SUFFIX,stackoverflow.com,🔧 开发工具",
        "DOMAIN-SUFFIX,stackexchange.com,🔧 开发工具",
        "DOMAIN-SUFFIX,replit.com,🔧 开发工具",
        "DOMAIN-SUFFIX,gitpod.io,🔧 开发工具",
        "DOMAIN-SUFFIX,codesandbox.io,🔧 开发工具",
        "DOMAIN-SUFFIX,codepen.io,🔧 开发工具",
        "DOMAIN-SUFFIX,devcontainers.dev,🔧 开发工具",
        // ↑ ADD 新开发工具 ↑

        // ═══ ⑬ 学术 / 新闻 / 云存储 / 隐私 ═════════════
        "DOMAIN-SUFFIX,deepl.com,📰 学术新闻与云服务",
        "DOMAIN-SUFFIX,arxiv.org,📰 学术新闻与云服务",
        "DOMAIN-SUFFIX,researchgate.net,📰 学术新闻与云服务",
        "DOMAIN-SUFFIX,academia.edu,📰 学术新闻与云服务",
        "DOMAIN-SUFFIX,semanticscholar.org,📰 学术新闻与云服务",
        "DOMAIN-SUFFIX,jstor.org,📰 学术新闻与云服务",
        "DOMAIN-SUFFIX,springer.com,📰 学术新闻与云服务",
        "DOMAIN-SUFFIX,nature.com,📰 学术新闻与云服务",
        "DOMAIN-SUFFIX,sciencedirect.com,📰 学术新闻与云服务",
        "DOMAIN-SUFFIX,ieee.org,📰 学术新闻与云服务",
        "DOMAIN-SUFFIX,acm.org,📰 学术新闻与云服务",
        "DOMAIN-SUFFIX,wolfram.com,📰 学术新闻与云服务",
        "DOMAIN-SUFFIX,wolframalpha.com,📰 学术新闻与云服务",
        "DOMAIN-SUFFIX,bbc.com,📰 学术新闻与云服务",
        "DOMAIN-SUFFIX,bbc.co.uk,📰 学术新闻与云服务",
        "DOMAIN-SUFFIX,nytimes.com,📰 学术新闻与云服务",
        "DOMAIN-SUFFIX,bloomberg.com,📰 学术新闻与云服务",
        "DOMAIN-SUFFIX,reuters.com,📰 学术新闻与云服务",
        "DOMAIN-SUFFIX,theguardian.com,📰 学术新闻与云服务",
        "DOMAIN-SUFFIX,wsj.com,📰 学术新闻与云服务",
        "DOMAIN-SUFFIX,economist.com,📰 学术新闻与云服务",
        "DOMAIN-SUFFIX,ft.com,📰 学术新闻与云服务",
        "DOMAIN-SUFFIX,dropbox.com,📰 学术新闻与云服务",
        "DOMAIN-SUFFIX,box.com,📰 学术新闻与云服务",
        "DOMAIN-SUFFIX,mega.nz,📰 学术新闻与云服务",
        "DOMAIN-SUFFIX,proton.me,📰 学术新闻与云服务",
        "DOMAIN-SUFFIX,protonmail.com,📰 学术新闻与云服务",
        "DOMAIN-SUFFIX,1password.com,📰 学术新闻与云服务",
        "DOMAIN-SUFFIX,bitwarden.com,📰 学术新闻与云服务",
        // ↑ ADD 新学术/新闻/云存储/隐私 ↑

        // ═══ ⑭ 海外购物 & 支付 ═════════════════════════
        "RULE-SET,paypal,🛒 海外购物",
        "RULE-SET,amazon,🛒 海外购物",
        "DOMAIN-SUFFIX,ebay.com,🛒 海外购物",
        "DOMAIN-SUFFIX,aliexpress.com,🛒 海外购物",
        "DOMAIN-SUFFIX,wise.com,🛒 海外购物",
        "DOMAIN-SUFFIX,stripe.com,🛒 海外购物",
        "DOMAIN-SUFFIX,etsy.com,🛒 海外购物",
        "DOMAIN-SUFFIX,shopify.com,🛒 海外购物",
        // ↑ ADD 新购物/支付平台 ↑

        // ═══ ⑮ Google 全家桶 ═══════════════════════════
        "RULE-SET,google,🚀 节点选择",

        // ═══ ⑯ 通用代理库（境外域名兜底）═══════════════
        "RULE-SET,proxy,🚀 节点选择",

        //防止浏览器WebRTC泄露
        "AND,(PROCESS-NAME,chrome.exe),(DST-PORT,3478),🚀 节点选择",
        "AND,(PROCESS-NAME,chrome.exe),(DST-PORT,19302),🚀 节点选择",
        "AND,(PROCESS-NAME,msedge.exe),(DST-PORT,3478),🚀 节点选择",
        "AND,(PROCESS-NAME,msedge.exe),(DST-PORT,19302),🚀 节点选择",
        

        // ═══ ⑰ 直连库 & 中国 IP（不可移动，顺序固定）════
        "RULE-SET,direct,DIRECT",
        "RULE-SET,cncidr,DIRECT,no-resolve",
        "GEOIP,CN,DIRECT,no-resolve",

        // ═══ ⑱ 最终兜底 ═══════════════════════════════
        "MATCH,🐟 漏网之鱼"
    ];

    return config;
}像我目前这个JS脚本，想把它分成YAML和JS要怎么分 