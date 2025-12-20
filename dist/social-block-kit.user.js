// ==UserScript==
// @name         社交平台自动拉黑工具
// @namespace    social-block-kit
// @version      1.1.0
// @author       Steven-Qiang
// @description  基于关键词搜索用户并批量拉黑的多平台油猴脚本，支持抖音、哔哩哔哩等
// @license      MIT
// @source       https://github.com/Steven-Qiang/social-block-kit
// @match        https://www.douyin.com/*
// @match        https://www.bilibili.com/*
// @match        https://search.bilibili.com/*
// @require      https://cdn.jsdelivr.net/npm/vue@3.5.25/dist/vue.global.prod.js
// @grant        GM_addStyle
// ==/UserScript==

(function (vue) {
  'use strict';

  const d=new Set;const o = async e=>{d.has(e)||(d.add(e),(t=>{typeof GM_addStyle=="function"?GM_addStyle(t):(document.head||document.documentElement).appendChild(document.createElement("style")).append(t);})(e));};

  o(" .panel[data-v-8c0b1694]{position:fixed;width:280px;background:#fff;border-radius:8px;box-shadow:0 2px 12px #00000026;z-index:999999;font-family:Arial,sans-serif}.header[data-v-8c0b1694]{background:linear-gradient(135deg,#667eea,#764ba2);color:#fff;padding:12px 16px;border-radius:8px 8px 0 0;font-weight:700;cursor:move;-webkit-user-select:none;user-select:none}.content[data-v-8c0b1694]{padding:16px}.form-group[data-v-8c0b1694]{margin-bottom:12px}label[data-v-8c0b1694]{display:block;margin-bottom:4px;font-size:13px;color:#333}input[type=text][data-v-8c0b1694],input[type=number][data-v-8c0b1694]{width:100%;padding:8px;border:1px solid #ddd;border-radius:4px;box-sizing:border-box;font-size:13px}.checkbox-label[data-v-8c0b1694]{display:flex;align-items:center;font-size:13px;color:#333;cursor:pointer}.checkbox-label input[type=checkbox][data-v-8c0b1694]{width:auto;margin-right:6px}input[data-v-8c0b1694]:disabled{background:#f5f5f5;cursor:not-allowed}button[data-v-8c0b1694]{width:100%;padding:10px;border:none;border-radius:4px;cursor:pointer;font-size:14px;font-weight:700}.btn-start[data-v-8c0b1694]{background:#667eea;color:#fff}.btn-start[data-v-8c0b1694]:disabled{background:#ccc;cursor:not-allowed}.btn-stop[data-v-8c0b1694]{background:#ff5722;color:#fff}.btn-stop[data-v-8c0b1694]:disabled{background:#ccc;cursor:not-allowed}.log-area[data-v-8c0b1694]{padding:10px;background:#f5f5f5;border-radius:4px;font-size:12px;color:#666;min-height:60px;max-height:150px;overflow-y:auto}.log-empty[data-v-8c0b1694]{color:#999}.log-item[data-v-8c0b1694]{margin-bottom:4px}.counter[data-v-8c0b1694]{margin-top:8px;font-size:12px;color:#999;text-align:center}.count[data-v-8c0b1694]{color:#667eea;font-weight:700} ");

  class BilibiliPlatform {
    name = "bilibili";
    displayName = "哔哩哔哩";
    blacklist = new Set();
    isCurrentPlatform() {
      return window.location.hostname.includes("bilibili.com");
    }
    async loadBlacklist() {
      let page = 1;
      let hasMore = true;
      while (hasMore) {
        const res = await fetch(`https://api.bilibili.com/x/relation/blacks?re_version=0&pn=${page}&ps=50&jsonp=jsonp&web_location=333.33`, {
          credentials: "include"
        });
        const data = await res.json();
        const list = data.data?.list || [];
        list.forEach((item) => this.blacklist.add(item.mid.toString()));
        hasMore = list.length >= 50;
        page++;
      }
    }
    isBlocked(uid) {
      return this.blacklist.has(uid);
    }
    async searchUsers(keyword, page) {
      if (page === 0 && this.blacklist.size === 0) {
        await this.loadBlacklist();
      }
      const searchParams = new URLSearchParams({
        keyword,
        page: (page + 1).toString(),
        order: "totalrank",
        duration: "0",
        tids: "0",
        search_type: "bili_user"
      });
      const res = await fetch(`https://api.bilibili.com/x/web-interface/search/type?${searchParams}`, {
        method: "GET",
        headers: {
          accept: "application/json, text/plain, */*",
          referer: "https://search.bilibili.com/"
        },
        credentials: "include"
      });
      const data = await res.json();
      const users = data.data?.result || [];
      return {
        users: users.map((item) => ({
          user_info: {
            nickname: item.uname,
            uid: item.mid.toString(),
            avatar: item.upic,
            is_blocked: this.isBlocked(item.mid.toString()),
            official_verify: !!item.official_verify?.desc
          }
        })),
        hasMore: users.length >= 20
      };
    }
    async blockUser(user) {
      const csrf = this.getCsrfToken();
      if (!csrf) {
        console.error("未找到CSRF token");
        return false;
      }
      const body = `fid=${user.uid}&act=5&re_src=11&gaia_source=web_main&spmid=333.1387.0.0&extend_content=${encodeURIComponent(JSON.stringify({ entity: "user", entity_id: Number.parseInt(user.uid) }))}&csrf=${csrf}`;
      const res = await fetch("https://api.bilibili.com/x/relation/modify?statistics=%7B%22appId%22:100,%22platform%22:5%7D", {
        method: "POST",
        headers: {
          "content-type": "application/x-www-form-urlencoded"
        },
        body,
        credentials: "include"
      });
      const data = await res.json();
      if (data.code === 0) {
        this.blacklist.add(user.uid);
        return true;
      }
      return false;
    }
    getCsrfToken() {
      const match = document.cookie.match(/bili_jct=([^;]+)/);
      return match ? match[1] : null;
    }
  }
  class DouyinPlatform {
    name = "douyin";
    displayName = "抖音";
    isCurrentPlatform() {
      return window.location.hostname.includes("douyin.com");
    }
    async searchUsers(keyword, page) {
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
    async blockUser(user) {
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
  }
  const platforms = [
    new DouyinPlatform(),
    new BilibiliPlatform()
  ];
  function getCurrentPlatform() {
    return platforms.find((platform) => platform.isCurrentPlatform()) || null;
  }
  const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
  const _hoisted_1 = { class: "content" };
  const _hoisted_2 = { class: "form-group" };
  const _hoisted_3 = ["disabled"];
  const _hoisted_4 = { class: "form-group" };
  const _hoisted_5 = ["disabled"];
  const _hoisted_6 = {
    key: 0,
    class: "form-group"
  };
  const _hoisted_7 = { class: "checkbox-label" };
  const _hoisted_8 = ["disabled"];
  const _hoisted_9 = { class: "form-group" };
  const _hoisted_10 = ["disabled"];
  const _hoisted_11 = { class: "form-group" };
  const _hoisted_12 = ["disabled"];
  const _hoisted_13 = { class: "log-area" };
  const _hoisted_14 = {
    key: 0,
    class: "log-empty"
  };
  const _hoisted_15 = { class: "counter" };
  const _hoisted_16 = { class: "count" };
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
      const currentPlatform = getCurrentPlatform();
      const onlyVerified = vue.ref(true);
      function addLog(msg, color = "#333") {
        const time = ( new Date()).toLocaleTimeString();
        logs.value.push({ msg, color, time });
      }
      async function startTask() {
        if (!keyword.value.trim()) {
          alert("请输入搜索关键词！");
          return;
        }
        if (!currentPlatform) {
          alert("当前平台不支持！请在抖音或哔哩哔哩网页版使用");
          return;
        }
        isRunning.value = true;
        isStopped.value = false;
        let currentPage = 0;
        blockedCount.value = 0;
        logs.value = [];
        addLog(`[${currentPlatform.displayName}] 开始搜索「${keyword.value}」，目标拉黑 ${limit.value} 个用户`, "#667eea");
        while (!isStopped.value && blockedCount.value < limit.value) {
          addLog(`获取第 ${currentPage + 1} 页用户...`, "#2196F3");
          const { users, hasMore } = await currentPlatform.searchUsers(keyword.value, currentPage);
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
            const isBlocked = currentPlatform.name === "douyin" ? item.user_info.user_tags?.some((tag) => tag.type === "blocked_label") : item.user_info.is_blocked;
            if (isBlocked) {
              addLog(`已拉黑：${user.nickname}（跳过）`, "#999");
              continue;
            }
            if (onlyVerified.value && currentPlatform.name === "bilibili" && !item.user_info.official_verify) {
              addLog(`非认证用户：${user.nickname}（跳过）`, "#999");
              continue;
            }
            if (await currentPlatform.blockUser(user)) {
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
          }, " 🚫 " + vue.toDisplayString(vue.unref(currentPlatform)?.displayName || "多平台") + "自动拉黑工具 ", 33),
          vue.createElementVNode("div", _hoisted_1, [
            vue.createElementVNode("div", _hoisted_2, [
              _cache[3] || (_cache[3] = vue.createElementVNode("label", null, "搜索关键词：", -1)),
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
              _cache[4] || (_cache[4] = vue.createElementVNode("label", null, "拉黑数量：", -1)),
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
            vue.unref(currentPlatform)?.name === "bilibili" ? (vue.openBlock(), vue.createElementBlock("div", _hoisted_6, [
              vue.createElementVNode("label", _hoisted_7, [
                vue.withDirectives(vue.createElementVNode("input", {
                  "onUpdate:modelValue": _cache[2] || (_cache[2] = ($event) => onlyVerified.value = $event),
                  type: "checkbox",
                  disabled: isRunning.value
                }, null, 8, _hoisted_8), [
                  [vue.vModelCheckbox, onlyVerified.value]
                ]),
                _cache[5] || (_cache[5] = vue.createTextVNode(" 只拉黑认证用户 ", -1))
              ])
            ])) : vue.createCommentVNode("", true),
            vue.createElementVNode("div", _hoisted_9, [
              vue.createElementVNode("button", {
                class: "btn-start",
                disabled: isRunning.value,
                onClick: startTask
              }, " 开始拉黑 ", 8, _hoisted_10)
            ]),
            vue.createElementVNode("div", _hoisted_11, [
              vue.createElementVNode("button", {
                class: "btn-stop",
                disabled: !isRunning.value,
                onClick: stopTask
              }, " 停止任务 ", 8, _hoisted_12)
            ]),
            vue.createElementVNode("div", _hoisted_13, [
              logs.value.length === 0 ? (vue.openBlock(), vue.createElementBlock("div", _hoisted_14, " 等待开始... ")) : vue.createCommentVNode("", true),
              (vue.openBlock(true), vue.createElementBlock(vue.Fragment, null, vue.renderList(logs.value, (log, i) => {
                return vue.openBlock(), vue.createElementBlock("div", {
                  key: i,
                  class: "log-item",
                  style: vue.normalizeStyle({ color: log.color })
                }, " [" + vue.toDisplayString(log.time) + "] " + vue.toDisplayString(log.msg), 5);
              }), 128))
            ]),
            vue.createElementVNode("div", _hoisted_15, [
              _cache[6] || (_cache[6] = vue.createTextVNode(" 已拉黑：", -1)),
              vue.createElementVNode("span", _hoisted_16, vue.toDisplayString(blockedCount.value), 1),
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
  const App = _export_sfc(_sfc_main, [["__scopeId", "data-v-8c0b1694"]]);
  const app = document.createElement("div");
  document.body.append(app);
  vue.createApp(App).mount(app);
  console.log("%c自动拉黑工具已加载", "color: #667eea; font-size: 14px; font-weight: bold");

})(Vue);