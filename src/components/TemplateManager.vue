<template>
  <div class="content">
    <div class="header">
      <h3>预设管理</h3>
      <div>
        <button class="btn-add" @click="showAddDialog = true">
          ➕ 新建
        </button>
      </div>
    </div>

    <div class="template-list">
      <div v-for="(template, index) in templates" :key="template.id" class="template-item">
        <div class="template-info">
          <span class="template-icon">{{ template.icon }}</span>
          <div class="template-details">
            <div class="template-name">
              {{ template.name }}
              <span v-if="template.source === 'community'" class="template-author">
                by {{ template.author }}
              </span>
              <span v-else-if="template.source === 'user'" class="template-source">
                自定义
              </span>
            </div>
            <div class="template-keywords">
              {{ template.keywords }}
            </div>
          </div>
        </div>
        <div class="template-actions">
          <button class="btn-edit" @click="editTemplate(template)">
            ✏️
          </button>
          <button class="btn-share" @click="shareTemplate(template)">
            📤
          </button>
          <button class="btn-delete" @click="deleteTemplate(index)">
            🗑️
          </button>
        </div>
      </div>
    </div>

    <div class="import-section">
      <h4>导入预设</h4>
      <textarea
        v-model="importText"
        placeholder="粘贴预设 JSON 数据..."
        rows="2"
      />
      <div class="import-actions">
        <button class="btn-import" @click="importTemplate">
          导入
        </button>
        <button class="btn-sync" :disabled="isSyncing" @click="syncCommunityTemplates">
          {{ isSyncing ? '同步中...' : '同步社区' }}
        </button>
      </div>
      <div class="contribute-info">
        🤝 欢迎贡献新预设：<a href="https://github.com/Steven-Qiang/block-kit-templates" target="_blank">访问 GitHub</a>
      </div>
    </div>

    <!-- 添加/编辑对话框 -->
    <div v-if="showAddDialog || editingTemplate" class="dialog-overlay" @click="closeDialog">
      <div class="dialog" @click.stop>
        <h4>{{ editingTemplate ? '编辑预设' : '新建预设' }}</h4>
        <div class="form-group">
          <label>名称：</label>
          <input v-model="currentTemplate.name" type="text" placeholder="例如：营销号">
        </div>
        <div class="form-group">
          <label>图标：</label>
          <input v-model="currentTemplate.icon" type="text" placeholder="例如：📰">
        </div>
        <div class="form-group">
          <label>关键词：</label>
          <textarea
            v-model="currentTemplate.keywords"
            placeholder="用逗号分隔，例如：新闻,日报,资讯"
            rows="2"
          />
        </div>
        <div class="dialog-actions">
          <button class="btn-cancel" @click="closeDialog">
            取消
          </button>
          <button class="btn-save" @click="saveTemplate">
            保存
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { KeywordTemplate } from '../stores/templateStore';
import { onMounted, ref } from 'vue';
import { githubTemplateService } from '../services/githubTemplateService';
import { useTemplateStore } from '../stores/templateStore';

const templateStore = useTemplateStore();
const templates = ref(templateStore.getTemplates());

const showAddDialog = ref(false);
const editingTemplate = ref<KeywordTemplate | null>(null);
const importText = ref('');
const isSyncing = ref(false);

const currentTemplate = ref({
  name: '',
  icon: '',
  keywords: ''
});

function editTemplate(template: KeywordTemplate) {
  editingTemplate.value = template;
  currentTemplate.value = { ...template };
}

function closeDialog() {
  showAddDialog.value = false;
  editingTemplate.value = null;
  currentTemplate.value = { name: '', icon: '', keywords: '' };
}

function saveTemplate() {
  if (!currentTemplate.value.name || !currentTemplate.value.keywords) {
    alert('请填写完整信息！');
    return;
  }

  if (editingTemplate.value) {
    templateStore.updateTemplate(editingTemplate.value.id, currentTemplate.value);
  } else {
    templateStore.addTemplate(currentTemplate.value);
  }

  templates.value = templateStore.getTemplates();
  closeDialog();
}

function deleteTemplate(index: number) {
  if (confirm('确定要删除这个预设吗？')) {
    const template = templates.value[index];
    templateStore.deleteTemplate(template.id);
    templates.value = templateStore.getTemplates();
  }
}

function shareTemplate(template: KeywordTemplate) {
  const shareData = JSON.stringify(template);
  navigator.clipboard.writeText(shareData).then(() => {
    alert('预设已复制到剪贴板！');
  });
}

