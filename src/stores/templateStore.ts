import { githubTemplateService } from '../services/githubTemplateService';

export interface KeywordTemplate {
  id: string;
  name: string;
  icon: string;
  keywords: string;
  source: 'user' | 'community';
  author?: string;
}

export type CreateTemplateData = Omit<KeywordTemplate, 'id' | 'source'>;

const STORAGE_KEY = 'social-block-kit-templates';

class TemplateStore {
  private templates: KeywordTemplate[] = [];

  constructor() {
    this.loadTemplates();
    this.autoSyncOnFirstRun();
  }

  private async autoSyncOnFirstRun() {
    if (this.templates.length === 0) {
      try {
        await githubTemplateService.syncTemplates();
        this.loadTemplates();
      } catch (error) {
        console.warn('Failed to auto-sync templates on first run:', error);
      }
    }
  }

  private loadTemplates() {
    try {
      const stored = GM_getValue(STORAGE_KEY, null);
      if (stored) {
        this.templates = JSON.parse(stored);
      } else {
        this.templates = [];
        this.saveTemplates();
      }
    } catch (error) {
      console.error('Failed to load templates:', error);
      this.templates = [];
    }
  }

  private saveTemplates() {
    try {
      GM_setValue(STORAGE_KEY, JSON.stringify(this.templates));
    } catch (error) {
      console.error('Failed to save templates:', error);
    }
  }

  getTemplates(): KeywordTemplate[] {
    return [...this.templates];
  }

  addTemplate(template: CreateTemplateData): KeywordTemplate {
    const newTemplate: KeywordTemplate = {
      ...template,
      id: `user-${Date.now()}`,
      source: 'user',
    };
    this.templates.push(newTemplate);
    this.saveTemplates();
    return newTemplate;
  }

  addCommunityTemplate(template: KeywordTemplate): KeywordTemplate {
    const existing = this.templates.find((t) => t.id === template.id);
    if (existing) {
      const index = this.templates.findIndex((t) => t.id === template.id);
      this.templates[index] = template;
    } else {
      this.templates.push(template);
    }
    this.saveTemplates();
    return this.templates.find((t) => t.id === template.id)!;
  }

  updateTemplate(id: string, updates: Partial<KeywordTemplate>) {
    const index = this.templates.findIndex((t) => t.id === id);
    if (index !== -1) {
      this.templates[index] = { ...this.templates[index], ...updates };
      this.saveTemplates();
    }
  }

  deleteTemplate(id: string) {
    this.templates = this.templates.filter((t) => t.id !== id);
    this.saveTemplates();
  }

  resetToDefaults() {
    this.templates = [];
    this.saveTemplates();
  }
}

let templateStore: TemplateStore;

export function useTemplateStore() {
  if (!templateStore) {
    templateStore = new TemplateStore();
  }
  return templateStore;
}
