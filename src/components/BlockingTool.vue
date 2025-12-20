<!-- eslint-disable no-alert -->
<template>
  <div class="content">
    <div class="form-group">
      <label>搜索关键词：</label>
      <div class="input-with-dropdown">
        <input v-model="keyword" type="text" placeholder="用逗号分隔，例如：新闻,日报,资讯" :disabled="isRunning">
        <div ref="dropdownRef" class="template-dropdown">
          <button
            class="dropdown-btn"
            :disabled="isRunning"
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
      <label>拉黑数量：</label>
      <input v-model.number="limit" type="number" min="0" max="50" :disabled="isRunning">
      <div class="hint">
        拉黑数量0表示不限制，直到无搜索结果
      </div>
    </div>
    <div v-if="PlatformUtils.isBilibili(currentPlatform)" class="form-group">
      <label class="checkbox-label">
        <input v-model="onlyVerified" type="checkbox" :disabled="isRunning">
        只拉黑认证用户
      </label>
    </div>
    <div class="form-group">
      <div class="advanced-toggle" @click="showAdvanced = !showAdvanced">
        <span>高级设置</span>
        <span class="arrow" :class="{ expanded: showAdvanced }">▼</span>
      </div>
      <div v-show="showAdvanced" class="advanced-content">
        <div class="advanced-item">
          <label>操作间隔（毫秒）：</label>
          <input v-model.number="delay" type="number" min="500" max="5000" step="100" :disabled="isRunning">
          <div class="hint">
            每次拉黑后的等待时间
          </div>
        </div>
        <div class="advanced-item">
          <label>翻页间隔（毫秒）：</label>
          <input v-model.number="pageDelay" type="number" min="1000" max="10000" step="100" :disabled="isRunning">
          <div class="hint">
            每次翻页后的等待时间
          </div>
        </div>
      </div>
    </div>
    <div class="form-group">
      <button class="btn-start" :disabled="isRunning" @click="startTask">
        开始拉黑
      </button>
    </div>
    <div class="form-group">
      <button class="btn-stop" :disabled="!isRunning" @click="stopTask">
        停止任务
      </button>
    </div>
    <log-viewer ref="logViewer" filename="拉黑日志" />
    <div class="counter">
      已拉黑：<span class="count">{{ blockedCount }}</span>{{ limit > 0 ? ` / ${limit}` : '' }}
    </div>
  </div>
</template>

<script setup lang="ts">
import type { User } from '../platforms';
import { onMounted, onUnmounted, ref, useTemplateRef } from 'vue';
import { getCurrentPlatform, LogColors, PlatformUtils } from '../platforms';
import { useTemplateStore } from '../stores/templateStore';
import { sleep } from '../utils';
import LogViewer from './LogViewer.vue';

const keyword = ref('');
const limit = ref(10);
const isRunning = ref(false);
const isStopped = ref(false);
const blockedCount = ref(0);
const currentPlatform = getCurrentPlatform();
const onlyVerified = ref(false);
const showAdvanced = ref(false);
const logViewerRef = useTemplateRef('logViewer');

const delay = ref(1000);
const pageDelay = ref(2000);
const templateStore = useTemplateStore();
const keywordTemplates = ref(templateStore.getTemplates());
const showDropdown = ref(false);
const dropdownRef = useTemplateRef('dropdownRef');

function applyTemplate(keywords: string) {
  keyword.value = keywords;
  showDropdown.value = false;
}

function handleClickOutside(event: MouseEvent) {
  if (dropdownRef.value && !dropdownRef.value.contains(event.target as Node)) {
    showDropdown.value = false;
  }
}

onMounted(() => {
  keywordTemplates.value = templateStore.getTemplates();
  document.addEventListener('click', handleClickOutside);
});

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside);
});

function addLog(msg: string, color = LogColors.MUTED) {
  logViewerRef.value?.addLog(msg, color);
}

async function startTask() {
  if (!keyword.value.trim()) {
    alert('请输入搜索关键词！');
    return;
  }

  if (limit.value < 0) {
    alert('拉黑数量输入不正确');
    return;
  }

  if (!currentPlatform) {
    alert('当前平台不支持！请在抖音或哔哩哔哩网页版使用');
    return;
  }

  isRunning.value = true;
  isStopped.value = false;
  blockedCount.value = 0;
  logViewerRef.value?.clearLogs();

  const keywords = keyword.value.split(/[,，]/).map((k) => k.trim()).filter((k) => k);

  for (let i = 0; i < keywords.length && !isStopped.value; i++) {
    const currentKeyword = keywords[i];
    addLog(`[${i + 1}/${keywords.length}] 开始处理关键词「${currentKeyword}」`, LogColors.PRIMARY);

    await processKeyword(currentKeyword);

    if (i < keywords.length - 1 && !isStopped.value) {
      addLog(`关键词「${currentKeyword}」处理完成，等待 2 秒后处理下一个...`, LogColors.MUTED);
      await sleep(2000);
    }
  }

  addLog(`所有任务结束！共成功拉黑 ${blockedCount.value} 个用户`, LogColors.PRIMARY);
  isRunning.value = false;
}

async function processKeyword(currentKeyword: string) {
  let currentPage = 0;
  const keywordStartCount = blockedCount.value;

  while (!isStopped.value && (limit.value === 0 || blockedCount.value < limit.value)) {
    addLog(`获取第 ${currentPage + 1} 页用户...`, LogColors.INFO);
    const { users, hasMore } = await currentPlatform!.searchUsers(currentKeyword, currentPage, (msg) => {
      addLog(msg, LogColors.INFO);
    });

    if (users.length === 0) {
      addLog('无更多用户，任务结束', LogColors.WARNING);
      break;
    }

    for (const item of users) {
      if ((limit.value > 0 && blockedCount.value >= limit.value) || isStopped.value)
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

      if (onlyVerified.value && PlatformUtils.isBilibili(currentPlatform) && !PlatformUtils.isVerifiedUser(currentPlatform!, item.user_info)) {
        addLog(`非认证用户：${user.nickname}（跳过）`, LogColors.MUTED);
        continue;
      }

      if (await currentPlatform!.blockUser(user)) {
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
</style>
