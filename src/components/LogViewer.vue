<template>
  <div class="log-container">
    <div class="log-header">
      <span>执行日志</span>
      <div class="log-controls">
        <button class="log-control-btn" :title="autoScroll ? '关闭自动滚动' : '开启自动滚动'" @click="autoScroll = !autoScroll">
          {{ autoScroll ? '🔓' : '🔒' }}
        </button>
        <button class="log-control-btn" :title="logExpanded ? '收起日志' : '展开日志'" @click="logExpanded = !logExpanded">
          {{ logExpanded ? '▲' : '▼' }}
        </button>
        <button class="log-control-btn" title="导出日志" @click="exportLogs">
          💾
        </button>
      </div>
    </div>
    <div ref="logArea" class="log-area" :class="{ expanded: logExpanded }">
      <div v-if="logs.length === 0" class="log-empty">
        等待开始...
      </div>
      <div v-for="(log, i) in logs" :key="i" class="log-item" :style="{ color: log.color }">
        [{{ log.time }}] {{ log.msg }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { nextTick, ref, useTemplateRef } from 'vue';

interface LogEntry {
  msg: string;
  color: string;
  time: string;
}

interface Props {
  filename?: string;
  logKey?: string;
}

const props = withDefaults(defineProps<Props>(), {
  filename: '日志',
  logKey: 'default',
});

const logs = ref<LogEntry[]>([]);
const logExpanded = ref(false);
const autoScroll = ref(true);
const logAreaRef = useTemplateRef('logArea');

function getLogsKey() {
  return `social-block-kit-logs-${props.logKey}`;
}

function saveLogs() {
  GM_setValue(getLogsKey(), JSON.stringify(logs.value));
}

function loadLogs() {
  try {
    const saved = GM_getValue(getLogsKey(), null);
    if (saved) {
      logs.value = JSON.parse(saved);
    }
  } catch (error) {
    console.error('Failed to load logs:', error);
  }
}

function addLog(msg: string, color = '#333') {
  const time = new Date().toLocaleTimeString();
  logs.value.push({ msg, color, time });
  saveLogs();

  if (autoScroll.value) {
    nextTick(() => {
      logAreaRef.value?.scrollTo(0, logAreaRef.value.scrollHeight);
    });
  }
}

function clearLogs() {
  logs.value = [];
  saveLogs();
}

function exportLogs() {
  if (logs.value.length === 0) {
    alert('没有日志可导出');
    return;
  }

  const logText = logs.value.map((log) => `[${log.time}] ${log.msg}`).join('\n');
  const blob = new Blob([logText], { type: 'text/plain;charset=utf-8' });
  const url = URL.createObjectURL(blob);

  const a = document.createElement('a');
  a.href = url;
  a.download = `${props.filename}_${new Date().toISOString().slice(0, 19).replace(/:/g, '-')}.txt`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

defineExpose({
  addLog,
  clearLogs,
  loadLogs,
  logs: logs.value,
});
</script>

<style scoped>
.log-container {
  margin-bottom: 12px;
}

.log-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 12px;
  background: #f8f9fa;
  border-radius: 4px 4px 0 0;
  border-bottom: 1px solid #eee;
  font-size: 13px;
  font-weight: bold;
  color: #333;
}

.log-controls {
  display: flex;
  gap: 4px;
}

.log-control-btn {
  width: auto;
  padding: 4px 6px;
  font-size: 12px;
  background: none;
  border: 1px solid #ddd;
  border-radius: 3px;
  cursor: pointer;
  transition: all 0.2s;
}

.log-control-btn:hover {
  background: #e9ecef;
}

.log-area {
  padding: 10px;
  background: #f5f5f5;
  border-radius: 0 0 4px 4px;
  font-size: 12px;
  color: #666;
  min-height: 60px;
  max-height: 150px;
  overflow-y: auto;
}

.log-area.expanded {
  max-height: 300px;
}

.log-empty {
  color: #999;
}

.log-item {
  margin-bottom: 4px;
}
</style>
