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

const COMMUNITY_TEMPLATES: KeywordTemplate[] = [
  { id: 'community-fake-propaganda', name: '虚假宣传', icon: '🚫', keywords: '助农,扶贫,山区,贫困,养生,中医,秘方,创业,成功,财富,逆袭', source: 'community', author: 'Steven-Qiang' },
  { id: 'community-fake-science', name: '伪科普', icon: '🧪', keywords: '科普,农技,健康,知识,真相,偏方,神药,特效,包治', source: 'community', author: 'Steven-Qiang' },
  { id: 'community-game-promotion', name: '游戏推广', icon: '🎮', keywords: '游戏,攻略,礼包,福利,充值,代练,外挂,破解', source: 'community', author: 'Steven-Qiang' },
  { id: 'community-impersonation-accounts', name: '冒充他人', icon: '🎭', keywords: '靳东,刘德华,马云,明星,名人,官方,政府,机构,认证,权威', source: 'community', author: 'Steven-Qiang' },
  { id: 'community-low-quality-content', name: '低俗引流', icon: '🔞', keywords: '街拍,搭讪,偶遇,美女,性感,诱惑,福利,私密,深夜', source: 'community', author: 'Steven-Qiang' },
  { id: 'community-marketing-accounts', name: '营销号', icon: '📰', keywords: '热点,评测,文旅,考公,新闻,日报,资讯,头条,快讯', source: 'community', author: 'Steven-Qiang' },
  { id: 'community-scam-marketing', name: '诱导消费', icon: '💸', keywords: '免费,红包,福利,领取,抽奖,紧急,限时,最后,错过,机会', source: 'community', author: 'Steven-Qiang' },
  { id: 'community-superstition-accounts', name: '玄学迷信', icon: '🔮', keywords: '国学,玄学,八字,命理,化灾,风水,算命,转运,开光', source: 'community', author: 'Steven-Qiang' }
];

class TemplateStore {
  private templates: KeywordTemplate[] = [];

  constructor() {
    this.loadTemplates();
    this.initCommunityTemplates();
  }

  private initCommunityTemplates() {
    const hasCommunity = this.templates.some((t) => t.source === 'community');
    if (!hasCommunity) {
      this.templates.push(...COMMUNITY_TEMPLATES);
      this.saveTemplates();
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
