<!-- eslint-disable no-alert -->
<script setup lang="ts">
import type { User } from '../platforms'
import { ref } from 'vue'
import { getCurrentPlatform } from '../platforms'
import { sleep } from '../utils'

const keyword = ref('')
const limit = ref(10)
const isRunning = ref(false)
const isStopped = ref(false)
const blockedCount = ref(0)
const logs = ref<Array<{ msg: string, color: string, time: string }>>([])
const currentPlatform = getCurrentPlatform()
const onlyVerified = ref(false)

const delay = 1000

function addLog(msg: string, color = '#333') {
  const time = new Date().toLocaleTimeString()
  logs.value.push({ msg, color, time })
}

async function startTask() {
  if (!keyword.value.trim()) {
    alert('请输入搜索关键词！')
    return
  }

  if (!currentPlatform) {
    alert('当前平台不支持！请在抖音或哔哩哔哩网页版使用')
    return
  }

  isRunning.value = true
  isStopped.value = false
  let currentPage = 0
  blockedCount.value = 0
  logs.value = []

  addLog(`[${currentPlatform.displayName}] 开始搜索「${keyword.value}」，目标拉黑 ${limit.value} 个用户`, '#667eea')

  while (!isStopped.value && blockedCount.value < limit.value) {
    addLog(`获取第 ${currentPage + 1} 页用户...`, '#2196F3')
    const { users, hasMore } = await currentPlatform.searchUsers(keyword.value, currentPage)

    if (users.length === 0) {
      addLog('无更多用户，任务结束', '#ff9800')
      break
    }

    for (const item of users) {
      if (blockedCount.value >= limit.value || isStopped.value)
        break

      const user: User = {
        nickname: item.user_info.nickname,
        uid: item.user_info.uid,
        sec_uid: item.user_info.sec_uid,
      }

      const isBlocked = currentPlatform.name === 'douyin'
        ? item.user_info.user_tags?.some((tag: any) => tag.type === 'blocked_label')
        : item.user_info.is_blocked

      if (isBlocked) {
        addLog(`已拉黑：${user.nickname}（跳过）`, '#999')
        continue
      }

      if (onlyVerified.value && currentPlatform.name === 'bilibili' && !item.user_info.official_verify) {
        addLog(`非认证用户：${user.nickname}（跳过）`, '#999')
        continue
      }

      if (await currentPlatform.blockUser(user)) {
        blockedCount.value++
        addLog(`✅ 拉黑成功：${user.nickname}`, '#4caf50')
      }
      else {
        addLog(`❌ 拉黑失败：${user.nickname}`, '#ff5722')
      }
      await sleep(delay)
    }

    if (!hasMore)
      break
    currentPage++
    await sleep(delay * 2)
  }

  addLog(`任务结束！成功拉黑 ${blockedCount.value} 个用户`, '#667eea')
  isRunning.value = false
}

function stopTask() {
  isStopped.value = true
  addLog('任务已停止', '#ff5722')
}
</script>

<template>
  <div class="content">
    <div class="form-group">
      <label>搜索关键词：</label>
      <input v-model="keyword" type="text" placeholder="例如：新闻" :disabled="isRunning">
    </div>
    <div class="form-group">
      <label>拉黑数量：</label>
      <input v-model.number="limit" type="number" min="1" max="50" :disabled="isRunning">
    </div>
    <div v-if="currentPlatform?.name === 'bilibili'" class="form-group">
      <label class="checkbox-label">
        <input v-model="onlyVerified" type="checkbox" :disabled="isRunning">
        只拉黑认证用户
      </label>
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
    <div class="log-area">
      <div v-if="logs.length === 0" class="log-empty">
        等待开始...
      </div>
      <div v-for="(log, i) in logs" :key="i" class="log-item" :style="{ color: log.color }">
        [{{ log.time }}] {{ log.msg }}
      </div>
    </div>
    <div class="counter">
      已拉黑：<span class="count">{{ blockedCount }}</span> / {{ limit }}
    </div>
  </div>
</template>

<style scoped>
.content {
  padding: 16px;
}

.form-group {
  margin-bottom: 12px;
}

label {
  display: block;
  margin-bottom: 4px;
  font-size: 13px;
  color: #333;
}

input[type="text"],
input[type="number"] {
  width: 100%;
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
  box-sizing: border-box;
  font-size: 13px;
}

.checkbox-label {
  display: flex;
  align-items: center;
  font-size: 13px;
  color: #333;
  cursor: pointer;
}

.checkbox-label input[type="checkbox"] {
  width: auto;
  margin-right: 6px;
}

input:disabled {
  background: #f5f5f5;
  cursor: not-allowed;
}

button {
  width: 100%;
  padding: 10px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  font-weight: bold;
}

.btn-start {
  background: #667eea;
  color: #fff;
}

.btn-start:disabled {
  background: #ccc;
  cursor: not-allowed;
}

.btn-stop {
  background: #ff5722;
  color: #fff;
}

.btn-stop:disabled {
  background: #ccc;
  cursor: not-allowed;
}

.log-area {
  padding: 10px;
  background: #f5f5f5;
  border-radius: 4px;
  font-size: 12px;
  color: #666;
  min-height: 60px;
  max-height: 150px;
  overflow-y: auto;
}

.log-empty {
  color: #999;
}

.log-item {
  margin-bottom: 4px;
}

.counter {
  margin-top: 8px;
  font-size: 12px;
  color: #999;
  text-align: center;
}

.count {
  color: #667eea;
  font-weight: bold;
}
</style>
