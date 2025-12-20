<template>
  <div class="content">
    <div class="form-group">
      <button class="btn-start" :disabled="isRunning" @click="startCleanup">
        开始清理黑名单
      </button>
    </div>
    <div class="form-group">
      <button class="btn-stop" :disabled="!isRunning" @click="stopCleanup">
        停止清理
      </button>
    </div>
    <log-viewer ref="logViewer" filename="清理日志" />
    <div class="counter">
      已移除：<span class="count">{{ removedCount }}</span> 个用户
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, useTemplateRef } from 'vue';
import { sleep } from '../utils';
import LogViewer from './LogViewer.vue';

const isRunning = ref(false);
const isStopped = ref(false);
const removedCount = ref(0);
const logViewerRef = useTemplateRef('logViewer');

function addLog(msg: string, color = '#333') {
  logViewerRef.value?.addLog(msg, color);
}

async function startCleanup() {
  isRunning.value = true;
  isStopped.value = false;
  removedCount.value = 0;
  logViewerRef.value?.clearLogs();

  addLog('开始清理黑名单...', '#667eea');

  let page = 1;
  let totalRemoved = 0;

  while (!isStopped.value) {
    const res = await fetch(`https://api.bilibili.com/x/relation/blacks?re_version=0&pn=${page}&ps=50&jsonp=jsonp&web_location=333.33`, {
      credentials: 'include',
    });
    const data = await res.json();
    const list = data.data?.list || [];

    if (list.length === 0) {
      addLog('黑名单已清空', '#4caf50');
      break;
    }

    addLog(`处理第 ${page} 页，共 ${list.length} 个用户`, '#2196F3');

    for (const item of list) {
      if (isStopped.value)
        break;

      if (await removeFromBlacklist(item.mid)) {
        totalRemoved++;
        removedCount.value = totalRemoved;
        addLog(`✅ 移除成功：${item.uname}`, '#4caf50');
      } else {
        addLog(`❌ 移除失败：${item.uname}`, '#ff5722');
      }
      await sleep(500);
    }

    page++;
    await sleep(1000);
  }

  addLog(`清理完成！共移除 ${totalRemoved} 个用户`, '#667eea');
  isRunning.value = false;
}

async function removeFromBlacklist(uid: string): Promise<boolean> {
  const csrf = getCsrfToken();
  if (!csrf)
    return false;

  const body = `fid=${uid}&act=6&re_src=11&csrf=${csrf}`;

  const res = await fetch('https://api.bilibili.com/x/relation/modify', {
    method: 'POST',
    headers: {
      'content-type': 'application/x-www-form-urlencoded',
    },
    body,
    credentials: 'include',
  });

  const data = await res.json();
  return data.code === 0;
}

function getCsrfToken(): string | null {
  const match = document.cookie.match(/bili_jct=([^;]+)/);
  return match ? match[1] : null;
}

function stopCleanup() {
  isStopped.value = true;
  addLog('清理已停止', '#ff5722');
}
</script>

<style scoped>
@import '../styles/common.css';

.btn-start {
  background: #ff5722;
}

.count {
  color: #ff5722;
}
</style>
