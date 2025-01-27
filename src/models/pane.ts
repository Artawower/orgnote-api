import type { Router } from 'vue-router';

export interface Pane {
  id: string;
  activePageId: string;
  pages: Record<string, Page>;
}

export interface Page {
  title: string;
  id: string;
  router: Router;
}

export type InitialPaneParams = Partial<Pick<Page, 'title' | 'id'>>;
