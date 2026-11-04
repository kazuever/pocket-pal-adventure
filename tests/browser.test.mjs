import assert from "node:assert/strict";
import { spawn } from "node:child_process";
import { existsSync } from "node:fs";
import { mkdtemp, mkdir, writeFile, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import test from "node:test";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const browserPath = process.env.BROWSER_PATH || [
  "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
  "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe"
].find(existsSync);
const artifacts = process.env.DEMO_ARTIFACTS || path.join(tmpdir(), "little-pocket-demo-previews");
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

class CDP {
  constructor(socket) {
    this.socket = socket;
    this.sequence = 0;
    this.pending = new Map();
    this.errors = [];
    this.network = [];
    socket.addEventListener("message", (event) => {
      const message = JSON.parse(event.data);
      if (message.id) {
        const request = this.pending.get(message.id);
        if (!request) return;
        this.pending.delete(message.id);
        clearTimeout(request.timer);
        if (message.error) request.reject(new Error(JSON.stringify(message.error)));
        else request.resolve(message.result);
      }
      if (message.method === "Runtime.exceptionThrown") this.errors.push(message.params.exceptionDetails);
      if (message.method === "Log.entryAdded" && message.params.entry.level === "error") this.errors.push(message.params.entry);
      if (message.method === "Network.requestWillBeSent") this.network.push(message.params.request.url);
    });
  }
  send(method, params = {}, sessionId) {
    const id = ++this.sequence;
    return new Promise((resolve, reject) => {
      const timer = setTimeout(() => {
        this.pending.delete(id);
        reject(new Error(`CDP timeout: ${method}`));
      }, 12000);
      this.pending.set(id, { resolve, reject, timer });
      this.socket.send(JSON.stringify({ id, method, params, ...(sessionId ? { sessionId } : {}) }));
    });
  }
}

test("four playable adventures, recovery, accessibility, persistence and responsive layout", { timeout: 180000 }, async (t) => {
  assert.ok(browserPath, "Chrome or Edge must be installed, or set BROWSER_PATH");
  const profile = await mkdtemp(path.join(tmpdir(), "little-pocket-browser-"));
  await mkdir(artifacts, { recursive: true });
  const browser = spawn(browserPath, [
    "--headless=new", "--disable-gpu", "--no-first-run", "--no-default-browser-check",
    "--disable-background-networking", "--disable-extensions", "--mute-audio",
    "--remote-debugging-port=0", `--user-data-dir=${profile}`, "about:blank"
  ], { stdio: ["ignore", "ignore", "pipe"], windowsHide: true });
  let cdp;
  t.after(async () => {
    if (cdp) {
      try { await cdp.send("Browser.close"); } catch { /* The browser may close before acknowledging. */ }
      cdp.socket.close();
    } else browser.kill();
    for (let i = 0; i < 30 && browser.exitCode === null; i++) await delay(100);
    if (browser.exitCode === null) browser.kill();
    await rm(profile, { recursive: true, force: true, maxRetries: 10, retryDelay: 200 });
  });
  const endpoint = await new Promise((resolve, reject) => {
    let output = "";
    const timer = setTimeout(() => reject(new Error(`Browser did not start: ${output}`)), 15000);
    browser.on("error", (error) => { clearTimeout(timer); reject(error); });
    browser.on("exit", (code) => {
      if (!output.includes("DevTools listening")) { clearTimeout(timer); reject(new Error(`Browser exited ${code}: ${output}`)); }
    });
    browser.stderr.on("data", (chunk) => {
      output += chunk.toString();
      const match = output.match(/DevTools listening on (ws:\/\/[^\s]+)/);
      if (match) { clearTimeout(timer); resolve(match[1]); }
    });
  });
  const socket = new WebSocket(endpoint);
  await new Promise((resolve, reject) => {
    socket.addEventListener("open", resolve, { once: true });
    socket.addEventListener("error", reject, { once: true });
  });
  cdp = new CDP(socket);
  const { targetId } = await cdp.send("Target.createTarget", { url: "about:blank" });
  const { sessionId } = await cdp.send("Target.attachToTarget", { targetId, flatten: true });
  const send = (method, params) => cdp.send(method, params, sessionId);
  await send("Runtime.enable");
  await send("Log.enable");
  await send("Network.enable");
  await send("Page.enable");
  const evaluate = async (expression) => {
    const response = await send("Runtime.evaluate", { expression, returnByValue: true, awaitPromise: true });
    if (response.exceptionDetails) throw new Error(JSON.stringify(response.exceptionDetails));
    return response.result.value;
  };
  const waitFor = async (expression) => {
    for (let i = 0; i < 60; i++) {
      if (await evaluate(expression)) return;
      await delay(50);
    }
    throw new Error(`Not ready: ${expression}`);
  };
  const click = async (selector) => {
    const point = await evaluate(`(() => {
      const e = document.querySelector(${JSON.stringify(selector)});
      if (!e || e.disabled || !e.getClientRects().length) throw new Error("Missing or unavailable button: " + ${JSON.stringify(selector)});
      e.scrollIntoView({block: "center", inline: "nearest"});
      const r = e.getBoundingClientRect();
      return {x:r.x+r.width/2,y:r.y+r.height/2};
    })()`);
    await send("Input.dispatchMouseEvent", { type: "mousePressed", button: "left", clickCount: 1, ...point });
    await send("Input.dispatchMouseEvent", { type: "mouseReleased", button: "left", clickCount: 1, ...point });
  };
  const text = (selector) => evaluate(`document.querySelector(${JSON.stringify(selector)}).textContent`);
  const modalOpen = () => evaluate('document.querySelector("#modal").open');
  const screenshot = async (name) => {
    await evaluate("window.scrollTo(0,0)");
    await delay(80);
    const image = await send("Page.captureScreenshot", { format: "png", captureBeyondViewport: true });
    const destination = path.join(artifacts, name);
    await writeFile(destination, Buffer.from(image.data, "base64"));
    console.log(`Screenshot: ${destination}`);
  };
  const viewport = (width, height) => send("Emulation.setDeviceMetricsOverride", { width, height, deviceScaleFactor: 1, mobile: width < 600 });
  const navigate = async () => {
    await send("Page.navigate", { url: pathToFileURL(path.join(root, "index.html")).href });
    await waitFor('Boolean(document.querySelector("#hotspot-sign") || document.querySelector("#hotspot-door") || document.querySelector(".garden-board") || document.querySelector(".bakery-door") || document.querySelector(".cookie-grid"))');
  };
  await viewport(1440, 1050);
  await navigate();
  await evaluate("localStorage.clear()");
  await navigate();

  await t.test("initial screen, blocked shortcuts and helpful hints", async () => {
    assert.match(await text("#level-title"), /彩虹桥/);
    assert.equal(await evaluate('document.querySelector("#level-two").disabled'), true);
    assert.equal(await text("#mission-count"), "0 / 3");
    await screenshot("01-forest-desktop.png");
    await click("#hotspot-treasure");
    assert.match(await text("#toast"), /搭一座小桥/);
    assert.equal(await text("#star-count"), "0");
    await click("#tool-fly");
    await click("#hotspot-sign");
    assert.match(await text("#toast"), /望远镜/);
    assert.equal(await text("#mission-count"), "0 / 3");
    await click("#hint-button");
    assert.match(await text("#modal-title"), /一起想/);
    await click('[data-modal-action="more-hint"]');
    assert.match(await text(".modal-copy"), /寻秘密望远镜/);
    await click("#modal-close");
    assert.equal(await evaluate('document.activeElement.id'), "hint-button");
  });

  await t.test("level one: clue, wrong-code recovery, correct-code and bridge", async () => {
    await click("#tool-scope");
    await click("#hotspot-sign");
    assert.match(await text("#modal-title"), /秘密/);
    assert.equal(await text("#mission-count"), "1 / 3");
    assert.equal(await evaluate('document.querySelectorAll(".queue-rules li").length'), 3);
    await screenshot("06-logic-clue-desktop.png");
    await click('[data-modal-action="back-code"]');
    assert.equal(await modalOpen(), true, "The clue CTA must open the puzzle, not dismiss the dialog");
    assert.equal(await evaluate('document.querySelectorAll("[data-shape]").length'), 4);
    assert.match(await text("#modal-title"), /谁站在哪里/);
    await click("#modal-close");
    await click("#hint-button");
    assert.doesNotMatch(await text(".modal-copy"), /月亮 →/);
    await click('[data-modal-action="more-hint"]');
    assert.match(await text(".modal-copy"), /插进不同位置/);
    await click('[data-modal-action="more-hint"]');
    assert.match(await text(".modal-copy"), /月亮 → 叶子 → 星星 → 太阳/);
    await click("#modal-close");
    await click("#hotspot-gate");
    for (const id of ["leaf", "sun", "star"]) await click(`[data-shape="${id}"]`);
    assert.equal(await text("#mission-count"), "1 / 3", "The old three-symbol answer must not unlock the new puzzle");
    assert.equal(await evaluate('document.querySelectorAll(".code-slot.filled").length'), 3);
    await click('[data-shape="moon"]');
    assert.match(await text("#code-feedback"), /差一点点/);
    assert.equal(await evaluate('document.querySelectorAll(".code-slot.filled").length'), 0);
    assert.equal(await text("#mission-count"), "1 / 3");
    for (const id of ["leaf", "moon", "sun", "star"]) await click(`[data-shape="${id}"]`);
    assert.match(await text("#code-feedback"), /差一点点/);
    await click('[data-shape="sun"]');
    await click('[data-shape="sun"]');
    assert.match(await text("#code-feedback"), /已经在队伍/);
    assert.equal(await evaluate('document.querySelectorAll(".code-slot.filled").length'), 1, "Duplicate friends must not occupy another slot");
    await click('[data-shape="leaf"]');
    await click('[data-modal-action="undo-code"]');
    assert.equal(await evaluate('document.querySelectorAll(".code-slot.filled").length'), 1);
    await click('[data-modal-action="peek-code"]');
    assert.match(await text("#modal-content"), /不能挨在一起/);
    assert.doesNotMatch(await text("#modal-content"), /月亮 → 叶子/, "Revisiting the clue must not reveal the answer");
    await click('[data-modal-action="back-code"]');
    assert.equal(await evaluate('document.querySelectorAll(".code-slot.filled").length'), 1, "Peeking must preserve partial input");
    await click('[data-modal-action="clear-code"]');
    assert.equal(await evaluate('document.querySelectorAll(".code-slot.filled").length'), 0);
    const permutations = (items) => items.length ? items.flatMap((id, i) => permutations(items.filter((_, j) => i !== j)).map((tail) => [id, ...tail])) : [[]];
    for (const order of permutations(["leaf", "sun", "star", "moon"])) {
      if (order.join() === "moon,leaf,star,sun") continue;
      for (const id of order) await click(`[data-shape="${id}"]`);
      assert.equal(await text("#mission-count"), "1 / 3", `Invalid order must not unlock: ${order}`);
      assert.match(await text("#code-feedback"), /约定没满足/);
    }
    for (const id of ["moon", "leaf", "star", "sun"]) await click(`[data-shape="${id}"]`);
    assert.match(await text("#modal-title"), /机关打开/);
    assert.equal(await text("#mission-count"), "2 / 3");
    await click('[data-modal-action="close"]');
    await click("#hotspot-river");
    assert.match(await text("#toast"), /手拉手/);
    await click("#tool-bridge");
    await click("#hotspot-river");
    assert.match(await text("#hotspot-river"), /长出来/);
    await click("#hotspot-treasure");
    assert.match(await text("#modal-title"), /第一颗星星/);
    assert.equal(await text("#star-count"), "1");
    assert.equal(await text("#mission-count"), "3 / 3");
    assert.equal(await evaluate('document.querySelector("#level-two").disabled'), false);
    await click('[data-modal-action="next-level"]');
    assert.match(await text("#level-title"), /灯塔/);
    assert.equal(await evaluate('document.querySelector("#toast").hidden'), true, "Previous-level messages must not leak into the next level");
  });

  await t.test("level two: shrink, directional puzzle, wrong-answer recovery and flight", async () => {
    await screenshot("02-lighthouse-desktop.png");
    await click("#hotspot-light");
    assert.match(await text("#toast"), /小门/);
    await click("#tool-bridge");
    await click("#hotspot-door");
    assert.match(await text("#toast"), /小不点/);
    await click("#tool-shrink");
    await click("#hotspot-door");
    assert.equal(await text("#mission-count"), "1 / 3");
    await click("#hotspot-light");
    await click('[data-modal-action="check-light"]');
    assert.match(await text("#light-feedback"), /第 1 块/);
    assert.equal(await text("#mission-count"), "1 / 3");
    await click('[data-modal-action="light-hint"]');
    assert.match(await text("#light-feedback"), /第 3 块需要往回拐/);
    assert.doesNotMatch(await text("#light-feedback"), /1 →/);
    await click('[data-modal-action="light-hint"]');
    assert.match(await text("#light-feedback"), /1 →、2 ↓、3 ←、4 ↓、5 →/);
    for (const [index, turns] of [[0, 3], [1, 3], [2, 1]]) {
      for (let i = 0; i < turns; i++) await click(`[data-arrow="${index}"]`);
    }
    await click('[data-modal-action="check-light"]');
    assert.match(await text("#light-feedback"), /第 3 块/, "The old solution must stop at the new left turn");
    assert.equal(await text("#mission-count"), "1 / 3");
    await click('[data-arrow="2"]');
    await click('[data-arrow="2"]');
    await click('[data-modal-action="check-light"]');
    assert.match(await text("#light-feedback"), /第 4 块/);
    for (const [index, turns] of [[3, 1], [4, 1]]) {
      for (let i = 0; i < turns; i++) await click(`[data-arrow="${index}"]`);
    }
    assert.equal(await evaluate('document.querySelectorAll(".arrow-tile.lit").length'), 5);
    await click("#modal-close");
    await click("#hotspot-light");
    assert.equal(await evaluate('document.querySelectorAll(".arrow-tile.lit").length'), 5, "Closing the puzzle must preserve the route");
    await screenshot("03-light-puzzle-desktop.png");
    await click('[data-modal-action="check-light"]');
    assert.match(await text("#modal-title"), /灯塔亮了/);
    assert.equal(await text("#mission-count"), "2 / 3");
    await click('[data-modal-action="close"]');
    await click("#hotspot-lighthouse");
    assert.match(await text("#toast"), /飞行帽/);
    await click("#tool-fly");
    await click("#hotspot-lighthouse");
    assert.match(await text("#modal-title"), /你做到了/);
    assert.equal(await text("#star-count"), "2");
    assert.equal(await text("#mission-count"), "3 / 3");
    await click('[data-modal-action="collection"]');
    assert.equal(await evaluate('document.querySelectorAll(".collection-star.earned").length'), 2);
    await click('[data-modal-action="close"]');
  });

  await t.test("save, replay, sound, keyboard dialogs and narrow mobile layout", async () => {
    await click("#sound-button");
    assert.equal(await evaluate('document.querySelector("#sound-button").getAttribute("aria-pressed")'), "true");
    await navigate();
    assert.equal(await text("#star-count"), "2");
    assert.match(await text("#level-title"), /灯塔/);
    assert.equal(await evaluate('document.querySelector("#sound-button").getAttribute("aria-pressed")'), "true");
    await click("#restart-button");
    assert.equal(await text("#mission-count"), "0 / 3");
    assert.equal(await text("#star-count"), "2");
    await click("#level-one");
    assert.match(await text("#level-title"), /彩虹桥/);
    await click("#how-button");
    assert.equal(await modalOpen(), true);
    await send("Input.dispatchKeyEvent", { type: "keyDown", key: "Escape", code: "Escape", windowsVirtualKeyCode: 27 });
    await send("Input.dispatchKeyEvent", { type: "keyUp", key: "Escape", code: "Escape", windowsVirtualKeyCode: 27 });
    assert.equal(await modalOpen(), false);
    assert.equal(await evaluate('document.activeElement.id'), "how-button");
    await viewport(390, 844);
    await click("#collection-button");
    assert.equal(await evaluate('document.querySelectorAll(".collection-star.earned").length'), 2);
    await click("#modal-close");
    await delay(4400);
    await screenshot("04-forest-mobile.png");
    assert.equal(await evaluate("document.documentElement.scrollWidth <= innerWidth"), true, "No horizontal page overflow at 390px");
    await click("#tool-scope");
    await click("#hotspot-sign");
    assert.match(await text("#modal-title"), /秘密/);
    assert.equal(await evaluate('document.querySelector("#modal").getBoundingClientRect().right <= innerWidth'), true);
    await screenshot("07-logic-clue-mobile.png");
    await click('[data-modal-action="back-code"]');
    assert.equal(await modalOpen(), true);
    assert.equal(await evaluate('document.querySelectorAll("[data-shape]").length'), 4, "Clue CTA also opens the actual puzzle on mobile");
    await screenshot("08-logic-puzzle-mobile.png");
    for (const id of ["moon", "leaf", "star", "sun"]) await click(`[data-shape="${id}"]`);
    assert.match(await text("#modal-title"), /机关打开/);
    await click("#modal-close");
    await click("#level-two");
    await click("#tool-shrink");
    await click("#hotspot-door");
    await click("#hotspot-light");
    await screenshot("05-light-puzzle-mobile.png");
    assert.equal(await evaluate('document.querySelector("#modal").scrollWidth <= document.querySelector("#modal").clientWidth'), true, "No horizontal puzzle overflow");
    for (const [index, turns] of [[0, 3], [1, 3], [2, 3], [3, 1], [4, 1]]) {
      for (let i = 0; i < turns; i++) await click(`[data-arrow="${index}"]`);
    }
    await click('[data-modal-action="check-light"]');
    assert.match(await text("#modal-title"), /灯塔亮了/);
    await click("#modal-close");
    await viewport(320, 740);
    assert.equal(await evaluate("document.documentElement.scrollWidth <= innerWidth"), true, "No horizontal page overflow at 320px");
    await click("#level-one");
    await click("#tool-scope");
    await click("#hotspot-sign");
    assert.equal(await evaluate('document.querySelector("#modal").scrollWidth <= document.querySelector("#modal").clientWidth'), true, "Logic clue fits at 320px");
    await click('[data-modal-action="back-code"]');
    assert.equal(await evaluate('document.querySelector("#modal").scrollWidth <= document.querySelector("#modal").clientWidth'), true, "Four-symbol controls fit at 320px");
    await click("#modal-close");
  });

  await t.test("level three: five differences, either picture, duplicates, hints and mobile", async () => {
    await viewport(1440, 1050);
    await click("#level-three");
    assert.match(await text("#level-title"), /不一样/);
    assert.equal(await evaluate('document.querySelector("#level-four").disabled'), true);
    assert.equal(await evaluate('document.querySelectorAll(".garden-board").length'), 2);
    await screenshot("13-garden-fog-desktop.png");
    await click('[data-action="mirror"]');
    assert.match(await text("#toast"), /望远镜/);
    assert.equal(await evaluate('document.querySelectorAll(".garden-object:disabled").length'), 16);
    await click("#tool-scope");
    await click('[data-action="mirror"]');
    assert.equal(await evaluate('document.querySelector(".mirror-fog") === null'), true);
    assert.equal(await text("#mission-count"), "1 / 3");
    await screenshot("09-garden-desktop.png");
    await click('[data-difference="sun"][data-side="0"]');
    assert.match(await text("#garden-feedback"), /一样的/);
    assert.equal(await text("#mission-count"), "1 / 3");
    await click('[data-difference="house"][data-side="1"]');
    assert.equal(await evaluate('document.querySelectorAll(".garden-object.found").length'), 2);
    await click('[data-difference="house"][data-side="0"]');
    assert.match(await text("#garden-feedback"), /已经找到/);
    assert.equal(await evaluate('document.querySelectorAll(".garden-object.found").length'), 2);
    await click("#hint-button");
    await click('[data-modal-action="more-hint"]');
    assert.match(await text(".modal-copy"), /花瓣/);
    await click("#modal-close");
    await viewport(390, 844);
    assert.equal(await evaluate("document.documentElement.scrollWidth <= innerWidth"), true);
    await screenshot("10-garden-mobile.png");
    for (const [id, side] of [["flower", 0], ["butterfly", 1], ["rabbit", 0], ["carrots", 1]]) await click(`[data-difference="${id}"][data-side="${side}"]`);
    assert.equal(await evaluate('document.querySelectorAll(".garden-object.found").length'), 10);
    assert.equal(await text("#mission-count"), "2 / 3");
    assert.equal(await evaluate('document.querySelector("[data-action=\\"garden-star\\"]") === null'), true, "Finding differences alone must not award the star");
    await click('[data-action="greenhouse"]');
    assert.match(await text("#toast"), /小不点/);
    await click("#tool-shrink");
    await click('[data-action="greenhouse"]');
    await click('[data-action="garden-star"]');
    assert.equal(await text("#star-count"), "3");
    assert.equal(await text("#mission-count"), "3 / 3");
    await click('[data-modal-action="next-level"]');
    assert.match(await text("#level-title"), /饼干/);
  });

  await t.test("level four: unique Sudoku, fixed clues, mistakes, hints and completion", async () => {
    await click('[data-action="bakery-door"]');
    assert.match(await text("#toast"), /小不点/);
    assert.equal(await evaluate('document.querySelector(".cookie-grid") === null'), true);
    await screenshot("14-bakery-door-mobile.png");
    await click("#tool-shrink");
    await click('[data-action="bakery-door"]');
    assert.equal(await text("#mission-count"), "1 / 3");
    const solution = [0, 1, 2, 3, 2, 3, 0, 1, 1, 0, 3, 2, 3, 2, 1, 0];
    const givens = await evaluate('Array.from(document.querySelectorAll(".cookie-cell")).map(e => e.disabled ? ["叶子","太阳","星星","月亮"].findIndex(name => e.getAttribute("aria-label").includes(name)) : null)');
    const candidates = (board, index) => {
      const row = Math.floor(index / 4), col = index % 4;
      return [0, 1, 2, 3].filter((value) => !board.some((other, i) => other === value && (Math.floor(i / 4) === row || i % 4 === col || (Math.floor(i / 8) === Math.floor(row / 2) && Math.floor((i % 4) / 2) === Math.floor(col / 2)))));
    };
    const solutions = [];
    const solve = (board) => {
      const empty = board.indexOf(null);
      if (empty === -1) { solutions.push([...board]); return; }
      for (const value of candidates(board, empty)) { board[empty] = value; solve(board); board[empty] = null; }
    };
    solve([...givens]);
    assert.equal(solutions.length, 1, "The picture Sudoku must have exactly one solution");
    assert.deepEqual(solutions[0], solution);
    assert.equal(await evaluate('document.querySelector("[data-cell=\\"0\\"]").disabled'), true);
    await click('[data-cookie-action="check"]');
    assert.match(await text("#cookie-feedback"), /还有空格/);
    await click('[data-cell="1"]');
    await click('[data-cookie="0"]');
    await click('[data-cookie-action="check"]');
    assert.match(await text("#cookie-feedback"), /重复/);
    await click('[data-cookie-action="erase"]');
    await click('[data-cookie-action="hint"]');
    assert.match(await text("#cookie-feedback"), /排除/);
    await click('[data-cookie-action="hint"]');
    assert.match(await text("#cookie-feedback"), /可以放/);
    await screenshot("11-sudoku-mobile.png");
    assert.equal(await evaluate("document.documentElement.scrollWidth <= innerWidth"), true);
    await viewport(320, 740);
    assert.equal(await evaluate("document.documentElement.scrollWidth <= innerWidth"), true);
    await viewport(1440, 1050);
    await screenshot("12-sudoku-desktop.png");
    for (let i = 0; i < 16; i++) {
      if (givens[i] !== null) continue;
      await click(`[data-cell="${i}"]`);
      await click(`[data-cookie="${solution[i]}"]`);
    }
    assert.equal(await text("#mission-count"), "1 / 3");
    await click('[data-cookie-action="check"]');
    assert.match(await text("#cookie-feedback"), /都对啦/);
    assert.equal(await text("#mission-count"), "2 / 3");
    await screenshot("15-moon-delivery-desktop.png");
    assert.equal(await evaluate('document.querySelector("[data-action=\\"cookie-star\\"]") === null'), true, "Solving Sudoku alone must not finish the gadget adventure");
    await click('[data-action="moon-delivery"]');
    assert.match(await text("#toast"), /飞行帽/);
    await click("#tool-fly");
    await click('[data-action="moon-delivery"]');
    await click('[data-action="cookie-star"]');
    assert.equal(await text("#star-count"), "4");
    await click('[data-modal-action="collection"]');
    assert.equal(await evaluate('document.querySelectorAll(".collection-star.earned").length'), 4);
    await click("#modal-close");
    await navigate();
    assert.equal(await text("#star-count"), "4");
    assert.match(await text("#level-title"), /饼干/);
    await click("#restart-button");
    assert.equal(await text("#mission-count"), "0 / 3");
    assert.equal(await text("#star-count"), "4");
    await click("#level-three");
    assert.equal(await evaluate('document.querySelectorAll(".garden-object.found").length'), 0);
  });

  await t.test("old two-star progress migrates and new levels remain sequential", async () => {
    await evaluate('localStorage.setItem("little-pocket-adventure-v1", JSON.stringify({completed:[1,2],level:2,sound:false}))');
    await navigate();
    assert.equal(await text("#star-count"), "2");
    assert.equal(await evaluate('document.querySelector("#level-three").disabled'), false);
    assert.equal(await evaluate('document.querySelector("#level-four").disabled'), true);
  });

  await t.test("unavailable storage is nonfatal and no external assets or runtime errors", async () => {
    await send("Page.addScriptToEvaluateOnNewDocument", { source: "Storage.prototype.setItem = function() { throw new DOMException('Unavailable', 'SecurityError'); };" });
    await navigate();
    assert.match(await text("#save-status"), /无法保存/);
    await click("#hint-button");
    assert.equal(await modalOpen(), true);
    assert.deepEqual(cdp.errors, [], "No JavaScript exceptions or browser resource errors");
    assert.deepEqual(cdp.network.filter((url) => /^https?:/.test(url)), [], "The game runs completely offline");
  });
});
