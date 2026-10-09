export {events} from './events.js';
export {people} from './people.js';
export const contentVersion='ming-2';
export const scoringVersion='event-pattern-1';
export const appVersion='0.3.0';
export const axes=[
  {
    "name": "主动担当",
    "short": "担当",
    "high": "你愿意主动接下责任，即使局面还没有完全明朗。",
    "cost": "主动接下的责任，可能超过你实际能够控制的范围。"
  },
  {
    "name": "审慎布局",
    "short": "审慎",
    "high": "你习惯先准备条件、确认信息，再推进重要行动。",
    "cost": "为了减少不确定性，你有时可能错过稍纵即逝的机会。"
  },
  {
    "name": "原则表达",
    "short": "原则",
    "high": "你重视明确表达立场，不轻易让重要原则变得含糊。",
    "cost": "清楚表达底线，也可能压缩与他人继续协商的空间。"
  },
  {
    "name": "路径变通",
    "short": "变通",
    "high": "你愿意调整方法，寻找比正面冲突更有效的路径。",
    "cost": "如果总是调整手段，他人可能不容易理解你的底线。"
  },
  {
    "name": "实践求实",
    "short": "求实",
    "high": "你关注行动是否真正有效，倾向于通过实践检验办法。",
    "cost": "眼前可见的效果，可能挤压那些需要长期才能显现的价值。"
  },
  {
    "name": "协作整合",
    "short": "协作",
    "high": "你善于把不同立场和资源组织起来，共同解决问题。",
    "cost": "争取共同支持需要时间，也可能让方案失去部分锋芒。"
  },
  {
    "name": "自主探索",
    "short": "自主",
    "high": "你愿意为自己的兴趣和判断保留空间，也能接受不确定的回报。",
    "cost": "独立选择需要资源支撑，有时也需要重新协调共同责任。"
  },
  {
    "name": "感受表达",
    "short": "表达",
    "high": "你重视体验、创作和表达，让难以量化的感受也进入决策。",
    "cost": "表达的完整性与他人的理解、眼前的生计有时难以兼得。"
  }
];
export const presets={deepseek:{label:'DeepSeek',baseUrl:'https://api.deepseek.com',model:'deepseek-chat'},custom:{label:'自定义兼容接口',baseUrl:'',model:''}};
export const groups=['行动','求知','创作','关系','权力'];
