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
  const toolIcon = (tool) => `<svg viewBox="0 0 50 50" aria-hidden="true">${tool.art}</svg>`;
  const levels = [
    { id: "level-one", title: "彩虹桥，藏着什么秘密？", category: "LEVEL 01 · 线索推理 · 进阶挑战", star: "森林星星", next: "星光灯塔" },
    { id: "level-two", title: "把星光，送到灯塔上吧！", category: "LEVEL 02 · 五步路线规划 · 进阶挑战", star: "灯塔星星", next: "倒影花园" },
    { id: "level-three", title: "两座花园，哪里不一样？", category: "LEVEL 03 · 观察与比较 · 找出 5 处不同", star: "花园星星", next: "月亮饼干屋" },
    { id: "level-four", title: "给月亮烤一盘图形饼干", category: "LEVEL 04 · 排除与推理 · 4 × 4 图形数独", star: "饼干星星" }
  ];
  let storageAvailable = true;
  let saved = {};
  try { saved = JSON.parse(localStorage.getItem(SAVE_KEY) || "{}") || {}; } catch { storageAvailable = false; }
  const completed = new Set(Array.isArray(saved.completed) ? saved.completed.filter((x) => Number.isInteger(x) && x >= 1 && x <= levels.length) : []);
  for (const number of [...completed]) for (let previous = 1; previous < number; previous++) completed.add(previous);
  let level = Number.isInteger(saved.level) && saved.level >= 1 && saved.level <= levels.length && (saved.level === 1 || completed.has(saved.level - 1)) ? saved.level : 1;
  let sound = saved.sound === true;
  let selectedTool = null;
  let state;
  let hintStep = 0;
  let codeInput = [];
  let toastTimer;
  let audioContext;
  let modalReturnFocus = null;
  let modalType = "";
  const correctCode = ["moon", "leaf", "star", "sun"];
  const queueRules = [
    { pair: ["leaf", "star"], text: "叶子紧挨着站在星星前面，中间不能有别人。", check: (items) => items.indexOf("star") === items.indexOf("leaf") + 1 },
    { pair: ["star", "sun"], text: "太阳在星星后面，不一定紧挨着。", check: (items) => items.indexOf("sun") > items.indexOf("star") },
    { pair: ["moon", "sun"], text: "月亮和太阳不能挨在一起。", check: (items) => Math.abs(items.indexOf("moon") - items.indexOf("sun")) > 1 }
  ];
  const directions = ["up", "right", "down", "left"];
  const arrowSymbols = { up: "↑", right: "→", down: "↓", left: "←" };
  const directionNames = { up: "上", right: "右", down: "下", left: "左" };
  const lightRoute = [[105, 65], [245, 65], [245, 175], [105, 175], [105, 285], [355, 285]];
  const correctArrows = ["right", "down", "left", "down", "right"];
  let lightHintStep = 0;
  const cookieKinds = ["leaf", "sun", "star", "moon"];
  const cookieGivens = [0, null, null, 3, 2, 3, 0, null, null, 0, 3, null, 3, null, null, 0];
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
  const defaultState = () => ({ clue: false, gate: false, bridge: false, small: false, power: false, collected: false, treasureReady: false, arrows: ["down", "left", "up", "right", "up"], found: [], cookieBoard: [...cookieGivens], selectedCell: 1, cookieHint: 0 });

  function save() {
    try { localStorage.setItem(SAVE_KEY, JSON.stringify({ completed: [...completed], level, sound })); }
    catch { storageAvailable = false; }
    $("#save-status").textContent = storageAvailable ? "冒险进度会自动保存在这台设备" : "暂时无法保存进度，这次冒险仍然可以玩";
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
      const notes = kind === "win" ? [523.25, 659.25, 783.99, 1046.5] : kind === "success" ? [659.25, 880] : [523.25];
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
    }).join("")}${side === 1 && !state.clue ? '<div class="mirror-fog"><span aria-hidden="true">☁</span><p>魔法迷雾挡住了倒影<br>什么道具能看见隐藏的秘密？</p><button class="primary-button" data-action="mirror">查看雾中的倒影</button></div>' : ""}</section>`;
    return `<div class="puzzle-intro"><span>小侦探任务 · 解开温室的魔法封印</span><strong>${state.clue ? `找到 ${state.found.length} / 5 处不同` : "迷雾里，藏着另一座花园"}</strong><p>${state.clue ? "找齐五处改动，迷你温室的封印才会打开。两边都能点！" : "蓝豆的望远镜能看穿魔法。先选道具，再查看倒影。"}</p></div><div class="garden-pair">${board(0)}${board(1)}</div><p id="garden-feedback" class="inline-feedback" role="status">${state.clue ? "从大到小、从上到下，仔细看看吧。点错不扣分。" : "先想办法看穿迷雾，才能比较两座花园。"}</p>${state.found.length === 5 && !state.collected ? `<div class="story-task"><span aria-hidden="true">✧</span><p>${state.treasureReady ? "你缩小后穿过了温室的叶片小门，花园星星就在眼前！" : "封印解开啦！星星藏在巴掌大的迷你温室里，我们太大，进不去呀。"}</p><button class="primary-button" data-action="${state.treasureReady ? "garden-star" : "greenhouse"}">${state.treasureReady ? "收下花园星星 ✦" : "进入迷你温室"}</button></div>` : ""}`;
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
    $("#garden-feedback").textContent = state.found.length === 5 ? "五处都找到啦！温室封印解开了，再想办法进入迷你温室吧。" : `找到啦！还差 ${5 - state.found.length} 处，继续观察吧。`;
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
        hotspot("door", 24, 72, state.small ? "小门打开啦" : "小小树洞门", state.small) +
        hotspot("light", 54, 60, state.power ? "星光线路亮啦" : "萤火虫工作台", state.power) +
        (!state.collected ? hotspot("lighthouse", 80, 32, "灯塔上的星星", false, true) : "");
    } else $("#scene").innerHTML = level === 3 ? gardenScene() : cookieScene();
    if (focusId && document.getElementById(focusId)) document.getElementById(focusId).focus({ preventScroll: true });
  }

  function missionData() {
    if (level === 3) return [["用道具看穿迷雾", state.clue], ["找齐五处，解开封印", state.found.length === 5], ["进入迷你温室取星星", state.collected]];
    if (level === 4) return [["进入巴掌大的饼干屋", state.small], ["解开烤盘的图形谜题", state.power], ["把饼干送给月亮", state.collected]];
    return level === 1
      ? [["发现路牌上的秘密", state.clue], ["解开彩虹机关", state.gate], ["搭起小桥，找到星星", state.collected]]
      : [["穿过小小树洞门", state.small], ["让萤火虫的光到达灯塔", state.power], ["飞上灯塔，收集星星", state.collected]];
  }

  function friendMessage() {
    if (state.collected) return "你做到了！观察、思考、勇敢试一试，就是最棒的魔法。";
    if (level === 3) return !state.clue ? "迷雾挡住了魔法倒影。哪个道具能看见藏起来的秘密呢？选好它，再查看倒影吧。" : state.found.length === 5 ? "温室封印打开啦！星星在迷你温室里，门却只有一片叶子那么大。口袋里有什么能帮忙？" : `魔法改了五个地方，找齐它们才能打开迷你温室。已经找到 ${state.found.length} 处，慢慢来。`;
    if (level === 4) return !state.small ? "巴掌大的饼干屋邀请我们帮忙烤饼干，可是这扇小门太小啦。想想口袋里的道具吧！" : state.power ? "饼干烤好啦！月亮住在云朵上，我们需要能飞的道具，把饼干送到它手里。" : "每行、每列、每个粗框小方盒里，四种饼干都只能出现一次。解开烤盘谜题，就能开始烤啦！";
    if (level === 1) {
      if (!state.clue) return "嗨，我是蓝豆！河对岸的星星在等我们。那块路牌好像藏着什么秘密呢？";
      if (!state.gate) return "四位朋友要排队过桥！三个小约定要同时满足。试着先把必须挨着的朋友放在一起吧。";
      if (!state.bridge) return "机关打开了！口袋里有一颗特别的种子，能让小河两边手拉手。";
      return "哇，小桥长出来了！点一下河对岸的森林星星，把它装进口袋吧。";
    }
    if (!state.small) return "天快黑啦，灯塔还没亮。小门后面有修灯的线索，可是门也太小了吧！";
    if (!state.power) return "小小的世界真奇妙！去工作台转一转箭头，帮萤火虫把光送到灯塔吧。";
    return "灯塔亮了！星星在高高的塔顶，哪个道具能让我们轻轻飞起来呢？";
  }

  function renderProgress() {
    const missions = missionData();
    $("#missions").innerHTML = missions.map(([text, done], i) => `<li class="${done ? "done" : ""}"><span class="mission-check" aria-hidden="true">${done ? "✓" : i + 1}</span><span>${text}</span>${done ? '<span class="sr-only">，已完成</span>' : ""}</li>`).join("");
    $("#mission-count").textContent = `${missions.filter(([, done]) => done).length} / 3`;
    $("#friend-message").textContent = friendMessage();
    $("#star-count").textContent = completed.size;
    levels.forEach((entry, i) => {
      const button = $(`#${entry.id}`);
      button.disabled = i > 0 && !completed.has(i);
      button.classList.toggle("active", level === i + 1);
      button.setAttribute("aria-pressed", String(level === i + 1));
      button.querySelector(".tab-status").textContent = completed.has(i + 1) ? "✓" : button.disabled ? "⌑" : "✦";
    });
  }

  function renderTools() {
    $("#tools").innerHTML = toolData.map((tool, i) => `<button id="tool-${tool.id}" class="tool-card${selectedTool === tool.id ? " selected" : ""}" data-tool="${tool.id}" aria-pressed="${selectedTool === tool.id}" aria-label="${tool.name}：${tool.description}"><span class="tool-number" aria-hidden="true">${selectedTool === tool.id ? "✓" : `0${i + 1}`}</span><span class="tool-icon">${toolIcon(tool)}</span><span><span class="tool-name">${tool.name}</span><span class="tool-description">${tool.description}</span></span></button>`).join("");
    const toolMessage = selectedTool ? `已选：${toolData.find((tool) => tool.id === selectedTool).name}。再点场景里的目标。` : "先选一个道具，再点场景里的目标。";
    $("#scene-instruction").textContent = level === 3 && state.clue && state.found.length < 5 ? "两幅图中任意一边都能点，找到的不同会同时圈出。" : level === 4 && state.small && !state.power ? "先点空格，再选饼干；填完点「检查烤盘」。" : toolMessage;
  }

  function startLevel(number) {
    if (!Number.isInteger(number) || number < 1 || number > levels.length || (number > 1 && !completed.has(number - 1))) return;
    clearTimeout(toastTimer);
    $("#toast").hidden = true;
    if ("speechSynthesis" in window) window.speechSynthesis.cancel();
    const hadDialog = $("#modal").open;
    if (hadDialog) closeModal();
    level = number;
    state = defaultState();
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
    let reached = true;
    const lit = state.arrows.map((direction, i) => {
      reached = reached && direction === correctArrows[i];
      return reached;
    });
    const wires = lightRoute.slice(0, -1).map(([x, y], i) => {
      const [nextX, nextY] = lightRoute[i + 1];
      return `<path d="M${x} ${y}L${nextX} ${nextY}" fill="none" stroke="${lit[i] ? "#e6c46c" : "#d4dcc2"}" stroke-width="7"/>`;
    }).join("");
    showModal(`<p class="modal-kicker">FOLLOW THE LITTLE LIGHT</p><h2 id="modal-title">五块导光片，绕个小弯</h2><p class="modal-copy">沿着实线走完五块导光片，把光送到灯塔。<br>箭头指向下一块；虚线是走不通的岔路。</p><div class="light-board"><svg viewBox="0 0 420 340" aria-hidden="true"><path d="M245 65h109m-109 110h109m-249 0H35" fill="none" stroke="#c6ceb8" stroke-width="4" stroke-dasharray="5 6"/><path d="m346 57 16 16m0-16-16 16m-16 94 16 16m0-16-16 16m-319-16 16 16m0-16-16 16" stroke="#c5b39a" stroke-width="3" stroke-linecap="round"/><path d="M35 65h70" stroke="#e6c46c" stroke-width="7"/>${wires}<circle cx="35" cy="65" r="14" fill="#f3d788"/><path d="M26 60q-9-18-13-8t13 8m18 0q10-18 14-8T44 60" fill="#c8d5b7"/><circle cx="31" cy="64" r="1.5" fill="#a28d50"/><circle cx="39" cy="64" r="1.5" fill="#a28d50"/><text x="35" y="105" fill="#9ba88b" font-size="10" text-anchor="middle">萤火虫</text><path d="m339 297 3-45h23l4 45Z" fill="#a9b9a1"/><path d="M338 253v-21h29v21Z" fill="${lit.at(-1) ? "#f2d383" : "#d9dec4"}" stroke="#9cad93" stroke-width="2"/><path d="m333 230 20-14 20 14Z" fill="#97ad97"/><text x="354" y="322" fill="#9ba88b" font-size="10" text-anchor="middle">小灯塔</text></svg>${lightRoute.slice(0, -1).map(([x, y], i) => `<button class="arrow-tile${lit[i] ? " lit" : ""}" data-arrow="${i}" style="left:${x / 4.2}%;top:${y / 3.4}%" aria-label="转动第${i + 1}块导光片，当前朝${directionNames[state.arrows[i]]}"><span class="tile-index" aria-hidden="true">${i + 1}</span><span aria-hidden="true">${arrowSymbols[state.arrows[i]]}</span></button>`).join("")}</div><p class="light-legend">点一下顺时针转一格 ↻ · 实线能走，虚线不通</p><p id="light-feedback" class="puzzle-feedback" aria-live="polite">${message || "别被岔路骗到啦，有时要往回拐一个弯。"}</p><button class="primary-button" data-modal-action="check-light">点亮星光线路</button><div class="puzzle-links"><button data-modal-action="light-hint">${lightHintStep ? "再说清楚一点" : "蓝豆，帮我想一想"}</button></div>`, "light", message ? '[data-modal-action="check-light"]' : '[data-arrow="0"]');
  }

  function rotateArrow(index) {
    if (!Number.isInteger(index) || index < 0 || index >= state.arrows.length) return;
    const current = directions.indexOf(state.arrows[index]);
    state.arrows[index] = directions[(current + 1) % directions.length];
    playSound();
    lightModal();
    $(`[data-arrow="${index}"]`).focus({ preventScroll: true });
  }

  function checkLight() {
    const wrong = state.arrows.findIndex((direction, i) => direction !== correctArrows[i]);
    if (wrong !== -1) {
      lightModal(`光在第 ${wrong + 1} 块导光片停住啦。沿着实线，找找下一块在哪里？`);
      return;
    }
    state.power = true;
    advance("你把星光接起来了！灯塔亮起来啦。");
    showModal(`<div class="hint-art" aria-hidden="true">☼</div><p class="modal-kicker">YOU LIGHT UP THE WORLD</p><h2 id="modal-title">灯塔亮了，你真棒！</h2><p class="modal-copy">小小的光连在一起，也能照亮大大的世界。<br>现在，想办法飞到灯塔上吧！</p><button class="primary-button" data-modal-action="close">去找灯塔上的星星</button>`);
  }

  function requireTool(toolId, message) {
    if (selectedTool === toolId) return true;
    toast(message);
    return false;
  }

  function act(action) {
    if (state.collected) { toast("这一关完成啦！可以再玩一次，或者去看看你的星星。"); return; }
    if (level >= 3) {
      if (level === 3 && action === "mirror") {
        if (!requireTool("scope", "迷雾遮住了倒影。先选「寻秘密望远镜」，再查看倒影吧。")) return;
        state.clue = true;
        advance("望远镜看穿了魔法迷雾！现在能比较两座花园啦。");
      } else if (level === 3 && action === "greenhouse" && state.found.length === 5) {
        if (!requireTool("shrink", "温室的门只有叶子那么大。试试「小不点光束」，再进入温室。")) return;
        state.treasureReady = true;
        advance("咻——我们变小，钻进迷你温室啦！");
      } else if (level === 4 && action === "bakery-door") {
        if (!requireTool("shrink", "饼干屋太小啦。先选「小不点光束」，再敲敲门。")) return;
        state.small = true;
        advance("变小之后，小门变成了大门！月亮的魔法烤盘就在屋里。");
      } else if (level === 4 && action === "moon-delivery" && state.power) {
        if (!requireTool("fly", "月亮住在高高的云朵上。先选「云朵飞行帽」，再送饼干。")) return;
        state.treasureReady = true;
        advance("飞行帽带你穿过云朵！月亮收到饼干，开心地送你一颗星星。");
      } else if ((level === 3 && action === "garden-star" && state.found.length === 5 && state.treasureReady) || (level === 4 && action === "cookie-star" && state.power && state.treasureReady)) winLevel();
      return;
    }
    playSound();
    if (level === 1) {
      if (action === "sign") {
        if (!state.clue && !requireTool("scope", "路牌上的字太小啦。试试能看见秘密的望远镜？")) return;
        if (!state.clue) { state.clue = true; advance(); }
        clueModal();
      } else if (action === "gate") {
        if (!state.clue) { toast("机关需要四种图案。先用望远镜看看神秘路牌吧。"); return; }
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
        if (state.small) { toast("你已经变成小小探险家啦。去萤火虫工作台看看！"); return; }
        if (!requireTool("shrink", "树洞门好小！哪个道具能把我们变成小不点呢？")) return;
        state.small = true;
        advance("咻——我们变小啦！树洞里的工作台，现在可以打开了。");
      } else if (action === "light") {
        if (!state.small) { toast("工作台藏在小门后面。先想办法穿过小小树洞门吧。"); return; }
        if (state.power) { toast("灯塔已经亮了！选一个能飞的道具，去找高处的星星。"); return; }
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
    const messages = ["你看懂了线索，解开了机关，还搭起一座桥。", "你绕过岔路，把小小的光送到了灯塔。", "五个小秘密，都没逃过你的眼睛！", "你用排除法完成了饼干数独，月亮和朋友们都很开心！"];
    showModal(`<div class="celebration-star">${shape("star")}</div><p class="modal-kicker">A WONDERFUL LITTLE DISCOVERY</p><h2 id="modal-title">${first ? "第一颗星星，到手啦！" : "小小冒险家，你做到了！"}</h2><p class="modal-copy">${messages[level - 1]}<br>蓝豆想说：你的好奇心，闪闪发光！</p><div class="sticker-row"><span class="sticker">✧ ${["推理小能手", "方向小达人", "观察小侦探", "数独小厨师"][level - 1]}</span><span class="sticker">✧ 勇敢试一试</span><span class="sticker">✧ 蓝豆的好朋友</span></div><div class="modal-actions">${entry.next ? `<button class="primary-button" data-modal-action="next-level">出发，去${entry.next} →</button>` : ""}<button class="${entry.next ? "secondary" : "primary"}-button" data-modal-action="collection">看看我的星星</button><button class="secondary-button" data-modal-action="close">再看看这里</button></div>`, "win");
    announce(`第 ${level} 关完成！获得${entry.star}。${entry.next ? "下一关已解锁。" : "四关冒险全部完成！"}`);
  }

  function hintText() {
    if (state.collected) return ["你已经完成这一关啦。去看看收集的星星，或者再玩一次吧！"];
    if (level === 3) {
      if (!state.clue) return ["迷雾是一种藏住秘密的魔法。看看哪个道具能让你看见秘密？", "先选「寻秘密望远镜」，再点「查看雾中的倒影」。"];
      if (state.found.length === 5) return state.treasureReady ? ["你已经进入温室啦，点「收下花园星星」吧！"] : ["星星藏在迷你温室里。不是门要变大，是我们可以变小呀。", "选「小不点光束」，再点「进入迷你温室」，就能取到星星。"];
      const item = differences.find((entry) => entry.hint && !state.found.includes(entry.id));
      return item ? ["试着把两幅画分成上、中、下三块，一块一块比较。颜色、形状、花纹和数量都值得留意。", item.hint] : ["五处都找到啦！点「收下花园星星」就能去下一关。"];
    }
    if (level === 4) {
      if (!state.small) return ["饼干屋和玩具一样小。怎样才能走进这么小的门？", "选「小不点光束」，再点「敲敲饼干屋的小门」。"];
      if (state.power) return state.treasureReady ? ["月亮的礼物已经准备好，点「收下饼干星星」吧！"] : ["月亮住在高高的云朵上。如果能飞起来，就能送到啦。", "选「云朵飞行帽」，再点「把饼干送给月亮」。"];
      return ["先找空格最少的一行或一列。看看四种饼干里缺了谁，再检查粗框小方盒。", "点烤盘旁的「蓝豆，帮我想一个空格」，我会高亮一个能推出来的空格。再点一次，就解释可以放哪一种。"];
    }
    if (level === 1) {
      if (!state.clue) return ["路牌上有很小很小的图案。什么道具能让远处的东西看得更清楚呢？", "先选口袋里的「寻秘密望远镜」，再点「神秘路牌」的小圆圈。"];
      if (!state.gate) return ["先把叶子和星星看成一对不能分开的朋友。太阳还要站在星星后面，月亮能放在哪里呢？", "叶子、星星、太阳的前后顺序已经确定。试着把月亮插进不同位置，检查它会不会和太阳挨着。", "点「彩虹机关」，依次点：月亮 → 叶子 → 星星 → 太阳。这样三个约定都能满足。"];
      if (!state.bridge) return ["机关解开了，小河两边还没有连起来。找找口袋里像彩虹的道具。", "先选「彩虹桥种子」，再点河面上「这里少了一座桥」的小圆圈。"];
      return ["现在可以过河啦，河对岸的星星正等着你。", "点一下「森林星星」的小圆圈，就能收集它啦！"];
    }
    if (!state.small) return ["门太小，我们太大。想想看：如果变小一点，是不是就能进去？", "先选「小不点光束」，再点「小小树洞门」。"];
    if (!state.power) return ["沿着实线找到下一块导光片。虚线是不通的岔路，有一处需要往左拐哦。", "从第 1 块出发：先右，再下，再左，再下，最后向右到灯塔。", "打开「萤火虫工作台」，把五个箭头转成：1 →、2 ↓、3 ←、4 ↓、5 →，再点「点亮星光线路」。"];
    return ["星星在高处。如果能像云朵一样飞起来，就能碰到它了！", "先选「云朵飞行帽」，再点「灯塔上的星星」。"];
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
    showModal(`<p class="modal-kicker">LET'S PLAY TOGETHER</p><h2 id="modal-title">冒险，从好奇开始</h2><ol class="how-steps"><li><span>1</span>先看看场景，听听蓝豆说了什么。</li><li><span>2</span>点口袋里的道具，再点场景的小圆圈。</li><li><span>3</span>观察图案、转动箭头，找到小秘密。</li><li><span>4</span>卡住了就找蓝豆提示，可以一直试哦！</li></ol><p class="parent-note">给大朋友：适合亲子一起探索，无广告、无付费、无倒计时。通关星星保存在当前浏览器；关卡可随时重玩。蓝豆是原创机器人伙伴。声音默认关闭，朗读需要浏览器支持中文语音。</p><button class="primary-button" data-modal-action="close">准备好啦，出发！</button>`);
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
    selectedTool = button.dataset.tool;
    renderTools();
    $(`#tool-${selectedTool}`).focus({ preventScroll: true });
    playSound();
    announce(`已选择${toolData.find((tool) => tool.id === selectedTool).name}。再点场景里的小圆圈试试看。`);
  });
  $("#scene").addEventListener("click", (event) => {
    clearTimeout(toastTimer);
    $("#toast").hidden = true;
    const difference = event.target.closest("[data-difference]");
    if (difference) { findDifference(difference.dataset.difference, difference.dataset.side); return; }
    const cell = event.target.closest("[data-cell]");
    if (cell && !cell.disabled && !state.power && !state.collected) {
      state.selectedCell = Number(cell.dataset.cell);
      state.cookieHint = 0;
      renderScene();
      $(`[data-cell="${state.selectedCell}"]`).focus({ preventScroll: true });
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
  levels.forEach((entry, i) => $(`#${entry.id}`).addEventListener("click", () => { if (level !== i + 1) startLevel(i + 1); }));
  $("#restart-button").addEventListener("click", () => { startLevel(level); toast("新的一次冒险开始啦，收集过的星星不会丢哦。"); });
  $("#hint-button").addEventListener("click", () => { hintStep = 0; showHint(); });
  $("#collection-button").addEventListener("click", collection);
  $("#how-button").addEventListener("click", howToPlay);
  $("#read-button").addEventListener("click", readFriend);
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
    const shapeButton = event.target.closest("[data-shape]");
    if (shapeButton && modalType === "code") { enterShape(shapeButton.dataset.shape); return; }
    const arrowButton = event.target.closest("[data-arrow]");
    if (arrowButton && modalType === "light") { rotateArrow(Number(arrowButton.dataset.arrow)); return; }
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
    else if (action === "light-hint") {
      lightHintStep++;
      lightModal(lightHintStep === 1 ? "先用手指沿实线走一遍。第 3 块需要往回拐，别沿虚线走进死路哦。" : "五块的方向是：1 →、2 ↓、3 ←、4 ↓、5 →。一块一块转，不用急。");
    }
  });

  $("#companion-art").innerHTML = robotArt();
  updateSoundButton();
  startLevel(level);
})();
