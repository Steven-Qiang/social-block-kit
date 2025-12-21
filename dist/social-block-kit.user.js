// ==UserScript==
// @name         社交平台自动拉黑工具
// @namespace    social-block-kit
// @version      1.3.1
// @author       Steven-Qiang
// @description  基于关键词搜索用户并批量拉黑的多平台油猴脚本，支持抖音、哔哩哔哩等
// @license      MIT
// @source       https://github.com/Steven-Qiang/social-block-kit
// @downloadURL  https://github.com/Steven-Qiang/social-block-kit/releases/latest/download/social-block-kit.user.js
// @match        https://www.douyin.com/*
// @match        https://www.bilibili.com/*
// @match        https://search.bilibili.com/*
// @match        https://account.bilibili.com/account/blacklist*
// @require      https://cdn.jsdelivr.net/npm/vue@3.5.26/dist/vue.global.prod.js
// @grant        GM_addStyle
// @grant        GM_getValue
// @grant        GM_setValue
// ==/UserScript==

(function (vue) {
  'use strict';

  const d=new Set;const importCSS = async e=>{d.has(e)||(d.add(e),(t=>{typeof GM_addStyle=="function"?GM_addStyle(t):(document.head||document.documentElement).appendChild(document.createElement("style")).append(t);})(e));};

  importCSS(' .log-container[data-v-62a6507f]{margin-bottom:12px}.log-header[data-v-62a6507f]{display:flex;justify-content:space-between;align-items:center;padding:8px 12px;background:#f8f9fa;border-radius:4px 4px 0 0;border-bottom:1px solid #eee;font-size:13px;font-weight:700;color:#333}.log-controls[data-v-62a6507f]{display:flex;gap:4px}.log-control-btn[data-v-62a6507f]{width:auto;padding:4px 6px;font-size:12px;background:none;border:1px solid #ddd;border-radius:3px;cursor:pointer;transition:all .2s}.log-control-btn[data-v-62a6507f]:hover{background:#e9ecef}.log-area[data-v-62a6507f]{padding:10px;background:#f5f5f5;border-radius:0 0 4px 4px;font-size:12px;color:#666;min-height:60px;max-height:150px;overflow-y:auto}.log-area.expanded[data-v-62a6507f]{max-height:300px}.log-empty[data-v-62a6507f]{color:#999}.log-item[data-v-62a6507f]{margin-bottom:4px}.content[data-v-343c2ad5]{padding:16px}.form-group[data-v-343c2ad5]{margin-bottom:12px}label[data-v-343c2ad5]{display:block;margin-bottom:4px;font-size:13px;color:#333}input[type=text][data-v-343c2ad5],input[type=number][data-v-343c2ad5]{width:100%;padding:8px;border:1px solid #ddd;border-radius:4px;box-sizing:border-box;font-size:13px}.checkbox-label[data-v-343c2ad5]{display:flex;align-items:center;font-size:13px;color:#333;cursor:pointer}.checkbox-label input[type=checkbox][data-v-343c2ad5]{width:auto;margin-right:6px}input[data-v-343c2ad5]:disabled{background:#f5f5f5;cursor:not-allowed}button[data-v-343c2ad5]{width:100%;padding:10px;border:none;border-radius:4px;cursor:pointer;font-size:14px;font-weight:700}.btn-start[data-v-343c2ad5]{background:#667eea;color:#fff}.btn-start[data-v-343c2ad5]:disabled{background:#ccc;cursor:not-allowed}.btn-stop[data-v-343c2ad5]{background:#ff5722;color:#fff}.btn-stop[data-v-343c2ad5]:disabled{background:#ccc;cursor:not-allowed}.log-area[data-v-343c2ad5]{padding:10px;background:#f5f5f5;border-radius:4px;font-size:12px;color:#666;min-height:60px;max-height:150px;overflow-y:auto}.log-empty[data-v-343c2ad5]{color:#999}.log-item[data-v-343c2ad5]{margin-bottom:4px}.counter[data-v-343c2ad5]{margin-top:18px;font-size:12px;color:#999;text-align:center}.count[data-v-343c2ad5]{font-weight:700}.btn-start[data-v-343c2ad5]{background:#ff5722}.count[data-v-343c2ad5]{color:#ff5722}.content[data-v-bba5d353]{padding:16px}.form-group[data-v-bba5d353]{margin-bottom:12px}label[data-v-bba5d353]{display:block;margin-bottom:4px;font-size:13px;color:#333}input[type=text][data-v-bba5d353],input[type=number][data-v-bba5d353]{width:100%;padding:8px;border:1px solid #ddd;border-radius:4px;box-sizing:border-box;font-size:13px}.checkbox-label[data-v-bba5d353]{display:flex;align-items:center;font-size:13px;color:#333;cursor:pointer}.checkbox-label input[type=checkbox][data-v-bba5d353]{width:auto;margin-right:6px}input[data-v-bba5d353]:disabled{background:#f5f5f5;cursor:not-allowed}button[data-v-bba5d353]{width:100%;padding:10px;border:none;border-radius:4px;cursor:pointer;font-size:14px;font-weight:700}.btn-start[data-v-bba5d353]{background:#667eea;color:#fff}.btn-start[data-v-bba5d353]:disabled{background:#ccc;cursor:not-allowed}.btn-stop[data-v-bba5d353]{background:#ff5722;color:#fff}.btn-stop[data-v-bba5d353]:disabled{background:#ccc;cursor:not-allowed}.log-area[data-v-bba5d353]{padding:10px;background:#f5f5f5;border-radius:4px;font-size:12px;color:#666;min-height:60px;max-height:150px;overflow-y:auto}.log-empty[data-v-bba5d353]{color:#999}.log-item[data-v-bba5d353]{margin-bottom:4px}.counter[data-v-bba5d353]{margin-top:18px;font-size:12px;color:#999;text-align:center}.count[data-v-bba5d353]{font-weight:700}.count[data-v-bba5d353]{color:#667eea}.hint[data-v-bba5d353]{font-size:11px;color:#999;margin-top:10px;margin-left:2px}.advanced-toggle[data-v-bba5d353]{display:flex;justify-content:space-between;align-items:center;padding:8px 12px;background:#f5f5f5;border-radius:4px;cursor:pointer;font-size:13px;color:#667eea;transition:background-color .2s;-webkit-user-select:none;user-select:none}.advanced-toggle[data-v-bba5d353]:hover{background:#ebebeb}.arrow[data-v-bba5d353]{font-size:10px;transition:transform .2s}.arrow.expanded[data-v-bba5d353]{transform:rotate(180deg)}.advanced-content[data-v-bba5d353]{margin-top:8px;padding:12px;background:#fafafa;border-radius:4px;border:1px solid #eee}.advanced-item[data-v-bba5d353]{margin-bottom:12px}.advanced-item[data-v-bba5d353]:last-child{margin-bottom:0}.input-with-dropdown[data-v-bba5d353]{display:flex;gap:4px}.input-with-dropdown input[data-v-bba5d353]{flex:1}.template-dropdown[data-v-bba5d353]{position:relative}.dropdown-btn[data-v-bba5d353]{padding:8px 12px;font-size:11px;background:#f0f4ff;border:1px solid #d0d9ff;border-radius:4px;color:#667eea;cursor:pointer;transition:all .2s;white-space:nowrap}.dropdown-btn[data-v-bba5d353]:hover:not(:disabled){background:#e6edff;border-color:#b8c5ff}.dropdown-btn[data-v-bba5d353]:disabled{opacity:.5;cursor:not-allowed}.dropdown-menu[data-v-bba5d353]{position:absolute;top:100%;right:0;min-width:150px;background:#fff;border:1px solid #ddd;border-radius:4px;box-shadow:0 4px 12px #00000026;z-index:1000;max-height:200px;overflow-y:auto}.dropdown-item[data-v-bba5d353]{display:flex;align-items:center;padding:8px 12px;cursor:pointer;transition:background-color .2s;font-size:12px}.dropdown-item[data-v-bba5d353]:hover{background:#f5f5f5}.item-icon[data-v-bba5d353]{margin-right:8px;font-size:14px}.item-name[data-v-bba5d353]{flex:1}.float-ball[data-v-f83e8372]{position:fixed;width:60px;height:60px;background:linear-gradient(135deg,#667eea,#764ba2);border-radius:50%;display:flex;align-items:center;justify-content:center;color:#fff;font-size:24px;cursor:pointer;box-shadow:0 4px 12px #667eea66;z-index:999999;-webkit-user-select:none;user-select:none;overflow:hidden;transition:transform .2s cubic-bezier(.4,0,.2,1),box-shadow .2s cubic-bezier(.4,0,.2,1);transform:scale(1)}.float-ball.animating[data-v-f83e8372]{transition:all .3s cubic-bezier(.4,0,.2,1)}.float-ball.dragging[data-v-f83e8372]{transition:none;transform:scale(1.1);box-shadow:0 8px 20px #667eea99}.float-ball[data-v-f83e8372]:hover{transform:scale(1.1);box-shadow:0 6px 16px #667eea80}.float-ball[data-v-f83e8372]:active{transform:scale(.95)}.ball-icon[data-v-f83e8372]{position:relative;z-index:2;transition:transform .2s}.ripple[data-v-f83e8372]{position:absolute;top:50%;left:50%;width:0;height:0;background:#ffffff4d;border-radius:50%;transform:translate(-50%,-50%);animation:ripple-f83e8372 2s infinite}@keyframes ripple-f83e8372{0%{width:0;height:0;opacity:1}to{width:120px;height:120px;opacity:0}}.panel[data-v-f83e8372]{position:fixed;min-width:300px;max-width:90vw;background:#fff;border-radius:12px;box-shadow:0 8px 32px #00000026;z-index:999999;font-family:Arial,sans-serif;animation:panelEnter-f83e8372 .3s cubic-bezier(.4,0,.2,1)}@keyframes panelEnter-f83e8372{0%{opacity:0;transform:scale(.8) translateY(-20px)}to{opacity:1;transform:scale(1) translateY(0)}}.header[data-v-f83e8372]{background:linear-gradient(135deg,#667eea,#764ba2);color:#fff;padding:12px 16px;border-radius:12px 12px 0 0;font-weight:700;cursor:move;-webkit-user-select:none;user-select:none;display:flex;justify-content:space-between;align-items:center;position:relative;overflow:hidden}.header[data-v-f83e8372]:before{content:"";position:absolute;top:0;left:-100%;width:100%;height:100%;background:linear-gradient(90deg,transparent,rgba(255,255,255,.2),transparent);transition:left .5s}.header[data-v-f83e8372]:hover:before{left:100%}.close-btn[data-v-f83e8372]{background:none;border:none;color:#fff;cursor:pointer;font-size:20px;line-height:1;padding:4px;width:28px;height:28px;display:flex;align-items:center;justify-content:center;border-radius:50%;transition:all .2s;position:relative;z-index:1}.close-btn[data-v-f83e8372]:hover{background-color:#fff3;transform:rotate(90deg)}.content-wrapper[data-v-f83e8372]{animation:contentSlide-f83e8372 .3s ease-out .1s both}@keyframes contentSlide-f83e8372{0%{opacity:0;transform:translateY(10px)}to{opacity:1;transform:translateY(0)}}.content[data-v-87bf9117]{padding:16px}.form-group[data-v-87bf9117]{margin-bottom:12px}label[data-v-87bf9117]{display:block;margin-bottom:4px;font-size:13px;color:#333}input[type=text][data-v-87bf9117],input[type=number][data-v-87bf9117]{width:100%;padding:8px;border:1px solid #ddd;border-radius:4px;box-sizing:border-box;font-size:13px}.checkbox-label[data-v-87bf9117]{display:flex;align-items:center;font-size:13px;color:#333;cursor:pointer}.checkbox-label input[type=checkbox][data-v-87bf9117]{width:auto;margin-right:6px}input[data-v-87bf9117]:disabled{background:#f5f5f5;cursor:not-allowed}button[data-v-87bf9117]{width:100%;padding:10px;border:none;border-radius:4px;cursor:pointer;font-size:14px;font-weight:700}.btn-start[data-v-87bf9117]{background:#667eea;color:#fff}.btn-start[data-v-87bf9117]:disabled{background:#ccc;cursor:not-allowed}.btn-stop[data-v-87bf9117]{background:#ff5722;color:#fff}.btn-stop[data-v-87bf9117]:disabled{background:#ccc;cursor:not-allowed}.log-area[data-v-87bf9117]{padding:10px;background:#f5f5f5;border-radius:4px;font-size:12px;color:#666;min-height:60px;max-height:150px;overflow-y:auto}.log-empty[data-v-87bf9117]{color:#999}.log-item[data-v-87bf9117]{margin-bottom:4px}.counter[data-v-87bf9117]{margin-top:18px;font-size:12px;color:#999;text-align:center}.count[data-v-87bf9117]{font-weight:700}.header[data-v-87bf9117]{display:flex;justify-content:space-between;align-items:center;margin-bottom:12px;gap:8px}.header h3[data-v-87bf9117]{margin:0;color:#333;font-size:14px;flex:1}.btn-add[data-v-87bf9117]{padding:4px 8px;background:#667eea;color:#fff;border:none;border-radius:4px;cursor:pointer;font-size:11px}.template-list[data-v-87bf9117]{margin-bottom:16px;max-height:200px;overflow-y:auto}.template-item[data-v-87bf9117]{display:flex;justify-content:space-between;align-items:center;padding:8px;border:1px solid #eee;border-radius:6px;margin-bottom:6px}.template-info[data-v-87bf9117]{display:flex;align-items:center;flex:1;min-width:0}.template-icon[data-v-87bf9117]{font-size:14px;margin-right:8px;flex-shrink:0}.template-details[data-v-87bf9117]{flex:1;min-width:0}.template-name[data-v-87bf9117]{font-weight:700;margin-bottom:2px;font-size:12px;display:flex;align-items:center;gap:4px}.template-author[data-v-87bf9117]{font-size:10px;color:#28a745;font-weight:400}.template-source[data-v-87bf9117]{font-size:10px;color:#667eea;font-weight:400}.template-keywords[data-v-87bf9117]{font-size:10px;color:#666;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.template-actions[data-v-87bf9117]{display:flex;gap:2px;flex-shrink:0}.template-actions button[data-v-87bf9117]{padding:2px 4px;border:none;border-radius:3px;cursor:pointer;font-size:10px}.btn-edit[data-v-87bf9117]{background:#f0f4ff}.btn-share[data-v-87bf9117]{background:#f0fff4}.btn-delete[data-v-87bf9117]{background:#fff0f0}.btn-edit[data-v-87bf9117]:disabled,.btn-delete[data-v-87bf9117]:disabled{opacity:.3;cursor:not-allowed}.import-section[data-v-87bf9117]{border-top:1px solid #eee;padding-top:12px}.import-section h4[data-v-87bf9117]{margin:0 0 6px;font-size:12px}.import-section textarea[data-v-87bf9117]{width:100%;margin-bottom:6px;padding:6px;border:1px solid #ddd;border-radius:4px;resize:vertical;font-size:11px}.btn-import[data-v-87bf9117]{padding:4px 8px;background:#28a745;color:#fff;border:none;border-radius:4px;cursor:pointer;font-size:11px}.import-actions[data-v-87bf9117]{display:flex;gap:6px}.btn-sync[data-v-87bf9117]{padding:4px 8px;background:#17a2b8;color:#fff;border:none;border-radius:4px;cursor:pointer;font-size:11px}.btn-sync[data-v-87bf9117]:disabled{background:#6c757d;cursor:not-allowed}.contribute-info[data-v-87bf9117]{margin-top:8px;font-size:11px;color:#666;text-align:center}.contribute-info a[data-v-87bf9117]{color:#667eea;text-decoration:none}.contribute-info a[data-v-87bf9117]:hover{text-decoration:underline}.dialog-overlay[data-v-87bf9117]{position:fixed;inset:0;background:#00000080;display:flex;align-items:center;justify-content:center;z-index:1000000}.dialog[data-v-87bf9117]{background:#fff;padding:16px;border-radius:6px;width:90%;max-width:320px}.dialog h4[data-v-87bf9117]{margin:0 0 12px;font-size:14px}.dialog textarea[data-v-87bf9117]{width:100%;padding:6px;border:1px solid #ddd;border-radius:4px;resize:vertical;font-size:11px}.dialog input[data-v-87bf9117]{font-size:11px}.dialog-actions[data-v-87bf9117]{display:flex;justify-content:flex-end;gap:6px;margin-top:12px}.btn-cancel[data-v-87bf9117]{padding:4px 8px;background:#6c757d;color:#fff;border:none;border-radius:4px;cursor:pointer;font-size:11px}.btn-save[data-v-87bf9117]{padding:4px 8px;background:#667eea;color:#fff;border:none;border-radius:4px;cursor:pointer;font-size:11px}.guide[data-v-656be68b]{padding:8px 16px;border-top:1px solid #eee}.guide-link[data-v-656be68b]{display:block;text-align:center;color:#667eea;text-decoration:none;font-size:13px;padding:8px;border-radius:6px;transition:all .2s;position:relative;overflow:hidden}.guide-link[data-v-656be68b]:before{content:"";position:absolute;top:0;left:-100%;width:100%;height:100%;background:linear-gradient(90deg,transparent,rgba(102,126,234,.1),transparent);transition:left .3s}.guide-link[data-v-656be68b]:hover{background-color:#f0f4ff;transform:translateY(-1px)}.guide-link[data-v-656be68b]:hover:before{left:100%}.footer[data-v-656be68b]{padding:8px 16px;border-top:1px solid #eee;display:flex;justify-content:space-between;align-items:center;font-size:11px;color:#999}.version[data-v-656be68b]{font-weight:700}.copyright[data-v-656be68b]{flex:1;text-align:center}.github-link[data-v-656be68b]{display:flex;align-items:center;gap:4px;color:#667eea;text-decoration:none;transition:color .2s}.github-link[data-v-656be68b]:hover{color:#5a67d8}.nav-section[data-v-656be68b]{padding:8px 16px;border-top:1px solid #eee;display:flex;gap:4px}.nav-btn[data-v-656be68b]{flex:1;padding:6px 8px;font-size:11px;background:#f5f5f5;border:1px solid #ddd;border-radius:4px;cursor:pointer;transition:all .2s}.nav-btn[data-v-656be68b]:hover{background:#ebebeb}.nav-btn.active[data-v-656be68b]{background:#667eea;color:#fff;border-color:#667eea} ');

  const name = "social-block-kit";
  const type = "module";
  const version = "1.3.1";
  const packageManager = "pnpm@10.24.0";
  const description = "基于关键词搜索用户并批量拉黑的多平台油猴脚本，支持抖音、哔哩哔哩等";
  const author = "Steven-Qiang";
  const license = "MIT";
  const repository = { "type": "git", "url": "https://github.com/Steven-Qiang/social-block-kit" };
  const keywords = ["douyin", "bilibili", "userscript", "tampermonkey", "block", "automation", "vue", "social-media"];
  const scripts = { "dev": "vite", "build": "vue-tsc -b && vite build", "preview": "vite preview", "lint": "eslint .", "lint:fix": "eslint . --fix", "release": "semantic-release" };
  const dependencies = { "vue": "^3.5.26" };
  const devDependencies = { "@antfu/eslint-config": "^6.7.1", "@semantic-release/changelog": "^6.0.3", "@semantic-release/exec": "^7.1.0", "@semantic-release/git": "^10.0.1", "@semantic-release/github": "^12.0.2", "@vitejs/plugin-vue": "^6.0.3", "eslint": "^9.39.2", "eslint-plugin-format": "^1.1.0", "semantic-release": "^25.0.2", "typescript": "^5.9.3", "unplugin-auto-import": "^20.3.0", "vite": "^7.3.0", "vite-plugin-monkey": "^7.1.8", "vue-tsc": "^3.1.8" };
  const pkg = {
    name,
    type,
    version,
    "private": true,
    packageManager,
    description,
    author,
    license,
    repository,
    keywords,
    scripts,
    dependencies,
    devDependencies
  };
  const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
  const _hoisted_1$5 = { class: "log-container" };
  const _hoisted_2$4 = { class: "log-header" };
  const _hoisted_3$4 = { class: "log-controls" };
  const _hoisted_4$4 = ["title"];
  const _hoisted_5$4 = ["title"];
  const _hoisted_6$4 = {
    key: 0,
    class: "log-empty"
  };
  const _sfc_main$5 = vue.defineComponent({
    __name: "LogViewer",
    props: {
      filename: { default: "日志" }
    },
    setup(__props, { expose: __expose }) {
      const props = __props;
      const logs = vue.ref([]);
      const logExpanded = vue.ref(false);
      const autoScroll = vue.ref(true);
      const logAreaRef = vue.useTemplateRef("logArea");
      function addLog(msg, color = "#333") {
        const time = ( new Date()).toLocaleTimeString();
        logs.value.push({ msg, color, time });
        if (autoScroll.value) {
          vue.nextTick(() => {
            logAreaRef.value?.scrollTo(0, logAreaRef.value.scrollHeight);
          });
        }
      }
      function clearLogs() {
        logs.value = [];
      }
      function exportLogs() {
        if (logs.value.length === 0) {
          alert("没有日志可导出");
          return;
        }
        const logText = logs.value.map((log) => `[${log.time}] ${log.msg}`).join("\n");
        const blob = new Blob([logText], { type: "text/plain;charset=utf-8" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `${props.filename}_${( new Date()).toISOString().slice(0, 19).replace(/:/g, "-")}.txt`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      }
      __expose({
        addLog,
        clearLogs,
        logs: logs.value
      });
      return (_ctx, _cache) => {
        return vue.openBlock(), vue.createElementBlock("div", _hoisted_1$5, [
          vue.createElementVNode("div", _hoisted_2$4, [
            _cache[2] || (_cache[2] = vue.createElementVNode("span", null, "执行日志", -1)),
            vue.createElementVNode("div", _hoisted_3$4, [
              vue.createElementVNode("button", {
                class: "log-control-btn",
                title: autoScroll.value ? "关闭自动滚动" : "开启自动滚动",
                onClick: _cache[0] || (_cache[0] = ($event) => autoScroll.value = !autoScroll.value)
              }, vue.toDisplayString(autoScroll.value ? "🔓" : "🔒"), 9, _hoisted_4$4),
              vue.createElementVNode("button", {
                class: "log-control-btn",
                title: logExpanded.value ? "收起日志" : "展开日志",
                onClick: _cache[1] || (_cache[1] = ($event) => logExpanded.value = !logExpanded.value)
              }, vue.toDisplayString(logExpanded.value ? "▲" : "▼"), 9, _hoisted_5$4),
              vue.createElementVNode("button", {
                class: "log-control-btn",
                title: "导出日志",
                onClick: exportLogs
              }, " 💾 ")
            ])
          ]),
          vue.createElementVNode("div", {
            ref: "logArea",
            class: vue.normalizeClass(["log-area", { expanded: logExpanded.value }])
          }, [
            logs.value.length === 0 ? (vue.openBlock(), vue.createElementBlock("div", _hoisted_6$4, " 等待开始... ")) : vue.createCommentVNode("", true),
            (vue.openBlock(true), vue.createElementBlock(vue.Fragment, null, vue.renderList(logs.value, (log, i) => {
              return vue.openBlock(), vue.createElementBlock("div", {
                key: i,
                class: "log-item",
                style: vue.normalizeStyle({ color: log.color })
              }, " [" + vue.toDisplayString(log.time) + "] " + vue.toDisplayString(log.msg), 5);
            }), 128))
          ], 2)
        ]);
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
  const LogViewer = _export_sfc(_sfc_main$5, [["__scopeId", "data-v-62a6507f"]]);
  const _hoisted_1$4 = { class: "content" };
  const _hoisted_2$3 = { class: "form-group" };
  const _hoisted_3$3 = ["disabled"];
  const _hoisted_4$3 = { class: "form-group" };
  const _hoisted_5$3 = ["disabled"];
  const _hoisted_6$3 = { class: "counter" };
  const _hoisted_7$2 = { class: "count" };
  const _sfc_main$4 = vue.defineComponent({
    __name: "BlacklistCleaner",
    setup(__props) {
      const isRunning = vue.ref(false);
      const isStopped = vue.ref(false);
      const removedCount = vue.ref(0);
      const logViewerRef = vue.useTemplateRef("logViewer");
      function addLog(msg, color = "#333") {
        logViewerRef.value?.addLog(msg, color);
      }
      async function startCleanup() {
        isRunning.value = true;
        isStopped.value = false;
        removedCount.value = 0;
        logViewerRef.value?.clearLogs();
        addLog("开始清理黑名单...", "#667eea");
        let page = 1;
        let totalRemoved = 0;
        while (!isStopped.value) {
          const res = await fetch(`https://api.bilibili.com/x/relation/blacks?re_version=0&pn=${page}&ps=50&jsonp=jsonp&web_location=333.33`, {
            credentials: "include"
          });
          const data = await res.json();
          const list = data.data?.list || [];
          if (list.length === 0) {
            addLog("黑名单已清空", "#4caf50");
            break;
          }
          addLog(`处理第 ${page} 页，共 ${list.length} 个用户`, "#2196F3");
          for (const item of list) {
            if (isStopped.value)
              break;
            if (await removeFromBlacklist(item.mid)) {
              totalRemoved++;
              removedCount.value = totalRemoved;
              addLog(`✅ 移除成功：${item.uname}`, "#4caf50");
            } else {
              addLog(`❌ 移除失败：${item.uname}`, "#ff5722");
            }
            await sleep(500);
          }
          page++;
          await sleep(1e3);
        }
        addLog(`清理完成！共移除 ${totalRemoved} 个用户`, "#667eea");
        isRunning.value = false;
      }
      async function removeFromBlacklist(uid) {
        const csrf = getCsrfToken();
        if (!csrf)
          return false;
        const body = `fid=${uid}&act=6&re_src=11&csrf=${csrf}`;
        const res = await fetch("https://api.bilibili.com/x/relation/modify", {
          method: "POST",
          headers: {
            "content-type": "application/x-www-form-urlencoded"
          },
          body,
          credentials: "include"
        });
        const data = await res.json();
        return data.code === 0;
      }
      function getCsrfToken() {
        const match = document.cookie.match(/bili_jct=([^;]+)/);
        return match ? match[1] : null;
      }
      function stopCleanup() {
        isStopped.value = true;
        addLog("清理已停止", "#ff5722");
      }
      return (_ctx, _cache) => {
        return vue.openBlock(), vue.createElementBlock("div", _hoisted_1$4, [
          vue.createElementVNode("div", _hoisted_2$3, [
            vue.createElementVNode("button", {
              class: "btn-start",
              disabled: isRunning.value,
              onClick: startCleanup
            }, " 开始清理黑名单 ", 8, _hoisted_3$3)
          ]),
          vue.createElementVNode("div", _hoisted_4$3, [
            vue.createElementVNode("button", {
              class: "btn-stop",
              disabled: !isRunning.value,
              onClick: stopCleanup
            }, " 停止清理 ", 8, _hoisted_5$3)
          ]),
          vue.createVNode(LogViewer, {
            ref: "logViewer",
            filename: "清理日志"
          }, null, 512),
          vue.createElementVNode("div", _hoisted_6$3, [
            _cache[0] || (_cache[0] = vue.createTextVNode(" 已移除：", -1)),
            vue.createElementVNode("span", _hoisted_7$2, vue.toDisplayString(removedCount.value), 1),
            _cache[1] || (_cache[1] = vue.createTextVNode(" 个用户 ", -1))
          ])
        ]);
      };
    }
  });
  const BlacklistCleaner = _export_sfc(_sfc_main$4, [["__scopeId", "data-v-343c2ad5"]]);
  var PlatformType = ((PlatformType2) => {
    PlatformType2["DOUYIN"] = "douyin";
    PlatformType2["BILIBILI"] = "bilibili";
    return PlatformType2;
  })(PlatformType || {});
  class BilibiliPlatform {
    name = PlatformType.BILIBILI;
    displayName = "哔哩哔哩";
    blacklist = new Set();
    isCurrentPlatform() {
      return window.location.hostname.includes("bilibili.com");
    }
    async loadBlacklist(onProgress) {
      let page = 1;
      let hasMore = true;
      let totalLoaded = 0;
      onProgress?.("正在加载黑名单...");
      while (hasMore) {
        const res = await fetch(`https://api.bilibili.com/x/relation/blacks?re_version=0&pn=${page}&ps=50&jsonp=jsonp&web_location=333.33`, {
          credentials: "include"
        });
        const data = await res.json();
        const list = data.data?.list || [];
        list.forEach((item) => this.blacklist.add(item.mid.toString()));
        totalLoaded += list.length;
        onProgress?.(`已加载 ${totalLoaded} 个黑名单用户...`);
        hasMore = list.length >= 50;
        page++;
      }
      onProgress?.(`黑名单加载完成，共 ${totalLoaded} 个用户`);
    }
    isBlocked(uid) {
      return this.blacklist.has(uid);
    }
    async searchUsers(keyword, page, onProgress) {
      if (page === 0 && this.blacklist.size === 0) {
        await this.loadBlacklist(onProgress);
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
      onProgress?.(`搜索到 ${users.length} 个用户`);
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
    name = PlatformType.DOUYIN;
    displayName = "抖音";
    isCurrentPlatform() {
      return window.location.hostname.includes("douyin.com");
    }
    async searchUsers(keyword, page, onProgress) {
      const offset = page * 10;
      const searchParams = `device_platform=webapp&aid=6383&channel=channel_pc_web&search_channel=aweme_user_web&search_source=normal_search&query_correct_type=1&is_filter_search=0&disable_rs=0&offset=${offset}&count=10&keyword=${encodeURIComponent(keyword)}&need_filter_settings=1&list_type=single&pc_search_top_1_params={"enable_ai_search_top_1":1}&update_version_code=170400&pc_client_type=1&pc_libra_divert=Windows&support_h265=1&support_dash=1&cpu_core_num=16&version_code=170400&version_name=17.4.0&cookie_enabled=true&screen_width=${window.screen.width}&screen_height=${window.screen.height}&browser_language=${navigator.language}&browser_platform=${navigator.platform}&browser_name=${navigator.appName}&browser_version=${navigator.appVersion}&browser_online=${navigator.onLine}&engine_name=Blink&engine_version=142.0.0.0&os_name=Windows&os_version=10&device_memory=8&platform=PC&downlink=10&effective_type=4g&round_trip_time=50`;
      const res = await fetch(`https://www.douyin.com/aweme/v1/web/discover/search/?${searchParams}`, {
        method: "GET",
        headers: { accept: "application/json, text/plain, */*" },
        credentials: "include"
      });
      const data = await res.json();
      const users = data.user_list || [];
      onProgress?.(`搜索到 ${users.length} 个用户`);
      return {
        users,
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
  class PlatformUtils {
static isDouyin(platform) {
      return platform?.name === PlatformType.DOUYIN;
    }
static isBilibili(platform) {
      return platform?.name === PlatformType.BILIBILI;
    }
static isUserBlocked(platform, userInfo) {
      if (this.isDouyin(platform)) {
        return userInfo.user_tags?.some((tag) => tag.type === "blocked_label");
      }
      if (this.isBilibili(platform)) {
        return userInfo.is_blocked;
      }
      return false;
    }
static isVerifiedUser(platform, userInfo) {
      if (this.isBilibili(platform)) {
        return !!userInfo.official_verify;
      }
      return false;
    }
static getPlatformDisplayName(platformType) {
      const displayNames = {
        [PlatformType.DOUYIN]: "抖音",
        [PlatformType.BILIBILI]: "哔哩哔哩"
      };
      return displayNames[platformType] || "未知平台";
    }
  }
  var LogColors = ((LogColors2) => {
    LogColors2["PRIMARY"] = "#667eea";
    LogColors2["SUCCESS"] = "#4caf50";
    LogColors2["ERROR"] = "#ff5722";
    LogColors2["WARNING"] = "#ff9800";
    LogColors2["INFO"] = "#2196F3";
    LogColors2["MUTED"] = "#999";
    return LogColors2;
  })(LogColors || {});
  const platforms = [
    new DouyinPlatform(),
    new BilibiliPlatform()
  ];
  function getCurrentPlatform() {
    return platforms.find((platform) => platform.isCurrentPlatform()) || null;
  }
  var _GM_getValue = (() => typeof GM_getValue != "undefined" ? GM_getValue : void 0)();
  var _GM_setValue = (() => typeof GM_setValue != "undefined" ? GM_setValue : void 0)();
  const GITHUB_API_BASE = "https://api.github.com/repos/Steven-Qiang/block-kit-templates";
  const TEMPLATES_PATH = "contents/community-templates";
  class GitHubTemplateService {
    cache = [];
    lastFetch = 0;
    CACHE_DURATION = 5 * 60 * 1e3;
async fetchCommunityTemplates() {
      const now = Date.now();
      if (this.cache.length > 0 && now - this.lastFetch < this.CACHE_DURATION) {
        return this.cache;
      }
      try {
        const response = await fetch(`${GITHUB_API_BASE}/${TEMPLATES_PATH}`);
        if (!response.ok) throw new Error("Failed to fetch templates");
        const files = await response.json();
        const templates = [];
        const templatePromises = files.filter((file) => file.name.endsWith(".json")).map(async (file) => {
          try {
            const fileResponse = await fetch(file.download_url);
            const template = await fileResponse.json();
            return {
              template,
              filename: file.name.replace(".json", "")
            };
          } catch (error) {
            console.warn(`Failed to load template ${file.name}:`, error);
            return null;
          }
        });
        const results = await Promise.all(templatePromises);
        templates.push(...results.filter((t) => t !== null));
        this.cache = templates;
        this.lastFetch = now;
        return templates;
      } catch (error) {
        console.error("Failed to fetch community templates:", error);
        return this.cache;
      }
    }
    async syncTemplates() {
      try {
        const communityTemplates = await this.fetchCommunityTemplates();
        const templateStore2 = useTemplateStore();
        let imported = 0;
        for (const { template, filename } of communityTemplates) {
          const communityTemplate = {
            id: `community-${filename}`,
            name: template.name,
            icon: template.icon,
            keywords: template.keywords,
            source: "community",
            author: template.author
          };
          templateStore2.addCommunityTemplate(communityTemplate);
          imported++;
        }
        _GM_setValue("community-templates-version", Date.now());
        return { success: true, imported };
      } catch (error) {
        console.error("Failed to sync templates:", error);
        return { success: false, imported: 0 };
      }
    }
  }
  const githubTemplateService = new GitHubTemplateService();
  const STORAGE_KEY = "social-block-kit-templates";
  class TemplateStore {
    templates = [];
    constructor() {
      this.loadTemplates();
      this.autoSyncOnFirstRun();
    }
    async autoSyncOnFirstRun() {
      if (this.templates.length === 0) {
        try {
          await githubTemplateService.syncTemplates();
          this.loadTemplates();
        } catch (error) {
          console.warn("Failed to auto-sync templates on first run:", error);
        }
      }
    }
    loadTemplates() {
      try {
        const stored = _GM_getValue(STORAGE_KEY, null);
        if (stored) {
          this.templates = JSON.parse(stored);
        } else {
          this.templates = [];
          this.saveTemplates();
        }
      } catch (error) {
        console.error("Failed to load templates:", error);
        this.templates = [];
      }
    }
    saveTemplates() {
      try {
        _GM_setValue(STORAGE_KEY, JSON.stringify(this.templates));
      } catch (error) {
        console.error("Failed to save templates:", error);
      }
    }
    getTemplates() {
      return [...this.templates];
    }
    addTemplate(template) {
      const newTemplate = {
        ...template,
        id: `user-${Date.now()}`,
        source: "user"
      };
      this.templates.push(newTemplate);
      this.saveTemplates();
      return newTemplate;
    }
    addCommunityTemplate(template) {
      const existing = this.templates.find((t) => t.id === template.id);
      if (existing) {
        const index = this.templates.findIndex((t) => t.id === template.id);
        this.templates[index] = template;
      } else {
        this.templates.push(template);
      }
      this.saveTemplates();
      return this.templates.find((t) => t.id === template.id);
    }
    updateTemplate(id, updates) {
      const index = this.templates.findIndex((t) => t.id === id);
      if (index !== -1) {
        this.templates[index] = { ...this.templates[index], ...updates };
        this.saveTemplates();
      }
    }
    deleteTemplate(id) {
      this.templates = this.templates.filter((t) => t.id !== id);
      this.saveTemplates();
    }
    resetToDefaults() {
      this.templates = [];
      this.saveTemplates();
    }
  }
  let templateStore;
  function useTemplateStore() {
    if (!templateStore) {
      templateStore = new TemplateStore();
    }
    return templateStore;
  }
  const _hoisted_1$3 = { class: "content" };
  const _hoisted_2$2 = { class: "form-group" };
  const _hoisted_3$2 = { class: "input-with-dropdown" };
  const _hoisted_4$2 = ["disabled"];
  const _hoisted_5$2 = ["disabled"];
  const _hoisted_6$2 = {
    key: 0,
    class: "dropdown-menu"
  };
  const _hoisted_7$1 = ["onClick"];
  const _hoisted_8$1 = { class: "item-icon" };
  const _hoisted_9$1 = { class: "item-name" };
  const _hoisted_10$1 = { class: "form-group" };
  const _hoisted_11$1 = ["disabled"];
  const _hoisted_12$1 = {
    key: 0,
    class: "form-group"
  };
  const _hoisted_13$1 = { class: "checkbox-label" };
  const _hoisted_14$1 = ["disabled"];
  const _hoisted_15$1 = { class: "form-group" };
  const _hoisted_16$1 = { class: "advanced-content" };
  const _hoisted_17$1 = { class: "advanced-item" };
  const _hoisted_18$1 = ["disabled"];
  const _hoisted_19$1 = { class: "advanced-item" };
  const _hoisted_20$1 = ["disabled"];
  const _hoisted_21 = { class: "form-group" };
  const _hoisted_22 = ["disabled"];
  const _hoisted_23 = { class: "form-group" };
  const _hoisted_24 = ["disabled"];
  const _hoisted_25 = { class: "counter" };
  const _hoisted_26 = { class: "count" };
  const _sfc_main$3 = vue.defineComponent({
    __name: "BlockingTool",
    setup(__props) {
      const keyword = vue.ref("");
      const limit = vue.ref(10);
      const isRunning = vue.ref(false);
      const isStopped = vue.ref(false);
      const blockedCount = vue.ref(0);
      const currentPlatform = getCurrentPlatform();
      const onlyVerified = vue.ref(false);
      const showAdvanced = vue.ref(false);
      const logViewerRef = vue.useTemplateRef("logViewer");
      const delay = vue.ref(1e3);
      const pageDelay = vue.ref(2e3);
      const templateStore2 = useTemplateStore();
      const keywordTemplates = vue.ref(templateStore2.getTemplates());
      const showDropdown = vue.ref(false);
      const dropdownRef = vue.useTemplateRef("dropdownRef");
      function applyTemplate(keywords2) {
        keyword.value = keywords2;
        showDropdown.value = false;
      }
      function handleClickOutside(event) {
        if (dropdownRef.value && !dropdownRef.value.contains(event.target)) {
          showDropdown.value = false;
        }
      }
      vue.onMounted(() => {
        keywordTemplates.value = templateStore2.getTemplates();
        document.addEventListener("click", handleClickOutside);
      });
      vue.onUnmounted(() => {
        document.removeEventListener("click", handleClickOutside);
      });
      function addLog(msg, color = LogColors.MUTED) {
        logViewerRef.value?.addLog(msg, color);
      }
      async function startTask() {
        if (!keyword.value.trim()) {
          alert("请输入搜索关键词！");
          return;
        }
        if (limit.value < 0) {
          alert("拉黑数量输入不正确");
          return;
        }
        if (!currentPlatform) {
          alert("当前平台不支持！请在抖音或哔哩哔哩网页版使用");
          return;
        }
        isRunning.value = true;
        isStopped.value = false;
        blockedCount.value = 0;
        logViewerRef.value?.clearLogs();
        const keywords2 = keyword.value.split(/[,，]/).map((k) => k.trim()).filter((k) => k);
        for (let i = 0; i < keywords2.length && !isStopped.value; i++) {
          const currentKeyword = keywords2[i];
          addLog(`[${i + 1}/${keywords2.length}] 开始处理关键词「${currentKeyword}」`, LogColors.PRIMARY);
          await processKeyword(currentKeyword);
          if (i < keywords2.length - 1 && !isStopped.value) {
            addLog(`关键词「${currentKeyword}」处理完成，等待 2 秒后处理下一个...`, LogColors.MUTED);
            await sleep(2e3);
          }
        }
        addLog(`所有任务结束！共成功拉黑 ${blockedCount.value} 个用户`, LogColors.PRIMARY);
        isRunning.value = false;
      }
      async function processKeyword(currentKeyword) {
        let currentPage = 0;
        const keywordStartCount = blockedCount.value;
        while (!isStopped.value && (limit.value === 0 || blockedCount.value < limit.value)) {
          addLog(`获取第 ${currentPage + 1} 页用户...`, LogColors.INFO);
          const { users, hasMore } = await currentPlatform.searchUsers(currentKeyword, currentPage, (msg) => {
            addLog(msg, LogColors.INFO);
          });
          if (users.length === 0) {
            addLog("无更多用户，任务结束", LogColors.WARNING);
            break;
          }
          for (const item of users) {
            if (limit.value > 0 && blockedCount.value >= limit.value || isStopped.value)
              break;
            const user = {
              nickname: item.user_info.nickname,
              uid: item.user_info.uid,
              sec_uid: item.user_info.sec_uid
            };
            const isBlocked = PlatformUtils.isUserBlocked(currentPlatform, item.user_info);
            if (isBlocked) {
              addLog(`已拉黑：${user.nickname}（跳过）`, LogColors.MUTED);
              continue;
            }
            if (onlyVerified.value && PlatformUtils.isBilibili(currentPlatform) && !PlatformUtils.isVerifiedUser(currentPlatform, item.user_info)) {
              addLog(`非认证用户：${user.nickname}（跳过）`, LogColors.MUTED);
              continue;
            }
            if (await currentPlatform.blockUser(user)) {
              blockedCount.value++;
              addLog(`✅ 拉黑成功：${user.nickname}`, LogColors.SUCCESS);
            } else {
              addLog(`❌ 拉黑失败：${user.nickname}`, LogColors.ERROR);
            }
            await sleep(delay.value);
          }
          if (!hasMore)
            break;
          currentPage++;
          await sleep(pageDelay.value);
        }
        const keywordCount = blockedCount.value - keywordStartCount;
        addLog(`关键词「${currentKeyword}」处理完成，拉黑 ${keywordCount} 个用户`, LogColors.PRIMARY);
      }
      function stopTask() {
        isStopped.value = true;
        addLog("任务已停止", LogColors.ERROR);
      }
      return (_ctx, _cache) => {
        return vue.openBlock(), vue.createElementBlock("div", _hoisted_1$3, [
          vue.createElementVNode("div", _hoisted_2$2, [
            _cache[7] || (_cache[7] = vue.createElementVNode("label", null, "搜索关键词：", -1)),
            vue.createElementVNode("div", _hoisted_3$2, [
              vue.withDirectives(vue.createElementVNode("input", {
                "onUpdate:modelValue": _cache[0] || (_cache[0] = ($event) => keyword.value = $event),
                type: "text",
                placeholder: "用逗号分隔，例如：新闻,日报,资讯",
                disabled: isRunning.value
              }, null, 8, _hoisted_4$2), [
                [vue.vModelText, keyword.value]
              ]),
              vue.createElementVNode("div", {
                ref_key: "dropdownRef",
                ref: dropdownRef,
                class: "template-dropdown"
              }, [
                vue.createElementVNode("button", {
                  class: "dropdown-btn",
                  disabled: isRunning.value,
                  onClick: _cache[1] || (_cache[1] = ($event) => showDropdown.value = !showDropdown.value)
                }, " 📋 预设 ▼ ", 8, _hoisted_5$2),
                showDropdown.value ? (vue.openBlock(), vue.createElementBlock("div", _hoisted_6$2, [
                  (vue.openBlock(true), vue.createElementBlock(vue.Fragment, null, vue.renderList(keywordTemplates.value, (template) => {
                    return vue.openBlock(), vue.createElementBlock("div", {
                      key: template.id,
                      class: "dropdown-item",
                      onClick: ($event) => applyTemplate(template.keywords)
                    }, [
                      vue.createElementVNode("span", _hoisted_8$1, vue.toDisplayString(template.icon), 1),
                      vue.createElementVNode("span", _hoisted_9$1, vue.toDisplayString(template.name), 1)
                    ], 8, _hoisted_7$1);
                  }), 128))
                ])) : vue.createCommentVNode("", true)
              ], 512)
            ])
          ]),
          vue.createElementVNode("div", _hoisted_10$1, [
            _cache[8] || (_cache[8] = vue.createElementVNode("label", null, "拉黑数量：", -1)),
            vue.withDirectives(vue.createElementVNode("input", {
              "onUpdate:modelValue": _cache[2] || (_cache[2] = ($event) => limit.value = $event),
              type: "number",
              min: "0",
              max: "50",
              disabled: isRunning.value
            }, null, 8, _hoisted_11$1), [
              [
                vue.vModelText,
                limit.value,
                void 0,
                { number: true }
              ]
            ]),
            _cache[9] || (_cache[9] = vue.createElementVNode("div", { class: "hint" }, " 拉黑数量0表示不限制，直到无搜索结果 ", -1))
          ]),
          vue.unref(PlatformUtils).isBilibili(vue.unref(currentPlatform)) ? (vue.openBlock(), vue.createElementBlock("div", _hoisted_12$1, [
            vue.createElementVNode("label", _hoisted_13$1, [
              vue.withDirectives(vue.createElementVNode("input", {
                "onUpdate:modelValue": _cache[3] || (_cache[3] = ($event) => onlyVerified.value = $event),
                type: "checkbox",
                disabled: isRunning.value
              }, null, 8, _hoisted_14$1), [
                [vue.vModelCheckbox, onlyVerified.value]
              ]),
              _cache[10] || (_cache[10] = vue.createTextVNode(" 只拉黑认证用户 ", -1))
            ])
          ])) : vue.createCommentVNode("", true),
          vue.createElementVNode("div", _hoisted_15$1, [
            vue.createElementVNode("div", {
              class: "advanced-toggle",
              onClick: _cache[4] || (_cache[4] = ($event) => showAdvanced.value = !showAdvanced.value)
            }, [
              _cache[11] || (_cache[11] = vue.createElementVNode("span", null, "高级设置", -1)),
              vue.createElementVNode("span", {
                class: vue.normalizeClass(["arrow", { expanded: showAdvanced.value }])
              }, "▼", 2)
            ]),
            vue.withDirectives(vue.createElementVNode("div", _hoisted_16$1, [
              vue.createElementVNode("div", _hoisted_17$1, [
                _cache[12] || (_cache[12] = vue.createElementVNode("label", null, "操作间隔（毫秒）：", -1)),
                vue.withDirectives(vue.createElementVNode("input", {
                  "onUpdate:modelValue": _cache[5] || (_cache[5] = ($event) => delay.value = $event),
                  type: "number",
                  min: "500",
                  max: "5000",
                  step: "100",
                  disabled: isRunning.value
                }, null, 8, _hoisted_18$1), [
                  [
                    vue.vModelText,
                    delay.value,
                    void 0,
                    { number: true }
                  ]
                ]),
                _cache[13] || (_cache[13] = vue.createElementVNode("div", { class: "hint" }, " 每次拉黑后的等待时间 ", -1))
              ]),
              vue.createElementVNode("div", _hoisted_19$1, [
                _cache[14] || (_cache[14] = vue.createElementVNode("label", null, "翻页间隔（毫秒）：", -1)),
                vue.withDirectives(vue.createElementVNode("input", {
                  "onUpdate:modelValue": _cache[6] || (_cache[6] = ($event) => pageDelay.value = $event),
                  type: "number",
                  min: "1000",
                  max: "10000",
                  step: "100",
                  disabled: isRunning.value
                }, null, 8, _hoisted_20$1), [
                  [
                    vue.vModelText,
                    pageDelay.value,
                    void 0,
                    { number: true }
                  ]
                ]),
                _cache[15] || (_cache[15] = vue.createElementVNode("div", { class: "hint" }, " 每次翻页后的等待时间 ", -1))
              ])
            ], 512), [
              [vue.vShow, showAdvanced.value]
            ])
          ]),
          vue.createElementVNode("div", _hoisted_21, [
            vue.createElementVNode("button", {
              class: "btn-start",
              disabled: isRunning.value,
              onClick: startTask
            }, " 开始拉黑 ", 8, _hoisted_22)
          ]),
          vue.createElementVNode("div", _hoisted_23, [
            vue.createElementVNode("button", {
              class: "btn-stop",
              disabled: !isRunning.value,
              onClick: stopTask
            }, " 停止任务 ", 8, _hoisted_24)
          ]),
          vue.createVNode(LogViewer, {
            ref: "logViewer",
            filename: "拉黑日志"
          }, null, 512),
          vue.createElementVNode("div", _hoisted_25, [
            _cache[16] || (_cache[16] = vue.createTextVNode(" 已拉黑：", -1)),
            vue.createElementVNode("span", _hoisted_26, vue.toDisplayString(blockedCount.value), 1),
            vue.createTextVNode(vue.toDisplayString(limit.value > 0 ? ` / ${limit.value}` : ""), 1)
          ])
        ]);
      };
    }
  });
  const BlockingTool = _export_sfc(_sfc_main$3, [["__scopeId", "data-v-bba5d353"]]);
  const _hoisted_1$2 = { class: "content-wrapper" };
  const _sfc_main$2 = vue.defineComponent({
    __name: "FloatingBall",
    props: {
      title: {},
      defaultExpanded: { type: Boolean }
    },
    setup(__props) {
      const props = __props;
      const isExpanded = vue.ref(false);
      const isAnimating = vue.ref(false);
      const panelWidth = vue.ref(350);
      const isInitialized = vue.ref(false);
      const isDragging = vue.ref(false);
      const dragMoved = vue.ref(false);
      const startX = vue.ref(0);
      const startY = vue.ref(0);
      const panelX = vue.ref(20);
      const panelY = vue.ref(window.innerHeight * 0.1);
      vue.watch(() => props.defaultExpanded, (newVal) => {
        if (!isInitialized.value && newVal !== void 0) {
          isExpanded.value = newVal;
          isInitialized.value = true;
          if (newVal) {
            setTimeout(snapToEdge, 50);
          }
        }
      }, { immediate: true });
      function updatePanelWidth() {
        const screenWidth = window.innerWidth;
        panelWidth.value = Math.min(350, screenWidth - 40);
      }
      function snapToEdge() {
        const centerX = panelX.value + 30;
        const screenWidth = window.innerWidth;
        let targetX;
        if (isExpanded.value) {
          targetX = centerX < screenWidth / 2 ? 10 : screenWidth - panelWidth.value - 10;
        } else {
          targetX = centerX < screenWidth / 2 ? 10 : screenWidth - 70;
        }
        isAnimating.value = true;
        panelX.value = targetX;
        setTimeout(() => {
          isAnimating.value = false;
        }, 300);
      }
      function handleMouseDown(e) {
        e.preventDefault();
        e.stopPropagation();
        isDragging.value = true;
        dragMoved.value = false;
        startX.value = e.clientX - panelX.value;
        startY.value = e.clientY - panelY.value;
      }
      function handleMouseMove(e) {
        if (isDragging.value) {
          const moveX = Math.abs(e.clientX - startX.value - panelX.value);
          const moveY = Math.abs(e.clientY - startY.value - panelY.value);
          if (moveX > 5 || moveY > 5) {
            dragMoved.value = true;
            panelX.value = e.clientX - startX.value;
            panelY.value = e.clientY - startY.value;
          }
        }
      }
      function handleMouseUp() {
        if (isDragging.value) {
          if (!dragMoved.value) {
            isExpanded.value = !isExpanded.value;
            setTimeout(snapToEdge, 50);
          } else {
            snapToEdge();
          }
        }
        isDragging.value = false;
        dragMoved.value = false;
      }
      function handleResize() {
        updatePanelWidth();
        snapToEdge();
      }
      vue.onMounted(() => {
        updatePanelWidth();
        document.addEventListener("mousemove", handleMouseMove);
        document.addEventListener("mouseup", handleMouseUp);
        window.addEventListener("resize", handleResize);
      });
      vue.onUnmounted(() => {
        document.removeEventListener("mousemove", handleMouseMove);
        document.removeEventListener("mouseup", handleMouseUp);
        window.removeEventListener("resize", handleResize);
      });
      return (_ctx, _cache) => {
        return !isExpanded.value ? (vue.openBlock(), vue.createElementBlock("div", {
          key: 0,
          class: vue.normalizeClass(["float-ball", { animating: isAnimating.value, dragging: isDragging.value }]),
          style: vue.normalizeStyle({ top: `${panelY.value}px`, left: `${panelX.value}px` }),
          onMousedown: handleMouseDown
        }, [..._cache[1] || (_cache[1] = [
          vue.createElementVNode("div", { class: "ball-icon" }, " 🚫 ", -1),
          vue.createElementVNode("div", { class: "ripple" }, null, -1)
        ])], 38)) : (vue.openBlock(), vue.createElementBlock("div", {
          key: 1,
          class: "panel",
          style: vue.normalizeStyle({ top: `${panelY.value}px`, left: `${panelX.value}px`, width: `${panelWidth.value}px` })
        }, [
          vue.createElementVNode("div", {
            class: "header",
            onMousedown: handleMouseDown
          }, [
            vue.createElementVNode("span", null, vue.toDisplayString(__props.title), 1),
            vue.createElementVNode("button", {
              class: "close-btn",
              onClick: _cache[0] || (_cache[0] = ($event) => isExpanded.value = false)
            }, " × ")
          ], 32),
          vue.createElementVNode("div", _hoisted_1$2, [
            vue.renderSlot(_ctx.$slots, "default", {}, void 0, true)
          ])
        ], 4));
      };
    }
  });
  const FloatingBall = _export_sfc(_sfc_main$2, [["__scopeId", "data-v-f83e8372"]]);
  const _hoisted_1$1 = { class: "content" };
  const _hoisted_2$1 = { class: "header" };
  const _hoisted_3$1 = { class: "template-list" };
  const _hoisted_4$1 = { class: "template-info" };
  const _hoisted_5$1 = { class: "template-icon" };
  const _hoisted_6$1 = { class: "template-details" };
  const _hoisted_7 = { class: "template-name" };
  const _hoisted_8 = {
    key: 0,
    class: "template-author"
  };
  const _hoisted_9 = {
    key: 1,
    class: "template-source"
  };
  const _hoisted_10 = { class: "template-keywords" };
  const _hoisted_11 = { class: "template-actions" };
  const _hoisted_12 = ["onClick"];
  const _hoisted_13 = ["onClick"];
  const _hoisted_14 = ["onClick"];
  const _hoisted_15 = { class: "import-section" };
  const _hoisted_16 = { class: "import-actions" };
  const _hoisted_17 = ["disabled"];
  const _hoisted_18 = { class: "form-group" };
  const _hoisted_19 = { class: "form-group" };
  const _hoisted_20 = { class: "form-group" };
  const _sfc_main$1 = vue.defineComponent({
    __name: "TemplateManager",
    setup(__props) {
      const templateStore2 = useTemplateStore();
      const templates = vue.ref(templateStore2.getTemplates());
      const showAddDialog = vue.ref(false);
      const editingTemplate = vue.ref(null);
      const importText = vue.ref("");
      const isSyncing = vue.ref(false);
      const currentTemplate = vue.ref({
        name: "",
        icon: "",
        keywords: ""
      });
      function editTemplate(template) {
        editingTemplate.value = template;
        currentTemplate.value = { ...template };
      }
      function closeDialog() {
        showAddDialog.value = false;
        editingTemplate.value = null;
        currentTemplate.value = { name: "", icon: "", keywords: "" };
      }
      function saveTemplate() {
        if (!currentTemplate.value.name || !currentTemplate.value.keywords) {
          alert("请填写完整信息！");
          return;
        }
        if (editingTemplate.value) {
          templateStore2.updateTemplate(editingTemplate.value.id, currentTemplate.value);
        } else {
          templateStore2.addTemplate(currentTemplate.value);
        }
        templates.value = templateStore2.getTemplates();
        closeDialog();
      }
      function deleteTemplate(index) {
        if (confirm("确定要删除这个预设吗？")) {
          const template = templates.value[index];
          templateStore2.deleteTemplate(template.id);
          templates.value = templateStore2.getTemplates();
        }
      }
      function shareTemplate(template) {
        const shareData = JSON.stringify(template);
        navigator.clipboard.writeText(shareData).then(() => {
          alert("预设已复制到剪贴板！");
        });
      }
      function importTemplate() {
        if (!importText.value.trim()) {
          alert("请输入要导入的预设数据！");
          return;
        }
        try {
          const templateData = JSON.parse(importText.value);
          if (!templateData.name || !templateData.name.trim()) {
            alert("预设名称不能为空！");
            return;
          }
          if (!templateData.keywords || !templateData.keywords.trim()) {
            alert("关键词不能为空！");
            return;
          }
          if (!templateData.icon || !templateData.icon.trim()) {
            templateData.icon = "📋";
          }
          templateStore2.addTemplate({
            name: templateData.name.trim(),
            icon: templateData.icon.trim(),
            keywords: templateData.keywords.trim()
          });
          templates.value = templateStore2.getTemplates();
          importText.value = "";
          alert("预设导入成功！");
        } catch {
          alert("预设数据格式错误！");
        }
      }
      async function syncCommunityTemplates() {
        isSyncing.value = true;
        try {
          const result = await githubTemplateService.syncTemplates();
          if (result.success) {
            templates.value = templateStore2.getTemplates();
            alert(`成功同步 ${result.imported} 个社区预设！`);
          } else {
            alert("同步失败，请检查网络连接！");
          }
        } catch {
          alert("同步失败！");
        } finally {
          isSyncing.value = false;
        }
      }
      vue.onMounted(() => {
        templates.value = templateStore2.getTemplates();
      });
      return (_ctx, _cache) => {
        return vue.openBlock(), vue.createElementBlock("div", _hoisted_1$1, [
          vue.createElementVNode("div", _hoisted_2$1, [
            _cache[6] || (_cache[6] = vue.createElementVNode("h3", null, "预设管理", -1)),
            vue.createElementVNode("div", null, [
              vue.createElementVNode("button", {
                class: "btn-add",
                onClick: _cache[0] || (_cache[0] = ($event) => showAddDialog.value = true)
              }, " ➕ 新建 ")
            ])
          ]),
          vue.createElementVNode("div", _hoisted_3$1, [
            (vue.openBlock(true), vue.createElementBlock(vue.Fragment, null, vue.renderList(templates.value, (template, index) => {
              return vue.openBlock(), vue.createElementBlock("div", {
                key: template.id,
                class: "template-item"
              }, [
                vue.createElementVNode("div", _hoisted_4$1, [
                  vue.createElementVNode("span", _hoisted_5$1, vue.toDisplayString(template.icon), 1),
                  vue.createElementVNode("div", _hoisted_6$1, [
                    vue.createElementVNode("div", _hoisted_7, [
                      vue.createTextVNode(vue.toDisplayString(template.name) + " ", 1),
                      template.source === "community" ? (vue.openBlock(), vue.createElementBlock("span", _hoisted_8, " by " + vue.toDisplayString(template.author), 1)) : template.source === "user" ? (vue.openBlock(), vue.createElementBlock("span", _hoisted_9, " 自定义 ")) : vue.createCommentVNode("", true)
                    ]),
                    vue.createElementVNode("div", _hoisted_10, vue.toDisplayString(template.keywords), 1)
                  ])
                ]),
                vue.createElementVNode("div", _hoisted_11, [
                  vue.createElementVNode("button", {
                    class: "btn-edit",
                    onClick: ($event) => editTemplate(template)
                  }, " ✏️ ", 8, _hoisted_12),
                  vue.createElementVNode("button", {
                    class: "btn-share",
                    onClick: ($event) => shareTemplate(template)
                  }, " 📤 ", 8, _hoisted_13),
                  vue.createElementVNode("button", {
                    class: "btn-delete",
                    onClick: ($event) => deleteTemplate(index)
                  }, " 🗑️ ", 8, _hoisted_14)
                ])
              ]);
            }), 128))
          ]),
          vue.createElementVNode("div", _hoisted_15, [
            _cache[7] || (_cache[7] = vue.createElementVNode("h4", null, "导入预设", -1)),
            vue.withDirectives(vue.createElementVNode("textarea", {
              "onUpdate:modelValue": _cache[1] || (_cache[1] = ($event) => importText.value = $event),
              placeholder: "粘贴预设 JSON 数据...",
              rows: "2"
            }, null, 512), [
              [vue.vModelText, importText.value]
            ]),
            vue.createElementVNode("div", _hoisted_16, [
              vue.createElementVNode("button", {
                class: "btn-import",
                onClick: importTemplate
              }, " 导入 "),
              vue.createElementVNode("button", {
                class: "btn-sync",
                disabled: isSyncing.value,
                onClick: syncCommunityTemplates
              }, vue.toDisplayString(isSyncing.value ? "同步中..." : "同步社区"), 9, _hoisted_17)
            ]),
            _cache[8] || (_cache[8] = vue.createElementVNode("div", { class: "contribute-info" }, [
              vue.createTextVNode(" 🤝 欢迎贡献新预设："),
              vue.createElementVNode("a", {
                href: "https://github.com/Steven-Qiang/block-kit-templates",
                target: "_blank"
              }, "访问 GitHub")
            ], -1))
          ]),
          showAddDialog.value || editingTemplate.value ? (vue.openBlock(), vue.createElementBlock("div", {
            key: 0,
            class: "dialog-overlay",
            onClick: closeDialog
          }, [
            vue.createElementVNode("div", {
              class: "dialog",
              onClick: _cache[5] || (_cache[5] = vue.withModifiers(() => {
              }, ["stop"]))
            }, [
              vue.createElementVNode("h4", null, vue.toDisplayString(editingTemplate.value ? "编辑预设" : "新建预设"), 1),
              vue.createElementVNode("div", _hoisted_18, [
                _cache[9] || (_cache[9] = vue.createElementVNode("label", null, "名称：", -1)),
                vue.withDirectives(vue.createElementVNode("input", {
                  "onUpdate:modelValue": _cache[2] || (_cache[2] = ($event) => currentTemplate.value.name = $event),
                  type: "text",
                  placeholder: "例如：营销号"
                }, null, 512), [
                  [vue.vModelText, currentTemplate.value.name]
                ])
              ]),
              vue.createElementVNode("div", _hoisted_19, [
                _cache[10] || (_cache[10] = vue.createElementVNode("label", null, "图标：", -1)),
                vue.withDirectives(vue.createElementVNode("input", {
                  "onUpdate:modelValue": _cache[3] || (_cache[3] = ($event) => currentTemplate.value.icon = $event),
                  type: "text",
                  placeholder: "例如：📰"
                }, null, 512), [
                  [vue.vModelText, currentTemplate.value.icon]
                ])
              ]),
              vue.createElementVNode("div", _hoisted_20, [
                _cache[11] || (_cache[11] = vue.createElementVNode("label", null, "关键词：", -1)),
                vue.withDirectives(vue.createElementVNode("textarea", {
                  "onUpdate:modelValue": _cache[4] || (_cache[4] = ($event) => currentTemplate.value.keywords = $event),
                  placeholder: "用逗号分隔，例如：新闻,日报,资讯",
                  rows: "2"
                }, null, 512), [
                  [vue.vModelText, currentTemplate.value.keywords]
                ])
              ]),
              vue.createElementVNode("div", { class: "dialog-actions" }, [
                vue.createElementVNode("button", {
                  class: "btn-cancel",
                  onClick: closeDialog
                }, " 取消 "),
                vue.createElementVNode("button", {
                  class: "btn-save",
                  onClick: saveTemplate
                }, " 保存 ")
              ])
            ])
          ])) : vue.createCommentVNode("", true)
        ]);
      };
    }
  });
  const TemplateManager = _export_sfc(_sfc_main$1, [["__scopeId", "data-v-87bf9117"]]);
  const _hoisted_1 = {
    key: 3,
    class: "guide"
  };
  const _hoisted_2 = {
    key: 4,
    class: "nav-section"
  };
  const _hoisted_3 = { class: "footer" };
  const _hoisted_4 = { class: "version" };
  const _hoisted_5 = { class: "copyright" };
  const _hoisted_6 = ["href"];
  const _sfc_main = vue.defineComponent({
    __name: "App",
    setup(__props) {
      const currentPlatform = getCurrentPlatform();
      const showTemplateManager = vue.ref(false);
      const isBlacklistPage = vue.computed(
        () => window.location.href.includes("account.bilibili.com/account/blacklist")
      );
      const title = vue.computed(
        () => isBlacklistPage.value ? "🗑️ 黑名单清理工具" : showTemplateManager.value ? "⚙️ 预设管理" : `🚫 ${currentPlatform?.displayName || "多平台"}自动拉黑工具`
      );
      return (_ctx, _cache) => {
        return vue.openBlock(), vue.createBlock(FloatingBall, {
          title: title.value,
          "default-expanded": isBlacklistPage.value
        }, {
          default: vue.withCtx(() => [
            isBlacklistPage.value ? (vue.openBlock(), vue.createBlock(BlacklistCleaner, { key: 0 })) : showTemplateManager.value ? (vue.openBlock(), vue.createBlock(TemplateManager, { key: 1 })) : (vue.openBlock(), vue.createBlock(BlockingTool, { key: 2 })),
            vue.unref(currentPlatform)?.name === "bilibili" && !isBlacklistPage.value && !showTemplateManager.value ? (vue.openBlock(), vue.createElementBlock("div", _hoisted_1, [..._cache[2] || (_cache[2] = [
              vue.createElementVNode("a", {
                href: "https://account.bilibili.com/account/blacklist",
                target: "_blank",
                class: "guide-link"
              }, " 🗑️ 清理黑名单 ", -1)
            ])])) : vue.createCommentVNode("", true),
            !isBlacklistPage.value ? (vue.openBlock(), vue.createElementBlock("div", _hoisted_2, [
              vue.createElementVNode("button", {
                class: vue.normalizeClass(["nav-btn", { active: !showTemplateManager.value }]),
                onClick: _cache[0] || (_cache[0] = ($event) => showTemplateManager.value = false)
              }, " 🚫 拉黑工具 ", 2),
              vue.createElementVNode("button", {
                class: vue.normalizeClass(["nav-btn", { active: showTemplateManager.value }]),
                onClick: _cache[1] || (_cache[1] = ($event) => showTemplateManager.value = true)
              }, " ⚙️ 预设管理 ", 2)
            ])) : vue.createCommentVNode("", true),
            vue.createElementVNode("div", _hoisted_3, [
              vue.createElementVNode("div", _hoisted_4, " v" + vue.toDisplayString(vue.unref(pkg).version), 1),
              vue.createElementVNode("div", _hoisted_5, " © " + vue.toDisplayString(vue.unref(pkg).author), 1),
              vue.createElementVNode("a", {
                href: vue.unref(pkg).repository.url,
                target: "_blank",
                class: "github-link"
              }, [..._cache[3] || (_cache[3] = [
                vue.createElementVNode("svg", {
                  width: "16",
                  height: "16",
                  viewBox: "0 0 24 24",
                  fill: "currentColor"
                }, [
                  vue.createElementVNode("path", { d: "M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" })
                ], -1),
                vue.createTextVNode(" GitHub ", -1)
              ])], 8, _hoisted_6)
            ])
          ]),
          _: 1
        }, 8, ["title", "default-expanded"]);
      };
    }
  });
  const App = _export_sfc(_sfc_main, [["__scopeId", "data-v-656be68b"]]);
  const wrapperCss = ".social-block-kit-wrapper{all:initial;font-family:-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,Helvetica Neue,Arial,sans-serif;font-size:14px;line-height:1.5;color:#333;box-sizing:border-box}.social-block-kit-wrapper *,.social-block-kit-wrapper *:before,.social-block-kit-wrapper *:after{box-sizing:border-box;font-family:inherit}";
  importCSS(wrapperCss);
  const app = document.createElement("div");
  app.classList.add("social-block-kit-wrapper");
  document.body.append(app);
  vue.createApp(App).mount(app);

})(Vue);