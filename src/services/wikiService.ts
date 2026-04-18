import { WikiPage, INITIAL_PAGES } from '../types';

const STORAGE_KEY = 'wikimaster_pages';

export const wikiService = {
  getPages: (): WikiPage[] => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (!saved) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_PAGES));
      return INITIAL_PAGES;
    }
    try {
      return JSON.parse(saved);
    } catch {
      return INITIAL_PAGES;
    }
  },

  savePage: (page: WikiPage): void => {
    const pages = wikiService.getPages();
    const index = pages.findIndex(p => p.id === page.id);
    
    if (index >= 0) {
      pages[index] = { ...page, updatedAt: Date.now() };
    } else {
      pages.push({ ...page, updatedAt: Date.now() });
    }
    
    localStorage.setItem(STORAGE_KEY, JSON.stringify(pages));
  },

  deletePage: (id: string): void => {
    const pages = wikiService.getPages().filter(p => p.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(pages));
  },

  getPage: (id: string): WikiPage | undefined => {
    return wikiService.getPages().find(p => p.id === id);
  }
};
