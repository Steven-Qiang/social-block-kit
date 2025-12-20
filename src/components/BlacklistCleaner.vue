<script setup lang="ts">
import { ref } from 'vue'
import { sleep } from '../utils'

const isRunning = ref(false)
const isStopped = ref(false)
const removedCount = ref(0)
const logs = ref<Array<{ msg: string, color: string, time: string }>>([])

function addLog(msg: string, color = '#333') {
  const time = new Date().toLocaleTimeString()
  logs.value.push({ msg, color, time })
}

async function startCleanup() {
  isRunning.value = true
  isStopped.value = false
  removedCount.value = 0
  logs.value = []

  addLog('开始清理黑名单...', '#667eea')

  let page = 1
  let totalRemoved = 0

  while (!isStopped.value) {
    const res = await fetch(`https://api.bilibili.com/x/relation/blacks?re_version=0&pn=${page}&ps=50&jsonp=jsonp&web_location=333.33`, {
      credentials: 'include',
    })
    const data = await res.json()
    const list = data.data?.list || []

    if (list.length === 0) {
      addLog('黑名单已清空', '#4caf50')
      break
    }

    addLog(`处理第 ${page} 页，共 ${list.length} 个用户`, '#2196F3')

    for (const item of list) {
      if (isStopped.value)
        break

      if (await removeFromBlacklist(item.mid)) {
        totalRemoved++
        removedCount.value = totalRemoved
        addLog(`✅ 移除成功：${item.uname}`, '#4caf50')
      }
      else {
        addLog(`❌ 移除失败：${item.uname}`, '#ff5722')
      }
      await sleep(500)
    }

    page++
    await sleep(1000)
  }

  addLog(`清理完成！共移除 ${totalRemoved} 个用户`, '#667eea')
  isRunning.value = false
}

async function removeFromBlacklist(uid: string): Promise<boolean> {
  const csrf = getCsrfToken()
  if (!csrf)
    return false

  const body = `fid=${uid}&act=6&re_src=11&csrf=${csrf}`

  const res = await fetch('https://api.bilibili.com/x/relation/modify', {
    method: 'POST',
    headers: {
      'content-type': 'application/x-www-form-urlencoded',
    },
    body,
    credentials: 'include',
  })

  const data = await res.json()
  return data.code === 0
}

function getCsrfToken(): string | null {
  const match = document.cookie.match(/bili_jct=([^;]+)/)
  return match ? match[1] : null
}

function stopCleanup() {
  isStopped.value = true
  addLog('清理已停止', '#ff5722')
}
</script>

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
    <div class="log-area">
      <div v-if="logs.length === 0" class="log-empty">
        等待开始...
      </div>
      <div v-for="(log, i) in logs" :key="i" class="log-item" :style="{ color: log.color }">
        [{{ log.time }}] {{ log.msg }}
      </div>
    </div>
    <div class="counter">
      已移除：<span class="count">{{ removedCount }}</span> 个用户
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
  background: #ff5722;
  color: #fff;
}

.btn-start:disabled {
  background: #ccc;
  cursor: not-allowed;
}

.btn-stop {
  background: #666;
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
  color: #ff5722;
  font-weight: bold;
}
</style>