function importTemplate() {
  if (!importText.value.trim()) {
    alert('请输入要导入的预设数据！');
    return;
  }

  try {
    const templateData = JSON.parse(importText.value) as Partial<KeywordTemplate>;

    if (!templateData.name || !templateData.name.trim()) {
      alert('预设名称不能为空！');
      return;
    }

    if (!templateData.keywords || !templateData.keywords.trim()) {
      alert('关键词不能为空！');
      return;
    }

    if (!templateData.icon || !templateData.icon.trim()) {
      templateData.icon = '📋';
    }

    templateStore.addTemplate({
      name: templateData.name.trim(),
      icon: templateData.icon.trim(),
      keywords: templateData.keywords.trim()
    });

    templates.value = templateStore.getTemplates();
    importText.value = '';
    alert('预设导入成功！');
  } catch {
    alert('预设数据格式错误！');
  }
}

async function syncCommunityTemplates() {
  isSyncing.value = true;
  try {
    const result = await githubTemplateService.syncTemplates();
    if (result.success) {
      templates.value = templateStore.getTemplates();
      alert(`成功同步 ${result.imported} 个社区预设！`);
    } else {
      alert('同步失败，请检查网络连接！');
    }
  } catch {
    alert('同步失败！');
  } finally {
    isSyncing.value = false;
  }
}

onMounted(() => {
  templates.value = templateStore.getTemplates();
});
</script>

<style scoped>
@import '../styles/common.css';

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
  gap: 8px;
}

.header h3 {
  margin: 0;
  color: #333;
  font-size: 14px;
  flex: 1;
}

.btn-add {
  padding: 4px 8px;
  background: #667eea;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 11px;
}

.template-list {
  margin-bottom: 16px;
  max-height: 200px;
  overflow-y: auto;
}

.template-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px;
  border: 1px solid #eee;
  border-radius: 6px;
  margin-bottom: 6px;
}

.template-info {
  display: flex;
  align-items: center;
  flex: 1;
  min-width: 0;
}

.template-icon {
  font-size: 14px;
  margin-right: 8px;
  flex-shrink: 0;
}

.template-details {
  flex: 1;
  min-width: 0;
}

.template-name {
  font-weight: bold;
  margin-bottom: 2px;
  font-size: 12px;
  display: flex;
  align-items: center;
  gap: 4px;
}

.template-author {
  font-size: 10px;
  color: #28a745;
  font-weight: normal;
}

.template-source {
  font-size: 10px;
  color: #667eea;
  font-weight: normal;
}

.template-keywords {
  font-size: 10px;
  color: #666;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.template-actions {
  display: flex;
  gap: 2px;
  flex-shrink: 0;
}

.template-actions button {
  padding: 2px 4px;
  border: none;
  border-radius: 3px;
  cursor: pointer;
  font-size: 10px;
}

.btn-edit {
  background: #f0f4ff;
}

.btn-share {
  background: #f0fff4;
}

.btn-delete {
  background: #fff0f0;
}

.btn-edit:disabled,
.btn-delete:disabled {
  opacity: 0.3;
  cursor: not-allowed;
}

.import-section {
  border-top: 1px solid #eee;
  padding-top: 12px;
}

.import-section h4 {
  margin: 0 0 6px 0;
  font-size: 12px;
}

.import-section textarea {
  width: 100%;
  margin-bottom: 6px;
  padding: 6px;
  border: 1px solid #ddd;
  border-radius: 4px;
  resize: vertical;
  font-size: 11px;
}

.btn-import {
  padding: 4px 8px;
  background: #28a745;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 11px;
}

.import-actions {
  display: flex;
  gap: 6px;
}

.btn-sync {
  padding: 4px 8px;
  background: #17a2b8;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 11px;
}

.btn-sync:disabled {
  background: #6c757d;
  cursor: not-allowed;
}

.contribute-info {
  margin-top: 8px;
  font-size: 11px;
  color: #666;
  text-align: center;
}

.contribute-info a {
  color: #667eea;
  text-decoration: none;
}

.contribute-info a:hover {
  text-decoration: underline;
}

.dialog-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000000;
}

.dialog {
  background: white;
  padding: 16px;
  border-radius: 6px;
  width: 90%;
  max-width: 320px;
}

.dialog h4 {
  margin: 0 0 12px 0;
  font-size: 14px;
}

.dialog textarea {
  width: 100%;
  padding: 6px;
  border: 1px solid #ddd;
  border-radius: 4px;
  resize: vertical;
  font-size: 11px;
}

.dialog input {
  font-size: 11px;
}

.dialog-actions {
  display: flex;
  justify-content: flex-end;
  gap: 6px;
  margin-top: 12px;
}

.btn-cancel {
  padding: 4px 8px;
  background: #6c757d;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 11px;
}

.btn-save {
  padding: 4px 8px;
  background: #667eea;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 11px;
}
</style>
