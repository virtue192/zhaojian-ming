import {quotes} from './quotes.js';
// Patterns are editorial game analogies, never records of hypothetical historical answers.
export const people = [
  {
    "id": "yu",
    "name": "于谦",
    "courtesy": "廷益",
    "years": "1398—1457",
    "tag": "危局中的担当者",
    "seal": "守",
    "color": "#52604c",
    "line": "风雨将至，先把眼前的城守住。",
    "summary": "在这个游戏的比较里，于谦代表危机中的责任承担与组织行动。你倾向于先稳住关键局面，并把自己放进需要承担后果的位置。",
    "difference": "一次危机中的相似选择，不能代表你与于谦的完整人生或性格相同。你在协商、组织和新知上的回答，会让这份相似呈现不同的侧面。",
    "facts": [
      "土木之变后反对都城南迁。",
      "参与拥立景帝，总督军务。"
    ],
    "source": {
      "name": "故宫博物院 · 于谦",
      "url": "https://www.dpm.org.cn/lemmas/243960.html"
    },
    "gender": "男",
    "group": "行动",
    "stage": "危机中的行动",
    "pattern": {
      "beijing": "beijing-0",
      "rebellion": "rebellion-0",
      "army": "army-0",
      "memorial": "memorial-0",
      "reform": "reform-0",
      "calendar": "calendar-0",
      "herbs": "herbs-2",
      "journey": "journey-1",
      "craft": "craft-0",
      "art": "art-2",
      "family": "family-1",
      "stage": "stage-3"
    },
    "anchors": [
      "beijing",
      "rebellion",
      "memorial"
    ]
  },
  {
    "id": "wang",
    "name": "王守仁",
    "courtesy": "伯安 · 阳明",
    "years": "1472—1529",
    "tag": "变局中的行动者",
    "seal": "行",
    "color": "#8a694b",
    "line": "局势未明，也要找到可行的一步。",
    "summary": "王守仁在本游戏里代表变局中的主动行动。你的回答更愿意在不完美的条件下先推进，并根据局势调整路径。",
    "difference": "这里主要借助宁王之乱的行动记录进行类比，不据此推断你具有王守仁的哲学思想或军事能力。",
    "facts": [
      "1519 年领导平定宁王朱宸濠叛乱。",
      "平叛后的献俘过程亦涉及复杂的政治处境。"
    ],
    "source": {
      "name": "故宫博物院 · 王守仁平叛研究",
      "url": "https://www.dpm.org.cn/journal/247247.html"
    },
    "gender": "男",
    "group": "行动",
    "stage": "成熟时期的实践",
    "pattern": {
      "beijing": "beijing-0",
      "rebellion": "rebellion-0",
      "army": "army-1",
      "memorial": "memorial-1",
      "reform": "reform-2",
      "calendar": "calendar-0",
      "herbs": "herbs-0",
      "journey": "journey-0",
      "craft": "craft-2",
      "art": "art-1",
      "family": "family-0",
      "stage": "stage-0"
    },
    "anchors": [
      "rebellion",
      "calendar",
      "herbs"
    ]
  },
  {
    "id": "qi",
    "name": "戚继光",
    "courtesy": "元敬",
    "years": "1528—1588",
    "tag": "把办法做实的人",
    "seal": "练",
    "color": "#5a6456",
    "line": "把一次胜负，做成可重复的能力。",
    "summary": "戚继光的招兵与练兵实践，是本游戏比较组织建设的参照。你的选择重视准备、训练和具体条件，倾向于把办法做成长期可用的能力。",
    "difference": "本次匹配集中于组织与实践方式；历史上的军事能力、功绩与个人处境无法通过六道题复现。",
    "facts": [
      "在义乌招募兵员。",
      "以训练与组织建设形成抗倭力量。"
    ],
    "source": {
      "name": "义乌地方志 · 戚继光招兵资料",
      "url": "https://zjjcmspublic.oss-cn-hangzhou-zwynet-d01-a.internet.cloud.zj.gov.cn/jcms_files/jcms1/web3549/site/attach/0/e109025165fb4c90a9068393f3b6eaac.pdf"
    },
    "gender": "男",
    "group": "行动",
    "stage": "训练与组织时期",
    "pattern": {
      "beijing": "beijing-0",
      "rebellion": "rebellion-3",
      "army": "army-1",
      "memorial": "memorial-3",
      "reform": "reform-1",
      "calendar": "calendar-2",
      "herbs": "herbs-1",
      "journey": "journey-2",
      "craft": "craft-0",
      "art": "art-1",
      "family": "family-2",
      "stage": "stage-3"
    },
    "anchors": [
      "army",
      "reform",
      "craft"
    ]
  },
  {
    "id": "hai",
    "name": "海瑞",
    "courtesy": "汝贤",
    "years": "1514—1587",
    "tag": "把底线说清的人",
    "seal": "直",
    "color": "#a34937",
    "line": "有些话，总要有人清楚地说出来。",
    "summary": "海瑞上疏的经历，是本游戏比较原则表达与风险承担的参照。你的选择更在意立场是否清楚，愿意为表达底线付出代价。",
    "difference": "直言只是海瑞历史行为的一部分。你的答案也包含对风险和效果的判断，不应被简化为“越强硬越正直”。",
    "facts": [
      "上《治安疏》直接批评嘉靖皇帝。",
      "因上疏被投入狱中，后来获释复职。"
    ],
    "source": {
      "name": "故宫博物院 · 海瑞",
      "url": "https://www.dpm.org.cn/court/figure/104050.html"
    },
    "gender": "男",
    "group": "行动",
    "stage": "成年后的直言",
    "pattern": {
      "beijing": "beijing-0",
      "rebellion": "rebellion-1",
      "army": "army-0",
      "memorial": "memorial-0",
      "reform": "reform-0",
      "calendar": "calendar-0",
      "herbs": "herbs-0",
      "journey": "journey-2",
      "craft": "craft-0",
      "art": "art-0",
      "family": "family-1",
      "stage": "stage-0"
    },
    "anchors": [
      "memorial",
      "beijing",
      "herbs"
    ]
  },
  {
    "id": "zhang",
    "name": "张居正",
    "courtesy": "叔大",
    "years": "1525—1582",
    "tag": "让改变发生的人",
    "seal": "成",
    "color": "#6c5945",
    "line": "办法写在纸上，还要落在人间。",
    "summary": "张居正推行考成法，是本游戏比较执行与改革的参照。你的选择更关注办法能否落地，也愿意调整路径、调动资源促成改变。",
    "difference": "重视结果不等于认可张居正的全部政治手段。你选择的改革速度、地方空间与协商方式，仍可能与他明显不同。",
    "facts": [
      "推行考成法，加强对官员的考核。",
      "在政治、经济与军事等方面推动改革。"
    ],
    "source": {
      "name": "故宫博物院 · 张居正",
      "url": "https://www.dpm.org.cn/court/figure/104014.html"
    },
    "gender": "男",
    "group": "行动",
    "stage": "改革时期",
    "pattern": {
      "beijing": "beijing-3",
      "rebellion": "rebellion-2",
      "army": "army-1",
      "memorial": "memorial-1",
      "reform": "reform-0",
      "calendar": "calendar-1",
      "herbs": "herbs-1",
      "journey": "journey-1",
      "craft": "craft-1",
      "art": "art-2",
      "family": "family-2",
      "stage": "stage-3"
    },
    "anchors": [
      "reform",
      "rebellion",
      "family"
    ]
  },
  {
    "id": "xu",
    "name": "徐光启",
    "courtesy": "子先",
    "years": "1562—1633",
    "tag": "向证据敞开的人",
    "seal": "通",
    "color": "#65786b",
    "line": "方法从哪里来，终究要看它能解释什么。",
    "summary": "徐光启参与中西修历，是本游戏比较求实与知识会通的参照。你倾向于理解、检验和吸收新方法，再把它接入已有的实践。",
    "difference": "采用新方法并不意味着全盘接受其来源。你的回答表达的是本次情境里的决策倾向，无法推断宗教信仰或学术能力。",
    "facts": [
      "主持编修《崇祯历书》的相关工作。",
      "提出先译后制，研究并参用西方天文学方法。"
    ],
    "source": {
      "name": "故宫博物院 · 崇祯历书",
      "url": "https://www.dpm.org.cn/lemmas/240416.html"
    },
    "gender": "男",
    "group": "求知",
    "stage": "晚年修历时期",
    "pattern": {
      "beijing": "beijing-2",
      "rebellion": "rebellion-2",
      "army": "army-2",
      "memorial": "memorial-1",
      "reform": "reform-1",
      "calendar": "calendar-0",
      "herbs": "herbs-0",
      "journey": "journey-0",
      "craft": "craft-0",
      "art": "art-3",
      "family": "family-2",
      "stage": "stage-1"
    },
    "anchors": [
      "calendar",
      "herbs",
      "craft"
    ]
  },
  {
    "id": "qin",
    "name": "秦良玉",
    "gender": "女",
    "group": "行动",
    "stage": "成年至晚年的军事行动",
    "years": "1574—1648",
    "courtesy": "贞素",
    "tag": "组织力量，也守护一方",
    "seal": "卫",
    "color": "#65734a",
    "line": "责任可以落在任何人的肩上。",
    "summary": "你在组织行动与关系责任之间寻找接合点。游戏以秦良玉的军事行动记录作参照，比较担当与资源组织的侧面。",
    "facts": [
      "参与军事行动，统领白杆兵。",
      "在明末承担保境与军务责任。"
    ],
    "source": {
      "name": "重庆地方志 · 秦良玉",
      "url": "https://dfz.cq.gov.cn/zqlswh/rwby_417819/202311/t20231102_12510540.html"
    },
    "pattern": {
      "beijing": "beijing-0",
      "rebellion": "rebellion-0",
      "army": "army-1",
      "memorial": "memorial-2",
      "reform": "reform-0",
      "calendar": "calendar-2",
      "herbs": "herbs-1",
      "journey": "journey-1",
      "craft": "craft-0",
      "art": "art-2",
      "family": "family-0",
      "stage": "stage-3"
    },
    "difference": "这里比较的是史料启发的游戏画像。你的年龄、性别和职业不会限制匹配；个体经历、社会资源与历史结局不能从这些回答推出。",
    "anchors": [
      "beijing",
      "army",
      "family"
    ]
  },
  {
    "id": "lishizhen",
    "name": "李时珍",
    "gender": "男",
    "group": "求知",
    "stage": "多年编书与验证",
    "years": "1518—1593",
    "courtesy": "东璧",
    "tag": "耐心核对的记录者",
    "seal": "辨",
    "color": "#7d7553",
    "line": "把一个疑问，追到能说清的地方。",
    "summary": "你愿意花时间核对具体问题，在可用性与记录的准确之间安排工作。李时珍编写《本草纲目》的实践提供了求证与耐心的参照。",
    "facts": [
      "参考医药著作，结合自身见闻编写《本草纲目》。",
      "书稿经过多次修改，于 1578 年完成。"
    ],
    "source": {
      "name": "中国国家博物馆 · 本草纲目",
      "url": "https://www.chnmuseum.cn/zp/zpml/gjwxbt/202203/t20220301_254064.shtml"
    },
    "pattern": {
      "beijing": "beijing-1",
      "rebellion": "rebellion-3",
      "army": "army-2",
      "memorial": "memorial-3",
      "reform": "reform-1",
      "calendar": "calendar-0",
      "herbs": "herbs-0",
      "journey": "journey-2",
      "craft": "craft-0",
      "art": "art-3",
      "family": "family-2",
      "stage": "stage-1"
    },
    "difference": "这里比较的是史料启发的游戏画像。你的年龄、性别和职业不会限制匹配；个体经历、社会资源与历史结局不能从这些回答推出。",
    "anchors": [
      "herbs",
      "craft",
      "calendar"
    ]
  },
  {
    "id": "xiake",
    "name": "徐霞客",
    "gender": "男",
    "group": "求知",
    "stage": "长期游历与记录",
    "years": "1587—1641",
    "courtesy": "弘祖 · 振之",
    "tag": "走向未知的观察者",
    "seal": "游",
    "color": "#648071",
    "line": "好奇心，也可以成为一条路。",
    "summary": "你的选择为自主探索保留空间，并重视亲自看见的证据。徐霞客的游历记录提供了探索、观察与不确定回报的参照。",
    "facts": [
      "在游历中考察地貌、水文等。",
      "实地观察与行程记录形成《徐霞客游记》。"
    ],
    "source": {
      "name": "中国国家博物馆 · 徐霞客游记",
      "url": "https://www.chnmuseum.cn/zp/zpml/gjwxbt/202203/t20220301_254063.shtml"
    },
    "pattern": {
      "beijing": "beijing-2",
      "rebellion": "rebellion-0",
      "army": "army-3",
      "memorial": "memorial-3",
      "reform": "reform-2",
      "calendar": "calendar-0",
      "herbs": "herbs-0",
      "journey": "journey-0",
      "craft": "craft-2",
      "art": "art-3",
      "family": "family-3",
      "stage": "stage-1"
    },
    "difference": "这里比较的是史料启发的游戏画像。你的年龄、性别和职业不会限制匹配；个体经历、社会资源与历史结局不能从这些回答推出。",
    "anchors": [
      "journey",
      "herbs",
      "art"
    ]
  },
  {
    "id": "song",
    "name": "宋应星",
    "gender": "男",
    "group": "求知",
    "stage": "著述与技艺整理时期",
    "years": "1587—约1666",
    "courtesy": "长庚",
    "tag": "把技艺写清的人",
    "seal": "工",
    "color": "#6d7957",
    "line": "手上的办法，值得认真留下。",
    "summary": "你关注实践能否被他人理解和使用。宋应星记述生产技术的著述，提供了记录、验证与实用知识的参照。",
    "facts": [
      "著《天工开物》，记录农业与手工业技术。",
      "著作结合文字与图示，初刊于 1637 年。"
    ],
    "source": {
      "name": "中国国家博物馆 · 天工开物",
      "url": "https://www.chnmuseum.cn/zp/zpml/gjwxbt/202203/t20220301_254061.shtml"
    },
    "pattern": {
      "beijing": "beijing-1",
      "rebellion": "rebellion-3",
      "army": "army-1",
      "memorial": "memorial-3",
      "reform": "reform-2",
      "calendar": "calendar-0",
      "herbs": "herbs-1",
      "journey": "journey-2",
      "craft": "craft-0",
      "art": "art-3",
      "family": "family-2",
      "stage": "stage-1"
    },
    "difference": "这里比较的是史料启发的游戏画像。你的年龄、性别和职业不会限制匹配；个体经历、社会资源与历史结局不能从这些回答推出。",
    "anchors": [
      "craft",
      "herbs",
      "reform"
    ]
  },
  {
    "id": "tang",
    "name": "唐寅",
    "gender": "男",
    "group": "创作",
    "stage": "仕途受挫后的创作",
    "years": "1470—1523",
    "courtesy": "伯虎",
    "tag": "另找生活道路的创作者",
    "seal": "逸",
    "color": "#956f57",
    "line": "路变了，也能留下自己的笔墨。",
    "summary": "你愿意用自己的技艺寻找生活道路，同时为表达保留空间。唐寅受科场事件牵连后卖画为生的经历，是创作与谋生的参照。",
    "facts": [
      "受会试舞弊案牵连后，转向以卖画谋生。",
      "曾离开宁王府，返回苏州。"
    ],
    "source": {
      "name": "故宫博物院 · 唐寅",
      "url": "https://www.dpm.org.cn/lemmas/242652.html"
    },
    "pattern": {
      "beijing": "beijing-2",
      "rebellion": "rebellion-3",
      "army": "army-3",
      "memorial": "memorial-3",
      "reform": "reform-3",
      "calendar": "calendar-2",
      "herbs": "herbs-2",
      "journey": "journey-0",
      "craft": "craft-2",
      "art": "art-0",
      "family": "family-3",
      "stage": "stage-0"
    },
    "difference": "这里比较的是史料启发的游戏画像。你的年龄、性别和职业不会限制匹配；个体经历、社会资源与历史结局不能从这些回答推出。",
    "anchors": [
      "art",
      "journey",
      "stage"
    ]
  },
  {
    "id": "wen",
    "name": "文徵明",
    "gender": "男",
    "group": "创作",
    "stage": "归乡后的长期创作",
    "years": "1470—1559",
    "courtesy": "徵仲",
    "tag": "沉心经营的艺术家",
    "seal": "修",
    "color": "#6b7566",
    "line": "在自己的日常里，把功夫做深。",
    "summary": "你更愿意为长期创作建立稳定节奏。文徵明归乡后的诗文书画实践，为专注、积累与个人道路提供参照。",
    "facts": [
      "科举经历坎坷，后来受荐任翰林待诏。",
      "辞归故里后，潜心诗文与书画。"
    ],
    "source": {
      "name": "故宫博物院 · 文徵明生平",
      "url": "https://www.dpm.org.cn/collection/paint/234421.html"
    },
    "pattern": {
      "beijing": "beijing-1",
      "rebellion": "rebellion-1",
      "army": "army-2",
      "memorial": "memorial-3",
      "reform": "reform-1",
      "calendar": "calendar-2",
      "herbs": "herbs-0",
      "journey": "journey-2",
      "craft": "craft-3",
      "art": "art-1",
      "family": "family-1",
      "stage": "stage-1"
    },
    "difference": "这里比较的是史料启发的游戏画像。你的年龄、性别和职业不会限制匹配；个体经历、社会资源与历史结局不能从这些回答推出。",
    "anchors": [
      "art",
      "journey",
      "stage"
    ]
  },
  {
    "id": "tangxianzu",
    "name": "汤显祖",
    "gender": "男",
    "group": "创作",
    "stage": "戏剧创作时期",
    "years": "1550—1616",
    "courtesy": "义仍",
    "tag": "让愿望进入故事的人",
    "seal": "梦",
    "color": "#936b60",
    "line": "那些难以说出口的愿望，也值得被看见。",
    "summary": "你的选择重视感受与表达的完整。游戏借《牡丹亭》对情感与秩序的书写，比较创作、自由与公开表达。",
    "facts": [
      "创作《牡丹亭》。",
      "作品通过人物故事展开情感、生命与社会主题。"
    ],
    "source": {
      "name": "北京市政府 · 牡丹亭原著与演出",
      "url": "https://www.beijing.gov.cn/renwen/cshd/202311/t20231115_3301519.html"
    },
    "pattern": {
      "beijing": "beijing-2",
      "rebellion": "rebellion-0",
      "army": "army-3",
      "memorial": "memorial-0",
      "reform": "reform-3",
      "calendar": "calendar-2",
      "herbs": "herbs-3",
      "journey": "journey-1",
      "craft": "craft-2",
      "art": "art-0",
      "family": "family-1",
      "stage": "stage-0"
    },
    "difference": "这里比较的是史料启发的游戏画像。你的年龄、性别和职业不会限制匹配；个体经历、社会资源与历史结局不能从这些回答推出。",
    "anchors": [
      "stage",
      "art",
      "family"
    ]
  },
  {
    "id": "lizhi",
    "name": "李贽",
    "gender": "男",
    "group": "创作",
    "stage": "晚年著述与讨论",
    "years": "1527—1602",
    "courtesy": "卓吾",
    "tag": "保留独立判断的人",
    "seal": "问",
    "color": "#9a6952",
    "line": "熟悉的答案，也可以再问一次。",
    "summary": "你愿意为自己的判断保留空间，并直接表达疑问。李贽的著述活动提供了思想独立与公开讨论的历史参照。",
    "facts": [
      "著有《焚书》《藏书》等。",
      "在著述与讲学中讨论既有思想和社会观念。"
    ],
    "source": {
      "name": "泉州市政府 · 李贽",
      "url": "https://quanzhou.gov.cn/lyb/lswh/lsmr/201609/t20160914_372767.htm"
    },
    "pattern": {
      "beijing": "beijing-2",
      "rebellion": "rebellion-0",
      "army": "army-3",
      "memorial": "memorial-0",
      "reform": "reform-2",
      "calendar": "calendar-0",
      "herbs": "herbs-0",
      "journey": "journey-0",
      "craft": "craft-2",
      "art": "art-0",
      "family": "family-3",
      "stage": "stage-0"
    },
    "difference": "这里比较的是史料启发的游戏画像。你的年龄、性别和职业不会限制匹配；个体经历、社会资源与历史结局不能从这些回答推出。",
    "anchors": [
      "memorial",
      "stage",
      "calendar"
    ]
  },
  {
    "id": "wenchu",
    "name": "文俶",
    "gender": "女",
    "group": "创作",
    "stage": "成年后的书画创作",
    "years": "1595—1634",
    "courtesy": "端容",
    "tag": "在细部里建立世界的人",
    "seal": "绘",
    "color": "#809075",
    "line": "近处的草木，也有值得凝视的世界。",
    "summary": "你在有限范围里认真观察与创作，更在意作品能否表达自己的感受。文俶的绘画记录提供了专注、日常观察与创作空间的参照。",
    "facts": [
      "明代吴门地区的女性画家。",
      "有花卉草虫等题材的传世绘画作品。"
    ],
    "source": {
      "name": "故宫博物院 · 文俶与仇珠研究",
      "url": "https://www.dpm.org.cn/paints/talk/203814.html"
    },
    "pattern": {
      "beijing": "beijing-1",
      "rebellion": "rebellion-3",
      "army": "army-2",
      "memorial": "memorial-3",
      "reform": "reform-1",
      "calendar": "calendar-2",
      "herbs": "herbs-0",
      "journey": "journey-2",
      "craft": "craft-3",
      "art": "art-1",
      "family": "family-1",
      "stage": "stage-2"
    },
    "difference": "这里比较的是史料启发的游戏画像。你的年龄、性别和职业不会限制匹配；个体经历、社会资源与历史结局不能从这些回答推出。",
    "anchors": [
      "art",
      "herbs",
      "stage"
    ]
  },
  {
    "id": "mashou",
    "name": "马守真",
    "gender": "女",
    "group": "创作",
    "stage": "诗画与交往时期",
    "years": "1548—1604",
    "courtesy": "湘兰",
    "tag": "以作品连接他人的人",
    "seal": "兰",
    "color": "#8b7d72",
    "line": "作品可以是表达，也可以是一种相遇。",
    "summary": "你的选择把创作与交流联系起来。马守真的绘画作品与艺术活动，提供了表达、个人空间与社会交往的参照。",
    "facts": [
      "明代女性画家，亦以马湘兰之名为人所知。",
      "有兰石题材作品被博物馆收藏或归于其名下。"
    ],
    "source": {
      "name": "大都会艺术博物馆 · 马守真作品",
      "url": "https://www.metmuseum.org/art/collection/search/48932"
    },
    "pattern": {
      "beijing": "beijing-2",
      "rebellion": "rebellion-2",
      "army": "army-3",
      "memorial": "memorial-2",
      "reform": "reform-3",
      "calendar": "calendar-1",
      "herbs": "herbs-2",
      "journey": "journey-1",
      "craft": "craft-1",
      "art": "art-0",
      "family": "family-0",
      "stage": "stage-2"
    },
    "difference": "这里比较的是史料启发的游戏画像。你的年龄、性别和职业不会限制匹配；个体经历、社会资源与历史结局不能从这些回答推出。",
    "anchors": [
      "art",
      "family",
      "stage"
    ]
  },
  {
    "id": "xue",
    "name": "薛素素",
    "gender": "女",
    "group": "创作",
    "stage": "多种技艺与创作时期",
    "years": "明中后期",
    "courtesy": "润娘",
    "tag": "给自己多种可能的人",
    "seal": "展",
    "color": "#857665",
    "line": "人的表达，可以有不止一种方式。",
    "summary": "你倾向于为独立表达与多种实践保留空间。薛素素的书画与技艺记录提供了多面创作的参照。",
    "facts": [
      "明代女性画家，存有兰竹等题材作品。",
      "相关记载涉及她的诗画与多种技艺。"
    ],
    "source": {
      "name": "故宫博物院 · 薛素素",
      "url": "https://www.dpm.org.cn/Uploads/wenhua/E9/06-01.htm"
    },
    "pattern": {
      "beijing": "beijing-2",
      "rebellion": "rebellion-0",
      "army": "army-3",
      "memorial": "memorial-0",
      "reform": "reform-2",
      "calendar": "calendar-0",
      "herbs": "herbs-0",
      "journey": "journey-0",
      "craft": "craft-2",
      "art": "art-0",
      "family": "family-0",
      "stage": "stage-2"
    },
    "difference": "这里比较的是史料启发的游戏画像。你的年龄、性别和职业不会限制匹配；个体经历、社会资源与历史结局不能从这些回答推出。",
    "anchors": [
      "art",
      "stage",
      "journey"
    ]
  },
  {
    "id": "shen",
    "name": "沈宜修",
    "gender": "女",
    "group": "关系",
    "stage": "家庭文学与记录时期",
    "years": "1590—1635",
    "courtesy": "宛君",
    "tag": "让身边声音被保存的人",
    "seal": "集",
    "color": "#778271",
    "line": "把别人认真写下，也是一种创造。",
    "summary": "你更愿意让关系、作者意愿和作品保存共同进入决定。沈宜修的诗文及家庭文学活动，为共同创作与声音保存提供参照。",
    "facts": [
      "参与午梦堂家庭的诗文创作与唱和。",
      "她及家人的作品后收入《午梦堂集》。"
    ],
    "source": {
      "name": "苏州地方志 · 沈宜修",
      "url": "https://dfzb.suzhou.gov.cn/dfzb/szdq/202308/f1c3986a7b31423da1fa9110ff1ff1bf.shtml"
    },
    "pattern": {
      "beijing": "beijing-3",
      "rebellion": "rebellion-2",
      "army": "army-3",
      "memorial": "memorial-2",
      "reform": "reform-3",
      "calendar": "calendar-3",
      "herbs": "herbs-3",
      "journey": "journey-3",
      "craft": "craft-1",
      "art": "art-1",
      "family": "family-0",
      "stage": "stage-3"
    },
    "difference": "这里比较的是史料启发的游戏画像。你的年龄、性别和职业不会限制匹配；个体经历、社会资源与历史结局不能从这些回答推出。",
    "anchors": [
      "family",
      "art",
      "journey"
    ]
  },
  {
    "id": "huang",
    "name": "黄峨",
    "gender": "女",
    "group": "关系",
    "stage": "长期生活与诗曲创作",
    "years": "1498—1569",
    "courtesy": "秀眉",
    "tag": "在牵挂中保留自己的人",
    "seal": "书",
    "color": "#987b68",
    "line": "承担生活，也可以保留自己的声音。",
    "summary": "你愿意同时考虑关系责任与个人表达。黄峨的诗曲与生活记录，为长期牵挂、独立表达和日常经营提供参照。",
    "facts": [
      "创作诗词与散曲。",
      "在与杨慎长期分离的生活中留下诗曲表达。"
    ],
    "source": {
      "name": "保山市纪委 · 杨慎与黄峨",
      "url": "https://bssjw.gov.cn/info/1197/38367.htm"
    },
    "pattern": {
      "beijing": "beijing-1",
      "rebellion": "rebellion-2",
      "army": "army-3",
      "memorial": "memorial-2",
      "reform": "reform-3",
      "calendar": "calendar-2",
      "herbs": "herbs-2",
      "journey": "journey-1",
      "craft": "craft-1",
      "art": "art-0",
      "family": "family-0",
      "stage": "stage-0"
    },
    "difference": "这里比较的是史料启发的游戏画像。你的年龄、性别和职业不会限制匹配；个体经历、社会资源与历史结局不能从这些回答推出。",
    "anchors": [
      "journey",
      "family",
      "stage"
    ]
  },
  {
    "id": "ye",
    "name": "叶小鸾",
    "gender": "女",
    "group": "创作",
    "stage": "青年时期的诗文创作",
    "years": "1616—1632",
    "courtesy": "琼章",
    "tag": "为感受寻找语言的人",
    "seal": "初",
    "color": "#929177",
    "line": "尚未走远，也可以认真表达眼前的世界。",
    "summary": "你愿意留意自己的感受，在近处观察中尝试表达。叶小鸾青年时期的作品提供了有限经历中的创作参照；这份画像的史料范围较窄。",
    "facts": [
      "青年时期已有诗文与艺术活动记录。",
      "相关作品由家庭保存，并进入《午梦堂集》的传播。"
    ],
    "source": {
      "name": "故宫博物院 · 叶小鸾研究",
      "url": "https://www.dpm.org.cn/Uploads/File/2021/03/29/u60619b08edfd9.pdf"
    },
    "pattern": {
      "beijing": "beijing-2",
      "rebellion": "rebellion-1",
      "army": "army-3",
      "memorial": "memorial-3",
      "reform": "reform-3",
      "calendar": "calendar-2",
      "herbs": "herbs-2",
      "journey": "journey-2",
      "craft": "craft-3",
      "art": "art-0",
      "family": "family-3",
      "stage": "stage-2"
    },
    "difference": "这里比较的是史料启发的游戏画像。你的年龄、性别和职业不会限制匹配；个体经历、社会资源与历史结局不能从这些回答推出。",
    "anchors": [
      "art",
      "family",
      "stage"
    ]
  },
  {
    "id": "hongwu",
    "name": "朱元璋",
    "gender": "男",
    "group": "权力",
    "stage": "开国与制度建立时期",
    "years": "1328—1398",
    "courtesy": "国瑞",
    "tag": "试图建立明确秩序的人",
    "seal": "立",
    "color": "#85694d",
    "line": "局面要稳定，规则也要真正生效。",
    "summary": "你在某些情境中重视明确规则与集中执行。游戏以朱元璋建国及制度建设记录作局部参照；匹配不表示赞同其全部统治手段。",
    "facts": [
      "建立明朝，推行制度与行政政策。",
      "加强皇权与中央控制。"
    ],
    "source": {
      "name": "故宫博物院 · 洪武皇帝",
      "url": "https://www.dpm.org.cn/court/lineage/226244.html"
    },
    "pattern": {
      "beijing": "beijing-3",
      "rebellion": "rebellion-0",
      "army": "army-0",
      "memorial": "memorial-0",
      "reform": "reform-0",
      "calendar": "calendar-0",
      "herbs": "herbs-1",
      "journey": "journey-1",
      "craft": "craft-0",
      "art": "art-2",
      "family": "family-2",
      "stage": "stage-3"
    },
    "difference": "这里比较的是史料启发的游戏画像。你的年龄、性别和职业不会限制匹配；个体经历、社会资源与历史结局不能从这些回答推出。",
    "anchors": [
      "beijing",
      "reform",
      "craft"
    ]
  },
  {
    "id": "yongle",
    "name": "朱棣",
    "gender": "男",
    "group": "权力",
    "stage": "迁都与大型工程时期",
    "years": "1360—1424",
    "courtesy": "永乐",
    "tag": "推动大规模行动的人",
    "seal": "拓",
    "color": "#756950",
    "line": "把方向定下来，再组织长远的行动。",
    "summary": "你在方向选择和资源调动上愿意主动推进。迁都北京及大型文化工程提供了组织与规模行动的参照，亦需要看见其成本。",
    "facts": [
      "营建北京宫殿并迁都北京。",
      "组织编纂《永乐大典》等大型文化工程。"
    ],
    "source": {
      "name": "故宫博物院 · 永乐皇帝",
      "url": "https://www.dpm.org.cn/court/lineage/226257.html"
    },
    "pattern": {
      "beijing": "beijing-0",
      "rebellion": "rebellion-0",
      "army": "army-0",
      "memorial": "memorial-1",
      "reform": "reform-0",
      "calendar": "calendar-1",
      "herbs": "herbs-1",
      "journey": "journey-0",
      "craft": "craft-1",
      "art": "art-2",
      "family": "family-2",
      "stage": "stage-3"
    },
    "difference": "这里比较的是史料启发的游戏画像。你的年龄、性别和职业不会限制匹配；个体经历、社会资源与历史结局不能从这些回答推出。",
    "anchors": [
      "beijing",
      "rebellion",
      "reform"
    ]
  },
  {
    "id": "zhengde",
    "name": "朱厚照",
    "gender": "男",
    "group": "权力",
    "stage": "成年时期的个人选择",
    "years": "1491—1521",
    "courtesy": "正德",
    "tag": "想越出既定位置的人",
    "seal": "越",
    "color": "#9d7961",
    "line": "既定的角色之外，还想亲自试一试。",
    "summary": "你的部分选择为个人兴趣与亲自行动保留空间。朱厚照的游历与军事活动在本游戏中提供局部参照，同时也提示角色责任的张力。",
    "facts": [
      "曾离宫巡游，参与军事活动。",
      "以将军身份活动，表现出不同于常规皇帝角色的选择。"
    ],
    "source": {
      "name": "故宫博物院 · 正德皇帝",
      "url": "https://www.dpm.org.cn/court/lineage/226240.html"
    },
    "pattern": {
      "beijing": "beijing-2",
      "rebellion": "rebellion-0",
      "army": "army-3",
      "memorial": "memorial-0",
      "reform": "reform-2",
      "calendar": "calendar-0",
      "herbs": "herbs-2",
      "journey": "journey-0",
      "craft": "craft-2",
      "art": "art-0",
      "family": "family-3",
      "stage": "stage-0"
    },
    "difference": "这里比较的是史料启发的游戏画像。你的年龄、性别和职业不会限制匹配；个体经历、社会资源与历史结局不能从这些回答推出。",
    "anchors": [
      "rebellion",
      "journey",
      "stage"
    ]
  },
  {
    "id": "ma",
    "name": "马皇后",
    "gender": "女",
    "group": "关系",
    "stage": "成年后的宫廷协商",
    "years": "1332—1382",
    "courtesy": "孝慈高皇后",
    "tag": "在关系中促成缓和的人",
    "seal": "和",
    "color": "#8a8064",
    "line": "影响一个决定，也可以从认真劝说开始。",
    "summary": "你愿意通过关系和协商减轻决策的伤害。马皇后参与劝谏与宫廷事务的记录，提供了调解、共同责任与影响路径的参照。",
    "facts": [
      "相关记载包含她对朱元璋的劝谏。",
      "曾参与为宋濂求情等宫廷事务。"
    ],
    "source": {
      "name": "故宫博物院 · 马皇后与宫廷政治",
      "url": "https://img.dpm.org.cn/Uploads/File/2020/02/16/u5e4909aedb1a4.pdf"
    },
    "pattern": {
      "beijing": "beijing-3",
      "rebellion": "rebellion-2",
      "army": "army-3",
      "memorial": "memorial-2",
      "reform": "reform-3",
      "calendar": "calendar-3",
      "herbs": "herbs-3",
      "journey": "journey-1",
      "craft": "craft-1",
      "art": "art-1",
      "family": "family-0",
      "stage": "stage-3"
    },
    "difference": "这里比较的是史料启发的游戏画像。你的年龄、性别和职业不会限制匹配；个体经历、社会资源与历史结局不能从这些回答推出。",
    "anchors": [
      "memorial",
      "family",
      "beijing"
    ]
  }
];

for(const person of people){person.editorialLine=person.line;person.quote=quotes[person.id];person.line=person.quote.text;}
