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

test("twenty playable adventures, recovery, accessibility, persistence and responsive layout", { timeout: 360000 }, async (t) => {
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
  await send("Emulation.setEmulatedMedia", { features: [{ name: "prefers-reduced-motion", value: "no-preference" }] });
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
      if (e) {
        let parent = e.parentElement;
        while (parent) {
          if (parent.tagName === "DETAILS" && !parent.querySelector(":scope > summary")?.contains(e)) parent.open = true;
          parent = parent.parentElement;
        }
      }
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
    await waitFor('Boolean(document.querySelector("#hotspot-sign") || document.querySelector("#hotspot-door") || document.querySelector(".garden-board") || document.querySelector(".bakery-door") || document.querySelector(".cookie-grid") || document.querySelector(".new-scene-banner"))');
  };
  await viewport(1440, 1050);
  await navigate();
  await evaluate("localStorage.clear()");
  await navigate();

  await t.test("initial screen, blocked shortcuts and helpful hints", async () => {
    assert.equal(await evaluate('document.querySelector(".world-map").open'), false, "The twenty-level map stays out of the game canvas until requested");
    assert.equal(await evaluate('document.querySelector(".game-settings").open'), false);
    assert.match(await text("#level-title"), /彩虹桥/);
    assert.equal(await evaluate('document.querySelector("#level-two").disabled'), false);
    assert.equal(await text("#mission-count"), "0 / 3");
    await screenshot("01-forest-desktop.png");
    await click("#hotspot-treasure");
    assert.match(await text("#toast"), /搭一座小桥/);
    assert.equal(await text("#star-count"), "0");
    await click("#tool-fly");
    await click("#hotspot-sign");
    assert.match(await text("#toast"), /细节|看不清/);
    assert.doesNotMatch(await text("#toast"), /望远镜|先选/);
    assert.equal(await text("#mission-count"), "0 / 3");
    await click("#hint-button");
    assert.match(await text("#modal-title"), /一起想/);
    await click('[data-modal-action="more-hint"]');
    assert.match(await text(".modal-copy"), /距离|更大/);
    assert.doesNotMatch(await text(".modal-copy"), /寻秘密望远镜|先选/);
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
    assert.match(await text("#toast"), /两边还没连起来/);
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

  await t.test("level two: bridge changes traversability, constrained route planning and flight", async () => {
    await screenshot("02-lighthouse-desktop.png");
    await click("#hotspot-light");
    assert.equal(await text("#mission-count"), "1 / 3");
    await click('[data-route="4"]');
    assert.match(await text("#light-feedback"), /没有落脚/);
    assert.equal(await evaluate('document.querySelectorAll(".route-cell.visited").length'), 1, "Water cannot be traversed");
    await click('[data-map-tool="shrink"]');
    await click('[data-route="4"]');
    assert.match(await text("#light-feedback"), /没有落脚/);
    assert.equal(await evaluate('Boolean(document.querySelector(".river-gap"))'), true, "Changing size cannot connect river banks");
    await click('[data-map-tool="bridge"]');
    await click('[data-route="4"]');
    assert.equal(await evaluate('Boolean(document.querySelector(".bridged"))'), true);
    assert.equal(await evaluate('document.querySelectorAll(".route-cell.visited").length'), 1, "Planting a bridge changes the map, not the player's route");
    assert.match(await text("#light-feedback"), /小桥长出来/);
    await click('[data-modal-action="check-light"]');
    assert.match(await text("#light-feedback"), /还没走到灯塔/);
    assert.equal(await text("#mission-count"), "1 / 3");
    await click('[data-modal-action="light-hint"]');
    assert.match(await text("#light-feedback"), /最短路线/);
    assert.doesNotMatch(await text("#light-feedback"), /右、下、左/);
    await click('[data-modal-action="light-hint"]');
    assert.match(await text("#light-feedback"), /先右、再下/);
    await click('[data-route="6"]');
    assert.match(await text("#light-feedback"), /猫头鹰/);
    await click('[data-route="3"]');
    assert.match(await text("#light-feedback"), /跳格/);
    for (const cell of [1, 2, 3, 7, 11]) await click(`[data-route="${cell}"]`);
    await click('[data-modal-action="check-light"]');
    assert.match(await text("#light-feedback"), /漏掉了补光花/);
    assert.equal(await text("#mission-count"), "1 / 3");
    await click('[data-modal-action="clear-route"]');
    for (const cell of [4, 8, 9, 5, 1, 2, 3, 7, 11]) await click(`[data-route="${cell}"]`);
    await click('[data-modal-action="check-light"]');
    assert.match(await text("#light-feedback"), /用了 9 步/);
    await click('[data-modal-action="clear-route"]');
    await click('[data-route="1"]');
    await click('[data-route="0"]');
    assert.match(await text("#light-feedback"), /不能重复/);
    await click('[data-modal-action="undo-route"]');
    assert.equal(await evaluate('document.querySelectorAll(".route-cell.visited").length'), 1);
    for (const cell of [1, 5, 4, 8, 9, 10, 11]) await click(`[data-route="${cell}"]`);
    assert.equal(await evaluate('document.querySelectorAll(".route-cell.visited").length'), 8);
    await click("#modal-close");
    await click("#hotspot-light");
    assert.equal(await evaluate('document.querySelectorAll(".route-cell.visited").length'), 8, "Closing the puzzle must preserve the route");
    const paths = [];
    const visit = (path) => {
      const last = path.at(-1);
      if (last === 11) { if (path.length === 8 && path.includes(5) && path.includes(8)) paths.push(path); return; }
      if (path.length >= 8) return;
      for (let i = 0; i < 12; i++) {
        if (i !== 6 && !path.includes(i) && Math.abs(Math.floor(i / 4) - Math.floor(last / 4)) + Math.abs(i % 4 - last % 4) === 1) visit([...path, i]);
      }
    };
    visit([0]);
    assert.deepEqual(paths, [[0, 1, 5, 4, 8, 9, 10, 11]], "Route constraints have one solution, not just an obvious shortest path");
    await screenshot("03-light-puzzle-desktop.png");
    await click('[data-modal-action="check-light"]');
    assert.match(await text("#modal-title"), /灯塔亮了/);
    assert.equal(await text("#mission-count"), "2 / 3");
    await click('[data-modal-action="close"]');
    await click("#hotspot-lighthouse");
    assert.match(await text("#toast"), /高处/);
    assert.doesNotMatch(await text("#toast"), /飞行帽|先选/);
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
    assert.equal(await text("#mission-count"), "1 / 3");
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
    await click("#hotspot-door");
    await screenshot("05-light-puzzle-mobile.png");
    assert.equal(await evaluate('document.querySelector("#modal").scrollWidth <= document.querySelector("#modal").clientWidth'), true, "No horizontal puzzle overflow");
    await viewport(320, 740);
    assert.equal(await evaluate('document.querySelector("#modal").scrollWidth <= document.querySelector("#modal").clientWidth'), true, "Route map fits at 320px");
    await viewport(390, 844);
    await click('[data-map-tool="bridge"]');
    await click('[data-route="4"]');
    for (const cell of [1, 5, 4, 8, 9, 10, 11]) await click(`[data-route="${cell}"]`);
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
    assert.equal(await evaluate('document.querySelector("#level-four").disabled'), false);
    assert.equal(await evaluate('document.querySelectorAll(".garden-board").length'), 2);
    assert.equal(await evaluate('document.querySelectorAll(".garden-object:disabled").length'), 0, "Observing is not locked behind a gadget");
    assert.equal(await evaluate('document.querySelector(".mirror-fog") === null'), true);
    await click("#tool-scope");
    await click('[data-difference="sun"][data-side="0"]');
    assert.equal(await evaluate('document.querySelectorAll(".detail-comparison svg").length'), 2);
    assert.equal(await evaluate('document.querySelectorAll(".garden-object.found").length'), 0, "Magnification never auto-detects differences");
    await click('[data-inspect-difference="sun"]');
    assert.match(await text("#garden-feedback"), /一样的/);
    await click('[data-difference="house"][data-side="1"]');
    assert.equal(await evaluate('document.querySelectorAll(".garden-object.found").length'), 0);
    assert.notEqual(await evaluate('document.querySelectorAll(".detail-comparison svg")[0].innerHTML'), await evaluate('document.querySelectorAll(".detail-comparison svg")[1].innerHTML'));
    await screenshot("13-garden-magnifier-desktop.png");
    await viewport(320, 740);
    assert.equal(await evaluate('document.querySelector("#modal").scrollWidth <= document.querySelector("#modal").clientWidth'), true, "Magnified comparisons fit at 320px");
    await click('[data-modal-action="close"]');
    await viewport(1440, 1050);
    await click("#tool-scope");
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
    assert.equal(await text("#mission-count"), "1 / 3", "Finding all differences alone must not solve the reasoning lock");
    assert.equal(await evaluate('document.querySelector("[data-action=\\"garden-star\\"]") === null'), true, "Finding differences alone must not award the star");
    assert.equal(await evaluate('document.querySelector("[data-action=\\"greenhouse\\"]") === null'), true, "Greenhouse access requires the observation lock");
    await click('[data-action="garden-lock"]');
    await screenshot("16-garden-lock-mobile.png");
    assert.equal(await evaluate('document.querySelector("#modal").scrollWidth <= document.querySelector("#modal").clientWidth'), true);
    await viewport(320, 740);
    assert.equal(await evaluate('document.querySelector("#modal").scrollWidth <= document.querySelector("#modal").clientWidth'), true, "Observation comparisons and password controls fit at 320px");
    await viewport(390, 844);
    await click('[data-garden-home="0"]');
    assert.match(await text("#garden-lock-feedback"), /先点上面/);
    await click('[data-modal-action="check-homes"]');
    assert.match(await text("#garden-lock-feedback"), /还有朋友/);
    const orders = [
      ["squirrel", "bear", "rabbit"], ["rabbit", "squirrel", "bear"],
      ["rabbit", "bear", "squirrel"], ["bear", "squirrel", "rabbit"],
      ["bear", "rabbit", "squirrel"], ["squirrel", "rabbit", "bear"]
    ];
    for (let order = 0; order < orders.length; order++) {
      for (let house = 0; house < 3; house++) {
        await click(`[data-garden-choice="${orders[order][house]}"]`);
        await click(`[data-garden-home="${house}"]`);
      }
      if (order === 0) {
        await click("#modal-close");
        await click('[data-action="garden-lock"]');
        assert.match(await evaluate('document.querySelector("[data-garden-home=\\"0\\"]").getAttribute("aria-label")'), /小松鼠/, "Home placements persist when reopening");
        await screenshot("17-animal-homes-mobile.png");
      }
      await click('[data-modal-action="check-homes"]');
      if (order < 5) assert.equal(await text("#mission-count"), "1 / 3", "All five wrong arrangements must fail");
    }
    assert.match(await text("#modal-title"), /朋友们回家/);
    assert.equal(await text("#mission-count"), "2 / 3");
    await click("#modal-close");
    assert.equal(await evaluate('document.querySelector("[data-action=\\"greenhouse\\"]") === null'), true, "No unrelated shrink gate after solving the actual puzzle");
    await click('[data-action="garden-star"]');
    assert.equal(await text("#star-count"), "3");
    assert.equal(await text("#mission-count"), "3 / 3");
    await click('[data-modal-action="next-level"]');
    assert.match(await text("#level-title"), /饼干/);
  });

  await t.test("level four: unique Sudoku, fixed clues, mistakes, hints and completion", async () => {
    assert.equal(await evaluate('document.querySelector(".cookie-grid") !== null'), true, "The board does not require an arbitrary door key");
    const cookieLayout = await evaluate(`(() => {
      const rect = selector => {
        const {x, width, height} = document.querySelector(selector).getBoundingClientRect();
        return {x, width, height};
      };
      return {
        workbench: rect(".cookie-workbench"),
        board: rect(".cookie-grid"),
        controls: rect(".cookie-controls"),
        palette: rect(".cookie-palette"),
        hint: rect(".cookie-controls .hint-button"),
        controlsColumns: getComputedStyle(document.querySelector(".cookie-controls")).gridTemplateColumns
      };
    })()`);
    assert.ok(cookieLayout.controls.width >= 170, `Cookie controls must retain readable width: ${JSON.stringify(cookieLayout)}`);
    assert.ok(cookieLayout.palette.width >= 150, `Cookie choices must not collapse: ${JSON.stringify(cookieLayout)}`);
    assert.ok(cookieLayout.hint.width >= 160 && cookieLayout.hint.height < 90, `Hint button must use the full controls column: ${JSON.stringify(cookieLayout)}`);
    assert.equal(cookieLayout.controlsColumns.split(" ").length, 1, "Inherited companion-panel grid placement must not create implicit narrow columns");
    await click("#tool-shrink");
    await click('[data-cell="1"]');
    assert.equal(await evaluate('document.querySelectorAll(".cookie-inspection section").length'), 3);
    assert.equal(await evaluate('document.querySelectorAll(".cookie-inspection .here").length'), 3);
    assert.doesNotMatch(await text("#modal-content"), /可以放|答案是/);
    assert.equal(await evaluate('document.querySelector("#modal").scrollWidth <= document.querySelector("#modal").clientWidth'), true);
    await screenshot("14-bakery-inspection-mobile.png");
    await click('[data-modal-action="close"]');
    await click("#tool-shrink");
    assert.equal(await text("#mission-count"), "1 / 3");
    const solution = [0, 1, 2, 3, 2, 3, 0, 1, 1, 0, 3, 2, 3, 2, 1, 0];
    const givens = await evaluate('Array.from(document.querySelectorAll(".cookie-cell")).map(e => e.disabled ? ["叶子","太阳","星星","月亮"].findIndex(name => e.getAttribute("aria-label").includes(name)) : null)');
    assert.equal(givens.filter((value) => value !== null).length, 5, "Five balanced clues leave eleven cells to infer");
    for (let row = 0; row < 4; row++) assert.ok(givens.slice(row * 4, row * 4 + 4).filter((value) => value !== null).length <= 2, "No row can be solved by copying a nearly full row");
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
    assert.match(await text("#toast"), /高处/);
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
    assert.equal(await text("#mission-count"), "1 / 3");
    assert.equal(await text("#star-count"), "4");
    await click("#level-three");
    assert.equal(await evaluate('document.querySelectorAll(".garden-object.found").length'), 0);
  });

  const extraClick = (action, value) => click(`[data-extra="${action}"]${value === undefined ? "" : `[data-value="${value}"]`}`);
  const enterExtra = async (id, tool, screenshotName) => {
    await click(`#level-${id}`);
    assert.equal(await text("#mission-count"), "0 / 3");
    assert.doesNotMatch(await text("#friend-message"), /先选.{0,8}道具|再借一个道具/);
    await click('[data-action="extra-entry"]');
    assert.equal(await text("#mission-count"), "1 / 3");
    assert.equal(await evaluate('document.querySelector(".world-map").open'), false, "Choosing a level returns to the game, not a wall of level buttons");
    assert.equal(await evaluate('document.querySelector(".canvas-rules")?.open || false'), false, "Long instructions are available on demand");
    assert.equal(await evaluate('document.querySelector(".gadget-effect") === null'), true, "Entering a puzzle must not pretend a gadget has done magic");
    await viewport(320, 740);
    assert.equal(await evaluate("document.documentElement.scrollWidth <= innerWidth"), true, `${id} must fit a 320px phone`);
    await delay(1750);
    await screenshot(screenshotName);
  };
  const finishExtra = async (tool, count) => {
    assert.equal(await text("#mission-count"), "2 / 3");
    assert.equal(await text("#star-count"), String(count - 1));
    assert.doesNotMatch(await text('[data-action="extra-finish"]'), /道具|修补笔|飞行帽/);
    await click(`#tool-${tool}`);
    await click('[data-action="extra-finish"]');
    assert.equal(await text("#star-count"), String(count));
    assert.doesNotMatch(await text("#modal-content"), /undefined/);
    await click("#modal-close");
  };

  await t.test("level five: infer fruit weights, recover from wrong baskets and deliver by bridge", async () => {
    assert.equal(await evaluate('document.querySelector("#level-six").disabled'), false);
    await enterExtra("five", "scope", "18-picnic-mobile.png");
    const baskets = [];
    for (let a = 0; a < 3; a++) for (let b = 0; b < 3; b++) for (let c = 0; c < 3; c++) {
      if ([2, 3, 5][a] + [2, 3, 5][b] + [2, 3, 5][c] === 7) baskets.push([a, b, c].sort().join(""));
    }
    assert.deepEqual([...new Set(baskets)], ["001"], "Only two apples and one pear meet both basket constraints");
    await extraClick("check");
    assert.match(await text("#extra-feedback"), /三只/);
    for (let i = 0; i < 3; i++) await extraClick("fruit", 2);
    await extraClick("fruit", 0);
    assert.match(await text("#extra-feedback"), /已经有三只/);
    await extraClick("check");
    assert.match(await text("#extra-feedback"), /15/);
    assert.equal(await text("#mission-count"), "1 / 3");
    for (let i = 0; i < 3; i++) await extraClick("undo");
    await extraClick("hint");
    assert.match(await text("#extra-feedback"), /苹果/);
    for (const id of [0, 0, 1]) await extraClick("fruit", id);
    await extraClick("check");
    await finishExtra("bridge", 5);
    assert.equal(await evaluate('document.querySelector("#level-six").disabled'), false);
  });

  await t.test("level six: rotate pipes, reject leaks and connect all nine flowerbeds", async () => {
    await enterExtra("six", "shrink", "19-water-pipes-mobile.png");
    const assertPorts = async () => {
      const positions = await evaluate(`(() => {
        const rect = s => { const r = document.querySelector(s).getBoundingClientRect(); return {x:r.x,y:r.y,w:r.width,h:r.height}; };
        return { inlet:rect(".water-inlet"), outlet:rect(".water-outlet"), first:rect('[data-extra="pipe"][data-value="0"]'), last:rect('[data-extra="pipe"][data-value="8"]') };
      })()`);
      assert.ok(Math.abs(positions.inlet.y + positions.inlet.h / 2 - positions.first.y - positions.first.h / 2) < 3, "Water source aligns with the first pipe, not a detached header");
      assert.ok(Math.abs(positions.outlet.y + positions.outlet.h / 2 - positions.last.y - positions.last.h / 2) < 3, "Duck aligns with the final pipe outlet");
      assert.ok(positions.inlet.x < positions.first.x && positions.outlet.x >= positions.last.x + positions.last.w - 1);
    };
    await assertPorts();
    await extraClick("check");
    assert.match(await text("#extra-feedback"), /接口|漏/);
    assert.equal(await text("#mission-count"), "1 / 3");
    const initial = [1, 1, 0, 0, 1, 1, 2, 1, 1];
    const solution = [0, 0, 2, 1, 0, 3, 0, 0, 0];
    for (let i = 0; i < 9; i++) {
      for (let turn = 0; turn < (solution[i] - initial[i] + 4) % 4; turn++) await extraClick("pipe", i);
    }
    await viewport(1440, 1050);
    await assertPorts();
    await screenshot("20-water-pipes-desktop.png");
    await extraClick("pipe", 8);
    await extraClick("check");
    assert.equal(await text("#mission-count"), "1 / 3", "A disconnected outlet cannot pass");
    for (let turn = 0; turn < 3; turn++) await extraClick("pipe", 8);
    await extraClick("check");
    assert.equal(await evaluate('document.querySelectorAll(".water-running .water-fill").length'), 9);
    await viewport(390, 844);
    await delay(1450);
    await screenshot("26-water-flow-mobile.png");
    await send("Emulation.setEmulatedMedia", { features: [{ name: "prefers-reduced-motion", value: "reduce" }] });
    assert.equal(await evaluate('getComputedStyle(document.querySelector(".water-fill")).animationName'), "none");
    await send("Emulation.setEmulatedMedia", { features: [{ name: "prefers-reduced-motion", value: "no-preference" }] });
    await finishExtra("fly", 6);
  });

  await t.test("level seven: plan safe crossings, reject unattended pairs and undo safely", async () => {
    await enterExtra("seven", "scope", "21-ferry-mobile.png");
    assert.match(await text(".ferry-rules"), /最多一位朋友/);
    assert.equal(await evaluate('document.querySelector(".ferry-rules").closest("details") === null'), true, "Capacity and safety rules must be visible without opening hints");
    await extraClick("passenger", 0);
    await extraClick("passenger", 2);
    assert.equal(await evaluate('document.querySelectorAll("[data-extra=passenger][aria-pressed=true]").length'), 1, "Selecting another passenger replaces, rather than adds, a passenger");
    assert.match(await text("#extra-feedback"), /这次带萝卜/);
    await extraClick("passenger", 0);
    await extraClick("cross");
    assert.match(await text("#extra-feedback"), /闹起来/);
    assert.match(await text(".extra-puzzle"), /已经飞了 0 次/);
    await extraClick("passenger", 2);
    await extraClick("cross");
    assert.match(await text("#extra-feedback"), /闹起来/);
    await extraClick("passenger", 1);
    await extraClick("cross");
    assert.match(await text(".river-banks section:nth-child(2)"), /兔子/);
    assert.equal(await evaluate('Boolean(document.querySelector(".gadget-fly"))'), true, "A safe trip animates the hat without a tool-selection chore");
    await extraClick("undo");
    assert.match(await text(".river-banks section:first-child"), /兔子/);
    assert.match(await text(".extra-puzzle"), /已经飞了 0 次/);
    for (const passenger of [1, null, 0, 1, 2, null, 1]) {
      if (passenger === null) await extraClick("alone");
      else await extraClick("passenger", passenger);
      await extraClick("cross");
    }
    assert.equal(await text("#star-count"), "7", "Getting everyone across completes the story without an unrelated bridge task");
    assert.match(await text("#modal-title"), /做到了/);
    await click("#modal-close");
  });

  await t.test("level eight: visual echo score, replay, wrong notes, undo and silent play", async () => {
    await enterExtra("eight", "fly", "22-echo-mobile.png");
    await extraClick("check");
    assert.match(await text("#extra-feedback"), /六声/);
    await extraClick("score");
    assert.equal(await evaluate('document.querySelectorAll(".echo-score li").length'), 6);
    await screenshot("23-echo-score-mobile.png");
    await click('[data-modal-action="close"]');
    await extraClick("note", 1);
    await extraClick("score");
    await click('[data-modal-action="close"]');
    assert.match(await text(".basket"), /1 \/ 6/, "Looking again preserves played notes");
    await extraClick("undo");
    for (let i = 0; i < 6; i++) await extraClick("note", 0);
    await extraClick("note", 2);
    assert.match(await text("#extra-feedback"), /六声都/);
    await extraClick("check");
    assert.match(await text("#extra-feedback"), /第 1 声/);
    assert.equal(await text("#mission-count"), "1 / 3");
    for (let i = 0; i < 6; i++) await extraClick("undo");
    for (const note of [1, 0, 2, 1, 3, 0]) await extraClick("note", note);
    await extraClick("check");
    await finishExtra("shrink", 8);
  });

  await t.test("level nine: spatial addresses, moving deliveries, final collection and save compatibility", async () => {
    await enterExtra("nine", "scope", "24-post-office-mobile.png");
    await extraClick("check");
    assert.match(await text("#extra-feedback"), /还有信/);
    await extraClick("house", 1);
    await extraClick("letter", 1);
    await extraClick("house", 1);
    assert.doesNotMatch(await text('[data-extra="letter"][data-value="0"]'), /✓/, "Reassigning a home displaces the previous letter");
    for (let i = 0; i < 5; i++) {
      await extraClick("letter", i);
      await extraClick("house", [1, 3, 5, 7, 6][i]);
    }
    await extraClick("check");
    assert.match(await text("#extra-feedback"), /叶子信/);
    assert.equal(await text("#mission-count"), "1 / 3");
    await extraClick("house", 8);
    await viewport(390, 844);
    assert.equal(await evaluate("document.documentElement.scrollWidth <= innerWidth"), true);
    await screenshot("25-post-office-filled-mobile.png");
    await extraClick("check");
    await finishExtra("fly", 9);
    await click('[data-action="extra-collection"]');
    assert.equal(await evaluate('document.querySelectorAll(".collection-star.earned").length'), 9);
    assert.match(await text("#modal-content"), /9 \/ 20/);
    await click("#modal-close");
    await navigate();
    assert.match(await text("#level-title"), /来信/);
    assert.equal(await text("#star-count"), "9");
    assert.equal(await text("#mission-count"), "0 / 3", "Stars persist while partial puzzle state restarts");
    await click("#level-one");
    assert.equal(await text("#star-count"), "9");
  });

  const expeditionCases = [
    { number: 10, entry: "magnet", finish: "repair", solve: async () => {
      await extraClick("pick", 4);
      await extraClick("check");
      assert.match(await text("#extra-feedback"), /木头/);
      await extraClick("reset");
      for (const id of [0, 1, 2]) await extraClick("pick", id);
    } },
    { number: 11, entry: "time", finish: "umbrella", solve: async () => {
      await extraClick("pick", 3);
      await extraClick("pick", 3);
      assert.match(await text("#extra-feedback"), /已经安排/);
      await extraClick("undo");
      for (const id of [3, 1, 4, 2, 0]) await extraClick("pick", id);
    } },
    { number: 12, entry: "umbrella", finish: "fly", solve: async () => {
      const before = await evaluate('Array.from(document.querySelectorAll(".weather-switches button")).map(e => e.getAttribute("aria-pressed"))');
      await extraClick("pick", 2);
      const after = await evaluate('Array.from(document.querySelectorAll(".weather-switches button")).map(e => e.getAttribute("aria-pressed"))');
      assert.deepEqual(after.map((value, i) => value !== before[i]), [false, true, true, true, false], "A weather switch changes itself and adjacent clouds");
      await extraClick("undo");
      for (const id of [0, 2, 4]) await extraClick("pick", id);
    } },
    { number: 13, entry: "translate", finish: "shrink", solve: async () => {
      await extraClick("place", 0);
      assert.match(await text("#extra-feedback"), /先选/);
      await extraClick("select", 2);
      await extraClick("place", 0);
      await extraClick("place", 1);
      assert.match(await text('[data-extra="place"][data-value="0"]'), /点我送/);
      await extraClick("reset");
      for (const [animal, meal] of [2, 0, 3, 1].entries()) {
        await extraClick("select", meal);
        await extraClick("place", animal);
      }
    } },
    { number: 14, entry: "copy", finish: "bridge", solve: async () => {
      await extraClick("pick", 0);
      await extraClick("pick", 0);
      await extraClick("pick", 0);
      await extraClick("pick", 1);
      assert.match(await text("#extra-feedback"), /只用三次/);
      await extraClick("check");
      assert.equal(await text("#mission-count"), "1 / 3");
      await extraClick("reset");
      for (const id of [0, 1, 2]) await extraClick("pick", id);
    } },
    { number: 15, entry: "repair", finish: "scope", solve: async () => {
      const before = await evaluate('Array.from(document.querySelectorAll(".slide-board button")).map(e=>e.dataset.tile)');
      await extraClick("pick", 8);
      assert.match(await text("#extra-feedback"), /紧挨空位/);
      assert.deepEqual(await evaluate('Array.from(document.querySelectorAll(".slide-board button")).map(e=>e.dataset.tile)'), before);
      for (const id of [4, 3, 6, 7, 8]) await extraClick("pick", id);
      assert.deepEqual(await evaluate('Array.from(document.querySelectorAll(".slide-board button")).map(e=>Number(e.dataset.tile))'), [0, 1, 2, 3, 4, 5, 6, 7, 8]);
    } },
    { number: 16, entry: "scope", finish: "repair", solve: async () => {
      await extraClick("pick", 2);
      await extraClick("check");
      assert.match(await text("#extra-feedback"), /照镜子/);
      await extraClick("undo");
      for (const id of [3, 6, 10, 11, 14]) await extraClick("pick", id);
    } },
    { number: 17, entry: "fly", finish: "translate", solve: async () => {
      for (const dir of [1, 1, 1, 2, 2, 2]) await extraClick("pick", dir);
      await extraClick("check");
      assert.match(await text("#extra-feedback"), /第 2 步碰到石头/);
      await extraClick("reset");
      for (const dir of [1, 2, 2, 1, 2, 1]) await extraClick("pick", dir);
    } },
    { number: 18, entry: "scope", finish: "repair", solve: async () => {
      const pattern = [0, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 0, 0, 1, 0, 0];
      assert.match(await text(".window-guide"), /正好有两格星星挨在一起/);
      assert.match(await text(".window-example-cells"), /⭐ ⭐/);
      assert.match(await text(".window-directions"), /左边数字管每一排；上面数字管每一列/);
      assert.match(await text(".window-toggle-help"), /点空格让星星亮起/);
      assert.equal(await evaluate('document.querySelectorAll(".window-board [data-extra=\\"pick\\"][aria-label]").length'), 16, "Every square tells the child its row, column and current state");
      assert.deepEqual(await evaluate('Array.from(document.querySelectorAll("[data-tool]")).map(button => button.dataset.tool)'), ["scope", "repair"], "Only gadgets with a real role in this puzzle are offered");
      await screenshot("58-star-window-rules-mobile.png");
      await click("#tool-scope");
      await extraClick("window-clue", 0);
      assert.match(await text("#modal-title"), /第 1 列/);
      assert.equal(await evaluate('document.querySelectorAll(".window-zoom-line span").length'), 4);
      assert.equal(await evaluate('document.querySelectorAll(".window-zoom-line span").length && document.querySelector(".window-zoom-line").textContent.includes("⭐")'), false, "Magnification clarifies the clue without revealing the answer");
      assert.equal(await text("#mission-count"), "1 / 3");
      await click('[data-modal-action="close"]');
      await extraClick("hint");
      assert.match(await text("#extra-feedback"), /第二排和第二列/);
      await extraClick("hint");
      assert.match(await text("#extra-feedback"), /最下面一排/);
      await extraClick("hint");
      assert.match(await text("#extra-feedback"), /⭐ ⭐ ⭐ ⭐/);
      const runs = (line) => line.join("").split("0").filter(Boolean).map(s => s.length).join(",");
      const clues = (board) => [
        ...[0, 1, 2, 3].map(row => runs(board.slice(row * 4, row * 4 + 4))),
        ...[0, 1, 2, 3].map(col => runs(board.filter((_, i) => i % 4 === col)))
      ].join("|");
      const target = clues(pattern);
      let solutions = 0;
      for (let bits = 0; bits < 65536; bits++) if (clues(Array.from({ length: 16 }, (_, i) => (bits >> i) & 1)) === target) solutions++;
      assert.equal(solutions, 1, "The window's row and column clues determine one drawing, not an arbitrary hidden answer");
      for (let i = 0; i < pattern.length; i++) if (pattern[i]) await extraClick("pick", i);
    } },
    { number: 19, entry: "time", finish: "umbrella", solve: async () => {
      await extraClick("pick", 0);
      assert.match(await text("#extra-feedback"), /不能这样跳/);
      for (const id of [1, 3, 4, 2, 0, 1, 3, 2]) await extraClick("pick", id);
    } },
    { number: 20, entry: "translate", finish: "fly", solve: async () => {
      for (const id of [9, 4, 1, 6]) await extraClick("pick", id);
      await extraClick("check");
      assert.equal(await text("#mission-count"), "1 / 3", "Repairing before removing the nail cannot pass");
      await extraClick("reset");
      for (const id of [4, 9, 1, 6]) await extraClick("pick", id);
    } }
  ];
  for (const adventure of expeditionCases) {
    await t.test(`level ${adventure.number}: gadget story, unique mechanics, mistakes, undo and completion`, async () => {
      await enterExtra(adventure.number, adventure.entry, `${adventure.number + 20}-new-adventure-mobile.png`);
      assert.equal(await evaluate('document.querySelectorAll("[data-tool]").length'), adventure.number === 18 ? 2 : 10);
      assert.equal(await evaluate('document.querySelectorAll(".level-tab").length'), 20);
      assert.equal(await evaluate(`(() => {
        const style = getComputedStyle(document.querySelector('[data-extra="check"]'));
        const luminance = color => {
          const channels = color.match(/\\d+/g).slice(0, 3).map(Number).map(value => value / 255).map(value => value <= .04045 ? value / 12.92 : ((value + .055) / 1.055) ** 2.4);
          return channels[0] * .2126 + channels[1] * .7152 + channels[2] * .0722;
        };
        const a = luminance(style.color), b = luminance(style.backgroundColor);
        return (Math.max(a, b) + .05) / (Math.min(a, b) + .05) >= 3;
      })()`), true, "The primary check button stays legible instead of inheriting the pale option background");
      if (adventure.number < 20) assert.equal(await evaluate(`document.querySelector("#level-${adventure.number + 1}").disabled`), false);
      await extraClick("check");
      assert.equal(await text("#mission-count"), "1 / 3", "An untouched puzzle cannot pass");
      if (adventure.number !== 18) {
        await extraClick("hint");
        assert.ok((await text("#extra-feedback")).length > 15);
      }
      await adventure.solve();
      await extraClick("check");
      if (adventure.number === 18) {
        await click("#tool-scope");
        await click('[data-action="extra-finish"]');
        assert.match(await text("#toast"), /碎开的地方还松着/);
        assert.equal(await text("#mission-count"), "2 / 3", "An unrelated gadget cannot repair the window");
      }
      if ([15, 18, 19, 20].includes(adventure.number)) {
        await viewport(1440, 1050);
        assert.equal(await evaluate("document.documentElement.scrollWidth <= innerWidth"), true);
        await screenshot(`${adventure.number + 40}-solved-desktop.png`);
      }
      await finishExtra(adventure.finish, adventure.number);
    });
  }
  await t.test("all twenty stars persist and all ten gadget previews animate without changing progress", async () => {
    await click("#collection-button");
    assert.equal(await evaluate('document.querySelectorAll(".collection-star.earned").length'), 20);
    assert.match(await text("#modal-content"), /20 \/ 20/);
    await click("#modal-close");
    await navigate();
    assert.equal(await text("#star-count"), "20");
    assert.match(await text("#level-title"), /大救援/);
    const tools = await evaluate('Array.from(document.querySelectorAll("[data-tool]")).map(e=>e.dataset.tool)');
    for (const id of tools) {
      await click(`#tool-${id}`);
      await click("#preview-effect");
      assert.equal(await evaluate(`Boolean(document.querySelector(".gadget-${id}"))`), true);
      if (["magnet", "time", "umbrella", "translate", "copy", "repair"].includes(id)) assert.notEqual(await evaluate(`getComputedStyle(document.querySelector(".new-tool-${id}")).animationName`), "none");
      assert.doesNotMatch(await text(".gadget-effect"), /undefined/);
      assert.equal(await text("#mission-count"), "0 / 3", "A preview cannot solve a puzzle");
    }
    await click("#restart-button");
    assert.equal(await evaluate('document.querySelector(".gadget-effect") === null'), true);
  });

  await t.test("game-first layout: on-demand map, rules, dialogue and scrollable gadget pocket", async () => {
    await viewport(390, 844);
    await click("#level-17");
    await click("#tool-fly");
    await click('[data-action="extra-entry"]');
    await delay(1750);
    assert.equal(await evaluate('document.querySelector(".canvas-rules").open'), false);
    await click(".canvas-rules summary");
    assert.equal(await evaluate('document.querySelector(".canvas-rules").open'), true);
    assert.match(await text(".canvas-rules"), /六步/);
    await extraClick("pick", 1);
    assert.equal(await evaluate('document.querySelector(".canvas-rules").open'), true, "Interacting preserves an intentionally expanded explanation");
    await click(".canvas-rules summary");
    await click("#expand-friend");
    assert.equal(await evaluate('document.querySelector("#expand-friend").getAttribute("aria-expanded")'), "true");
    await click("#expand-friend");
    assert.equal(await evaluate('document.querySelector("#tools").scrollWidth > document.querySelector("#tools").clientWidth'), true, "Gadgets are a single swipeable pocket, not a tall table");
    assert.equal(await evaluate('getComputedStyle(document.querySelector("#tools")).display'), "flex");
    const height = await evaluate('document.querySelector(".game-card").getBoundingClientRect().height');
    await screenshot("70-canvas-robot-mobile.png");
    const sizes = await evaluate('Object.fromEntries([".scene-heading","#scene",".extra-puzzle",".companion-panel",".canvas-rules",".flight-map",".plan-slots",".scene-story",".new-scene-banner"].map(s=>[s,document.querySelector(s)?.getBoundingClientRect().height]))');
    assert.ok(height < 850, `A mobile puzzle should not become a multi-screen document (${height}px) ${JSON.stringify(sizes)}`);
    await viewport(1440, 1050);
    await screenshot("71-canvas-robot-desktop.png");
    assert.ok(await evaluate('document.querySelector("#scene").getBoundingClientRect().height < 650'), "Desktop layout places the controls beside the board instead of stacking a long worksheet");
    await click("#level-one");
    await screenshot("72-canvas-forest-desktop.png");
    await viewport(390, 844);
    await screenshot("73-canvas-forest-mobile.png");
    assert.equal(await evaluate('document.querySelector("#scene").getBoundingClientRect().top < 200'), true, "The game scene is visible immediately, without scrolling past a title and twenty levels");
    assert.equal(await evaluate("document.documentElement.scrollWidth <= innerWidth"), true);
  });

  await t.test("free selection from a fresh save and nonsequential stars survive reload", async () => {
    await evaluate('localStorage.clear()');
    await navigate();
    assert.equal(await evaluate('document.querySelectorAll(".level-tab:disabled").length'), 0);
    for (const id of ["20", "six", "13", "one"]) {
      await click(`#level-${id}`);
      assert.equal(await text("#star-count"), "0", "Selecting any level cannot award stars");
      assert.equal(await evaluate('document.querySelector(".world-map").open'), false);
    }
    await click("#level-20");
    await click("#tool-translate");
    await click('[data-action="extra-entry"]');
    for (const id of [4, 9, 1, 6]) await extraClick("pick", id);
    await extraClick("check");
    await finishExtra("fly", 1);
    await navigate();
    assert.match(await text("#level-title"), /大救援/);
    assert.equal(await text("#star-count"), "1");
    assert.deepEqual(await evaluate('JSON.parse(localStorage.getItem("little-pocket-adventure-v1")).completed'), [20]);
    await click("#collection-button");
    assert.equal(await evaluate('document.querySelectorAll(".collection-star.earned").length'), 1);
    await click("#modal-close");
  });

  await t.test("old two-star progress is preserved while all other levels are selectable", async () => {
    await evaluate('localStorage.setItem("little-pocket-adventure-v1", JSON.stringify({completed:[1,2],level:2,sound:false}))');
    await navigate();
    assert.equal(await text("#star-count"), "2");
    assert.equal(await evaluate('document.querySelector("#level-three").disabled'), false);
    assert.equal(await evaluate('document.querySelector("#level-four").disabled'), false);
  });

  await t.test("gadget effects clean up and reduced motion preserves instant progress", async () => {
    await click("#level-one");
    await click("#tool-scope");
    await click("#hotspot-sign");
    assert.equal(await evaluate('Boolean(document.querySelector("#modal .gadget-scope"))'), true, "Effect remains visible above native dialog");
    await delay(1800);
    assert.equal(await evaluate('document.querySelector(".gadget-effect") === null'), true);
    await click("#modal-close");
    await click("#restart-button");
    await send("Emulation.setEmulatedMedia", { features: [{ name: "prefers-reduced-motion", value: "reduce" }] });
    await click("#tool-scope");
    await click("#hotspot-sign");
    assert.equal(await text("#mission-count"), "1 / 3");
    assert.equal(await evaluate('document.querySelector(".gadget-effect") === null'), true);
    await click("#modal-close");
    assert.match(await text("#effects-status"), /系统设置/);
    await click("#effects-button");
    assert.equal(await evaluate('Boolean(document.querySelector(".gadget-scope"))'), true, "Explicit opt-in previews even with reduced-motion system preference");
    assert.notEqual(await evaluate('getComputedStyle(document.querySelector(".scope-lens")).animationName'), "none");
    await click("#tool-shrink");
    await click("#preview-effect");
    assert.equal(await evaluate('Boolean(document.querySelector(".gadget-shrink"))'), true);
    await navigate();
    assert.equal(await evaluate('document.querySelector("#effects-button").getAttribute("aria-pressed")'), "true", "Animation preference survives reload");
    await click("#effects-button");
    assert.equal(await evaluate('document.querySelector(".gadget-effect") === null'), true);
    await click("#preview-effect");
    assert.match(await text("#toast"), /已关闭/);
    await send("Emulation.setEmulatedMedia", { features: [{ name: "prefers-reduced-motion", value: "no-preference" }] });
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
