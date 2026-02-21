<!-- eslint-disable no-alert -->
<template>
  <div class="content">
    <div v-if="PlatformUtils.isDouyin(currentPlatform) && isDouyinSearchPage" class="warning-banner">
      ⚠️ 不建议在抖音搜索页面使用本脚本，可能触发风控导致搜索失败！请切换到其他页面使用。
    </div>
    <div class="form-group">
      <label>搜索关键词：</label>
      <div class="input-with-dropdown">
        <input v-model="state.keyword" type="text" placeholder="用逗号分隔，例如：新闻,日报,资讯" :disabled="state.isRunning">
        <div ref="dropdownRef" class="template-dropdown">
          <button
            class="dropdown-btn"
            title="选择预设关键词模板"
            :disabled="state.isRunning"
            @click="showDropdown = !showDropdown"
          >
            📋 预设 ▼
          </button>
          <div v-if="showDropdown" class="dropdown-menu">
            <div
              v-for="template in keywordTemplates"
              :key="template.id"
              class="dropdown-item"
              @click="applyTemplate(template.keywords)"
            >
              <span class="item-icon">{{ template.icon }}</span>
              <span class="item-name">{{ template.name }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="form-group">
      <label>目标拉黑数量(每个关键词)：</label>
      <input v-model.number="state.limit" type="number" min="0" :disabled="state.isRunning">
      <div class="hint">
        数量 0 表示不限制，直到无搜索结果
      </div>
    </div>
    <div class="form-group">
      <label class="checkbox-label">
        <input v-model="state.onlyVerified" type="checkbox" :disabled="state.isRunning">
        只拉黑认证用户
      </label>
    </div>
    <div v-if="state.onlyVerified && PlatformUtils.isDouyin(currentPlatform)" class="form-group">
      <label>认证类型关键词（可选）：</label>
      <input v-model="state.verifyFilter" type="text" placeholder="例如：官方,媒体,新闻" :disabled="state.isRunning">
      <div class="hint">
        过滤包含指定关键词的认证类型，用逗号分隔，留空表示不过滤
      </div>
    </div>
    <div class="form-group">
      <div class="advanced-toggle" @click="state.showAdvanced = !state.showAdvanced">
        <span>高级设置</span>
        <span class="arrow" :class="{ expanded: state.showAdvanced }">▼</span>
      </div>
      <div v-show="state.showAdvanced" class="advanced-content">
        <div class="advanced-item">
          <label>操作间隔（毫秒）：</label>
          <input v-model.number="state.delay" type="number" step="100" :disabled="state.isRunning">
          <div class="hint">
            每次拉黑后的等待时间
          </div>
        </div>
        <div class="advanced-item">
          <label>翻页间隔（毫秒）：</label>
          <input v-model.number="state.pageDelay" type="number" step="100" :disabled="state.isRunning">
          <div class="hint">
            每次翻页后的等待时间
          </div>
        </div>
      </div>
    </div>
    <div class="form-group">
      <button class="btn-start" title="开始执行拉黑任务" :disabled="state.isRunning" @click="startTask">
        开始拉黑
      </button>
    </div>
    <div class="form-group">
      <button class="btn-stop" title="停止当前拉黑任务" :disabled="!state.isRunning" @click="stopTask">
        停止任务
      </button>
    </div>
    <log-viewer ref="logViewer" filename="拉黑日志" :log-key="`blocking-${currentPlatform?.name || 'unknown'}`" />
    <div class="counter">
      <span v-if="state.currentKeyword">{{ state.currentKeyword }}：已拉黑：<span class="count">{{ state.keywordBlockedCount }}</span>{{ state.limit > 0 ? ` / ${state.limit}` : '' }} | 总计：<span class="count">{{ state.blockedCount }}</span></span>
      <span v-else>已拉黑：<span class="count">{{ state.blockedCount }}</span></span>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { User } from '../platforms';
import { onMounted, onUnmounted, reactive, ref, useTemplateRef, watch } from 'vue';
import { getCurrentPlatform, LogColors, PlatformUtils } from '../platforms';
import { useTemplateStore } from '../stores/templateStore';
import { sleep } from '../utils';
import LogViewer from './LogViewer.vue';

const state = reactive({
  keyword: '',
  limit: 10,
  isRunning: false,
  isStopped: false,
  blockedCount: 0,
  keywordBlockedCount: 0,
  currentKeyword: '',
  onlyVerified: false,
  verifyFilter: '',
  showAdvanced: false,
  delay: 1000,
  pageDelay: 2000,
});

const currentPlatform = getCurrentPlatform();
const logViewerRef = useTemplateRef('logViewer');
const isDouyinSearchPage = ref(false);

const SETTINGS_KEY = 'social-block-kit-settings';

function saveSettings() {
  GM_setValue(SETTINGS_KEY, JSON.stringify(state));
}

function loadSettings() {
  try {
    const saved = GM_getValue(SETTINGS_KEY, null);
    if (saved) {
      const settings = JSON.parse(saved);
      Object.assign(state, {
        keyword: settings.keyword ?? '',
        limit: settings.limit ?? 10,
        onlyVerified: settings.onlyVerified ?? false,
        verifyFilter: settings.verifyFilter ?? '',
        delay: settings.delay ?? 1000,
        pageDelay: settings.pageDelay ?? 2000,
        showAdvanced: settings.showAdvanced ?? false,
        blockedCount: settings.blockedCount ?? 0,
        keywordBlockedCount: settings.keywordBlockedCount ?? 0,
        currentKeyword: settings.currentKeyword ?? '',
      });
    }
  } catch (error) {
    console.error('Failed to load settings:', error);
  }
}
const templateStore = useTemplateStore();
const keywordTemplates = ref(templateStore.getTemplates());
const showDropdown = ref(false);
const dropdownRef = useTemplateRef('dropdownRef');

function applyTemplate(keywords: string) {
  state.keyword = keywords;
  showDropdown.value = false;
}

function handleClickOutside(event: MouseEvent) {
  if (dropdownRef.value && !dropdownRef.value.contains(event.target as Node)) {
    showDropdown.value = false;
  }
}

onMounted(() => {
  loadSettings();
  keywordTemplates.value = templateStore.getTemplates();
  document.addEventListener('click', handleClickOutside);

  // 检查是否在抖音搜索页面
  if (PlatformUtils.isDouyin(currentPlatform)) {
    isDouyinSearchPage.value = location.pathname.includes('/search/');
  }

  // 恢复日志
  setTimeout(() => {
    logViewerRef.value?.loadLogs();
  }, 100);
});

// 实时保存设置
watch(state, () => {
  saveSettings();
}, { deep: true });

onUnmounted(() => {
  saveSettings();
  document.removeEventListener('click', handleClickOutside);
});

function addLog(msg: string, color = LogColors.MUTED) {
  logViewerRef.value?.addLog(msg, color);
  saveSettings();
}

async function startTask() {
  if (!state.keyword.trim()) {
    alert('请输入搜索关键词！');
    return;
  }

  if (state.limit < 0) {
    alert('拉黑数量输入不正确');
    return;
  }

  if (!currentPlatform) {
    alert('当前平台不支持！请在抖音或哔哩哔哩网页版使用');
    return;
  }

  state.isRunning = true;
  state.isStopped = false;
  state.blockedCount = 0;
  state.keywordBlockedCount = 0;
  state.currentKeyword = '';
  logViewerRef.value?.clearLogs();

  const keywords = state.keyword.split(/[,，]/).map((k) => k.trim()).filter((k) => k);

  for (let i = 0; i < keywords.length && !state.isStopped; i++) {
    const currentKeyword = keywords[i];
    addLog(`[${i + 1}/${keywords.length}] 开始处理关键词「${currentKeyword}」`, LogColors.PRIMARY);

    await processKeyword(currentKeyword);

    if (i < keywords.length - 1 && !state.isStopped) {
      addLog(`关键词「${currentKeyword}」处理完成，等待 2 秒后处理下一个...`, LogColors.MUTED);
      await sleep(2000);
    }
  }

  addLog(`所有任务结束！共成功拉黑 ${state.blockedCount} 个用户`, LogColors.PRIMARY);
  state.isRunning = false;
}

async function processKeyword(keywordName: string) {
  state.currentKeyword = keywordName;
  state.keywordBlockedCount = 0;
  let currentPage = 0;

  while (!state.isStopped && (state.limit === 0 || state.keywordBlockedCount < state.limit)) {
    addLog(`获取第 ${currentPage + 1} 页用户...`, LogColors.INFO);
    const { users, hasMore } = await currentPlatform!.searchUsers(keywordName, currentPage, (msg) => {
      addLog(msg, LogColors.INFO);
    });

    if (users.length === 0) {
      addLog('无更多用户，任务结束', LogColors.WARNING);
      break;
    }

    for (const item of users) {
      if ((state.limit > 0 && state.keywordBlockedCount >= state.limit) || state.isStopped)
        break;

      const user: User = {
        nickname: item.user_info.nickname,
        uid: item.user_info.uid,
        sec_uid: item.user_info.sec_uid,
      };

      const isBlocked = PlatformUtils.isUserBlocked(currentPlatform!, item.user_info);

      if (isBlocked) {
        addLog(`已拉黑：${user.nickname}（跳过）`, LogColors.MUTED);
        continue;
      }

      if (state.onlyVerified && !PlatformUtils.isVerifiedUser(currentPlatform!, item.user_info)) {
        addLog(`非认证用户：${user.nickname}（跳过）`, LogColors.MUTED);
        continue;
      }

      if (state.onlyVerified && state.verifyFilter && PlatformUtils.isDouyin(currentPlatform)) {
        const verifyType = PlatformUtils.getVerifyType(currentPlatform!, item.user_info);
        if (verifyType) {
          const filters = state.verifyFilter.split(/[,，]/).map((f) => f.trim()).filter((f) => f);
          const matched = filters.some((filter) => verifyType.includes(filter));
          if (!matched) {
            addLog(`认证类型不匹配：${user.nickname} [${verifyType}]（跳过）`, LogColors.MUTED);
            continue;
          }
        }
      }

      if (await currentPlatform!.blockUser(user)) {
        state.keywordBlockedCount++;
        state.blockedCount++;
        addLog(`✅ 拉黑成功：${user.nickname}`, LogColors.SUCCESS);
      } else {
        addLog(`❌ 拉黑失败：${user.nickname}`, LogColors.ERROR);
      }
      await sleep(state.delay);
    }

    if (!hasMore)
      break;
    currentPage++;
    await sleep(state.pageDelay);
  }

  addLog(`关键词「${keywordName}」处理完成，拉黑 ${state.keywordBlockedCount} 个用户`, LogColors.PRIMARY);
}

function stopTask() {
  state.isStopped = true;
  addLog('任务已停止', LogColors.ERROR);
}
</script>

<style scoped>
@import '../styles/common.css';

.count {
  color: #667eea;
}

.hint {
  font-size: 11px;
  color: #999;
  margin-top: 10px;
  margin-left: 2px;
}

.advanced-toggle {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 12px;
  background: #f5f5f5;
  border-radius: 4px;
  cursor: pointer;
  font-size: 13px;
  color: #667eea;
  transition: background-color 0.2s;
  user-select: none;
}

.advanced-toggle:hover {
  background: #ebebeb;
}

.arrow {
  font-size: 10px;
  transition: transform 0.2s;
}

.arrow.expanded {
  transform: rotate(180deg);
}

.advanced-content {
  margin-top: 8px;
  padding: 12px;
  background: #fafafa;
  border-radius: 4px;
  border: 1px solid #eee;
}

.advanced-item {
  margin-bottom: 12px;
}

.advanced-item:last-child {
  margin-bottom: 0;
}

.input-with-dropdown {
  display: flex;
  gap: 4px;
}

.input-with-dropdown input {
  flex: 1;
}

.template-dropdown {
  position: relative;
}

.dropdown-btn {
  padding: 8px 12px;
  font-size: 11px;
  background: #f0f4ff;
  border: 1px solid #d0d9ff;
  border-radius: 4px;
  color: #667eea;
  cursor: pointer;
  transition: all 0.2s;
  white-space: nowrap;
}

.dropdown-btn:hover:not(:disabled) {
  background: #e6edff;
  border-color: #b8c5ff;
}

.dropdown-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.dropdown-menu {
  position: absolute;
  top: 100%;
  right: 0;
  min-width: 150px;
  background: white;
  border: 1px solid #ddd;
  border-radius: 4px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  z-index: 1000;
  max-height: 200px;
  overflow-y: auto;
}

.dropdown-item {
  display: flex;
  align-items: center;
  padding: 8px 12px;
  cursor: pointer;
  transition: background-color 0.2s;
  font-size: 12px;
}

.dropdown-item:hover {
  background: #f5f5f5;
}

.item-icon {
  margin-right: 8px;
  font-size: 14px;
}

.item-name {
  flex: 1;
}

.warning-banner {
  background: #fff3cd;
  border: 1px solid #ffc107;
  border-radius: 4px;
  padding: 8px 12px;
  margin-bottom: 12px;
  color: #856404;
  font-size: 12px;
  line-height: 1.5;
}
</style>
