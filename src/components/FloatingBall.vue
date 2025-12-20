<template>
  <div
    v-if="!isExpanded"
    class="float-ball"
    :class="{ animating: isAnimating, dragging: isDragging }"
    :style="{ top: `${panelY}px`, left: `${panelX}px` }"
    @mousedown="handleMouseDown"
  >
    <div class="ball-icon">
      🚫
    </div>
    <div class="ripple" />
  </div>
  <div
    v-else
    class="panel"
    :style="{ top: `${panelY}px`, left: `${panelX}px`, width: `${panelWidth}px` }"
  >
    <div class="header" @mousedown="handleMouseDown">
      <span>{{ title }}</span>
      <button class="close-btn" @click="isExpanded = false">
        ×
      </button>
    </div>
    <div class="content-wrapper">
      <slot />
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted, ref, watch } from 'vue';

interface Props {
  title: string;
  defaultExpanded?: boolean;
}

const props = defineProps<Props>();

const isExpanded = ref(false);
const isAnimating = ref(false);
const panelWidth = ref(350);
const isInitialized = ref(false);

const isDragging = ref(false);
const dragMoved = ref(false);
const startX = ref(0);
const startY = ref(0);
const panelX = ref(20);
const panelY = ref(window.innerHeight * 0.1);

watch(() => props.defaultExpanded, (newVal) => {
  if (!isInitialized.value && newVal !== undefined) {
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

function handleMouseDown(e: MouseEvent) {
  e.preventDefault();
  e.stopPropagation();
  isDragging.value = true;
  dragMoved.value = false;
  startX.value = e.clientX - panelX.value;
  startY.value = e.clientY - panelY.value;
}

function handleMouseMove(e: MouseEvent) {
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

onMounted(() => {
  updatePanelWidth();
  document.addEventListener('mousemove', handleMouseMove);
  document.addEventListener('mouseup', handleMouseUp);
  window.addEventListener('resize', handleResize);
});

onUnmounted(() => {
  document.removeEventListener('mousemove', handleMouseMove);
  document.removeEventListener('mouseup', handleMouseUp);
  window.removeEventListener('resize', handleResize);
});
</script>

<style scoped>
.float-ball {
  position: fixed;
  width: 60px;
  height: 60px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  font-size: 24px;
  cursor: pointer;
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
  z-index: 999999;
  user-select: none;
  overflow: hidden;
  transition:
    transform 0.2s cubic-bezier(0.4, 0, 0.2, 1),
    box-shadow 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  transform: scale(1);
}

.float-ball.animating {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.float-ball.dragging {
  transition: none;
  transform: scale(1.1);
  box-shadow: 0 8px 20px rgba(102, 126, 234, 0.6);
}

.float-ball:hover {
  transform: scale(1.1);
  box-shadow: 0 6px 16px rgba(102, 126, 234, 0.5);
}

.float-ball:active {
  transform: scale(0.95);
}

.ball-icon {
  position: relative;
  z-index: 2;
  transition: transform 0.2s;
}

.ripple {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 0;
  height: 0;
  background: rgba(255, 255, 255, 0.3);
  border-radius: 50%;
  transform: translate(-50%, -50%);
  animation: ripple 2s infinite;
}

@keyframes ripple {
  0% {
    width: 0;
    height: 0;
    opacity: 1;
  }
  100% {
    width: 120px;
    height: 120px;
    opacity: 0;
  }
}

.panel {
  position: fixed;
  min-width: 300px;
  max-width: 90vw;
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.15);
  z-index: 999999;
  font-family: Arial, sans-serif;
  animation: panelEnter 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

@keyframes panelEnter {
  0% {
    opacity: 0;
    transform: scale(0.8) translateY(-20px);
  }
  100% {
    opacity: 1;
    transform: scale(1) translateY(0);
  }
}

.header {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: #fff;
  padding: 12px 16px;
  border-radius: 12px 12px 0 0;
  font-weight: bold;
  cursor: move;
  user-select: none;
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: relative;
  overflow: hidden;
}

.header::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
  transition: left 0.5s;
}

.header:hover::before {
  left: 100%;
}

.close-btn {
  background: none;
  border: none;
  color: #fff;
  cursor: pointer;
  font-size: 20px;
  line-height: 1;
  padding: 4px;
  width: 28px;
  height: 28px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  transition: all 0.2s;
  position: relative;
  z-index: 1;
}

.close-btn:hover {
  background-color: rgba(255, 255, 255, 0.2);
  transform: rotate(90deg);
}

.content-wrapper {
  animation: contentSlide 0.3s ease-out 0.1s both;
}
</style>
