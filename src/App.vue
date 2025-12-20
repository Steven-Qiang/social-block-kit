<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref } from 'vue'
import BlacklistCleaner from './components/BlacklistCleaner.vue'
import BlockingTool from './components/BlockingTool.vue'
import { getCurrentPlatform } from './platforms'

const currentPlatform = getCurrentPlatform()
const isBlacklistPage = computed(() =>
  window.location.href.includes('account.bilibili.com/account/blacklist'),
)

// 拖拽功能
const isDragging = ref(false)
const startX = ref(0)
const startY = ref(0)
const panelX = ref(window.innerWidth - 300)
const panelY = ref(20)

function handleMouseDown(e: MouseEvent) {
  isDragging.value = true
  startX.value = e.clientX - panelX.value
  startY.value = e.clientY - panelY.value
}

function handleMouseMove(e: MouseEvent) {
  if (isDragging.value) {
    panelX.value = e.clientX - startX.value
    panelY.value = e.clientY - startY.value
  }
}

function handleMouseUp() {
  isDragging.value = false
}

onMounted(() => {
  document.addEventListener('mousemove', handleMouseMove)
  document.addEventListener('mouseup', handleMouseUp)
})

onUnmounted(() => {
  document.removeEventListener('mousemove', handleMouseMove)
  document.removeEventListener('mouseup', handleMouseUp)
})
</script>

<template>
  <div
    class="panel"
    :style="{ top: `${panelY}px`, left: `${panelX}px` }"
  >
    <div class="header" @mousedown="handleMouseDown">
      {{ isBlacklistPage ? '🗑️ 黑名单清理工具' : `🚫 ${currentPlatform?.displayName || '多平台'}自动拉黑工具` }}
    </div>
    <BlacklistCleaner v-if="isBlacklistPage" />
    <BlockingTool v-else />
    <div v-if="currentPlatform?.name === 'bilibili' && !isBlacklistPage" class="guide">
      <a href="https://account.bilibili.com/account/blacklist" target="_blank" class="guide-link">
        🗑️ 清理黑名单
      </a>
    </div>
  </div>
</template>

<style scoped>
.panel {
  position: fixed;
  width: 280px;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.15);
  z-index: 999999;
  font-family: Arial, sans-serif;
}

.header {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: #fff;
  padding: 12px 16px;
  border-radius: 8px 8px 0 0;
  font-weight: bold;
  cursor: move;
  user-select: none;
}

.guide {
  padding: 8px 16px;
  border-top: 1px solid #eee;
}

.guide-link {
  display: block;
  text-align: center;
  color: #667eea;
  text-decoration: none;
  font-size: 13px;
  padding: 6px;
  border-radius: 4px;
  transition: background-color 0.2s;
}

.guide-link:hover {
  background-color: #f5f5f5;
}
</style>
