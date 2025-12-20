import type { KeywordTemplate } from '../stores/templateStore';
import { useTemplateStore } from '../stores/templateStore';

export interface CommunityTemplate {
  name: string;
  icon: string;
  keywords: string;
  author: string;
  description: string;
}

const GITHUB_API_BASE = 'https://api.github.com/repos/Steven-Qiang/block-kit-templates';
const TEMPLATES_PATH = 'contents/community-templates';

class GitHubTemplateService {
  private cache: { template: CommunityTemplate; filename: string }[] = [];
  private lastFetch = 0;
  private readonly CACHE_DURATION = 5 * 60 * 1000; // 5分钟缓存

  async fetchCommunityTemplates(): Promise<{ template: CommunityTemplate; filename: string }[]> {
    const now = Date.now();
    if (this.cache.length > 0 && now - this.lastFetch < this.CACHE_DURATION) {
      return this.cache;
    }

    try {
      const response = await fetch(`${GITHUB_API_BASE}/${TEMPLATES_PATH}`);
      if (!response.ok) throw new Error('Failed to fetch templates');

      const files = await response.json();
      const templates: { template: CommunityTemplate; filename: string }[] = [];

      const templatePromises = files
        .filter((file: any) => file.name.endsWith('.json'))
        .map(async (file: any) => {
          try {
            const fileResponse = await fetch(file.download_url);
            const template = await fileResponse.json();
            return {
              template: template as CommunityTemplate,
              filename: file.name.replace('.json', '')
            };
          } catch (error) {
            console.warn(`Failed to load template ${file.name}:`, error);
            return null;
          }
        });

      const results = await Promise.all(templatePromises);
      templates.push(...results.filter((t) => t !== null));

      this.cache = templates;
      this.lastFetch = now;
      return templates;
    } catch (error) {
      console.error('Failed to fetch community templates:', error);
      return this.cache;
    }
  }

  async syncTemplates(): Promise<{ success: boolean; imported: number }> {
    try {
      const communityTemplates = await this.fetchCommunityTemplates();
      const templateStore = useTemplateStore();

      let imported = 0;
      for (const { template, filename } of communityTemplates) {
        const communityTemplate: KeywordTemplate = {
          id: `community-${filename}`,
          name: template.name,
          icon: template.icon,
          keywords: template.keywords,
          source: 'community' as const,
          author: template.author
        };

        templateStore.addCommunityTemplate(communityTemplate);
        imported++;
      }

      GM_setValue('community-templates-version', Date.now());
      return { success: true, imported };
    } catch (error) {
      console.error('Failed to sync templates:', error);
      return { success: false, imported: 0 };
    }
  }
}

export const githubTemplateService = new GitHubTemplateService();
