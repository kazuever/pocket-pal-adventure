(() => {
  "use strict";

  const $ = (selector) => document.querySelector(selector);
  const SAVE_KEY = "little-pocket-adventure-v1";
  const shapes = {
    leaf: { name: "叶子", art: '<path d="M8 32C4 11 16 6 36 5c1 20-7 32-24 29Z" fill="#87ab73"/><path d="m10 33 20-21M17 25l-1-8m7 2 7 1" stroke="#edf1cc" stroke-width="2" fill="none" stroke-linecap="round"/>' },
    sun: { name: "太阳", art: '<g stroke="#d7a648" stroke-width="2.5" stroke-linecap="round"><path d="M22 3v4m0 30v4M3 22h4m30 0h4M8 8l3 3m22 22 3 3M8 36l3-3m22-22 3-3"/></g><circle cx="22" cy="22" r="11" fill="#edc76a"/><circle cx="19" cy="21" r="1" fill="#a8803a"/><circle cx="25" cy="21" r="1" fill="#a8803a"/><path d="M19 26q3 3 6 0" fill="none" stroke="#a8803a" stroke-linecap="round"/>' },
    star: { name: "星星", art: '<path d="m22 3 5.9 12 13.2 1.9-9.6 9.3 2.3 13.2L22 33.2l-11.8 6.2 2.3-13.2-9.6-9.3L16.1 15Z" fill="#edc667" stroke="#d8ae4e" stroke-width="1.5" stroke-linejoin="round"/><circle cx="18" cy="23" r="1.3" fill="#b28b40"/><circle cx="26" cy="23" r="1.3" fill="#b28b40"/><path d="M19 27q3 3 6 0" fill="none" stroke="#b28b40" stroke-linecap="round"/>' },
    moon: { name: "月亮", art: '<path d="M31 5A18 18 0 1 0 39 32 19 19 0 0 1 31 5Z" fill="#b1b2d8" stroke="#969cc4" stroke-width="1.5"/><path d="m31 18 1.5 3.5 3.5 1-3.5 1-1.5 3.5-1-3.5-3.5-1 3.5-1Z" fill="#e5c875"/>' }
  };
  const shape = (name) => `<svg class="shape-svg" viewBox="0 0 44 44" aria-hidden="true">${shapes[name].art}</svg>`;
  const toolData = [
    { id: "scope", name: "寻秘密望远镜", description: "看见藏起来的线索", art: '<g transform="rotate(-30 25 25)"><path d="M7 17h27v16H7Z" fill="#c1b58b" stroke="#9d9879" stroke-width="1.4"/><path d="M15 15h15v20H15Z" fill="#93b9a2"/><path d="M30 13h8v24h-8Z" fill="#e4d7a8" stroke="#b2aa87" stroke-width="1.4"/><path d="M4 20h6v10H4Z" fill="#779c9c"/><path d="M34 16h3v18h-3Z" fill="#c9e6da"/></g><path d="m39 5 1 3 3 1-3 1-1 3-1-3-3-1 3-1Z" fill="#d9bc6a"/>' },
    { id: "bridge", name: "彩虹桥种子", description: "让小河两边手拉手", art: '<path d="M7 33q18-35 36 0" fill="none" stroke="#cd9b82" stroke-width="6" stroke-linecap="round"/><path d="M9 34q16-31 32 0" fill="none" stroke="#e1c97e" stroke-width="4"/><path d="M12 34q13-25 26 0" fill="none" stroke="#9cba95" stroke-width="4"/><path d="M15 34q10-19 20 0" fill="none" stroke="#9cbcc0" stroke-width="4"/><path d="M4 36h12m18 0h12" stroke="#c3cdb3" stroke-width="4" stroke-linecap="round"/>' },
    { id: "shrink", name: "小不点光束", description: "变小，发现新世界", art: '<g transform="rotate(-28 25 25)"><rect x="7" y="18" width="27" height="16" rx="6" fill="#b7aed0" stroke="#9993b5" stroke-width="1.4"/><path d="M15 32v10h9l3-10" fill="#c6bfdc" stroke="#9993b5" stroke-width="1.4"/><path d="m32 18 8-4v24l-8-4Z" fill="#d2c7df"/><path d="M18 20v11" stroke="#eee8f2" stroke-width="3"/><circle cx="28" cy="25" r="3" fill="#f3d880"/></g><path d="m41 5 2 3 3 1-3 1-2 3-1-3-3-1 3-1Z" fill="#c0b1ce"/>' },
    { id: "fly", name: "云朵飞行帽", description: "轻轻飞向高高的地方", art: '<path d="M13 34V23a12 12 0 0 1 24 0v11" fill="#b0c5a1" stroke="#8da683" stroke-width="1.4"/><path d="M8 35h34" stroke="#849f80" stroke-width="5" stroke-linecap="round"/><path d="M25 12V6" stroke="#b9a979" stroke-width="3"/><ellipse cx="16" cy="6" rx="12" ry="3" fill="#d7ca9e"/><ellipse cx="34" cy="6" rx="12" ry="3" fill="#c8b985"/><circle cx="25" cy="6" r="3" fill="#9da982"/><path d="M21 25q4-6 8 0" fill="none" stroke="#f1f4df" stroke-width="3" stroke-linecap="round"/>' }
  ];
  const extraTools = [
    ["magnet", "星星磁力手套", "吸起铁制小零件", "🧲"],
    ["time", "慢慢时光钟", "看清变化的每一步", "⏳"],
    ["umbrella", "晴天泡泡伞", "把小雨云变成晴天", "☂️"],
    ["translate", "动物悄悄话机", "听懂小动物的请求", "🗨️"],
    ["copy", "双双复制盒", "给两边各添一份", "🎁"],
    ["repair", "咔哒修补笔", "拼好破碎的小物件", "🖍️"]
  ];
  extraTools.forEach(([id, name, description, icon]) => toolData.push({ id, name, description, art: `<text x="25" y="37" text-anchor="middle" font-size="35">${icon}</text>` }));
  const toolIcon = (tool) => `<svg viewBox="0 0 50 50" aria-hidden="true">${tool.art}</svg>`;
  const levels = [
    { id: "level-one", title: "彩虹桥，藏着什么秘密？", category: "LEVEL 01 · 线索推理 · 进阶挑战", star: "森林星星", next: "星光灯塔" },
    { id: "level-two", title: "把星光，送到灯塔上吧！", category: "LEVEL 02 · 两次补光 + 七步路线 · 计划与取舍", star: "灯塔星星", next: "倒影花园" },
    { id: "level-three", title: "两座花园，哪里不一样？", category: "LEVEL 03 · 近看细节，帮朋友找家", star: "花园星星", next: "月亮饼干屋" },
    { id: "level-four", title: "给月亮烤一盘图形饼干", category: "LEVEL 04 · 五条线索，十一个空格 · 交叉排除", star: "饼干星星", next: "水果野餐岛" },
    { id: "level-five", title: "野餐篮，怎样才不会太重？", category: "LEVEL 05 · 水果称重 · 等量替换", star: "野餐星星", next: "小鸭水车园" },
    { id: "level-six", title: "转转水管，让花园喝到水", category: "LEVEL 06 · 水车救援 · 空间旋转", star: "水车星星", next: "云朵渡口" },
    { id: "level-seven", title: "带三个朋友，平安过河", category: "LEVEL 07 · 云朵渡口 · 提前想一步", star: "渡口星星", next: "回声音乐树" },
    { id: "level-eight", title: "找回音乐树的晚安歌", category: "LEVEL 08 · 回声演奏 · 观察与记忆", star: "音乐星星", next: "星空邮局" },
    { id: "level-nine", title: "把星空来信，送到朋友家", category: "LEVEL 09 · 星空邮局 · 看图找位置", star: "邮差星星", next: "磁力修理铺" }
  ];
  const newStories = [
    { icon: "🧺", entryTool: "scope", entry: "看看树叶秤上的小刻痕", intro: "小熊准备了野餐，可桥上的篮子只能装三只水果、重量刚好七颗松果。树叶秤的刻痕太小了，先借道具看清楚！", finishTool: "bridge", finish: "种下彩虹桥，把野餐篮送过河", ending: "彩虹桥托住刚刚好的篮子，朋友们开饭啦！", badge: "称重小帮手" },
    { icon: "🦆", entryTool: "shrink", entry: "钻进小鸭的迷你水车房", intro: "九块花田都渴啦！水车房比积木还小，先想办法进去，再把弯弯直直的水管接起来。", finishTool: "fly", finish: "飞上屋顶，打开雨水桶", ending: "雨水流过每块花田，小鸭送你一颗水亮亮的星星！", badge: "水管小工程师" },
    { icon: "☁️", entryTool: "fly", entry: "帮朋友安排过河", intro: "蓝豆戴好了飞行帽，每次能带一位朋友过河。你来安排谁先走、谁要带回来，让三位朋友都平安到达营地。", finishTool: "fly", finish: "把三位朋友安全送到营地", ending: "三个朋友一起到达营地，谁也没落下！", badge: "渡口小队长" },
    { icon: "🎵", entryTool: "fly", entry: "飞到树冠，听听回声", intro: "音乐树忘了晚安歌。六个小声音藏在树冠里！飞上去看一眼歌谱，记好后请四位朋友一起演奏。", finishTool: "shrink", finish: "变小，帮树洞里的小宝宝唱晚安歌", ending: "轻轻的晚安歌飘进小树洞，小宝宝安心睡着啦！", badge: "回声小乐手" },
    { icon: "💌", entryTool: "scope", entry: "看清小信封上的地址", intro: "五封星空来信等着送出去。地址写的是地图里的位置，不是门牌号！先放大地址，再帮蓝豆找对小屋。", finishTool: "fly", finish: "戴上飞行帽，把五封信送出去", ending: "每位朋友都收到了来信，星空邮局谢谢你！", badge: "星空小邮差" }
  ];
  const expeditions = [
    { title: "找齐小火车的三个零件", name: "磁力修理铺", icon: "🚂", mode: "collect", entryTool: "magnet", entry: "吸起散在沙坑里的铁零件", intro: "小火车的零件掉进沙坑。磁力手套能吸起铁件，修车篮只能放三件，合起来刚好六份重。", finishTool: "repair", finish: "用修补笔装好小火车", ending: "呜——小火车重新开动，带朋友们去看花！", badge: "磁力小修理师", rules: "只选铁制零件，刚好三件、六份重。点一下放入，再点一下拿回。", hints: ["先排除木头和石头。剩下的铁件里，试试先选最轻的。", "选铁钥匙、铁螺丝和铁铃铛：一份加两份加三份，刚好六份。"] },
    { title: "给种子排一场成长电影", name: "时光种子园", icon: "🌱", mode: "order", entryTool: "time", entry: "用时光钟慢慢看种子的变化", intro: "风吹乱了种子成长的照片。用时光钟看清小线索，把五张照片排成一场能看懂的小电影。", finishTool: "umbrella", finish: "撑起晴天伞，让果实晒晒太阳", ending: "从一粒种子到甜甜的果实，小松鼠把收获分给了大家！", badge: "成长小导演", rules: "先埋种子，再浇水；长出芽以后才能开花，花谢后才结果。点照片放进下一格。", hints: ["先找还没有长出植物的两张照片，再看哪张有花、哪张有果。", "顺序是：埋种子、浇水、发芽、开花、结果。"] },
    { title: "一起推开五朵小雨云", name: "晴天游乐场", icon: "🌦️", mode: "clouds", entryTool: "umbrella", entry: "撑开泡泡伞，找到云朵开关", intro: "游乐场被五朵雨云挡住了。泡泡伞连着五个开关，点一个，它和左右紧挨着的云都会换成另一种天气。", finishTool: "fly", finish: "飞上天空，挂起晴天彩旗", ending: "五个太阳一起笑，游乐场重新热闹起来啦！", badge: "天气小魔法师", rules: "把五格都变成太阳。点一格会同时改变自己和左右邻居，最边上只有一个邻居。", hints: ["每次不是只变一格哦。试一次，观察邻居，再用退回恢复。", "从最初状态出发，依次点第一格、第三格、第五格，就能全变晴。"] },
    { title: "听懂四位朋友的点心订单", name: "动物点心站", icon: "🐾", mode: "meals", entryTool: "translate", entry: "打开悄悄话机，听听订单", intro: "四位朋友只会用自己的声音点餐。悄悄话机帮你翻译，但菜单夹乱了！根据它们说的话，把四份点心送对。", finishTool: "shrink", finish: "变小，给树洞里的朋友摆好点心", ending: "四位朋友都吃到喜欢的点心，一起向你说谢谢！", badge: "动物小翻译", rules: "松鼠：我要橡果。兔子：不要水果，也不要橡果。小熊：我要小鸟点心的甜甜原料。小鸟：我要苹果派。四份点心各送一位。", hints: ["先安排说得最清楚的松鼠和小鸟。苹果派里用的是什么水果？", "松鼠吃橡果，兔子吃胡萝卜，小熊吃苹果，小鸟吃苹果派。"] },
    { title: "两边各添一颗，公平分松果", name: "双双分享屋", icon: "🌰", mode: "copy", entryTool: "copy", entry: "打开双双盒，看看三个碗", intro: "三位朋友都有些松果。复制盒每次只能让两个不同的碗各多一颗，最多用三次。怎样让大家一样多？", finishTool: "bridge", finish: "搭好桌边的小桥，让朋友们来分享", ending: "每位朋友都有四颗松果，大家一起分享刚刚好的快乐！", badge: "公平分享员", rules: "起初左碗两颗、中碗两颗、右碗两颗。每次选两个碗，各添一颗。只用三次，让每碗都有四颗。", hints: ["每次会多出两颗，三次一共六颗。每个碗都要被选到两次。", "依次选左和中、中和右、左和右。每碗都得到两颗。"] },
    { title: "把蝴蝶壁画，一块块拼回来", name: "蝴蝶修补馆", icon: "🦋", mode: "slide", entryTool: "repair", entry: "用修补笔托住散开的壁画", intro: "蝴蝶壁画碎成八片，只有一个空位可以移动。修补笔托住小碎片，你来帮它们滑回原位。", finishTool: "scope", finish: "用望远镜检查拼好的蝴蝶翅膀", ending: "完整的蝴蝶壁画又展开翅膀，花园展览开门啦！", badge: "壁画修补师", rules: "点紧挨空位的图片，把它滑进空位。对照完整小图，让每块回到自己的位置；右下角留空。", hints: ["只有空位上下左右的图片能移动。可以退回上一步，不用硬猜。", "从初始状态依次点这些位置：中间、左中、左下、下中、右下。"] },
    { title: "给蝴蝶补上另一半翅膀", name: "镜子蝴蝶谷", icon: "🪞", mode: "mirror", entryTool: "scope", entry: "看清蝴蝶左翅的小花纹", intro: "小蝴蝶的右翅花纹不见了。用望远镜看清左边，在镜子线右边补上正好对称的图案。", finishTool: "repair", finish: "用修补笔固定新花纹", ending: "左右翅膀像照镜子一样，小蝴蝶轻轻飞起来啦！", badge: "对称小画家", rules: "竖线像一面镜子。左边离镜子近的花纹，右边也要离镜子近。点右边格子画花，再点可擦掉。", hints: ["按一行一行看。左边最外一格，要对应右边最外一格。", "右半边从上到下，分别点：右格、左格、两格、左格。"] },
    { title: "给送花机器人写一条小路线", name: "送花机器人站", icon: "🤖", mode: "program", entryTool: "fly", entry: "飞到高处，看看整张送花地图", intro: "送花机器人只听得懂上下左右。先用飞行帽看清地图，写好指令，让它拿到两束花，再到朋友家。", finishTool: "translate", finish: "用悄悄话机告诉小鸟来收花", ending: "机器人沿着你的指令顺利送花，小鸟唱起感谢的歌！", badge: "路线小程序员", rules: "起点左上，终点右下。上下左右走，拿齐两束花；不能走到石头上。一次写好六步，再试跑。", hints: ["先想怎么到第一束花。那里往下走，才能绕开挡路的石头。", "六步依次是：右、下、下、右、下、右。"] },
    { title: "星星窗的数字秘密", name: "星星玻璃工坊", icon: "🪟", mode: "window", entryTool: "scope", entry: "看看窗框留下的数字", intro: "星星窗的玻璃碎了，窗格旁边留下了一串数字。横着看一排，竖着看一列，找出哪些格子应该亮起。", finishTool: "repair", finish: "固定好裂开的窗格", ending: "星星窗修好了，亮晶晶的星光给晚归的朋友指路！", badge: "玻璃小设计师", rules: "先看一排或一列旁边的数字：它说这条线上要有几个星星格，而且要连在一起。比如「2」表示这条线上正好有两个相邻的星星格；「4」表示四格全亮。横着看左边的数字，竖着看上面的数字。亮错的格子再点一下可以熄灭。", hints: ["先看第二排和第二列：它们旁边都写着4。每条线只有四格，所以这两条线要全部点亮。", "最下面一排写着1，表示只有一格亮；第二列已经全亮了，所以最下面一排的星星就在第二格。", "从上到下照着看：· · ⭐ ⭐；⭐ ⭐ ⭐ ⭐；⭐ ⭐ ⭐ ·；· ⭐ · ·。每条横线和竖线都要符合旁边的数字。"] },
    { title: "让两队小青蛙，换个岸边坐", name: "青蛙荷叶池", icon: "🐸", mode: "frogs", entryTool: "time", entry: "用时光钟看清青蛙的跳法", intro: "两队青蛙想交换位置，池里只有一片空荷叶。时光钟让它们慢慢跳，不着急，想错了可以退回。", finishTool: "umbrella", finish: "撑起泡泡伞，给青蛙们遮小雨", ending: "两队小青蛙交换了位置，开心地开起荷叶音乐会！", badge: "荷叶小队长", rules: "向右的青蛙只能往右，向左的只能往左。能跳到紧邻的空叶子，也能越过一只不同队的青蛙落到空叶子。", hints: ["先让左边靠空位的青蛙向右一步。然后让右边的青蛙跳过它。", "从初始状态依次点第 2、4、5、3、1、2、4、3 片荷叶。"] },
    { title: "神奇口袋大救援，一起去庆典", name: "口袋朋友庆典", icon: "🎉", mode: "rescue", entryTool: "translate", entry: "听懂朋友们的庆典求助", intro: "庆典就要开始，朋友们被困在车站啦。悄悄话机传来求助，你要按场景顺序安排一队道具来帮忙。", finishTool: "fly", finish: "和蓝豆一起飞向庆典，领取最后一颗星星", ending: "二十颗星星连成一条银河！朋友们谢谢你的观察、思考和勇敢尝试。", badge: "神奇口袋救援队长", rules: "先吸出卡在轮子里的铁钉，才能修好车轮；修好车后才能过断河；到对岸要先赶走雨云，才能让晾着的彩旗晒干。安排四件道具，不用飞行帽代替小火车哦。", hints: ["想想哪件道具吸铁、哪件能修东西。河和雨云要留到车能走以后再解决。", "依次安排：磁力手套、修补笔、彩虹桥种子、晴天泡泡伞。"]
    }
  ];
  expeditions.forEach((story, i) => {
    newStories.push(story);
    levels.push({ id: `level-${i + 10}`, title: story.title, category: `LEVEL ${i + 10} · ${story.name}`, star: `${story.name}星星`, next: expeditions[i + 1]?.name });
  });
  const fruitNames = ["🍎 苹果", "🍐 梨", "🍈 小瓜"];
  const fruitWeights = [2, 3, 5];
  const pipeKinds = ["straight", "straight", "bend", "bend", "straight", "bend", "bend", "straight", "straight"];
  const echoSong = [1, 0, 2, 1, 3, 0];
  const musicians = ["🐸 青蛙 · 咚", "🐦 小鸟 · 啾", "🦉 猫头鹰 · 咕", "💧 小溪 · 哗"];
  const letters = [
    ["🌙 月亮信", "最上面一排，紧挨着苹果树的小屋。", 1],
    ["🌸 花朵信", "苹果树正下方的小屋。", 3],
    ["☀️ 太阳信", "湖的右边，粉屋顶小屋的正下方。", 5],
    ["⭐ 星星信", "湖的正下方，两间小屋夹着的那间。", 7],
    ["🍃 叶子信", "最下面一排，星星信小屋的右边。", 8]
  ];
  let storageAvailable = true;
  let saved = {};
  try { saved = JSON.parse(localStorage.getItem(SAVE_KEY) || "{}") || {}; } catch { storageAvailable = false; }
  const completed = new Set(Array.isArray(saved.completed) ? saved.completed.filter((x) => Number.isInteger(x) && x >= 1 && x <= levels.length) : []);
  let level = Number.isInteger(saved.level) && saved.level >= 1 && saved.level <= levels.length ? saved.level : 1;
  let sound = saved.sound === true;
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  let effects = typeof saved.effects === "boolean" ? saved.effects : null;
  const effectsEnabled = () => effects ?? !reducedMotion.matches;
  let selectedTool = null;
  let state;
  let hintStep = 0;
  let codeInput = [];
  let toastTimer;
  let gadgetTimer;
  let audioContext;
  let modalReturnFocus = null;
  let modalType = "";
  const correctCode = ["moon", "leaf", "star", "sun"];
  const queueRules = [
    { pair: ["leaf", "star"], text: "叶子紧挨着站在星星前面，中间不能有别人。", check: (items) => items.indexOf("star") === items.indexOf("leaf") + 1 },
    { pair: ["star", "sun"], text: "太阳在星星后面，不一定紧挨着。", check: (items) => items.indexOf("sun") > items.indexOf("star") },
    { pair: ["moon", "sun"], text: "月亮和太阳不能挨在一起。", check: (items) => Math.abs(items.indexOf("moon") - items.indexOf("sun")) > 1 }
  ];
  const lightStations = [5, 8];
  const lightSteps = 7;
  let lightHintStep = 0;
  const cookieKinds = ["leaf", "sun", "star", "moon"];
  const cookieGivens = [0, null, null, null, null, null, null, 1, null, 0, 3, null, 3, null, null, null];
  const differences = [
    { id: "house", name: "小屋", x: 48, y: 29, w: 36, h: 38, hint: "看看小屋的屋顶，两边的颜色一样吗？" },
    { id: "flower", name: "大花朵", x: 9, y: 58, w: 21, h: 26, hint: "左下角的大花朵，两边的花瓣数量一样吗？" },
    { id: "butterfly", name: "蝴蝶", x: 27, y: 30, w: 18, h: 20, hint: "找找蝴蝶，比较它两边翅膀上的花纹。" },
    { id: "rabbit", name: "小兔子", x: 65, y: 65, w: 21, h: 25, hint: "右下角的小兔子，两边的耳朵形状一样吗？" },
    { id: "carrots", name: "胡萝卜地", x: 35, y: 72, w: 25, h: 19, hint: "数数下面菜地里的胡萝卜，有没有少一根？" },
    { id: "sun", name: "太阳", x: 8, y: 8, w: 16, h: 19 },
    { id: "tree", name: "苹果树", x: 4, y: 27, w: 23, h: 29 },
    { id: "cloud", name: "小云朵", x: 59, y: 6, w: 26, h: 18 }
  ];
  const defaultState = () => ({ clue: false, gate: false, bridge: false, small: false, power: false, collected: false, treasureReady: false, route: [0], gardenAnimal: null, gardenHint: 0, gardenHomes: [null, null, null], found: [], cookieBoard: [...cookieGivens], selectedCell: 1, cookieHint: 0, fruit: [], pipes: [1, 1, 0, 0, 1, 1, 2, 1, 1], bank: [0, 0, 0], boat: 0, crossings: [], passenger: null, notes: [], letter: 0, deliveries: Array(5).fill(null), feedback: "", extraHint: 0 });

  function save() {
    try { localStorage.setItem(SAVE_KEY, JSON.stringify({ completed: [...completed], level, sound, effects })); }
    catch { storageAvailable = false; }
    $("#save-status").textContent = storageAvailable ? "冒险进度会自动保存在这台设备" : "暂时无法保存进度，这次冒险仍然可以玩";
  }

  function clearGadgetAnimation() {
    clearTimeout(gadgetTimer);
    $(".gadget-effect")?.remove();
  }

  function animateGadget(toolId) {
    clearGadgetAnimation();
    if (!effectsEnabled()) return;
    const target = document.activeElement?.getBoundingClientRect();
    const x = target?.width ? target.x + target.width / 2 : innerWidth / 2;
    const y = target?.height ? target.y + target.height / 2 : innerHeight / 2;
    const art = {
      scope: `<path class="scope-beam" d="M110 290 240 50 445 110Z" fill="#fff1a7" opacity=".45"/><g class="scope-lens"><circle cx="300" cy="170" r="80" fill="#effff3" fill-opacity=".85" stroke="#73a8ad" stroke-width="12"/><path d="m244 228-47 49" stroke="#c3a778" stroke-width="24" stroke-linecap="round"/><g transform="translate(270 140) scale(1.4)">${shapes.star.art}</g></g><g class="gadget-sparkles" fill="#d9b866"><path d="m190 80 4 12 12 4-12 4-4 12-4-12-12-4 12-4Z"/><path d="m420 170 4 12 12 4-12 4-4 12-4-12-12-4 12-4Z"/></g>`,
      bridge: `<g class="growing-rainbow" fill="none" stroke-width="17" stroke-linecap="round">${["#d69c94", "#e7bb72", "#ecdb8d", "#a4c493", "#95bdc9"].map((color, i) => `<path pathLength="1" d="M75 ${270 + i * 4}Q300 ${-65 + i * 34} 525 ${270 + i * 4}" stroke="${color}" style="animation-delay:${i * 65}ms"/>`).join("")}</g><g class="bridge-friend">${littleRobot(300, 215, .75)}</g><g class="gadget-sparkles" fill="#e1c66c"><circle cx="80" cy="270" r="8"/><circle cx="520" cy="270" r="8"/></g>`,
      shrink: `<path class="shrink-beam" d="M100 90 410 120 410 290Z" fill="#d7bbeb" opacity=".65"/><g class="shrinking-friend">${littleRobot(300, 220, 1.65)}</g><g class="gadget-sparkles" fill="#c0a3d8"><path d="m415 95 5 15 15 5-15 5-5 15-5-15-15-5 15-5Z"/><circle cx="215" cy="260" r="7"/><circle cx="365" cy="270" r="5"/></g>`,
      fly: `<g class="flying-clouds">${cloud(100, 245, 1.3)}${cloud(360, 265, 1.5)}${cloud(230, 300, .8)}</g><g class="flying-friend">${littleRobot(300, 225, 1.1)}<path d="M300 180v-22" stroke="#b9a979" stroke-width="5"/><g class="spinning-propeller"><ellipse cx="300" cy="157" rx="50" ry="7" fill="#c8b985"/><circle cx="300" cy="157" r="7" fill="#8da683"/></g></g>`
    };
    extraTools.forEach(([id, , , icon]) => {
      art[id] = `<g class="new-tool-${id}"><circle cx="300" cy="170" r="95" fill="#fff4d8" opacity=".8"/><text x="300" y="200" text-anchor="middle" font-size="110">${icon}</text></g><g class="gadget-sparkles" fill="#d9b866"><path d="m165 105 5 15 15 5-15 5-5 15-5-15-15-5 15-5Z"/><circle cx="415" cy="230" r="9"/><circle cx="405" cy="90" r="6"/></g>`;
    });
    const effect = document.createElement("div");
    effect.className = `gadget-effect gadget-${toolId}`;
    effect.setAttribute("aria-hidden", "true");
    effect.style.left = `${Math.max(100, Math.min(innerWidth - 100, x))}px`;
    effect.style.top = `${Math.max(150, Math.min(innerHeight - 130, y))}px`;
    effect.innerHTML = `<svg viewBox="0 0 600 340">${art[toolId]}</svg><span>${{ scope: "叮！秘密看清楚啦！", bridge: "小种子，长成彩虹桥！", shrink: "咻——变成小小探险家！", fly: "呼呼——跟云朵一起出发！", magnet: "嗖嗖——铁零件来啦！", time: "滴答——慢慢看清楚！", umbrella: "噗！雨云变晴天！", translate: "听懂啦，朋友在说悄悄话！", copy: "叮叮！两边各添一份！", repair: "咔哒——碎片合起来啦！" }[toolId]}</span>`;
    ($("#modal").open ? $("#modal") : document.body).append(effect);
    gadgetTimer = setTimeout(clearGadgetAnimation, 1700);
  }

  function updateEffects() {
    const enabled = effectsEnabled();
    document.body.classList.toggle("gadget-motion-on", enabled);
    $("#effects-button").textContent = `道具动画：${enabled ? "开" : "关"}`;
    $("#effects-button").setAttribute("aria-pressed", String(enabled));
    $("#effects-status").textContent = enabled ? "成功使用道具时播放；也可以点预览，不影响通关。" : effects === null ? "系统设置减少动态效果，动画已关闭。可自行开启。" : "动画已关闭，游戏仍可正常进行。";
    if (!enabled) clearGadgetAnimation();
  }

  function announce(message) { $("#announcement").textContent = message; }
  function toast(message) {
    $("#toast").textContent = message;
    $("#toast").hidden = false;
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => { $("#toast").hidden = true; }, 4300);
  }

  function playSound(kind = "tap") {
    if (!sound) return;
    try {
      const Audio = window.AudioContext || window.webkitAudioContext;
      if (!Audio) return;
      audioContext ||= new Audio();
      if (audioContext.state === "suspended") audioContext.resume().catch(() => {});
      const notes = Number.isInteger(kind) ? [[440, 659.25, 329.63, 880][kind]] : kind === "win" ? [523.25, 659.25, 783.99, 1046.5] : kind === "success" ? [659.25, 880] : [523.25];
      notes.forEach((frequency, index) => {
        const oscillator = audioContext.createOscillator();
        const gain = audioContext.createGain();
        oscillator.type = "sine";
        oscillator.frequency.value = frequency;
        const start = audioContext.currentTime + index * .12;
        gain.gain.setValueAtTime(0, start);
        gain.gain.linearRampToValueAtTime(.065, start + .015);
        gain.gain.exponentialRampToValueAtTime(.001, start + .28);
        oscillator.connect(gain);
        gain.connect(audioContext.destination);
        oscillator.start(start);
        oscillator.stop(start + .3);
      });
    } catch { /* Audio is optional when the browser restricts playback. */ }
  }

  function robotArt() {
    return `<svg viewBox="0 0 240 145"><ellipse cx="126" cy="132" rx="53" ry="7" fill="#dce4cf"/><g transform="rotate(-5 122 80)"><path d="M104 101 99 126h16l8-21m14-4 9 23h17l-15-30" fill="#6ba6b7" stroke="#568fa3" stroke-width="2"/><rect x="94" y="78" width="58" height="39" rx="19" fill="#7ab8c5"/><path d="M107 91h33v13q-16 15-33 0Z" fill="#e5f0d7"/><path d="m123 93 2 5 5 .4-4 3 1 5-4-3-4 3 1-5-4-3 5-.4Z" fill="#d8bd6d"/><path d="m96 86-19 13-7-10m78-4 14-13 9 1" fill="none" stroke="#78b3bf" stroke-width="12" stroke-linecap="round"/><circle cx="70" cy="88" r="7" fill="#a6cdd0"/><circle cx="173" cy="73" r="7" fill="#a6cdd0"/><path d="M119 28V18" stroke="#8eab9b" stroke-width="3"/><path d="M119 21q-12-15 2-17 13 3-2 17Z" fill="#9eb989"/><rect x="83" y="29" width="80" height="61" rx="24" fill="#79b8c8" stroke="#69a5b7" stroke-width="2"/><rect x="79" y="48" width="9" height="22" rx="4" fill="#a5ced2"/><rect x="159" y="49" width="10" height="19" rx="4" fill="#a5ced2"/><rect x="94" y="43" width="58" height="35" rx="15" fill="#fff9df"/><path d="M106 57q3-5 6 0m18 0q3-5 6 0" fill="none" stroke="#547b7d" stroke-width="2.8" stroke-linecap="round"/><path d="M117 66q5 5 10 0" fill="none" stroke="#547b7d" stroke-width="2" stroke-linecap="round"/><ellipse cx="102" cy="65" rx="5" ry="3" fill="#edc1a8"/><ellipse cx="141" cy="65" rx="5" ry="3" fill="#edc1a8"/></g><path d="m183 34 2 6 6 2-6 2-2 6-2-6-6-2 6-2Z" fill="#d4bd7d"/><path d="m65 52 1.5 4 4 1.5-4 1.5-1.5 4-1.5-4-4-1.5 4-1.5Z" fill="#bccb97"/></svg>`;
  }

  function tree(x, y, scale = 1, color = "#8baa7d", variant = 0) {
    return `<g transform="translate(${x} ${y}) scale(${scale})"><path d="M-8 0 0-127 10 0Z" fill="#b8aa82"/><path d="M0-63-31-85m32 9 28-24" fill="none" stroke="#b8aa82" stroke-width="6" stroke-linecap="round"/><path d="${variant ? "M-57-78q-17-35 13-55-1-35 31-37 25-35 49-3 35-1 37 34 36 29 7 58-7 32-45 19-30 20-49-16Z" : "M-49-80q-28-25-3-53-4-32 28-40 20-33 47-8 33-5 38 27 30 18 9 50 3 29-34 34-28 26-51-2-28 10-34-8Z"}" fill="${color}"/><path d="M-28-122q11-10 15-31m38 32 12-20m-18 49 18-11" fill="none" stroke="#ffffff25" stroke-width="4" stroke-linecap="round"/><path d="M0-10v-77m0 32-16-15M1-36l18-14" fill="none" stroke="#ad9d76" stroke-width="3" stroke-linecap="round"/></g>`;
  }
  function flower(x, y, color = "#fff2c4", scale = 1) {
    return `<g transform="translate(${x} ${y}) scale(${scale})"><path d="M0 0v-17m0 11q-10-10-12-4 2 7 12 4" fill="#93a777" stroke="#93a777" stroke-width="2"/><g fill="${color}"><circle cx="-4" cy="-19" r="4"/><circle cx="4" cy="-19" r="4"/><circle cx="0" cy="-24" r="4"/><circle cx="0" cy="-15" r="4"/></g><circle cy="-20" r="3" fill="#cfb16d"/></g>`;
  }
  function cloud(x, y, scale = 1) {
    return `<g class="cloud"><path transform="translate(${x} ${y}) scale(${scale})" d="M0 17q-3-15 14-16 6-26 31-14 14-10 25 8 23-5 26 15 0 11-16 12H13Q0 24 0 17Z" fill="#fffdf1" opacity=".8"/></g>`;
  }
  function littleRobot(x, y, scale = 1) {
    return `<g transform="translate(${x} ${y}) scale(${scale})"><ellipse cy="40" rx="26" ry="5" fill="#6c8e7530"/><path d="M-10 18v19m20-19v19" stroke="#609fac" stroke-width="9" stroke-linecap="round"/><rect x="-18" y="-3" width="36" height="31" rx="12" fill="#7bb6c3"/><path d="M-10 10h20v7q-10 9-20 0" fill="#eff3d8"/><path d="M-20 6-29 17m49-11 9-12" stroke="#81b9c4" stroke-width="8" stroke-linecap="round"/><rect x="-27" y="-39" width="54" height="42" rx="16" fill="#7bb6c3" stroke="#649fae" stroke-width="1.5"/><rect x="-20" y="-29" width="40" height="24" rx="10" fill="#fff8dc"/><circle cx="-8" cy="-18" r="2" fill="#55787b"/><circle cx="8" cy="-18" r="2" fill="#55787b"/><path d="M-4-11q4 4 8 0" fill="none" stroke="#55787b" stroke-width="1.4"/><path d="M0-39v-10q-12-12 0-12 13 2 0 12" fill="#9ab58b" stroke="#9ab58b" stroke-width="1.5"/></g>`;
  }

  function forestScene() {
    const bridge = state.bridge ? `<g><path d="M384 431q132-95 259-14" fill="none" stroke="#bf9679" stroke-width="25"/><path d="M384 421q132-95 259-14" fill="none" stroke="#e5cb91" stroke-width="22"/><path d="m401 410 9 19m17-35 9 19m18-32 8 19m20-30 6 19m22-26 3 18m23-22 1 18m23-16-2 19m24-12-5 20m24-7-7 20" fill="none" stroke="#c2a676" stroke-width="3"/><path d="M381 405q135-102 269-14" fill="none" stroke="#d9ad93" stroke-width="6" stroke-linecap="round"/><path d="M382 405v35m47-62v31m55-48v29m55-27v28m58-10v29m52-19v34" stroke="#d4b28e" stroke-width="5"/><path d="M387 395q133-95 257-14" fill="none" stroke="#bdd0ae" stroke-width="5"/></g>` : `<path d="M382 437q13 5 25-2m228-12 22 5" stroke="#aac4af" stroke-width="6" stroke-linecap="round" fill="none"/>`;
    return `<svg class="world" viewBox="0 0 1000 580" preserveAspectRatio="none" aria-hidden="true">
      <defs><linearGradient id="sky" x2="0" y2="1"><stop stop-color="#dfefe8"/><stop offset="1" stop-color="#eff1d6"/></linearGradient><linearGradient id="water" x2="0" y2="1"><stop stop-color="#b5d8cf"/><stop offset="1" stop-color="#89bdba"/></linearGradient><pattern id="grain" width="7" height="7" patternUnits="userSpaceOnUse"><circle cx="2" cy="3" r=".7" fill="#426a4d" opacity=".035"/></pattern></defs>
      <path d="M0 0h1000v580H0Z" fill="url(#sky)"/>
      <circle cx="747" cy="98" r="38" fill="#f3df9c" opacity=".65"/><circle cx="747" cy="98" r="50" fill="#f3df9c" opacity=".12"/>
      ${cloud(125, 100, 1.1)}${cloud(480, 65, .9)}${cloud(835, 152, .85)}
      <path d="M0 278 117 163 212 261 328 139 454 276 585 170 748 275 875 186 1000 272v308H0Z" fill="#cbdcc3"/>
      <path d="m295 176 33-37 41 45-26-10-15 12-16-15Z" fill="#e7edda"/>
      <path d="M0 303q117-106 257-16 95-59 214 12 117-88 236-15 149-66 293 3v293H0Z" fill="#b5cea8"/>
      <path d="M0 365q129-112 333-39 155 43 238 11 181-73 429 2v241H0Z" fill="#a4c295"/>
      ${tree(48, 347, 1.2, "#98b786")}${tree(159, 338, .86, "#a2bd8d", 1)}${tree(917, 352, 1.12, "#9cb789", 1)}${tree(1000, 341, 1.4, "#87a97e")}
      <path d="M452 307q-49 57 7 91 93 56 34 182H227q174-108 107-167-58-54 74-106Z" fill="url(#water)"/>
      <path d="M0 360q179-45 366 16 41 24 17 58-56 81-159 146H0Z" fill="#c8d6a4"/>
      <path d="M510 367q184-54 490-10v223H488q82-96 22-150-47-33 0-63Z" fill="#c2d39f"/>
      <path d="M0 450q114-39 246-3l47 26q-100-8-194 52L0 558Z" fill="#dce0b1"/>
      <path d="M599 460q120-81 278-39l123 27v63q-242-57-361-7Z" fill="#d6dbad"/>
      <path d="M354 359q15-9 31-6m25 33 24 9m-71 43 21-4m-48 54 28-9m73-32 20-3m-93 84 34-10m30 38 24-9" stroke="#e9f4d9" stroke-width="3" fill="none" stroke-linecap="round" opacity=".7"/>
      <ellipse cx="199" cy="383" rx="75" ry="16" fill="#95ae7a35"/>
      <path d="m190 373 3-96h14l4 96" fill="#ae936d"/><path d="m139 267 117-7 10 50-124 6Z" fill="#c5a474" stroke="#a68b60" stroke-width="3"/><path d="m150 276 96-5m-94 32 100-4" stroke="#e2c99b" stroke-width="2" opacity=".7"/>
      ${state.clue ? `<g transform="translate(150 276) scale(.52)">${shapes.leaf.art}</g><g transform="translate(178 274) scale(.52)">${shapes.moon.art}</g><g transform="translate(206 272) scale(.52)">${shapes.sun.art}</g><g transform="translate(234 270) scale(.52)">${shapes.star.art}</g>` : `<text x="202" y="299" text-anchor="middle" fill="#f1e2b9" font-size="26" font-family="serif">? · ? · ?</text>`}
      <g transform="translate(487 264)"><ellipse cx="28" cy="69" rx="49" ry="10" fill="#8ea87d40"/><path d="M0 62V12Q0-8 28-8t28 20v50Z" fill="#a8b58c" stroke="#8d9d78" stroke-width="3"/><path d="M8 55V13q0-12 20-12t20 12v42Z" fill="#d7d9ac"/><path d="M12 22h32" stroke="#a8b58c" stroke-width="3"/><circle cx="19" cy="38" r="6" fill="${state.gate ? "#f5d875" : "#b9c4a0"}"/><circle cx="36" cy="38" r="6" fill="${state.gate ? "#f5d875" : "#b9c4a0"}"/><path d="m21 5 7-10 7 10" fill="#edce82"/></g>
      ${bridge}
      <g transform="translate(815 310)"><ellipse cy="45" rx="46" ry="10" fill="#8eaa7735"/><path d="M-32 0h64v37q-32 18-64 0Z" fill="#c3a472" stroke="#a98f63" stroke-width="2"/><path d="M-35-1q35-40 70 0v12h-70Z" fill="#ddc395" stroke="#b99c6b" stroke-width="2"/><path d="M-24-11v20m48-20v20" stroke="#bfa370" stroke-width="4"/><rect x="-7" y="8" width="14" height="13" rx="3" fill="#efd98e"/><circle cy="14" r="2" fill="#b09759"/></g>
      ${!state.collected ? `<g transform="translate(792 249) scale(1.05)"><g class="float">${shapes.star.art}</g></g>` : ""}
      ${littleRobot(292, 414, .85)}
      ${tree(-11, 538, 1.7, "#7f9e74", 1)}${tree(990, 516, 1.15, "#88a779")}
      <path d="m706 407-6-13 12 4 8-10 1 17m-598 38-7-11 12 2 7-9 4 15" fill="#93b180"/>
      ${flower(76, 459)}${flower(106, 482, "#e5bb9f", .9)}${flower(721, 441, "#fff3c2", 1.1)}${flower(745, 460, "#e7c2ac", .8)}${flower(882, 478, "#fff4d0", 1.2)}${flower(853, 496, "#fff4d0", .8)}${flower(184, 537, "#f7e6b2", .9)}
      <g fill="#e5e5bb"><ellipse cx="591" cy="530" rx="12" ry="5"/><ellipse cx="622" cy="514" rx="8" ry="4"/><ellipse cx="786" cy="386" rx="8" ry="4"/></g>
      <g transform="translate(674 319)"><path d="M0 0q-17-22-20-10T0 0Q15-22 20-10T0 0" fill="#e1c789"/><path d="m-2-3 4 9" stroke="#a8a06e" stroke-width="2"/></g>
      <path d="M0 0h1000v580H0Z" fill="url(#grain)" pointer-events="none"/>
    </svg>`;
  }

  function nightScene() {
    return `<svg class="world" viewBox="0 0 1000 580" preserveAspectRatio="none" aria-hidden="true"><defs><linearGradient id="night-sky" x2="0" y2="1"><stop stop-color="#9caec2"/><stop offset=".75" stop-color="#d0d5ca"/></linearGradient><pattern id="night-grain" width="7" height="7" patternUnits="userSpaceOnUse"><circle cx="2" cy="3" r=".7" fill="#294556" opacity=".035"/></pattern></defs>
      <path d="M0 0h1000v580H0Z" fill="url(#night-sky)"/><circle cx="767" cy="94" r="35" fill="#f8e9b5"/><circle cx="780" cy="82" r="31" fill="#9eafc1"/><circle cx="764" cy="93" r="51" fill="#f8e9b5" opacity=".08"/>
      ${[[100, 90], [269, 58], [435, 115], [617, 64], [903, 135], [858, 57], [548, 174], [354, 185]].map(([x, y], i) => `<path class="twinkle" style="animation-delay:${i * .3}s" d="m${x} ${y - 5} 1.5 4 4 1-4 1-1.5 4-1.5-4-4-1 4-1Z" fill="#f6e8b6"/>`).join("")}
      ${cloud(155, 154, .7)}${cloud(499, 98, 1)}
      <path d="M0 301 130 206 246 292 399 200 550 307 707 198 885 305 1000 231v349H0Z" fill="#a3b8b1"/>
      <path d="M0 346q112-125 280-21 139-71 258 7 119-80 246-12 109-66 216-5v265H0Z" fill="#92afa0"/>
      <path d="M0 403q214-107 436-16 205-103 564-7v200H0Z" fill="#aec19e"/>
      <path d="M0 475q171-63 337-21 121 51 228-1 171-90 435 7v120H0Z" fill="#becaa4"/>
      <path d="M309 580q-13-103 136-129 202-39 345-74" fill="none" stroke="#d3d5b1" stroke-width="42"/>
      ${tree(38, 397, 1.45, "#829f91", 1)}${tree(962, 432, 1.5, "#87a18f")}${tree(887, 358, .9, "#91aa98", 1)}
      <g transform="translate(228 375)"><ellipse cy="64" rx="105" ry="17" fill="#708e7d35"/><path d="M-59 56q-5-95 10-189l66-9Q13-18 61 54Z" fill="#b9aa89" stroke="#a09477" stroke-width="3"/><path d="M-28-113q-7 73 4 135m25-142Q-9-33 22 35" fill="none" stroke="#a39678" stroke-width="3"/><path d="m-10-64-54-43m66 55 65-61" stroke="#b9aa89" stroke-width="22" stroke-linecap="round"/><path d="M-133-104q-40-53 8-97-15-47 41-72 23-52 72-29 49-32 77 17 62 1 60 49 49 43 8 83-1 42-64 36-39 34-77 8-67 34-82 5-35 10-43 0Z" fill="#92ab8a"/><path d="M-109-153q25-5 35-25m50-67 18 23m65 36 21-15" fill="none" stroke="#c3ccaa55" stroke-width="5" stroke-linecap="round"/><path d="M-23 55V16q0-29 26-29t26 29v39Z" fill="#7d9180" stroke="#d9c69a" stroke-width="5"/><path d="M-12 53V17q0-15 15-15t15 15v36Z" fill="${state.small ? "#efd391" : "#a8a383"}"/><circle cx="10" cy="30" r="3" fill="#d9c28f"/><path d="M-32 57h70" stroke="#c4b38e" stroke-width="8" stroke-linecap="round"/></g>
      <g transform="translate(538 349)"><ellipse cy="71" rx="65" ry="12" fill="#7b998335"/><path d="M-40 60v-68l40-20 40 20v68Z" fill="#c1baa0" stroke="#a19f89" stroke-width="2"/><path d="m-50-8 50-30L50-8" fill="none" stroke="#a6a18b" stroke-width="10" stroke-linecap="round"/><rect x="-29" y="7" width="58" height="36" rx="7" fill="#8faaa0"/><path d="M-18 25h36" stroke="${state.power ? "#f3d48b" : "#bfccb5"}" stroke-width="4" stroke-dasharray="4 4"/><circle cx="-18" cy="25" r="5" fill="#ead39a"/><circle cx="18" cy="25" r="5" fill="${state.power ? "#f6d681" : "#bdc7ab"}"/><path d="M-47 65h94" stroke="#d7ceb0" stroke-width="9" stroke-linecap="round"/></g>
      <path d="M580 388q90 29 192-44" fill="none" stroke="${state.power ? "#f5d17c" : "#9cae92"}" stroke-width="5" stroke-dasharray="7 7"/>
      <g transform="translate(794 328)"><ellipse cy="77" rx="66" ry="13" fill="#6f8b7935"/><path d="m-35 70 11-222h48L35 70Z" fill="#e1d8b8" stroke="#bbb798" stroke-width="2"/><path d="m-31-15 60-27-2-38-56 25Z" fill="#a7b8ac"/><path d="m-27-98 53-26-2-28h-48Z" fill="#a7b8ac"/><path d="M-38-150h76v-47h-76Z" fill="${state.power ? "#ffe5a0" : "#c2cec0"}" stroke="#9ba998" stroke-width="4"/><path d="m-44-198 44-31 44 31Z" fill="#8eaa9b"/><path d="M0-150v-45" stroke="#b1b99d" stroke-width="4"/><path d="M-45-148h90M-45-146v-17m90 17v-17" stroke="#a6b098" stroke-width="5"/><path d="M-10 69V40q10-18 20 0v29" fill="#95a78f"/><path d="M-45 72h90" stroke="#c9c1a1" stroke-width="10" stroke-linecap="round"/></g>
      ${state.power ? `<path d="m756 131-116-44v107Z" fill="#ffedac" opacity=".22"/><path d="m833 131 167-67v135Z" fill="#ffedac" opacity=".22"/><circle cx="793" cy="139" r="52" fill="#ffe5a0" opacity=".12"/>` : ""}
      ${!state.collected ? `<g transform="translate(774 79)"><g class="float">${shapes.star.art}</g></g>` : ""}
      ${littleRobot(state.small ? 317 : 351, state.small ? 419 : 446, state.small ? .48 : .9)}
      <g fill="#f4e7a5" class="twinkle"><circle cx="108" cy="354" r="3"/><circle cx="342" cy="308" r="3"/><circle cx="394" cy="378" r="2"/><circle cx="658" cy="336" r="3"/><circle cx="911" cy="412" r="2"/><circle cx="707" cy="433" r="2"/></g>
      ${flower(90, 490, "#dcd5c1")}${flower(119, 510, "#eee3b3", .8)}${flower(654, 505, "#f4e3a8", 1.1)}${flower(683, 518, "#e0d1c5", .8)}${flower(887, 478, "#f5e2ac")}
      <path d="M0 0h1000v580H0Z" fill="url(#night-grain)"/>
    </svg>`;
  }

  function gardenObject(id, changed) {
    if (id === "house") return `<path d="M20 48h60v45H20Z" fill="#f3ddb0" stroke="#bea47e" stroke-width="2"/><path d="m9 48 41-36 41 36Z" fill="${changed ? "#a5b6d3" : "#d89984"}" stroke="#b48f7c" stroke-width="2"/><path d="M42 93V66q8-11 16 0v27" fill="#a5b4a0"/><rect x="26" y="58" width="12" height="14" rx="3" fill="#fff5ce"/><circle cx="69" cy="65" r="7" fill="#fff5ce"/>`;
    if (id === "flower") return `<path d="M50 95V42m0 33q-30-28-30-7 12 13 30 7m0 6q28-28 29-8-10 14-29 8" fill="#91b482" stroke="#82a275" stroke-width="3"/><g fill="#e7b6bf">${[0, 60, 120, 180, 240, ...(changed ? [] : [300])].map((angle) => `<ellipse cx="50" cy="23" rx="12" ry="19" transform="rotate(${angle} 50 42)"/>`).join("")}</g><circle cx="50" cy="42" r="14" fill="#f1d177"/>`;
    if (id === "butterfly") return `<path d="M48 40Q9 0 11 42q0 18 32 12Q8 86 31 88q17 0 18-25m4-23Q92 0 90 42q0 18-32 12 35 32 12 34-17 0-18-25" fill="#c5b4d6" stroke="#ab97c1" stroke-width="2"/><path d="M50 34v35m-1-32-9-11m12 11 9-11" stroke="#9e8aaa" stroke-width="4" stroke-linecap="round"/>${changed ? '<path d="m20 37 15 7m32 0 15-7" stroke="#f8efcd" stroke-width="5"/>' : '<g fill="#f8efcd"><circle cx="27" cy="39" r="6"/><circle cx="75" cy="39" r="6"/></g>'}`;
    if (id === "rabbit") return `<ellipse cx="50" cy="75" rx="29" ry="20" fill="#faf2dc"/><ellipse cx="37" cy="28" rx="9" ry="24" fill="#faf2dc" transform="rotate(-12 37 28)"/><ellipse cx="62" cy="29" rx="9" ry="${changed ? "14" : "24"}" fill="#faf2dc" transform="rotate(12 62 29)"/><circle cx="49" cy="55" r="24" fill="#faf2dc"/><circle cx="40" cy="53" r="2.5" fill="#7d8170"/><circle cx="58" cy="53" r="2.5" fill="#7d8170"/><path d="m46 62 4 3 4-3" stroke="#c5a18e" stroke-width="2" fill="none"/><circle cx="78" cy="75" r="9" fill="#fff9e7"/>`;
    if (id === "carrots") return `<ellipse cx="50" cy="72" rx="47" ry="17" fill="#b5ac86"/>${[21, 49, ...(changed ? [] : [77])].map((x) => `<path d="m${x - 8} 43 16 0-8 39Z" fill="#e2aa74"/><path d="m${x} 43-7-17m7 17 7-17m-7 17V23" fill="none" stroke="#8ba979" stroke-width="4" stroke-linecap="round"/>`).join("")}`;
    if (id === "sun") return `<g transform="translate(6 6) scale(2)">${shapes.sun.art}</g>`;
    if (id === "tree") return `<path d="M44 97V45h13v52Z" fill="#b8a17e"/><path d="M12 61Q-3 32 23 25 17 4 45 8 68-7 78 17q30 2 17 32 8 22-25 23-25 17-39-1-17 8-19-10Z" fill="#a2bc8d"/><g fill="#d9a08c"><circle cx="30" cy="39" r="6"/><circle cx="69" cy="29" r="6"/><circle cx="62" cy="59" r="6"/></g>`;
    return `<path d="M8 62Q-4 40 22 37 22 10 48 21q25-12 30 15 28 1 17 26Z" fill="#fffaf0"/>`;
  }

  function gardenScene() {
    const board = (side) => `<section class="garden-board" aria-label="${side === 0 ? "左图，真实花园" : "右图，魔法倒影"}"><span class="garden-label">${side === 0 ? "真实花园" : "魔法倒影"}</span><svg class="garden-background" viewBox="0 0 500 400" preserveAspectRatio="none" aria-hidden="true"><rect width="500" height="400" fill="#e3efe2"/><path d="M0 245q145-105 280-15 120-80 220-9v179H0Z" fill="#c3d6aa"/><path d="M0 314q180-79 500 5v81H0Z" fill="#b6cb9b"/><path d="M230 400q-13-77 108-145" fill="none" stroke="#e0d9b2" stroke-width="35"/><g stroke="#eaf0cb" stroke-width="3"><path d="M433 210v61m24-65v65m24-59v59m-63-42h76m-76 25h76"/></g>${flower(52, 366, "#fff3c4", 1.5)}${flower(450, 354, "#f7e4c2", 1.3)}</svg>${differences.map((item) => {
      const found = state.found.includes(item.id);
      return `<button class="garden-object${found ? " found" : ""}" data-difference="${item.id}" data-side="${side}" ${!state.clue ? "disabled" : ""} aria-label="${side === 0 ? "左图" : "右图"}的${item.name}${found ? "，已找到不同" : ""}" aria-pressed="${found}" style="left:${item.x}%;top:${item.y}%;width:${item.w}%;height:${item.h}%"><svg viewBox="0 0 100 100" aria-hidden="true">${gardenObject(item.id, side === 1 && Boolean(item.hint))}</svg>${found ? '<span class="found-check" aria-hidden="true">✓</span>' : ""}</button>`;
    }).join("")}</section>`;
    return `<div class="puzzle-intro"><span>小侦探任务 · 双筒观察</span><strong>找到 ${state.found.length} / 5 处不同</strong><p>倒影偷偷改变了五个地方。两边都能点，小细节也值得凑近看看。</p></div><div class="garden-pair">${board(0)}${board(1)}</div><p id="garden-feedback" class="inline-feedback" role="status">仔细比较，找到的地方会被圈起来！</p>${state.found.length === 5 && !state.collected ? `<div class="story-task"><span aria-hidden="true">✧</span><p>${!state.gate ? "五处改动都找到了！三位朋友却忘了自己住哪间。听听它们记得什么，帮它们找家吧。" : "小兔子从温室捧出一颗星星，送给帮大家找回家的你。"}</p><button class="primary-button" data-action="${!state.gate ? "garden-lock" : "garden-star"}">${!state.gate ? "帮三位朋友找家" : "收下花园星星 ✦"}</button></div>` : ""}`;
  }

  function gardenLock(message = "") {
    const animals = { squirrel: ["🐿️", "小松鼠"], rabbit: ["🐰", "小兔子"], bear: ["🐻", "小熊"] };
    showModal(`<p class="modal-kicker">花园救援 · 帮朋友找家</p><h2 id="modal-title">谁住在哪一间？</h2><p class="garden-question">迷雾把门牌弄乱啦！三位朋友各住一间小屋。先选小动物，再点小屋，把它送回家。</p><ul class="puzzle-rules"><li>🐿️ 小松鼠：我不住中间那间。</li><li>🐰 小兔子：我和小松鼠是邻居，我住在它右边。</li><li>🐻 小熊：我不住蓝色屋顶的小屋。</li></ul><div class="animal-palette">${Object.entries(animals).map(([id, [icon, name]]) => `<button data-garden-choice="${id}" aria-pressed="${state.gardenAnimal === id}" class="${state.gardenAnimal === id ? "picked" : ""}"><span aria-hidden="true">${icon}</span>${name}</button>`).join("")}</div><div class="animal-homes">${["yellow", "blue", "pink"].map((color, i) => {
      const animal = animals[state.gardenHomes[i]];
      return `<button data-garden-home="${i}" aria-label="${["左边黄屋顶", "中间蓝屋顶", "右边粉屋顶"][i]}，${animal ? animal[1] : "还没人住"}"><svg viewBox="0 0 100 100" aria-hidden="true"><path d="M17 44h66v50H17Z" fill="#ead9b1"/><path d="m7 45 43-38 43 38Z" fill="${["#dfc36d", "#8eafc7", "#d4a0ac"][i]}"/><path d="M38 94V67q12-17 24 0v27" fill="#fff9e6"/></svg><span class="home-resident" aria-hidden="true">${animal ? animal[0] : "？"}</span><small>${["左边", "中间", "右边"][i]}</small></button>`;
    }).join("")}</div><p id="garden-lock-feedback" class="puzzle-feedback" aria-live="polite">${message || "三个朋友说的话，要同时符合哦。可以随时换房子。"}</p><button class="primary-button" data-modal-action="check-homes">都安排好了，敲敲门！</button><div class="puzzle-links"><button data-modal-action="garden-hint">蓝豆，给个提示</button></div>`, "garden-lock", "[data-garden-choice]");
  }

  function enterGardenChoice(id) {
    if (!["squirrel", "rabbit", "bear"].includes(id)) return;
    state.gardenAnimal = id;
    gardenLock("选好啦，再点一间小屋。");
    $(`[data-garden-choice="${id}"]`).focus({ preventScroll: true });
  }

  function placeGardenAnimal(index) {
    if (!Number.isInteger(index) || index < 0 || index > 2 || !state.gardenAnimal) { gardenLock("先点上面的一位小动物，再选它的小屋吧。"); return; }
    state.gardenHomes = state.gardenHomes.map((id) => id === state.gardenAnimal ? null : id);
    state.gardenHomes[index] = state.gardenAnimal;
    gardenLock("住进去啦！继续安排朋友，或者换一间试试看。");
    $(`[data-garden-home="${index}"]`).focus({ preventScroll: true });
  }

  function checkGardenHomes() {
    if (state.gardenHomes.includes(null)) { gardenLock("还有朋友没找到家哦。每位一间，把三个小屋都安排好。"); return; }
    const squirrel = state.gardenHomes.indexOf("squirrel");
    const rabbit = state.gardenHomes.indexOf("rabbit");
    if (squirrel === 1) { gardenLock("小松鼠说它不住中间。想想它和小兔子怎样才能做邻居？"); return; }
    if (rabbit !== squirrel + 1) { gardenLock("小兔子要紧挨着小松鼠，而且住在它右边。试着把它俩一起挪一挪。"); return; }
    if (state.gardenHomes[1] === "bear") { gardenLock("小熊说它不住蓝屋顶的小屋。再换一下吧。"); return; }
    state.gate = true;
    state.treasureReady = true;
    advance();
    showModal(`<p class="modal-kicker">EVERY FRIEND HAS A HOME</p><h2 id="modal-title">朋友们回家啦，温室打开了！</h2><p class="modal-copy">小松鼠住左边，小兔子住中间，小熊住右边。<br>小兔子蹦进温室，把珍藏的花园星星捧了出来。<br>“谢谢你，帮我们找到了家！”</p><button class="primary-button" data-modal-action="close">接住朋友的礼物</button>`);
  }

  function inspectGarden(id, side) {
    const item = differences.find((entry) => entry.id === id);
    if (!item) return;
    showModal(`<p class="modal-kicker">双筒观察镜 · 两边一起放大</p><h2 id="modal-title">${item.name}的近距离观察</h2><div class="detail-comparison">${[false, true].map((changed) => `<div><p>${changed ? "魔法倒影" : "真实花园"}</p><svg viewBox="0 0 100 100" aria-label="${changed ? "右图" : "左图"}的${item.name}">${gardenObject(id, changed && Boolean(item.hint))}</svg></div>`).join("")}</div><p class="modal-copy">看一看轮廓、颜色、数量和花纹。<br>放大镜不会替你判断，你觉得两边一样吗？</p><div class="modal-actions"><button class="primary-button" data-inspect-difference="${id}" data-side="${side}">这里不一样</button><button class="secondary-button" data-modal-action="close">继续观察</button></div>`, "garden-inspect");
  }

  function inspectCookie() {
    const index = state.selectedCell;
    const units = cookieUnits(index);
    const used = [...new Set(units.flat().filter((i) => i !== index).map((i) => state.cookieBoard[i]).filter((value) => value !== null))];
    showModal(`<p class="modal-kicker">站在烤盘上的小小探险</p><h2 id="modal-title">饼干变得像小山一样大！</h2><p class="modal-copy">你站在第 ${Math.floor(index / 4) + 1} 行、第 ${index % 4 + 1} 列。<br>沿着烤盘的沟槽，看看这三组邻居。</p><div class="cookie-inspection">${units.map((unit, i) => `<section><h3>${["横着的一排", "竖着的一排", "脚下的小方盒"][i]}</h3><div>${unit.map((cell) => `<span class="${cell === index ? "here" : ""}" aria-label="${cell === index ? "你在这里，" : ""}${state.cookieBoard[cell] === null ? "空格" : shapes[cookieKinds[state.cookieBoard[cell]]].name}">${state.cookieBoard[cell] === null ? "？" : shape(cookieKinds[state.cookieBoard[cell]])}${cell === index ? "<small>你在这里</small>" : ""}</span>`).join("")}</div></section>`).join("")}</div><p class="modal-copy">${used.length ? `邻居中已经出现了：${used.map((value) => shapes[cookieKinds[value]].name).join("、")}。` : "附近还有许多空位。"}<br>这里不该再放相同的饼干，但还要检查别处。<br>想好后回到大烤盘，自己试一试。</p><button class="primary-button" data-modal-action="close">回到烤盘</button>`, "cookie-inspect");
  }

  function cookieUnits(index) {
    const row = Math.floor(index / 4);
    const column = index % 4;
    const boxRow = Math.floor(row / 2) * 2;
    const boxColumn = Math.floor(column / 2) * 2;
    return [
      Array.from({ length: 4 }, (_, i) => row * 4 + i),
      Array.from({ length: 4 }, (_, i) => i * 4 + column),
      [0, 1, 4, 5].map((offset) => boxRow * 4 + boxColumn + offset)
    ];
  }

  function cookieScene() {
    if (!state.small) return `<div class="puzzle-intro"><span>月亮饼干屋 · 变小才能进来的邀请</span><strong>叩叩，小小的门后是谁？</strong><p>月亮的烤盘放在一间巴掌大的饼干屋里。<br>先选一个合适的道具，再敲一敲小门吧。</p></div><div class="bakery-door"><svg viewBox="0 0 500 300" aria-hidden="true"><path d="M0 270q250-100 500 0v30H0Z" fill="#d2d7b1"/><path d="M120 262V125h260v137Z" fill="#e5cda0" stroke="#bfa57d" stroke-width="4"/><path d="m93 130 157-96 157 96Z" fill="#c69daa" stroke="#ad8c96" stroke-width="4"/><path d="M205 264v-72q45-65 90 0v72" fill="#9eaf93" stroke="#81997d" stroke-width="4"/><circle cx="276" cy="224" r="6" fill="#f3d288"/><rect x="142" y="160" width="40" height="43" rx="8" fill="#fff3cd"/><rect x="320" y="160" width="40" height="43" rx="8" fill="#fff3cd"/><g transform="translate(222 68) scale(1.3)">${shapes.moon.art}</g></svg><button class="primary-button" data-action="bakery-door">敲敲饼干屋的小门</button></div>`;
    return `<div class="puzzle-intro"><span>月亮饼干屋 · 甜甜的推理</span><strong>烤盘里，不许有双胞胎！</strong><p>每行、每列、每个粗框小方盒，都要有四种不同的饼干。</p></div><div class="cookie-workbench"><div class="cookie-grid" role="group" aria-label="4乘4图形数独烤盘">${state.cookieBoard.map((value, i) => `<button class="cookie-cell${cookieGivens[i] !== null ? " fixed" : ""}${state.selectedCell === i ? " selected" : ""}" data-cell="${i}" ${cookieGivens[i] !== null || state.power ? "disabled" : ""} aria-pressed="${state.selectedCell === i}" aria-label="第${Math.floor(i / 4) + 1}行第${i % 4 + 1}列，${value === null ? "空格" : shapes[cookieKinds[value]].name}${cookieGivens[i] !== null ? "，固定饼干" : ""}">${value === null ? '<span aria-hidden="true">·</span>' : shape(cookieKinds[value])}</button>`).join("")}</div><div class="cookie-controls"><p>先点空格，再选饼干</p><div class="cookie-palette" role="group" aria-label="选择填入的饼干">${cookieKinds.map((id, i) => `<button data-cookie="${i}" ${state.power ? "disabled" : ""} aria-label="放入${shapes[id].name}饼干">${shape(id)}<span>${shapes[id].name}</span></button>`).join("")}</div><button class="text-button" data-cookie-action="erase">擦掉选中的饼干</button><button class="primary-button" data-cookie-action="check">检查烤盘，开始烤！</button><button class="hint-button" data-cookie-action="hint">蓝豆，帮我想一个空格</button></div></div><p id="cookie-feedback" class="inline-feedback" role="status">浅色饼干是线索，不能移动。填错也能改，不着急。</p>${state.power && !state.collected ? `<div class="story-task"><span aria-hidden="true">☾</span><p>${state.treasureReady ? "你戴上飞行帽，把热乎乎的饼干送给了月亮。月亮回赠你一颗星星！" : "饼干烤好了！可月亮住在高高的云朵上，怎样才能把饼干送过去？"}</p><button class="primary-button" data-action="${state.treasureReady ? "cookie-star" : "moon-delivery"}">${state.treasureReady ? "收下饼干星星 ✦" : "把饼干送给月亮"}</button></div>` : ""}`;
  }

  function findDifference(id, side) {
    if (level !== 3 || state.collected || !state.clue) return;
    const item = differences.find((entry) => entry.id === id);
    if (!item) return;
    if (!item.hint) { $("#garden-feedback").textContent = "这里两边是一样的哦。再看看颜色、形状、数量和花纹吧。"; return; }
    if (state.found.includes(id)) { $("#garden-feedback").textContent = "这处已经找到啦！找找还没圈起来的地方。"; return; }
    state.found.push(id);
    advance();
    $("#garden-feedback").textContent = state.found.length === 5 ? "迷雾散了！三位小动物需要你帮忙找家。" : `找到啦！还差 ${5 - state.found.length} 处，继续观察吧。`;
    $(`[data-difference="${id}"][data-side="${side}"]`).focus({ preventScroll: true });
    announce($("#garden-feedback").textContent);
  }

  function putCookie(value) {
    if (level !== 4 || state.collected || state.power || cookieGivens[state.selectedCell] !== null) return;
    state.cookieBoard[state.selectedCell] = value;
    state.cookieHint = 0;
    renderScene();
    renderProgress();
    $("#cookie-feedback").textContent = value === null ? "擦干净啦，可以再试一种饼干。" : "放好啦！检查一下同一行、同一列和小方盒，有没有重复？";
    $(`[data-cell="${state.selectedCell}"]`).focus({ preventScroll: true });
    playSound();
  }

  function cookieHint() {
    if (state.power || state.collected) { toast("饼干已经烤好啦！收下星星吧。"); return; }
    const empty = state.cookieBoard.map((value, i) => value === null ? i : -1).filter((i) => i !== -1);
    const choices = empty.map((index) => ({ index, candidates: [0, 1, 2, 3].filter((value) => !cookieUnits(index).flat().some((i) => state.cookieBoard[i] === value)) }));
    const forced = choices.find((item) => item.candidates.length === 1);
    if (!forced) { $("#cookie-feedback").textContent = "先检查已填的饼干有没有重复；也可以擦掉不确定的，再从线索最多的一行开始。"; return; }
    state.selectedCell = forced.index;
    state.cookieHint++;
    renderScene();
    const position = `第 ${Math.floor(forced.index / 4) + 1} 行第 ${forced.index % 4 + 1} 列`;
    $("#cookie-feedback").textContent = state.cookieHint === 1 ? `看高亮的${position}：把同一行、同一列和小方盒里已经有的饼干排除，还剩哪一种？` : `${position}可以放「${shapes[cookieKinds[forced.candidates[0]]].name}」。对照行、列和小方盒，看看为什么吧。`;
    $(`[data-cell="${forced.index}"]`).focus({ preventScroll: true });
  }

  function checkCookies() {
    for (let i = 0; i < 16; i++) {
      if (state.cookieBoard[i] === null) continue;
      const conflict = cookieUnits(i).findIndex((unit) => unit.some((other) => other !== i && state.cookieBoard[other] === state.cookieBoard[i]));
      if (conflict !== -1) {
        $("#cookie-feedback").textContent = `第 ${Math.floor(i / 4) + 1} 行第 ${i % 4 + 1} 列的饼干，在${["同一行", "同一列", "同一个粗框小方盒"][conflict]}里重复啦。换一种试试看？`;
        return;
      }
    }
    if (state.cookieBoard.includes(null)) { $("#cookie-feedback").textContent = "还有空格没放饼干哦。先找线索最多的一行，再排除试试看。"; return; }
    state.power = true;
    advance();
    $("#cookie-feedback").textContent = "叮！每行、每列、每个小方盒都对啦。饼干烤好了，星星属于你！";
  }

  const metalParts = [
    ["🔑 铁钥匙", 1, true], ["🔩 铁螺丝", 2, true], ["🔔 铁铃铛", 3, true],
    ["⚙️ 铁齿轮", 5, true], ["🪵 木积木", 2, false], ["🪨 小石头", 1, false]
  ];
  const growthPhotos = ["🍎 结果", "💧 浇水", "🌸 开花", "🫘 埋种子", "🌱 发芽"];
  const mealOptions = ["🥕 胡萝卜", "🥧 苹果派", "🌰 橡果", "🍎 苹果"];
  const windowPattern = [0, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 0, 0, 1, 0, 0];
  const mirrorLeft = [1, 0, 0, 1, 1, 1, 0, 1];
  const flightRocks = [2, 6, 8, 11, 13];
  const directionNames = ["↑ 上", "→ 右", "↓ 下", "← 左"];
  const butterflyArt = '<rect width="300" height="300" fill="#e1ecce"/><path d="M150 140C35 15 5 120 135 158C10 165 60 290 150 178C240 290 290 165 165 158C295 120 265 15 150 140Z" fill="#c6a9d2" stroke="#88759f" stroke-width="8"/><path d="M150 125V195m0-60-20-30m20 30 20-30" stroke="#6b8265" stroke-width="9" stroke-linecap="round"/><circle cx="85" cy="107" r="15" fill="#efd88c"/><circle cx="215" cy="107" r="15" fill="#efd88c"/><circle cx="105" cy="205" r="12" fill="#fff5c9"/><circle cx="195" cy="205" r="12" fill="#fff5c9"/>';
  const canvasGoals = [
    "三只水果 · 刚好七份重", "接通水龙头和小鸭 · 九块花田都喝水",
    "把三位朋友安全送到对岸", "记住六声歌 · 请朋友们来演奏", "读信封地址 · 点小屋送信",
    "找三件铁零件 · 合起来六份重", "给种子的五张照片排顺序",
    "点一朵云，会连着改变左右邻居 · 全变晴天", "先选点心 · 再点朋友送给它",
    "选两个碗各添一颗 · 三次后每碗四颗", "点空位旁的碎片 · 拼回蝴蝶",
    "左边照镜子 · 点右边补上花纹", "写六步指令 · 拿齐两束花到朋友家",
    "横看左边、竖看上边，按数字把相邻格子点亮", "顺着箭头跳 · 两队青蛙交换位置",
    "吸铁钉 → 修车轮 → 过河 → 晒彩旗"
  ];

  function decorateCanvas() {
    if (level < 5) return;
    $("#scene").dataset.realm = ["picnic", "water", "river", "music", "post", "workshop", "garden", "sky", "cafe", "picnic", "art", "garden", "sky", "night", "water", "festival"][level - 5];
    $("#scene").dataset.puzzle = level >= 10 ? expeditions[level - 10].mode : ["fruit", "pipes", "ferry", "echo", "post"][level - 5];
    const landscape = $("#scene .new-scene-banner");
    if (landscape) {
      landscape.setAttribute("viewBox", "0 0 1000 580");
      landscape.setAttribute("preserveAspectRatio", "xMinYMax slice");
      landscape.innerHTML = `${cloud(75, 85, 1.2)}${cloud(790, 110, 1.4)}<path d="M0 400Q180 260 400 410Q750 260 1000 380V580H0Z" fill="#abc69b"/><path d="M0 480Q300 350 530 480Q850 390 1000 490V580H0Z" fill="#c4d6a5"/>${tree(930, 510, .85, "#86a780")}${tree(25, 490, .7, "#91b18b", 1)}${littleRobot(150, 475, 1.15)}${flower(780, 520, "#fff3c4", 2)}${flower(245, 540, "#efc2b2", 1.5)}<path d="M360 580Q400 520 580 490" fill="none" stroke="#e0deb5" stroke-width="30"/>`;
    }
    const intro = $("#scene .puzzle-intro");
    if (intro) {
      intro.querySelector("span")?.remove();
      intro.querySelector("strong")?.remove();
      const story = document.createElement("details");
      story.className = "scene-story";
      story.innerHTML = "<summary>📖 朋友的故事</summary>";
      story.append(intro.querySelector("p"));
      intro.replaceWith(story);
    }
    const puzzle = $("#scene .extra-puzzle");
    if (!puzzle) return;
    if (level === 7) {
      const capacity = document.createElement("div");
      capacity.className = "ferry-rules";
      capacity.innerHTML = '<strong>🎩 蓝豆 + 最多一位朋友</strong><span>单选：点另一位会换人，也能自己飞回来。</span><span>蓝豆不在时，不能单独留下：🦊 + 🐰 或 🐰 + 🥕</span>';
      puzzle.querySelector(".river-banks").before(capacity);
      const counter = puzzle.querySelector(".river-banks + p");
      if (counter) counter.textContent = `已经飞了 ${state.crossings.length} 次。选好同行朋友，蓝豆会戴上帽子带它出发。`;
    }
    const hint = puzzle.querySelector('[data-extra="hint"]');
    if (hint) { hint.setAttribute("aria-label", "蓝豆，给一点提示"); hint.textContent = "☼"; hint.classList.add("canvas-help"); }
    const controls = puzzle.querySelector('[data-extra="check"]')?.closest(".extra-options");
    if (controls) {
      controls.classList.add("canvas-actions");
      for (const [action, label] of [["undo", "↶ 退一步"], ["reset", "↻ 重来"], ["check", "试试看 ✓"]]) {
        const control = controls.querySelector(`[data-extra="${action}"]`);
        if (control) control.textContent = label;
      }
    }
    const feedback = puzzle.querySelector("#extra-feedback");
    if (feedback && (!state.feedback || state.feedback === "安排好啦！可以继续，也可以退回一步或检查。")) feedback.hidden = true;
    if (level >= 10 && expeditions[level - 10].mode === "program") {
      const directionOptions = puzzle.querySelector('[data-extra="pick"]')?.closest(".extra-options");
      directionOptions?.classList.add("direction-pad");
    }
    const instructions = [...puzzle.children].filter((element) => element.matches("p:first-child, .expedition-rules, ul.puzzle-rules"));
    const rules = document.createElement("details");
    rules.className = "canvas-rules";
    rules.open = Boolean(state.rulesOpen);
    rules.innerHTML = "<summary>💡 怎么玩</summary>";
    for (const instruction of instructions) rules.append(instruction);
    if (instructions.length) {
      rules.addEventListener("toggle", () => { if (rules.isConnected) state.rulesOpen = rules.open; });
      puzzle.prepend(rules);
    }
    const goal = document.createElement("p");
    goal.className = "canvas-objective";
    goal.textContent = canvasGoals[level - 5];
    puzzle.prepend(goal);
  }

  function expeditionPuzzle() {
    const story = expeditions[level - 10];
    const button = (label, action, value, pressed = null, ariaLabel = "") => `<button data-extra="${action}" data-value="${value}"${pressed === null ? "" : ` aria-pressed="${pressed}"`}${ariaLabel ? ` aria-label="${ariaLabel}"` : ""}>${label}</button>`;
    let board = "";
    if (story.mode === "collect") board = `<div class="extra-options">${metalParts.map(([name, weight], i) => button(`${name}<small>${weight} 份重</small>`, "pick", i, state.trial.includes(i))).join("")}</div><div class="basket">🧺 已选 ${state.trial.length} 件 · ${state.trial.reduce((sum, i) => sum + metalParts[i][1], 0)} 份重</div>`;
    if (story.mode === "order" || story.mode === "rescue") {
      const options = story.mode === "order" ? growthPhotos : toolData.map((tool) => `${toolIcon(tool)}${tool.name}`);
      board = `<ol class="plan-slots">${Array.from({ length: story.mode === "order" ? 5 : 4 }, (_, i) => `<li>${state.trial[i] === undefined ? "等待安排" : options[state.trial[i]]}</li>`).join("")}</ol><div class="extra-options">${options.map((name, i) => button(name, "pick", i, state.trial.includes(i))).join("")}</div>`;
    }
    if (story.mode === "clouds") board = `<div class="weather-switches">${state.board.map((sun, i) => button(`<span>${sun ? "☀️" : "🌧️"}</span><small>第 ${i + 1} 格</small>`, "pick", i, Boolean(sun))).join("")}</div>`;
    if (story.mode === "meals") board = `<div class="extra-options">${mealOptions.map((name, i) => button(name, "select", i, state.choice === i)).join("")}</div><div class="meal-places">${["🐿️ 松鼠", "🐰 兔子", "🐻 小熊", "🐦 小鸟"].map((name, i) => button(`${name}<small>${state.trial[i] === undefined ? "点我送点心" : mealOptions[state.trial[i]]}</small>`, "place", i)).join("")}</div>`;
    if (story.mode === "copy") board = `<div class="bowl-row">${state.board.map((count, i) => `<div><strong>${["左碗", "中碗", "右碗"][i]}</strong><p>${"🌰".repeat(count)}</p><span>${count} 颗</span></div>`).join("")}</div><p>复制 ${state.history.length} / 3 次</p><div class="extra-options">${["左碗 + 中碗", "中碗 + 右碗", "左碗 + 右碗"].map((name, i) => button(name, "pick", i)).join("")}</div>`;
    if (story.mode === "slide") board = `<figure class="butterfly-reference"><svg viewBox="0 0 300 300" role="img" aria-label="完整蝴蝶壁画参考">${butterflyArt}</svg><figcaption>拼好后这样，右下留空</figcaption></figure><div class="slide-board">${state.board.map((tile, i) => `<button data-extra="pick" data-value="${i}" data-tile="${tile}" aria-label="第${Math.floor(i / 3) + 1}行第${i % 3 + 1}列，${tile === 8 ? "空位" : `图片原位第${Math.floor(tile / 3) + 1}行第${tile % 3 + 1}列`}">${tile === 8 ? '<span aria-hidden="true">空位</span>' : `<svg viewBox="${tile % 3 * 100} ${Math.floor(tile / 3) * 100} 100 100" aria-hidden="true">${butterflyArt}</svg>`}</button>`).join("")}</div>`;
    if (story.mode === "mirror") board = `<div class="mirror-board">${Array.from({ length: 16 }, (_, i) => {
      const col = i % 4, row = Math.floor(i / 4);
      return col < 2 ? `<span class="mirror-given" aria-label="左边第${row + 1}行第${col + 1}格${mirrorLeft[row * 2 + col] ? "有花" : "空白"}">${mirrorLeft[row * 2 + col] ? "🌸" : "·"}</span>` : button(state.board[i] ? "🌸" : "·", "pick", i, Boolean(state.board[i]));
    }).join("")}</div><p class="map-edge">左边是原图 │ 右边像照镜子</p>`;
    if (story.mode === "program") board = `<div class="flight-map">${Array.from({ length: 16 }, (_, i) => `<div aria-label="第${Math.floor(i / 4) + 1}行第${i % 4 + 1}列">${i === 0 ? "🤖 起点" : i === 15 ? "🏡 终点" : flightRocks.includes(i) ? "🪨" : [5, 10].includes(i) ? "💐" : "·"}</div>`).join("")}</div><ol class="plan-slots">${state.trial.map((id) => `<li>${directionNames[id]}</li>`).join("")}</ol><div class="extra-options">${directionNames.map((name, i) => button(name, "pick", i)).join("")}</div><p>已写 ${state.trial.length} / 6 步</p>`;
    if (story.mode === "window") {
      const groups = (bits) => {
        const runs = bits.join("").split("0").filter(Boolean).map((run) => run.length);
        return runs.join(" · ") || "0";
      };
      const clue = (line, number, label) => `<button class="window-clue" data-extra="window-clue" data-value="${number}" aria-label="${label}，提示 ${line} 格，点数字可以仔细看">${line}</button>`;
      board = `<div class="window-guide"><p class="window-guide-title"><strong>数字 2</strong>：这条线上，正好有两格星星挨在一起。</p><div class="window-guide-examples"><div class="window-example"><span>横着看</span><b>2</b><span class="window-example-cells" aria-label="星星、星星、空格、空格">⭐ ⭐ · ·</span></div><div class="window-example"><span>竖着看</span><b>2</b><span class="window-example-cells vertical" aria-label="从上到下：星星、星星、空格、空格">⭐<br>⭐<br>·<br>·</span></div></div><p>这只是“2”的一种排法。横着看左边的数，竖着看上面的数；星星的位置要两边一起对照。</p></div><div class="window-directions">左边数字管每一排；上面数字管每一列。</div><div class="window-board" role="group" aria-label="四行四列的星星窗"><span aria-hidden="true"></span>${[0, 1, 2, 3].map((col) => clue(groups(windowPattern.filter((_, i) => i % 4 === col)), col, `上面第${col + 1}列的提示`)).join("")}${Array.from({ length: 4 }, (_, row) => `${clue(groups(windowPattern.slice(row * 4, row * 4 + 4)), row + 4, `左边第${row + 1}排的提示`)}${Array.from({ length: 4 }, (_, col) => button(state.board[row * 4 + col] ? "⭐" : "·", "pick", row * 4 + col, Boolean(state.board[row * 4 + col]), `第${row + 1}排第${col + 1}格，${state.board[row * 4 + col] ? "星星亮着" : "空白"}，点一下切换`)).join("")}`).join("")}</div><p class="window-toggle-help">点空格让星星亮起；点亮的格子再点一下会熄灭。</p>`;
    }
    if (story.mode === "frogs") board = `<div class="frog-goal">目标：🐸← 🐸← 空位 →🐸 →🐸</div><div class="frog-pond">${state.board.map((frog, i) => button(`<span>${frog ? "🐸" : "🍃"}</span><strong>${frog === 1 ? "→" : frog === -1 ? "←" : "空位"}</strong><small>第 ${i + 1} 片</small>`, "pick", i)).join("")}</div>`;
    return `<p class="expedition-rules">${story.rules}</p>${board}<div class="extra-options"><button data-extra="undo">退回一步</button><button data-extra="reset">重新安排</button><button class="primary-button" data-extra="check">检查一下，帮朋友完成</button></div>`;
  }

  function checkExpedition() {
    const mode = expeditions[level - 10].mode;
    const same = (actual, expected) => actual.length === expected.length && expected.every((value, i) => actual[i] === value);
    if (mode === "collect") {
      if (state.trial.some((id) => !metalParts[id][2])) return "木头和石头不能被磁力手套吸起。选铁做的小零件吧。";
      if (state.trial.length !== 3 || state.trial.reduce((sum, i) => sum + metalParts[i][1], 0) !== 6) return "还没同时满足：三件铁零件、合起来六份重。换一件再试试。";
    }
    if (mode === "order" && !same(state.trial, [3, 1, 4, 2, 0])) return "小种子还没按成长顺序排好。先种下、再浇水，花和果实谁先来？";
    if (mode === "clouds" && !state.board.every(Boolean)) return "还有小雨云。试着想想：点这一格，会影响哪几个邻居？";
    if (mode === "meals" && !same(state.trial, [2, 0, 3, 1])) return "有朋友的点心还没对上。再听一听：小熊要的是苹果派用到的水果，不是派。";
    if (mode === "copy" && (!state.board.every((count) => count === 4) || state.history.length !== 3)) return "每碗要四颗，只用三次。两边各添一颗，不能只给一个碗哦。";
    if (mode === "slide" && !state.board.every((tile, i) => tile === i)) return "有图片还没回到原位。对照小图，看看花纹和蝴蝶翅膀能不能接起来。";
    if (mode === "mirror" && !state.board.every((on, i) => i % 4 < 2 || on === mirrorLeft[Math.floor(i / 4) * 2 + 3 - i % 4])) return "两半还没像照镜子一样。离竖线近的格子，要对应另一边离竖线近的格子。";
    if (mode === "program") {
      if (state.trial.length !== 6) return "先写好六步指令，再让机器人试跑。";
      let cell = 0;
      const flowers = new Set();
      for (let step = 0; step < state.trial.length; step++) {
        const dir = state.trial[step], row = Math.floor(cell / 4), col = cell % 4;
        if ((dir === 0 && row === 0) || (dir === 1 && col === 3) || (dir === 2 && row === 3) || (dir === 3 && col === 0)) return `第 ${step + 1} 步跑到地图外啦，退回几步换个方向。`;
        cell += [-4, 1, 4, -1][dir];
        if (flightRocks.includes(cell)) return `第 ${step + 1} 步碰到石头啦。先看看哪边有路。`;
        if ([5, 10].includes(cell)) flowers.add(cell);
      }
      if (cell !== 15 || flowers.size !== 2) return "还没带齐两束花到终点。把拿花的位置和终点连起来想一想。";
    }
    if (mode === "window" && !same(state.board, windowPattern)) return "还有一排或一列的星星没有按数字连起来。横着核对左边的数，再竖着核对上面的数。";
    if (mode === "frogs" && !same(state.board, [-1, -1, 0, 1, 1])) return "两队还没完全交换位置。不能往回跳，必要时退回一步重新想。";
    if (mode === "rescue" && !same(state.trial, [4, 9, 1, 6])) return "道具顺序还不符合车站的情况。铁钉没取出不能修，车没修好不能过河。";
    return "";
  }

  function expeditionAction(action, value) {
    const mode = expeditions[level - 10].mode;
    if (action === "undo") {
      const previous = state.history.pop();
      if (previous) { state.trial = previous.trial; state.board = previous.board; }
      return "退回上一步啦，可以换个办法。";
    }
    if (action === "reset") {
      while (state.history.length) expeditionAction("undo", null);
      state.choice = null;
      return "回到最初状态啦。先看看朋友给的线索。";
    }
    if (mode === "window" && action === "window-clue") {
      if (!Number.isInteger(value) || value < 0 || value > 7) return "";
      if (selectedTool !== "scope") return "窗玻璃上的数字太小啦，凑近一点仔细看看。";
      const isColumn = value < 4;
      const index = isColumn ? value : value - 4;
      const cells = isColumn
        ? windowPattern.filter((_, i) => i % 4 === index)
        : windowPattern.slice(index * 4, index * 4 + 4);
      const count = cells.join("").split("0").filter(Boolean).map((run) => run.length).join(" · ") || "0";
      animateGadget("scope");
      const emptyLine = Array.from({ length: 4 }, () => "<span>·</span>").join("");
      showModal(`<p class="modal-kicker">望远镜里的窗格细节</p><h2 id="modal-title">${isColumn ? `第 ${index + 1} 列` : `第 ${index + 1} 排`}的数字</h2><p class="modal-copy">提示数字是 <strong>${count}</strong>。这条线有四个位置，放大后看得更清楚：</p><div class="window-zoom-line${isColumn ? " vertical" : ""}" aria-label="${isColumn ? "从上到下" : "从左到右"}的四个空格">${emptyLine}</div><p class="modal-copy">数字告诉你要点亮几个相邻的格子；星星具体在哪几格，还要和交叉的提示一起想。</p><button class="primary-button" data-modal-action="close">看清楚啦，回窗格继续推理</button>`, "window-clue");
      return "";
    }
    if (action === "select" && mode === "meals" && value >= 0 && value < 4) {
      state.choice = value;
      return "选好点心啦，再点一位朋友送给它。";
    }
    if (!Number.isInteger(value) || value < 0) return "";
    if (mode === "meals" && action === "place" && state.choice === null) return "先选一种点心，再点朋友。";
    if (["order", "rescue"].includes(mode) && (state.trial.includes(value) || state.trial.length >= (mode === "order" ? 5 : 4))) return "已经安排过，或者格子满啦。可以退回一步再换。";
    if (mode === "copy" && state.history.length >= 3) return "复制盒只用三次。退回一步，换一对碗试试。";
    if (mode === "program" && state.trial.length >= 6) return "六步指令写满啦，先检查，或者退回一步。";
    if (mode === "slide") {
      const empty = state.board.indexOf(8);
      if (Math.abs(Math.floor(empty / 3) - Math.floor(value / 3)) + Math.abs(empty % 3 - value % 3) !== 1) return "只有紧挨空位的图片能滑动，斜着也不行哦。";
    }
    if (mode === "frogs") {
      const empty = state.board.indexOf(0), frog = state.board[value];
      const distance = (empty - value) * frog;
      if (!frog || (distance !== 1 && !(distance === 2 && state.board[value + frog] === -frog))) return "这只青蛙不能这样跳。只能向箭头方向，走一格或跳过一只不同队的青蛙。";
    }
    state.history.push({ trial: [...state.trial], board: [...state.board] });
    if (mode === "collect") state.trial = state.trial.includes(value) ? state.trial.filter((id) => id !== value) : [...state.trial, value];
    if (["order", "rescue", "program"].includes(mode)) state.trial.push(value);
    if (mode === "clouds") {
      state.board = state.board.map((sun, i) => Math.abs(i - value) <= 1 ? 1 - sun : sun);
      animateGadget("umbrella");
    }
    if (mode === "copy") {
      for (const bowl of [[0, 1], [1, 2], [0, 2]][value]) state.board[bowl]++;
      animateGadget("copy");
    }
    if (mode === "meals") {
      state.trial = Array.from({ length: 4 }, (_, i) => state.trial[i] === state.choice ? undefined : state.trial[i]);
      state.trial[value] = state.choice;
    }
    if (mode === "slide" || mode === "frogs") {
      const empty = state.board.indexOf(mode === "slide" ? 8 : 0);
      [state.board[empty], state.board[value]] = [state.board[value], state.board[empty]];
    }
    if (mode === "mirror" || mode === "window") state.board[value] = 1 - state.board[value];
    return "安排好啦！可以继续，也可以退回一步或检查。";
  }

  function pipePorts(index) {
    const base = pipeKinds[index] === "straight" ? [1, 3] : [0, 1];
    return base.map((port) => (port + state.pipes[index]) % 4);
  }

  function extraPuzzle() {
    if (level >= 10) return expeditionPuzzle();
    if (level === 5) return `<div class="puzzle-rules"><p>⚖️ 🍎 + 🍎 = 🌰🌰🌰🌰</p><p>⚖️ 🍎 + 🍐 = 🌰🌰🌰🌰🌰</p><p>⚖️ 🍈 = 🍎 + 🍐</p></div><p>一颗松果算一份重量。篮子要装 <strong>三只水果，刚好七份重</strong>，同种水果可以再拿。</p><div class="extra-options">${fruitNames.map((name, i) => `<button data-extra="fruit" data-value="${i}">${name}<small>放进篮子</small></button>`).join("")}</div><div class="basket" aria-label="野餐篮">${state.fruit.length ? state.fruit.map((id) => fruitNames[id]).join(" + ") : "🧺 篮子还是空的"}<small>${state.fruit.length} / 3 只水果</small></div><button class="secondary-button" data-extra="undo">拿回最后一只</button><button class="primary-button" data-extra="check">称一称，准备出发</button>`;
    if (level === 6) return `<p>${state.gate ? "水流过九块花田啦！小鸭喝到水，花儿也开了！" : "点水管转一格，让水从水龙头流到小鸭。<strong>九块花田都要经过</strong>，别让水从其他边缘漏出去。"}</p><div class="water-garden${state.gate ? " water-running" : ""}"><div class="water-port water-inlet" aria-label="进水口，在第一行第一列的左侧"><span aria-hidden="true">🚰</span><strong>进水</strong><span class="port-arrow" aria-hidden="true">→</span></div><div class="pipe-grid">${pipeKinds.map((kind, i) => {
      const ports = pipePorts(i);
      const ends = [[50, 0], [100, 50], [50, 100], [0, 50]];
      const order = [0, 1, 2, 5, 4, 3, 6, 7, 8].indexOf(i);
      const entry = [0, 1, 2, 7, 8].includes(i) ? 3 : [4, 3].includes(i) ? 1 : 0;
      const exit = ports.find((port) => port !== entry);
      return `<button data-extra="pipe" data-value="${i}" ${state.gate ? "disabled" : ""} aria-label="第${Math.floor(i / 3) + 1}行第${i % 3 + 1}列水管${i === 0 ? "，左侧是进水口" : i === 8 ? "，右侧是出水口" : ""}，接口朝${ports.map((p) => ["上", "右", "下", "左"][p]).join("和")}，${state.gate ? "水已接通" : "点击旋转"}" style="--water-delay:${order * 130}ms"><svg viewBox="0 0 100 100" aria-hidden="true"><rect x="3" y="3" width="94" height="94" rx="14" fill="#e1ead5"/><path d="${ports.map((p) => `M50 50L${ends[p].join(" ")}`).join("")}" fill="none" stroke="#88b9c3" stroke-width="20" stroke-linecap="round"/>${state.gate ? `<path class="water-fill" pathLength="1" d="M${ends[entry].join(" ")}L50 50L${ends[exit].join(" ")}"/><path class="water-drops" d="M${ends[entry].join(" ")}L50 50L${ends[exit].join(" ")}"/><text class="water-flower" x="65" y="27" font-size="21">🌼</text>` : '<circle cx="50" cy="50" r="6" fill="#c6e9e9"/>'}</svg></button>`;
    }).join("")}</div><div class="water-port water-outlet" aria-label="出水口，在第三行第三列的右侧"><span class="port-arrow" aria-hidden="true">→</span><span class="drinking-duck" aria-hidden="true">🦆</span><strong>${state.gate ? "喝到啦！" : "出水"}</strong></div></div>${state.gate ? '<p class="inline-feedback" role="status">哗啦啦——九块花田都喝到水啦！</p>' : '<button class="primary-button" data-extra="check">放一点水，试试看</button>'}`;
    if (level === 7) return `<ul class="puzzle-rules"><li>飞行帽一次只能带一位朋友，也能自己飞回来。</li><li>蓝豆不在那一岸时，狐狸会追兔子，兔子会偷吃萝卜，不能把它们单独留下。</li><li>每飞一次，都想想两岸留下了谁。可以退回上一步，不着急。</li></ul><div class="river-banks">${[0, 1].map((side) => `<section><strong>${side ? "对岸 · 营地" : "这岸 · 出发点"}</strong><p>${state.boat === side ? "🤖 蓝豆在这里" : "蓝豆不在这里"}</p>${["🦊 狐狸", "🐰 兔子", "🥕 萝卜"].map((name, i) => state.bank[i] === side ? `<button data-extra="passenger" data-value="${i}" ${side !== state.boat ? "disabled" : ""} aria-pressed="${state.passenger === i}">${name}${state.passenger === i ? " ✓" : ""}</button>` : "").join("")}</section>`).join("")}</div><p>已经飞了 ${state.crossings.length} 次。选好朋友后，记得选「云朵飞行帽」。</p><div class="extra-options"><button data-extra="alone" aria-pressed="${state.passenger === null}">🤖 这次自己飞</button><button data-extra="cross">飞到${state.boat ? "出发点" : "营地"} →</button><button data-extra="undo">退回上一步</button></div>`;
    if (level === 8) return `<p>先看树冠里的六声歌谱，记好再回来演奏。每只小动物都有图案和声音，<strong>不用打开声音也能玩</strong>。随时可以回看，没有倒计时。</p><button class="secondary-button" data-extra="score">看看回声歌谱</button><div class="extra-options">${musicians.map((name, i) => `<button data-extra="note" data-value="${i}">${name}</button>`).join("")}</div><div class="basket" aria-label="我的演奏">${state.notes.length ? state.notes.map((id, i) => `<span>${i + 1}. ${musicians[id]}</span>`).join("　") : "🎵 还没有演奏，点一位音乐朋友开始吧"}<small>${state.notes.length} / 6 声</small></div><button class="secondary-button" data-extra="undo">退回一声</button><button class="primary-button" data-extra="check">请音乐树听一听</button>`;
    return `<p>地图上方是山坡，下方是小路。先选信，再点小屋；五封信各送一间，可以随时修改。</p><div class="letter-palette">${letters.map(([name], i) => `<button data-extra="letter" data-value="${i}" aria-pressed="${state.letter === i}">${name}${state.deliveries[i] !== null ? " ✓" : ""}</button>`).join("")}</div><p class="address-card" role="status"><strong>${letters[state.letter][0]}的地址：</strong>${letters[state.letter][1]}</p><p class="map-edge">⛰️ 山坡 · 地图上方</p><div class="post-map">${Array.from({ length: 9 }, (_, i) => i === 0 || i === 4 ? `<div class="map-landmark">${i === 0 ? "🌳 苹果树" : "💧 小湖"}</div>` : `<button data-extra="house" data-value="${i}" aria-label="第${Math.floor(i / 3) + 1}行第${i % 3 + 1}列${i === 2 ? "粉屋顶" : "黄屋顶"}小屋"><svg viewBox="0 0 100 85" aria-hidden="true"><path d="M17 35h66v45H17Z" fill="#e6d5aa"/><path d="m6 37 44-32 44 32Z" fill="${i === 2 ? "#d4a0ac" : "#dfc36d"}"/><path d="M39 80V57h22v23" fill="#fff9e6"/></svg><span>${letters.filter((_, n) => state.deliveries[n] === i).map(([name]) => name.split(" ")[0]).join("") || "等待来信"}</span></button>`).join("")}</div><p class="map-edge">🌼 小路 · 地图下方</p><button class="primary-button" data-extra="check">检查地址，准备投递</button>`;
  }

  function extraScene() {
    const story = newStories[level - 5];
    return `<div class="puzzle-intro"><span>蓝豆的朋友任务 · 第 ${level} 站</span><strong>${story.icon} ${levels[level - 1].title}</strong><p>${canvasGoals[level - 5]}。朋友需要你的观察和思考，道具不会替你决定。</p></div><svg class="new-scene-banner" viewBox="0 0 600 150" aria-hidden="true"><rect width="600" height="150" rx="18" fill="${level === 8 || level === 9 ? "#bdcbd5" : "#dcebe1"}"/>${cloud(50, 30, .6)}${cloud(455, 36, .7)}<path d="M0 115Q100 30 260 107Q450 30 600 106V150H0Z" fill="#bacfa7"/><path d="M0 141Q130 80 300 135Q480 70 600 135V150H0Z" fill="#d0dbad"/>${littleRobot(135, 105, .6)}${tree(535, 145, .55)}<text x="300" y="106" text-anchor="middle" font-size="66">${story.icon}</text>${flower(390, 140, "#fff3c4", 1.4)}</svg>${!state.clue ? `<div class="story-task"><p>先到现场看看，留意哪些事情会随着你的动作改变。</p><button class="primary-button" data-action="extra-entry">看看现场</button></div>` : !state.gate ? `<div class="extra-puzzle">${extraPuzzle()}<p id="extra-feedback" class="inline-feedback" role="status">${state.feedback || "先想一想，再试试看。蓝豆一直陪着你！"}</p><button class="text-button" data-extra="hint">☼ 蓝豆，给一点提示</button></div>` : `<div class="story-task"><span class="new-story-icon" aria-hidden="true">${story.icon} ✨</span><p>${level === 18 ? "星星的位置都找对了，可窗框还在摇晃，裂开的玻璃没有固定好。" : "朋友的小难题解决啦！这颗星星送给愿意思考的你。"}</p>${!state.collected ? `<button class="primary-button" data-action="extra-finish">${level === 18 ? "检查摇晃的窗框" : "收下朋友的星星"}</button>` : '<button class="secondary-button" data-action="extra-collection">看看我的星星</button>'}</div>`}`;
  }

  function extraHints() {
    if (level >= 10) return expeditions[level - 10].hints;
    return [
      ["两只苹果和四颗松果一样重。一只苹果是几份？再从五份里拿走一只苹果，梨是几份？", "苹果两份，梨三份，小瓜五份。先试两只苹果，再想第三只加谁，能到七份。"],
      ["先看水从哪里进、哪里出。左上角需要接住左边来的水，右下角要向右送水。", "试试像蛇一样绕过每块花田：上排向右，中排向左，下排再向右。转弯处需要弯水管。"],
      ["先带谁走，才不会让另一岸剩下会闹起来的一对？有时已经过去的朋友还得带回来。", "先带兔子，自己回来，带狐狸过去，再带兔子回来。接着带萝卜过去，自己回来，最后接兔子。"],
      ["把歌分成前面三声和后面三声记。图案比文字更容易记住，可以再看看歌谱！", "六声是：小鸟、青蛙、猫头鹰；小鸟、小溪、青蛙。"],
      ["正下方指同一列的下一格；右边指同一排的右一格。先送不需要别的信帮忙的信。", "月亮信去上排中间，花朵信去中排左边，太阳信去中排右边。星星信去下排中间，叶子信在它右边。"]
    ][level - 5];
  }

  function checkExtra() {
    if (level >= 10) {
      const error = checkExpedition();
      if (error) return error;
      state.gate = true;
      advance("朋友的小难题解开啦！他们为你准备了礼物。");
      return "";
    }
    if (level === 5) {
      if (state.fruit.length !== 3) return "篮子里要有三只水果哦，不多也不少。";
      const weight = state.fruit.reduce((sum, id) => sum + fruitWeights[id], 0);
      if (weight !== 7) return `树叶秤显示 ${weight} 份，${weight > 7 ? "有点重，换一只轻一点的" : "还轻了些，换一只重一点的"}。目标是七份！`;
    } else if (level === 6) {
      let cell = 0, incoming = 3;
      const visited = new Set();
      while (!visited.has(cell)) {
        visited.add(cell);
        const ports = pipePorts(cell);
        if (!ports.includes(incoming)) return "水在接口处停住啦。两根相邻水管的口，要面对面接起来。";
        const out = ports.find((port) => port !== incoming);
        if (cell === 8 && out === 1) {
          if (visited.size === 9) break;
          return "小鸭喝到水了，但还有花田没经过。九块都要喝到水哦。";
        }
        const row = Math.floor(cell / 3), col = cell % 3;
        if ((out === 0 && row === 0) || (out === 1 && col === 2) || (out === 2 && row === 2) || (out === 3 && col === 0)) return "水从花田边缘漏出去啦。转转这边的水管，让水留在花园里。";
        cell += [-3, 1, 3, -1][out];
        incoming = (out + 2) % 4;
      }
      if (visited.size !== 9 || cell !== 8) return "水绕了个圈，没有到小鸭那里。试试让它经过全部花田再流出去。";
    } else if (level === 8) {
      if (state.notes.length !== echoSong.length) return "晚安歌一共六声，先把六声演奏完整吧。";
      const mismatch = state.notes.findIndex((note, i) => note !== echoSong[i]);
      if (mismatch !== -1) return `第 ${mismatch + 1} 声和回声不一样。可以退回几声，也可以再看看歌谱。`;
    } else if (level === 9) {
      if (state.deliveries.includes(null)) return "还有信没选好小屋。每封信都要有一位收信朋友。";
      const mismatch = state.deliveries.findIndex((house, i) => house !== letters[i][2]);
      if (mismatch !== -1) return `${letters[mismatch][0]}的地址还没对上。选这封信，再对着地图看看位置。`;
    } else return "先把三个朋友都送到对岸吧。";
    state.gate = true;
    advance("你想出来啦！朋友的心愿完成了。");
    return "";
  }

  function extraAction(action, value) {
    if (level < 5 || !state.clue || state.gate || state.collected) return;
    state.rulesOpen = Boolean($(".canvas-rules")?.open);
    let message = "";
    if (action === "hint") {
      const hints = extraHints();
      message = hints[Math.min(state.extraHint++, hints.length - 1)];
    }
    else if (action === "check") message = checkExtra();
    else if (level >= 10) message = expeditionAction(action, value);
    else if (level === 5 && action === "fruit" && value >= 0 && value < 3) {
      if (state.fruit.length === 3) message = "篮子已经有三只啦。先拿回最后一只，再换一个试试。";
      else { state.fruit.push(value); message = "放进去啦！想好后三只一起称一称。"; }
    } else if (level === 6 && action === "pipe" && value >= 0 && value < 9) {
      state.pipes[value] = (state.pipes[value] + 1) % 4;
      message = "水管转了一格。接口连好后，可以放一点水试试。";
    } else if (level === 7) {
      if (action === "passenger" && state.bank[value] === state.boat) { state.passenger = value; message = `这次带${["狐狸", "兔子", "萝卜"][value]}。帽子只能带一位，点另一位会换人。`; }
      else if (action === "alone") { state.passenger = null; message = "这一次蓝豆自己飞，不带朋友。"; }
      else if (action === "cross") {
        const bank = [...state.bank], boat = 1 - state.boat;
        if (state.passenger !== null) bank[state.passenger] = boat;
        if ((bank[0] === bank[1] && bank[1] !== boat) || (bank[1] === bank[2] && bank[1] !== boat)) message = `等等！蓝豆离开后，${bank[0] === bank[1] && bank[1] !== boat ? "狐狸和兔子" : "兔子和萝卜"}会单独留下、闹起来。这次先不出发，换个同行朋友想想吧。`;
        else {
          animateGadget("fly");
          state.crossings.push({ bank: [...state.bank], boat: state.boat });
          state.bank = bank; state.boat = boat; state.passenger = null;
          message = "平安到达！下一次可以带朋友，也可以自己回来。";
          if (bank.every((side) => side === 1)) { state.gate = true; winLevel(); return; }
        }
      }
    } else if (level === 8) {
      if (action === "score") {
        showModal(`<p class="modal-kicker">树冠里的回声 · 可以反复看</p><h2 id="modal-title">六声晚安歌</h2><ol class="echo-score">${echoSong.map((id) => `<li>${musicians[id]}</li>`).join("")}</ol><p class="modal-copy">记前面三声，再记后面三声。准备好再回去，不着急。</p><button class="primary-button" data-modal-action="close">记好啦，去演奏</button>`, "echo");
        return;
      }
      if (action === "note" && value >= 0 && value < 4) {
        if (state.notes.length === 6) message = "六声都演奏啦。听一听，或者退回一声再试。";
        else { state.notes.push(value); playSound(value); message = `${musicians[value]}！已经演奏 ${state.notes.length} 声。`; }
      }
    } else if (level === 9) {
      if (action === "letter" && value >= 0 && value < 5) { state.letter = value; message = "看看这封信的地址，再点地图上的小屋。"; }
      if (action === "house" && [1, 2, 3, 5, 6, 7, 8].includes(value)) {
        state.deliveries = state.deliveries.map((house) => house === value ? null : house);
        state.deliveries[state.letter] = value;
        message = "标好收信小屋啦！可以换位置，或者继续安排下一封信。";
      }
    }
    if (action === "undo") {
      if (level === 5) state.fruit.pop();
      if (level === 8) state.notes.pop();
      if (level === 7 && state.crossings.length) { const previous = state.crossings.pop(); state.bank = previous.bank; state.boat = previous.boat; state.passenger = null; }
      message = "退回一步啦，继续想一想。";
    }
    state.feedback = message;
    renderScene();
    const selector = `[data-extra="${action}"]${Number.isInteger(value) ? `[data-value="${value}"]` : ""}`;
    $(selector)?.focus({ preventScroll: true });
    announce(message);
  }

  function hotspot(id, x, y, label, done = false, star = false) {
    return `<button id="hotspot-${id}" data-action="${id}" class="hotspot${done ? " done" : ""}${star ? " star-hotspot" : ""}" style="left:${x}%;top:${y}%" aria-label="${label}${done ? "，已完成" : ""}"><span class="hotspot-dot" aria-hidden="true">${done ? "✓" : star ? "✦" : "+"}</span><span class="hotspot-label">${label}</span></button>`;
  }

  function renderScene() {
    const focusId = document.activeElement?.id;
    $("#scene").classList.toggle("puzzle-scene", level >= 3);
    $("#scene").classList.toggle("bakery-scene", level === 4);
    if (level === 1) {
      $("#scene").innerHTML = forestScene() + '<span class="scene-note">✧ 微风森林 · 晴</span>' +
        hotspot("sign", 20, 59, state.clue ? "再看一眼线索" : "神秘路牌", state.clue) +
        hotspot("gate", 52, 48, state.gate ? "机关解开啦" : "彩虹机关", state.gate) +
        hotspot("river", 49, 80, state.bridge ? "彩虹桥长出来啦" : "这里少了一座桥", state.bridge) +
        (!state.collected ? hotspot("treasure", 82, 57, "森林星星", false, true) : "");
    } else if (level === 2) {
      $("#scene").innerHTML = nightScene() + '<span class="scene-note night">☾ 星光山谷 · 傍晚</span>' +
        hotspot("door", 24, 72, "溪边的路线图", state.power) +
        hotspot("light", 54, 60, state.power ? "星光线路亮啦" : "萤火虫工作台", state.power) +
        (!state.collected ? hotspot("lighthouse", 80, 32, "灯塔上的星星", false, true) : "");
    } else $("#scene").innerHTML = level >= 5 ? extraScene() : level === 3 ? gardenScene() : cookieScene();
    if (level === 6 && state.gate) $(".story-task").insertAdjacentHTML("beforebegin", `<div class="extra-puzzle">${extraPuzzle()}</div>`);
    decorateCanvas();
    const collectionButton = $('[data-action="extra-collection"]');
    if (collectionButton) collectionButton.textContent = "看看我的星星";
    if (focusId && document.getElementById(focusId)) document.getElementById(focusId).focus({ preventScroll: true });
  }

  function missionData() {
    if (level >= 5) return [["看看朋友遇到的问题", state.clue], ["帮朋友解开小难题", state.gate], [level === 18 ? "修补窗框，收下星星" : "收下朋友的星星", state.collected]];
    if (level === 3) return [["观察两座花园", state.clue], ["找出变化，帮朋友找家", state.gate], ["接住朋友的礼物", state.collected]];
    if (level === 4) return [["观察饼干烤盘", state.small], ["解开烤盘的图形谜题", state.power], ["把饼干送给月亮", state.collected]];
    return level === 1
      ? [["发现路牌上的秘密", state.clue], ["解开彩虹机关", state.gate], ["搭起小桥，找到星星", state.collected]]
      : [["观察溪边路线图", state.small], ["让萤火虫的光到达灯塔", state.power], ["飞上灯塔，收集星星", state.collected]];
  }

  function friendMessage() {
    if (state.collected) return "你做到了！观察、思考、勇敢试一试，就是最棒的魔法。";
    if (level >= 5) return state.gate ? level === 18 ? "星星图案排好啦。窗框还在摇晃，裂开的玻璃没有固定好。" : "问题解决了！朋友准备了一份小礼物。" : `${canvasGoals[level - 5]}。先观察发生了什么，不用急着作答。`;
    if (level === 3) return state.gate ? "小兔子捧着花园星星跑来了。这是朋友们的谢礼！" : state.found.length === 5 ? "三位朋友忘了住哪里。它们说的话能一起成立吗？" : `已经找到 ${state.found.length} 处。远看一样的地方，近看会不会不同？`;
    if (level === 4) return state.power ? "饼干烤好啦！月亮还在云朵上等着，地上的路却到这里就结束了。" : "同一个空格要同时照顾横排、竖排和小方盒。你能找到三边都不重复的一种吗？";
    if (level === 1) {
      if (!state.clue) return "嗨，我是蓝豆！河对岸的星星在等我们。那块路牌好像藏着什么秘密呢？";
      if (!state.gate) return "四位朋友要排队过桥！三个小约定要同时满足。试着先把必须挨着的朋友放在一起吧。";
      if (!state.bridge) return "机关打开了，可河水还在流。两岸之间少了一段能走的路。";
      return "哇，小桥长出来了！点一下河对岸的森林星星，把它装进口袋吧。";
    }
    if (!state.small) return "天快黑啦，灯塔还没亮。小门后面有修灯的线索，可是门也太小了吧！";
    if (!state.power) return "这次没有现成的路线哦！要经过两朵补光花，避开猫头鹰，还得刚好走七步。先想好，再出发！";
    return "灯塔亮了！星星在塔顶，最后一段路不在地上。";
  }

  function renderProgress() {
    const missions = missionData();
    $("#missions").innerHTML = missions.map(([text, done], i) => `<li class="${done ? "done" : ""}"><span class="mission-check" aria-hidden="true">${done ? "✓" : i + 1}</span><span>${text}</span>${done ? '<span class="sr-only">，已完成</span>' : ""}</li>`).join("");
    $("#mission-count").textContent = `${missions.filter(([, done]) => done).length} / 3`;
    $("#friend-message").textContent = friendMessage();
    $("#star-count").textContent = completed.size;
    $("#map-current").textContent = `第 ${level} 站 / ${levels.length}`;
    levels.forEach((entry, i) => {
      const button = $(`#${entry.id}`);
      button.disabled = false;
      button.classList.toggle("active", level === i + 1);
      button.setAttribute("aria-pressed", String(level === i + 1));
      button.querySelector(".tab-status").textContent = completed.has(i + 1) ? "✓" : "✦";
    });
  }

  function renderTools() {
    const availableTools = level === 18 ? toolData.filter((tool) => ["scope", "repair"].includes(tool.id)) : toolData;
    $("#tools").innerHTML = availableTools.map((tool, i) => `<button id="tool-${tool.id}" class="tool-card${selectedTool === tool.id ? " selected" : ""}" data-tool="${tool.id}" aria-pressed="${selectedTool === tool.id}" aria-label="${tool.name}：${tool.description}"><span class="tool-number" aria-hidden="true">${selectedTool === tool.id ? "✓" : String(i + 1).padStart(2, "0")}</span><span class="tool-icon">${toolIcon(tool)}</span><span><span class="tool-name">${tool.name}</span><span class="tool-description">${tool.description}</span></span></button>`).join("");
    const toolMessage = selectedTool ? `拿着${toolData.find((tool) => tool.id === selectedTool).name}，你想试试哪里？` : "观察场景，也可以打开口袋试试自己的办法。";
    $("#scene-instruction").textContent = level === 18 ? selectedTool ? `拿着${toolData.find((tool) => tool.id === selectedTool).name}，看看窗边的数字和裂缝。` : "窗边有小小的数字，窗框也裂开了。看看口袋里的道具，也看看每一条线索。" : level === 3 ? selectedTool === "scope" ? "观察镜已举起，点一处景物就能同时放大两边。" : "点景物标记不同；拿起观察镜时，同样的点击会变成近看。" : level === 4 && !state.power ? selectedTool === "shrink" ? "点一个空格，你会变小站进烤盘，近看它的三组邻居。" : "先点空格，再选饼干；填完检查烤盘。道具只是帮手，不替你答题。" : toolMessage;
  }

  function startLevel(number) {
    if (!Number.isInteger(number) || number < 1 || number > levels.length) return;
    clearGadgetAnimation();
    clearTimeout(toastTimer);
    $("#toast").hidden = true;
    if ("speechSynthesis" in window) window.speechSynthesis.cancel();
    const hadDialog = $("#modal").open;
    if (hadDialog) closeModal();
    level = number;
    state = defaultState();
    if (number === 2 || number === 4) state.small = true;
    if (number === 3) state.clue = true;
    state.trial = [];
    state.history = [];
    state.choice = null;
    state.board = level === 12 ? [0, 1, 0, 1, 0] : level === 14 ? [2, 2, 2] : level === 15 ? [0, 8, 2, 4, 1, 5, 3, 6, 7] : level === 19 ? [1, 1, 0, -1, -1] : Array(16).fill(0);
    selectedTool = null;
    hintStep = 0;
    lightHintStep = 0;
    codeInput = [];
    $("#level-category").textContent = levels[level - 1].category;
    $("#level-title").textContent = levels[level - 1].title;
    $("#scene").setAttribute("aria-label", levels[level - 1].title);
    renderScene();
    renderTools();
    renderProgress();
    save();
    announce(`第 ${level} 关。${friendMessage()}`);
    if (hadDialog) $("#restart-button").focus({ preventScroll: true });
  }

  function advance(message) {
    hintStep = 0;
    renderScene();
    renderProgress();
    renderTools();
    save();
    playSound("success");
    if (message) toast(message);
  }

  function showModal(content, type = "info", focusSelector = null) {
    clearTimeout(toastTimer);
    $("#toast").hidden = true;
    const dialog = $("#modal");
    const alreadyOpen = dialog.open;
    if (!alreadyOpen) modalReturnFocus = document.activeElement;
    modalType = type;
    $("#modal-content").innerHTML = content;
    if (!alreadyOpen) dialog.showModal();
    const effect = $(".gadget-effect");
    if (effect) dialog.append(effect);
    const focusTarget = focusSelector ? $(focusSelector) : $("#modal-content .primary-button") || $("#modal-close");
    focusTarget?.focus({ preventScroll: true });
  }

  function closeModal() {
    $("#modal").close();
    modalType = "";
    if (modalReturnFocus?.isConnected) modalReturnFocus.focus({ preventScroll: true });
    else $("#restart-button").focus({ preventScroll: true });
  }

  function queueClue() {
    return `<ol class="queue-rules">${queueRules.map((rule) => `<li><span class="rule-pair" aria-hidden="true">${rule.pair.map(shape).join("")}</span><span>${rule.text}</span></li>`).join("")}</ol>`;
  }

  function clueModal() {
    showModal(`<p class="modal-kicker">A LITTLE FOREST SECRET</p><h2 id="modal-title">秘密藏在三个小约定里！</h2><p class="modal-copy">四位朋友排成一队，从左往右出发。<br>能让下面三个约定同时成立吗？</p>${queueClue()}<button class="primary-button" data-modal-action="back-code">我来给图案排排队 →</button>`, "clue");
  }

  function codeModal(message = "", retry = false) {
    showModal(`<p class="modal-kicker">THE RAINBOW LOCK</p><h2 id="modal-title">${state.gate ? "咔哒，机关打开了！" : "四位朋友，谁站在哪里？"}</h2><p class="modal-copy">${state.gate ? "三个约定都满足啦，你找到了唯一的队伍！" : "从左往右点选朋友，每位只能出现一次。<br>前面 ← 队伍 → 后面"}</p>${state.gate ? "" : queueClue()}<div class="code-slots" aria-label="已经输入的图案">${correctCode.map((_, i) => `<span class="code-slot${codeInput[i] ? " filled" : ""}" aria-label="第${i + 1}个：${codeInput[i] ? shapes[codeInput[i]].name : "空"}">${codeInput[i] ? shape(codeInput[i]) : "·"}</span>`).join("")}</div>${state.gate ? '<button class="primary-button" data-modal-action="close">去搭一座彩虹桥</button>' : `<div class="shape-choices">${Object.entries(shapes).map(([id, item]) => `<button class="shape-choice" data-shape="${id}" aria-label="输入${item.name}">${shape(id)}<span>${item.name}</span></button>`).join("")}</div><p id="code-feedback" class="puzzle-feedback${retry ? " retry" : ""}" aria-live="polite">${message || "先想想：哪两位朋友必须连在一起？"} </p><div class="puzzle-links"><button data-modal-action="undo-code">退回一格</button><button data-modal-action="clear-code">重新选</button><button data-modal-action="peek-code">再看路牌</button></div>`}`, "code", state.gate ? null : ".shape-choice");
  }

  function enterShape(id) {
    if (state.gate || !Object.hasOwn(shapes, id)) return;
    if (codeInput.includes(id)) {
      codeModal(`${shapes[id].name}已经在队伍里啦。每位朋友只能出现一次，可以先退回一格。`, true);
      $(`[data-shape="${id}"]`).focus({ preventScroll: true });
      return;
    }
    codeInput.push(id);
    playSound();
    let message = `你选了${shapes[id].name}，再选${correctCode.length - codeInput.length}个图案。`;
    let retry = false;
    if (codeInput.length === correctCode.length) {
      const brokenRule = queueRules.find((rule) => !rule.check(codeInput));
      if (!brokenRule) {
        state.gate = true;
        advance("你发现了正确的顺序！彩虹机关打开啦。");
      } else {
        codeInput = [];
        message = `差一点点！还有一个约定没满足：${brokenRule.text} 再试一试吧。`;
        retry = true;
      }
    }
    codeModal(message, retry);
    if (!state.gate) $(`[data-shape="${id}"]`).focus({ preventScroll: true });
  }

  function lightModal(message = "") {
    const visited = lightStations.filter((cell) => state.route.includes(cell)).length;
    showModal(`<p class="modal-kicker">PLAN BEFORE YOU GO</p><h2 id="modal-title">刚好七步，把光送到家</h2><ul class="puzzle-rules"><li>上下左右走，每走一格用一步，不能重复经过。</li><li>要经过两朵「补光花」，不能碰到「睡觉猫头鹰」。</li><li>到达灯塔时，必须刚好用 ${lightSteps} 步。不是越短越好哦！</li></ul><div class="route-summary">已走 ${state.route.length - 1} / ${lightSteps} 步 · 补光花 ${visited} / 2</div><div class="route-grid" role="group" aria-label="三行四列的星光路线地图">${Array.from({ length: 12 }, (_, i) => {
      const step = state.route.indexOf(i);
      const label = i === 0 ? "起点" : i === 11 ? "灯塔" : i === 6 ? "睡觉猫头鹰" : i === 4 ? state.bridge ? "彩虹小桥" : "溪水断口" : lightStations.includes(i) ? "补光花" : "草地";
      const next = state.route[step + 1];
      const arrow = next === undefined ? "●" : next === i + 1 ? "→" : next === i - 1 ? "←" : next > i ? "↓" : "↑";
      return `<button class="route-cell${step !== -1 ? " visited" : ""}${i === 6 ? " blocked" : ""}${i === 4 ? state.bridge ? " bridged" : " river-gap" : ""}" data-route="${i}" aria-label="第${Math.floor(i / 4) + 1}行第${i % 4 + 1}列，${label}${step !== -1 ? `，路线第${step}步` : ""}" aria-pressed="${step !== -1}"><span class="route-symbol" aria-hidden="true">${i === 0 ? "✧" : i === 11 ? "灯" : i === 6 ? "☾" : i === 4 ? state.bridge ? "⌒" : "≈" : lightStations.includes(i) ? "❀" : "·"}</span><span>${label}</span>${step !== -1 ? `<b class="route-step" aria-hidden="true">${step} ${arrow}</b>` : ""}</button>`;
    }).join("")}</div><div class="route-pocket" role="group" aria-label="带进地图的小口袋">${toolData.slice(0, 4).map((tool) => `<button data-map-tool="${tool.id}" aria-pressed="${selectedTool === tool.id}" aria-label="拿起${tool.name}">${toolIcon(tool)}</button>`).join("")}</div><p id="light-feedback" class="puzzle-feedback" aria-live="polite">${message || "溪水把一块路冲断了。你可以绕路，也可以试着改变这张地图。口袋里的东西能直接对地图使用。"}</p><button class="primary-button" data-modal-action="check-light">试着点亮灯塔</button><div class="puzzle-links"><button data-modal-action="undo-route">退一步</button><button data-modal-action="clear-route">重新规划</button><button data-modal-action="light-hint">${lightHintStep ? "再提示一点" : "蓝豆，帮我想想"}</button></div>`, "light", message ? '[data-modal-action="check-light"]' : '[data-route="1"]');
  }

  function extendRoute(index) {
    if (!Number.isInteger(index) || index < 0 || index >= 12) return;
    const last = state.route.at(-1);
    if (index === 6) { lightModal("猫头鹰正在睡觉，这格不能走。试着绕过去吧。"); return; }
    if (index === 4 && !state.bridge) {
      if (selectedTool !== "bridge") { lightModal("这里没有落脚的地方，光掉进了溪水。水两边还没有连起来。"); return; }
      state.bridge = true;
      selectedTool = null;
      renderTools();
      lightModal("种子落在水边，弯弯的小桥长出来了！断口变成了能走的一格，路线还由你来规划。");
      return;
    }
    if (state.route.includes(index)) { lightModal("这格已经走过啦，不能重复。可以点「退一步」或「重新规划」。"); return; }
    if (last === 11) { lightModal("已经到灯塔啦，先检查路线；想改路线可以退一步。"); return; }
    if (Math.abs(Math.floor(last / 4) - Math.floor(index / 4)) + Math.abs(last % 4 - index % 4) !== 1) {
      lightModal("只能从上一步上下左右走一格，不能斜走或跳格哦。");
      return;
    }
    state.route.push(index);
    playSound();
    lightModal();
    $(`[data-route="${index}"]`).focus({ preventScroll: true });
  }

  function checkLight() {
    if (state.route.at(-1) !== 11) { lightModal("还没走到灯塔呢，先想好怎么把两朵补光花连起来。"); return; }
    if (lightStations.some((cell) => !state.route.includes(cell))) { lightModal("到灯塔了，可是漏掉了补光花！两朵都要经过，光才够亮。"); return; }
    if (state.route.length - 1 !== lightSteps) { lightModal(`补光花都经过啦，但用了 ${state.route.length - 1} 步。需要刚好 ${lightSteps} 步，试试另一条路。`); return; }
    state.power = true;
    advance("你把星光接起来了！灯塔亮起来啦。");
    showModal(`<div class="hint-art" aria-hidden="true">☼</div><p class="modal-kicker">YOU LIGHT UP THE WORLD</p><h2 id="modal-title">灯塔亮了，你真棒！</h2><p class="modal-copy">小小的光连在一起，也能照亮大大的世界。<br>现在，想办法飞到灯塔上吧！</p><button class="primary-button" data-modal-action="close">去找灯塔上的星星</button>`);
  }

  function requireTool(toolId, message, animate = true) {
    if (selectedTool === toolId) {
      if (animate) animateGadget(toolId);
      return true;
    }
    const observations = {
      scope: "细节还是看不清。你能找到让远处变清楚的办法吗？",
      bridge: "两边还没连起来，中间没有能落脚的地方。",
      shrink: "空间比身体窄，照原来的大小过不去。",
      fly: "脚下已经没有路了，目标还在高处。",
      magnet: "零件卡在缝里，手伸不进去。",
      time: "刚才发生得太快，没看清变化的顺序。",
      umbrella: "雨云还挡着这里，水滴不停地落下来。",
      translate: "朋友说了很多，可我们还听不懂它的意思。",
      copy: "两边都缺一份，现有的还不够分。",
      repair: "碎开的地方还松着，碰一下就会掉。"
    };
    toast(observations[toolId] || "这次没有改变眼前的问题。再观察一下它需要什么。");
    return false;
  }

  function act(action) {
    if (level >= 5 && action === "extra-collection" && state.collected) { collection(); return; }
    if (state.collected) { toast("这一关完成啦！可以再玩一次，或者去看看你的星星。"); return; }
    if (level >= 5) {
      if (action === "extra-entry" && !state.clue) { state.clue = true; advance("来到现场啦，先看看哪些东西能动起来。"); }
      else if (action === "extra-finish" && state.gate) {
        if (level === 18 && !requireTool("repair", "窗框还在摇晃，裂开的玻璃还没有固定好。")) return;
        winLevel();
      }
      return;
    }
    if (level >= 3) {
      if (level === 3 && action === "garden-lock" && state.found.length === 5 && !state.gate) {
        gardenLock();
      } else if (level === 4 && action === "moon-delivery" && state.power) {
        if (!requireTool("fly", "月亮住在高高的云朵上。先选「云朵飞行帽」，再送饼干。")) return;
        state.treasureReady = true;
        advance("飞行帽带你穿过云朵！月亮收到饼干，开心地送你一颗星星。");
      } else if ((level === 3 && action === "garden-star" && state.gate && state.treasureReady) || (level === 4 && action === "cookie-star" && state.power && state.treasureReady)) winLevel();
      return;
    }
    playSound();
    if (level === 1) {
      if (action === "sign") {
        if (!state.clue && !requireTool("scope", "路牌上的字太小啦。试试能看见秘密的望远镜？")) return;
        if (!state.clue) { state.clue = true; advance(); }
        clueModal();
      } else if (action === "gate") {
        if (!state.clue) { toast("机关旁只有三个约定的图画，小小的路牌上似乎还有字。"); return; }
        codeInput = state.gate ? [...correctCode] : [];
        codeModal();
      } else if (action === "river") {
        if (state.bridge) { toast("彩虹桥已经准备好啦，去点一下河对岸的星星！"); return; }
        if (!state.gate) { toast("种子还在睡觉呢。先找到线索，解开彩虹机关吧。"); return; }
        if (!requireTool("bridge", "哪个道具能让小河两边手拉手？选好它，再点这里。")) return;
        state.bridge = true;
        advance("小种子长成彩虹桥啦！去点一下河对岸的森林星星。");
      } else if (action === "treasure") {
        if (!state.bridge) { toast("星星就在对岸。我们先想办法搭一座小桥吧。"); return; }
        winLevel();
      }
    } else {
      if (action === "door") {
        if (!state.power) lightModal();
        else toast("光已经顺着你规划的路线到达灯塔啦！");
      } else if (action === "light") {
        if (state.power) { toast("灯塔已经亮了！星星还在塔顶，地上的路线到这里结束。"); return; }
        lightModal();
      } else if (action === "lighthouse") {
        if (!state.power) { toast("灯塔还没有亮。先把萤火虫的光送过去吧！"); return; }
        if (!requireTool("fly", "星星在好高好高的地方。试试口袋里的云朵飞行帽？")) return;
        winLevel();
      }
    }
  }

  function confetti() {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const colors = ["#d9b866", "#92b79a", "#90b7c5", "#c5afd1", "#e0aa94"];
    for (let i = 0; i < 32; i++) {
      const piece = document.createElement("span");
      piece.className = "confetti";
      piece.style.left = `${Math.random() * 100}%`;
      piece.style.background = colors[i % colors.length];
      piece.style.animationDelay = `${Math.random() * .5}s`;
      piece.style.setProperty("--drift", `${(Math.random() - .5) * 200}px`);
      document.body.append(piece);
      setTimeout(() => piece.remove(), 3100);
    }
  }

  function winLevel() {
    state.collected = true;
    completed.add(level);
    advance();
    playSound("win");
    confetti();
    const first = level === 1;
    const entry = levels[level - 1];
    const messages = ["你看懂了线索，解开了机关，还搭起一座桥。", "你绕过岔路，把小小的光送到了灯塔。", "五个小秘密，都没逃过你的眼睛！", "你用排除法完成了饼干数独，月亮和朋友们都很开心！", ...newStories.map((story) => story.ending)];
    showModal(`<div class="celebration-star">${shape("star")}</div><p class="modal-kicker">A WONDERFUL LITTLE DISCOVERY</p><h2 id="modal-title">${first ? "第一颗星星，到手啦！" : "小小冒险家，你做到了！"}</h2><p class="modal-copy">${messages[level - 1]}<br>蓝豆想说：你的好奇心，闪闪发光！</p><div class="sticker-row"><span class="sticker">✧ ${["推理小能手", "方向小达人", "观察小侦探", "数独小厨师", ...newStories.map((story) => story.badge)][level - 1]}</span><span class="sticker">✧ 勇敢试一试</span><span class="sticker">✧ 蓝豆的好朋友</span></div><div class="modal-actions">${entry.next ? `<button class="primary-button" data-modal-action="next-level">出发，去${entry.next} →</button>` : ""}<button class="${entry.next ? "secondary" : "primary"}-button" data-modal-action="collection">看看我的星星</button><button class="secondary-button" data-modal-action="close">再看看这里</button></div>`, "win");
    announce(`第 ${level} 关完成！获得${entry.star}。${completed.size === levels.length ? "二十关冒险全部完成！" : "可以去地图选择任何一关。"}`);
  }

  function hintText() {
    if (state.collected) return ["你已经完成这一关啦。去看看收集的星星，或者再玩一次吧！"];
    if (level >= 5) {
      if (!state.clue) return ["朋友遇到了什么困难？先到现场看看，留意哪些东西可以改变。"];
      if (state.gate) return ["朋友的问题已经解决，不用再找一把道具钥匙。收下它们准备的小礼物吧。"];
      return extraHints();
    }
    if (level === 3) {
      if (!state.clue) return ["迷雾是一种藏住秘密的魔法。看看哪个道具能让你看见秘密？", "先选「寻秘密望远镜」，再点「查看雾中的倒影」。"];
      if (state.found.length === 5 && !state.gate) return ["先想小松鼠和小兔子：它们挨着住，小兔子在右边。哪两间屋子能让它们做邻居？", "小松鼠不能住中间，也不能住最右边，不然小兔子就没法住在它右边啦。", "从左到右安排：小松鼠、小兔子、小熊。再敲敲门，三个朋友的话都符合啦。"];
      if (state.gate) return ["朋友已经回家啦！小兔子捧来了一颗星星。"];
      const item = differences.find((entry) => entry.hint && !state.found.includes(entry.id));
      return item ? ["试着把两幅画分成上、中、下三块，一块一块比较。颜色、形状、花纹和数量都值得留意。", item.hint] : ["五处都找到啦！点「收下花园星星」就能去下一关。"];
    }
    if (level === 4) {
      if (state.power) return state.treasureReady ? ["月亮的礼物已经准备好啦。"] : ["饼干要送到云朵上，可地上的路够不到那里。", "除了向前走，还有哪一个方向可以出发？看看口袋里哪些东西会改变你的移动方式。"];
      return ["先找空格最少的一行或一列。看看四种饼干里缺了谁，再检查粗框小方盒。", "点烤盘旁的「蓝豆，帮我想一个空格」，我会高亮一个能推出来的空格。再点一次，就解释可以放哪一种。"];
    }
    if (level === 1) {
      if (!state.clue) return ["路牌不是空白的，只是字和图案特别小。", "不用改变路牌上的内容。你需要的是改变看它的距离，或者让细节看起来更大。"];
      if (!state.gate) return ["先把叶子和星星看成一对不能分开的朋友。太阳还要站在星星后面，月亮能放在哪里呢？", "叶子、星星、太阳的前后顺序已经确定。试着把月亮插进不同位置，检查它会不会和太阳挨着。", "点「彩虹机关」，依次点：月亮 → 叶子 → 星星 → 太阳。这样三个约定都能满足。"];
      if (!state.bridge) return ["机关解开了，小河两边还没有连起来。缺的是一段路，不是另一把钥匙。", "岸边的泥土软软的。有什么东西会在这里长大，而且能跨过水面？"];
      return ["现在可以过河啦，河对岸的星星正等着你。", "点一下「森林星星」的小圆圈，就能收集它啦！"];
    }
    if (!state.small) return ["门太小，我们太大。想想看：如果变小一点，是不是就能进去？", "先选「小不点光束」，再点「小小树洞门」。"];
    if (!state.power) return ["先找两朵补光花。最短的路不一定能经过两朵，绕太远又会超过七步，试着倒着想一想。", "先往右，再往下，经过中间那朵补光花后向左绕；左下角补光花之后，沿底行去灯塔。", "从起点依次走：右、下、左、下、右、右、右。两朵补光花都经过，刚好七步。"];
    return ["星星还在塔顶，地上的路已经走完了。", "最后这段需要改变移动方式，而不是改变星星的位置。"];
  }

  function showHint() {
    const hints = hintText();
    const index = Math.min(hintStep, hints.length - 1);
    showModal(`<div class="hint-art" aria-hidden="true">☼</div><p class="modal-kicker">A LITTLE HELP FROM YOUR FRIEND</p><h2 id="modal-title">${index === 0 ? "一起想一想吧" : "蓝豆陪你一步一步来"}</h2><p class="modal-copy">${hints[index]}</p><div class="modal-actions"><button class="primary-button" data-modal-action="close">好，我去试试看</button>${index < hints.length - 1 ? '<button class="secondary-button" data-modal-action="more-hint">再说清楚一点</button>' : ""}</div>`, "hint");
  }

  function collection() {
    showModal(`<p class="modal-kicker">MY LITTLE COLLECTION</p><h2 id="modal-title">口袋里的小小星光</h2><p class="modal-copy">每一颗星星，都藏着你勇敢尝试的故事。</p><div class="collection-stars">${levels.map((entry, i) => `<div class="collection-star${completed.has(i + 1) ? " earned" : ""}" aria-label="${entry.star}：${completed.has(i + 1) ? "已获得" : "还未获得"}">${shape("star")}<p>${entry.star}<br>${completed.has(i + 1) ? "已经装进口袋啦 ✓" : "等着和你见面"}</p></div>`).join("")}</div><p class="modal-copy">已经收集 ${completed.size} / ${levels.length} 颗星星</p><button class="primary-button" data-modal-action="close">带着星光，继续探索</button>`, "collection");
  }

  function howToPlay() {
    showModal(`<p class="modal-kicker">LET'S PLAY TOGETHER</p><h2 id="modal-title">冒险，从好奇开始</h2><ol class="how-steps"><li><span>1</span>先看看场景，听听蓝豆说了什么。</li><li><span>2</span>点口袋里的道具，再点场景里的目标。</li><li><span>3</span>观察变化、规划路线，用线索推理小秘密。</li><li><span>4</span>卡住了就找蓝豆提示，可以一直试哦！</li></ol><p class="parent-note">给大朋友：适合亲子一起探索，无广告、无付费、无倒计时。通关星星保存在当前浏览器；关卡可随时重玩。蓝豆是原创机器人伙伴。声音默认关闭，朗读需要浏览器支持中文语音。</p><button class="primary-button" data-modal-action="close">准备好啦，出发！</button>`);
  }

  function updateSoundButton() {
    $("#sound-button").setAttribute("aria-pressed", String(sound));
    $("#sound-button").setAttribute("aria-label", sound ? "关闭音效" : "开启音效");
    $("#sound-button").innerHTML = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 9h4l5-4v14l-5-4H4Z"/>${sound ? '<path d="M16 8q5 4 0 8m3-11q8 7 0 14"/>' : '<path d="m17 10 4 4m0-4-4 4"/>'}</svg>`;
  }

  function readFriend() {
    if (!("speechSynthesis" in window) || !("SpeechSynthesisUtterance" in window)) {
      toast("这个浏览器暂时不能朗读，请大朋友帮忙读一读吧。");
      return;
    }
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(friendMessage());
    utterance.lang = "zh-CN";
    utterance.rate = .82;
    const voice = window.speechSynthesis.getVoices().find((item) => /^zh[-_]CN/i.test(item.lang));
    if (voice) utterance.voice = voice;
    utterance.onerror = (event) => {
      if (event.error !== "interrupted" && event.error !== "canceled") toast("中文朗读暂时不可用，请大朋友帮忙读一读吧。");
    };
    window.speechSynthesis.speak(utterance);
  }

  $("#tools").addEventListener("click", (event) => {
    const button = event.target.closest("[data-tool]");
    if (!button) return;
    clearTimeout(toastTimer);
    $("#toast").hidden = true;
    selectedTool = selectedTool === button.dataset.tool ? null : button.dataset.tool;
    renderTools();
    button.focus({ preventScroll: true });
    playSound();
    announce(selectedTool ? `拿起${toolData.find((tool) => tool.id === selectedTool).name}。想试试哪里？再点道具可以放回。` : "道具放回口袋啦。");
  });
  $("#scene").addEventListener("click", (event) => {
    clearTimeout(toastTimer);
    $("#toast").hidden = true;
    const extra = event.target.closest("[data-extra]");
    if (extra && !extra.disabled) { extraAction(extra.dataset.extra, extra.hasAttribute("data-value") ? Number(extra.dataset.value) : null); return; }
    const difference = event.target.closest("[data-difference]");
    if (difference) {
      if (selectedTool === "scope" && !state.collected) inspectGarden(difference.dataset.difference, difference.dataset.side);
      else findDifference(difference.dataset.difference, difference.dataset.side);
      return;
    }
    const cell = event.target.closest("[data-cell]");
    if (cell && !cell.disabled && !state.power && !state.collected) {
      state.selectedCell = Number(cell.dataset.cell);
      state.cookieHint = 0;
      renderScene();
      $(`[data-cell="${state.selectedCell}"]`).focus({ preventScroll: true });
      if (selectedTool === "shrink") inspectCookie();
      return;
    }
    const cookie = event.target.closest("[data-cookie]");
    if (cookie) { putCookie(Number(cookie.dataset.cookie)); return; }
    const cookieAction = event.target.closest("[data-cookie-action]")?.dataset.cookieAction;
    if (cookieAction === "erase") { putCookie(null); return; }
    if (cookieAction === "hint") { cookieHint(); return; }
    if (cookieAction === "check") { checkCookies(); return; }
    const button = event.target.closest("[data-action]");
    if (button) act(button.dataset.action);
  });
  levels.slice(4).forEach((entry, i) => {
    $(".level-tabs").insertAdjacentHTML("beforeend", `<button id="${entry.id}" class="level-tab" aria-pressed="false" disabled><span class="level-number">${String(i + 5).padStart(2, "0")}</span><span>${newStories[i].name || ["水果野餐岛", "小鸭水车园", "云朵渡口", "回声音乐树", "星空邮局"][i]}</span><span class="tab-status" aria-hidden="true">⌑</span></button>`);
  });
  levels.forEach((entry, i) => $(`#${entry.id}`).addEventListener("click", () => {
    if (level !== i + 1) startLevel(i + 1);
    $(".world-map").open = false;
    $(".game-settings").open = false;
  }));
  $("#restart-button").addEventListener("click", () => { startLevel(level); toast("新的一次冒险开始啦，收集过的星星不会丢哦。"); });
  $("#hint-button").addEventListener("click", () => { hintStep = 0; showHint(); });
  $("#collection-button").addEventListener("click", collection);
  $("#how-button").addEventListener("click", howToPlay);
  $("#read-button").addEventListener("click", readFriend);
  $("#expand-friend").addEventListener("click", () => {
    const expanded = $(".speech-bubble").classList.toggle("expanded");
    $("#expand-friend").setAttribute("aria-expanded", String(expanded));
    $("#expand-friend").textContent = expanded ? "收起对话" : "展开对话";
  });
  $("#effects-button").addEventListener("click", () => {
    effects = !effectsEnabled();
    updateEffects();
    save();
    if (effects) animateGadget(selectedTool || "scope");
  });
  $("#preview-effect").addEventListener("click", () => {
    if (!effectsEnabled()) { toast("道具动画已关闭。点旁边的「道具动画：关」即可开启并预览。"); return; }
    animateGadget(selectedTool || "scope");
  });
  reducedMotion.addEventListener("change", updateEffects);
  updateEffects();
  $("#sound-button").addEventListener("click", () => {
    sound = !sound;
    updateSoundButton();
    save();
    if (sound) playSound("success");
    else if ("speechSynthesis" in window) window.speechSynthesis.cancel();
    toast(sound ? "小小音效打开啦 ♫" : "音效已关闭，安静地探索吧。");
  });
  $("#modal-close").addEventListener("click", closeModal);
  $("#modal").addEventListener("cancel", (event) => { event.preventDefault(); closeModal(); });
  $("#modal").addEventListener("click", (event) => {
    if (event.target === $("#modal")) {
      const rect = $("#modal").getBoundingClientRect();
      if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) closeModal();
    }
  });
  $("#modal-content").addEventListener("click", (event) => {
    const inspection = event.target.closest("[data-inspect-difference]");
    if (inspection && modalType === "garden-inspect") {
      const { inspectDifference, side } = inspection.dataset;
      closeModal();
      findDifference(inspectDifference, side);
      return;
    }
    const mapTool = event.target.closest("[data-map-tool]");
    if (mapTool && modalType === "light") {
      selectedTool = selectedTool === mapTool.dataset.mapTool ? null : mapTool.dataset.mapTool;
      renderTools();
      lightModal(selectedTool ? `拿起了${toolData.find((tool) => tool.id === selectedTool).name}。你想改变地图的哪一处？` : "放回口袋，继续规划。");
      $(`[data-map-tool="${mapTool.dataset.mapTool}"]`).focus({ preventScroll: true });
      return;
    }
    const shapeButton = event.target.closest("[data-shape]");
    if (shapeButton && modalType === "code") { enterShape(shapeButton.dataset.shape); return; }
    const routeButton = event.target.closest("[data-route]");
    if (routeButton && modalType === "light") { extendRoute(Number(routeButton.dataset.route)); return; }
    const gardenButton = event.target.closest("[data-garden-choice]");
    if (gardenButton && modalType === "garden-lock") { enterGardenChoice(gardenButton.dataset.gardenChoice); return; }
    const homeButton = event.target.closest("[data-garden-home]");
    if (homeButton && modalType === "garden-lock") { placeGardenAnimal(Number(homeButton.dataset.gardenHome)); return; }
    const action = event.target.closest("[data-modal-action]")?.dataset.modalAction;
    if (action === "close") closeModal();
    else if (action === "next-level") startLevel(level + 1);
    else if (action === "collection") collection();
    else if (action === "more-hint") { hintStep++; showHint(); }
    else if (action === "undo-code") { codeInput.pop(); codeModal("退回一格啦，接着想一想。"); }
    else if (action === "clear-code") { codeInput = []; codeModal("队伍空出来啦。想想三个约定，再试一次。"); }
    else if (action === "peek-code") {
      showModal(`<h2 id="modal-title">再看一眼小秘密</h2>${queueClue()}<button class="primary-button" data-modal-action="back-code">回到机关试试看</button>`, "peek");
    } else if (action === "back-code") codeModal();
    else if (action === "check-light") checkLight();
    else if (action === "undo-route") { if (state.route.length > 1) state.route.pop(); lightModal("退一步啦，继续规划吧。"); }
    else if (action === "clear-route") { state.route = [0]; lightModal("回到起点啦。先想想两朵补光花怎么连起来。"); }
    else if (action === "check-homes") checkGardenHomes();
    else if (action === "garden-hint") { state.gardenHint++; gardenLock(state.gardenHint === 1 ? "先安排住在一起的两位朋友：小兔子要紧挨着小松鼠，而且在右边。" : "小松鼠不住中间，也不能住最右边，不然小兔子右边就没位置啦。想想它应该住哪间？"); }
    else if (action === "light-hint") {
      lightHintStep++;
      lightModal(lightHintStep === 1 ? "最短路线会漏掉补光花。想一想：从哪边经过中间那朵花，才能继续到左下角，又不重复走？" : lightHintStep === 2 ? "先右、再下，经过中间补光花后向左绕。左下角之后，沿底行去灯塔。" : "从起点依次走：右、下、左、下、右、右、右。刚好七步，两朵花都经过。");
    }
  });

  $("#companion-art").innerHTML = robotArt();
  updateSoundButton();
  startLevel(level);
})();
