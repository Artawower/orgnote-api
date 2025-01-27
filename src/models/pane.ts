import type { Router } from 'vue-router';

export interface Pane {
  activePageId: string;
  pages: Record<string, Page>;
}

export interface Page {
  title: string;
  pageId: string;
  router: Router;
}

export type InitialPaneParams = Partial<Pick<Page, 'title' | 'pageId'>>;
