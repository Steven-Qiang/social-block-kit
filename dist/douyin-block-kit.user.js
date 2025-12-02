// ==UserScript==
// @name         抖音搜索自动拉黑
// @namespace    douyin-block-kit
// @version      1.0.0
// @author       Steven-Qiang
// @description  基于关键词搜索用户并批量拉黑的抖音油猴脚本
// @license      MIT
// @icon         🚫
// @source       https://github.com/Steven-Qiang/douyin-block-kit
// @match        https://www.douyin.com/*
// @require      https://cdn.jsdelivr.net/npm/vue@3.5.25/dist/vue.global.prod.js
// @grant        GM_addStyle
// ==/UserScript==

(function (vue) {
  'use strict';

  const d=new Set;const o = async e=>{d.has(e)||(d.add(e),(t=>{typeof GM_addStyle=="function"?GM_addStyle(t):(document.head||document.documentElement).appendChild(document.createElement("style")).append(t);})(e));};

  o(" .panel[data-v-90b47026]{position:fixed;width:280px;background:#fff;border-radius:8px;box-shadow:0 2px 12px #00000026;z-index:999999;font-family:Arial,sans-serif}.header[data-v-90b47026]{background:linear-gradient(135deg,#667eea,#764ba2);color:#fff;padding:12px 16px;border-radius:8px 8px 0 0;font-weight:700;cursor:move;-webkit-user-select:none;user-select:none}.content[data-v-90b47026]{padding:16px}.form-group[data-v-90b47026]{margin-bottom:12px}label[data-v-90b47026]{display:block;margin-bottom:4px;font-size:13px;color:#333}input[type=text][data-v-90b47026],input[type=number][data-v-90b47026]{width:100%;padding:8px;border:1px solid #ddd;border-radius:4px;box-sizing:border-box;font-size:13px}input[data-v-90b47026]:disabled{background:#f5f5f5;cursor:not-allowed}button[data-v-90b47026]{width:100%;padding:10px;border:none;border-radius:4px;cursor:pointer;font-size:14px;font-weight:700}.btn-start[data-v-90b47026]{background:#667eea;color:#fff}.btn-start[data-v-90b47026]:disabled{background:#ccc;cursor:not-allowed}.btn-stop[data-v-90b47026]{background:#ff5722;color:#fff}.btn-stop[data-v-90b47026]:disabled{background:#ccc;cursor:not-allowed}.log-area[data-v-90b47026]{padding:10px;background:#f5f5f5;border-radius:4px;font-size:12px;color:#666;min-height:60px;max-height:150px;overflow-y:auto}.log-empty[data-v-90b47026]{color:#999}.log-item[data-v-90b47026]{margin-bottom:4px}.counter[data-v-90b47026]{margin-top:8px;font-size:12px;color:#999;text-align:center}.count[data-v-90b47026]{color:#667eea;font-weight:700} ");

  async function searchUsers(keyword, page) {
    const offset = page * 10;
    const searchParams = `device_platform=webapp&aid=6383&channel=channel_pc_web&search_channel=aweme_user_web&search_source=normal_search&query_correct_type=1&is_filter_search=0&disable_rs=0&offset=${offset}&count=10&keyword=${encodeURIComponent(keyword)}&need_filter_settings=1&list_type=single&pc_search_top_1_params={"enable_ai_search_top_1":1}&update_version_code=170400&pc_client_type=1&pc_libra_divert=Windows&support_h265=1&support_dash=1&cpu_core_num=16&version_code=170400&version_name=17.4.0&cookie_enabled=true&screen_width=${window.screen.width}&screen_height=${window.screen.height}&browser_language=${navigator.language}&browser_platform=${navigator.platform}&browser_name=${navigator.appName}&browser_version=${navigator.appVersion}&browser_online=${navigator.onLine}&engine_name=Blink&engine_version=142.0.0.0&os_name=Windows&os_version=10&device_memory=8&platform=PC&downlink=10&effective_type=4g&round_trip_time=50`;
    const res = await fetch(`https://www.douyin.com/aweme/v1/web/discover/search/?${searchParams}`, {
      method: "GET",
      headers: { accept: "application/json, text/plain, */*" },
      credentials: "include"
    });
    const data = await res.json();
    return {
      users: data.user_list || [],
      hasMore: data.has_more === 1
    };
  }
  async function blockUser(user) {
    const blockUrlParams = `device_platform=webapp&aid=6383&channel=channel_pc_web&pc_client_type=1&pc_libra_divert=Windows&update_version_code=170400&support_h265=1&support_dash=1&version_code=170400&version_name=17.4.0&cookie_enabled=true&screen_width=2560&screen_height=1440&browser_language=zh-CN&browser_platform=Win32&browser_name=Chrome&browser_version=142.0.0.0&browser_online=true&engine_name=Blink&engine_version=142.0.0.0&os_name=Windows&os_version=10&cpu_core_num=16&device_memory=8&platform=PC&downlink=10&effective_type=4g&round_trip_time=50`;
    const blockBody = `block_type=1&source=0&user_id=${user.uid}&sec_user_id=${user.sec_uid}`;
    const res = await fetch(`https://www-hj.douyin.com/aweme/v1/web/user/block/?${blockUrlParams}`, {
      method: "POST",
      headers: {
        "accept": "application/json, text/plain, */*",
        "content-type": "application/x-www-form-urlencoded; charset=UTF-8",
        "referrer": "https://www.douyin.com/"
      },
      body: blockBody,
      credentials: "include"
    });
    const data = await res.json();
    return data.status_code === 0;
  }
  const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
  const _hoisted_1 = { class: "content" };
  const _hoisted_2 = { class: "form-group" };
  const _hoisted_3 = ["disabled"];
  const _hoisted_4 = { class: "form-group" };
  const _hoisted_5 = ["disabled"];
  const _hoisted_6 = { class: "form-group" };
  const _hoisted_7 = ["disabled"];
  const _hoisted_8 = { class: "form-group" };
  const _hoisted_9 = ["disabled"];
  const _hoisted_10 = { class: "log-area" };
  const _hoisted_11 = {
    key: 0,
    class: "log-empty"
  };
  const _hoisted_12 = { class: "counter" };
  const _hoisted_13 = { class: "count" };
  const delay = 1e3;
  const _sfc_main = vue.defineComponent({
    __name: "App",
    setup(__props) {
      const keyword = vue.ref("");
      const limit = vue.ref(10);
      const isRunning = vue.ref(false);
      const isStopped = vue.ref(false);
      const blockedCount = vue.ref(0);
      const logs = vue.ref([]);
      function addLog(msg, color = "#333") {
        const time = ( new Date()).toLocaleTimeString();
        logs.value.push({ msg, color, time });
      }
      async function startTask() {
        if (!keyword.value.trim()) {
          alert("请输入搜索关键词！");
          return;
        }
        isRunning.value = true;
        isStopped.value = false;
        let currentPage = 0;
        blockedCount.value = 0;
        logs.value = [];
        addLog(`开始搜索「${keyword.value}」，目标拉黑 ${limit.value} 个用户`, "#667eea");
        while (!isStopped.value && blockedCount.value < limit.value) {
          addLog(`获取第 ${currentPage + 1} 页用户...`, "#2196F3");
          const { users, hasMore } = await searchUsers(keyword.value, currentPage);
          if (users.length === 0) {
            addLog("无更多用户，任务结束", "#ff9800");
            break;
          }
          for (const item of users) {
            if (blockedCount.value >= limit.value || isStopped.value)
              break;
            const user = {
              nickname: item.user_info.nickname,
              uid: item.user_info.uid,
              sec_uid: item.user_info.sec_uid
            };
            if (item.user_info.user_tags?.some((tag) => tag.type === "blocked_label")) {
              addLog(`已拉黑：${user.nickname}（跳过）`, "#999");
              continue;
            }
            if (await blockUser(user)) {
              blockedCount.value++;
              addLog(`✅ 拉黑成功：${user.nickname}`, "#4caf50");
            } else {
              addLog(`❌ 拉黑失败：${user.nickname}`, "#ff5722");
            }
            await sleep(delay);
          }
          if (!hasMore)
            break;
          currentPage++;
          await sleep(delay * 2);
        }
        addLog(`任务结束！成功拉黑 ${blockedCount.value} 个用户`, "#667eea");
        isRunning.value = false;
      }
      function stopTask() {
        isStopped.value = true;
        addLog("任务已停止", "#ff5722");
      }
      const isDragging = vue.ref(false);
      const startX = vue.ref(0);
      const startY = vue.ref(0);
      const panelX = vue.ref(window.innerWidth - 300);
      const panelY = vue.ref(20);
      function handleMouseDown(e) {
        isDragging.value = true;
        startX.value = e.clientX - panelX.value;
        startY.value = e.clientY - panelY.value;
      }
      function handleMouseMove(e) {
        if (isDragging.value) {
          panelX.value = e.clientX - startX.value;
          panelY.value = e.clientY - startY.value;
        }
      }
      function handleMouseUp() {
        isDragging.value = false;
      }
      vue.onMounted(() => {
        document.addEventListener("mousemove", handleMouseMove);
        document.addEventListener("mouseup", handleMouseUp);
      });
      vue.onUnmounted(() => {
        document.removeEventListener("mousemove", handleMouseMove);
        document.removeEventListener("mouseup", handleMouseUp);
      });
      return (_ctx, _cache) => {
        return vue.openBlock(), vue.createElementBlock("div", {
          class: "panel",
          style: vue.normalizeStyle({ top: `${panelY.value}px`, left: `${panelX.value}px` })
        }, [
          vue.createElementVNode("div", {
            class: "header",
            onMousedown: handleMouseDown
          }, " 🚫 抖音自动拉黑工具 ", 32),
          vue.createElementVNode("div", _hoisted_1, [
            vue.createElementVNode("div", _hoisted_2, [
              _cache[2] || (_cache[2] = vue.createElementVNode("label", null, "搜索关键词：", -1)),
              vue.withDirectives(vue.createElementVNode("input", {
                "onUpdate:modelValue": _cache[0] || (_cache[0] = ($event) => keyword.value = $event),
                type: "text",
                placeholder: "例如：新闻",
                disabled: isRunning.value
              }, null, 8, _hoisted_3), [
                [vue.vModelText, keyword.value]
              ])
            ]),
            vue.createElementVNode("div", _hoisted_4, [
              _cache[3] || (_cache[3] = vue.createElementVNode("label", null, "拉黑数量：", -1)),
              vue.withDirectives(vue.createElementVNode("input", {
                "onUpdate:modelValue": _cache[1] || (_cache[1] = ($event) => limit.value = $event),
                type: "number",
                min: "1",
                max: "50",
                disabled: isRunning.value
              }, null, 8, _hoisted_5), [
                [
                  vue.vModelText,
                  limit.value,
                  void 0,
                  { number: true }
                ]
              ])
            ]),
            vue.createElementVNode("div", _hoisted_6, [
              vue.createElementVNode("button", {
                class: "btn-start",
                disabled: isRunning.value,
                onClick: startTask
              }, " 开始拉黑 ", 8, _hoisted_7)
            ]),
            vue.createElementVNode("div", _hoisted_8, [
              vue.createElementVNode("button", {
                class: "btn-stop",
                disabled: !isRunning.value,
                onClick: stopTask
              }, " 停止任务 ", 8, _hoisted_9)
            ]),
            vue.createElementVNode("div", _hoisted_10, [
              logs.value.length === 0 ? (vue.openBlock(), vue.createElementBlock("div", _hoisted_11, " 等待开始... ")) : vue.createCommentVNode("", true),
              (vue.openBlock(true), vue.createElementBlock(vue.Fragment, null, vue.renderList(logs.value, (log, i) => {
                return vue.openBlock(), vue.createElementBlock("div", {
                  key: i,
                  class: "log-item",
                  style: vue.normalizeStyle({ color: log.color })
                }, " [" + vue.toDisplayString(log.time) + "] " + vue.toDisplayString(log.msg), 5);
              }), 128))
            ]),
            vue.createElementVNode("div", _hoisted_12, [
              _cache[4] || (_cache[4] = vue.createTextVNode(" 已拉黑：", -1)),
              vue.createElementVNode("span", _hoisted_13, vue.toDisplayString(blockedCount.value), 1),
              vue.createTextVNode(" / " + vue.toDisplayString(limit.value), 1)
            ])
          ])
        ], 4);
      };
    }
  });
  const _export_sfc = (sfc, props) => {
    const target = sfc.__vccOpts || sfc;
    for (const [key, val] of props) {
      target[key] = val;
    }
    return target;
  };
  const App = _export_sfc(_sfc_main, [["__scopeId", "data-v-90b47026"]]);
  const app = document.createElement("div");
  document.body.append(app);
  vue.createApp(App).mount(app);
  console.log("%c抖音自动拉黑工具已加载", "color: #667eea; font-size: 14px; font-weight: bold");

})(Vue);