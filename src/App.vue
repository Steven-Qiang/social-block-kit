<template>
  <floating-ball :title="title" :default-expanded="isBlacklistPage">
    <blacklist-cleaner v-if="isBlacklistPage" />
    <template-manager v-else-if="showTemplateManager" />
    <blocking-tool v-else />
    <div v-if="currentPlatform?.name === 'bilibili' && !isBlacklistPage && !showTemplateManager" class="guide">
      <a href="https://account.bilibili.com/account/blacklist" target="_blank" class="guide-link">
        🗑️ 清理黑名单
      </a>
    </div>
    <div v-if="!isBlacklistPage" class="nav-section">
      <button
        class="nav-btn"
        :class="{ active: !showTemplateManager }"
        @click="showTemplateManager = false"
      >
        🚫 拉黑工具
      </button>
      <button
        class="nav-btn"
        :class="{ active: showTemplateManager }"
        @click="showTemplateManager = true"
      >
        ⚙️ 预设管理
      </button>
    </div>
    <div class="footer">
      <div class="version">
        v{{ pkg.version }}
      </div>
      <div class="copyright">
        © {{ pkg.author }}
      </div>
      <a :href="pkg.repository.url" target="_blank" class="github-link">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
        </svg>
        GitHub
      </a>
    </div>
  </floating-ball>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import pkg from '../package.json';
import BlacklistCleaner from './components/BlacklistCleaner.vue';
import BlockingTool from './components/BlockingTool.vue';
import FloatingBall from './components/FloatingBall.vue';
import TemplateManager from './components/TemplateManager.vue';
import { getCurrentPlatform } from './platforms';

const currentPlatform = getCurrentPlatform();
const showTemplateManager = ref(false);
const isBlacklistPage = computed(() =>
  window.location.href.includes('account.bilibili.com/account/blacklist'),
);

const title = computed(() =>
  isBlacklistPage.value
    ? '🗑️ 黑名单清理工具'
    : showTemplateManager.value
      ? '⚙️ 预设管理'
      : `🚫 ${currentPlatform?.displayName || '多平台'}自动拉黑工具`,
);
</script>

<style scoped>
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
  padding: 8px;
  border-radius: 6px;
  transition: all 0.2s;
  position: relative;
  overflow: hidden;
}

.guide-link::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(102, 126, 234, 0.1), transparent);
  transition: left 0.3s;
}

.guide-link:hover {
  background-color: #f0f4ff;
  transform: translateY(-1px);
}

.guide-link:hover::before {
  left: 100%;
}

.footer {
  padding: 8px 16px;
  border-top: 1px solid #eee;
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 11px;
  color: #999;
}

.version {
  font-weight: bold;
}

.copyright {
  flex: 1;
  text-align: center;
}

.github-link {
  display: flex;
  align-items: center;
  gap: 4px;
  color: #667eea;
  text-decoration: none;
  transition: color 0.2s;
}

.github-link:hover {
  color: #5a67d8;
}

.nav-section {
  padding: 8px 16px;
  border-top: 1px solid #eee;
  display: flex;
  gap: 4px;
}

.nav-btn {
  flex: 1;
  padding: 6px 8px;
  font-size: 11px;
  background: #f5f5f5;
  border: 1px solid #ddd;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.2s;
}

.nav-btn:hover {
  background: #ebebeb;
}

.nav-btn.active {
  background: #667eea;
  color: white;
  border-color: #667eea;
}
</style>
