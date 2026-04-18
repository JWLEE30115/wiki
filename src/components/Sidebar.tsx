import React, { useState } from 'react';
import { Search, Plus, Book, Clock, ChevronRight } from 'lucide-react';
import { WikiPage } from '../types';
import { cn } from '../lib/utils';
import { motion } from 'motion/react';

interface SidebarProps {
  pages: WikiPage[];
  currentPageId: string | null;
  onSelectPage: (id: string) => void;
  onNewPage: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  pages,
  currentPageId,
  onSelectPage,
  onNewPage,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const searchInputRef = React.useRef<HTMLInputElement>(null);

  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        searchInputRef.current?.focus();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const filteredPages = pages.filter(page =>
    page.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    page.content.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <aside className="w-72 bg-paper border-r border-gray-light h-screen flex flex-col sticky top-0">
      <div className="p-10 border-b border-gray-light flex flex-col gap-6">
        <div className="flex items-center gap-2">
          <h1 className="font-black text-2xl tracking-tighter uppercase leading-none">Ω WikiMaster</h1>
        </div>
        
        <div className="relative group">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-mid group-focus-within:text-ink transition-colors" />
          <input
            ref={searchInputRef}
            type="text"
            placeholder="Search assets..."
            className="w-full bg-paper border-2 border-ink rounded-none pl-10 pr-4 py-2 text-sm font-medium focus:outline-none transition-all placeholder:text-gray-light"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <button
          onClick={onNewPage}
          className="w-full flex items-center justify-center gap-2 bg-ink text-paper py-3 rounded-none text-xs font-bold uppercase tracking-wider hover:bg-gray-mid transition-colors shadow-[4px_4px_0px_0px_rgba(0,0,0,0.1)] active:translate-x-[1px] active:translate-y-[1px] active:shadow-none"
        >
          <Plus className="w-4 h-4" />
          Create New
        </button>
      </div>

      <nav className="flex-1 overflow-y-auto py-10">
        <div className="px-10 mb-4 flex justify-between items-center">
          <span className="text-[11px] font-black text-gray-mid uppercase tracking-[1px]">
            Knowledge Base ({pages.length})
          </span>
          {searchTerm && (
            <span className="text-[9px] font-black bg-accent text-white px-1.5 py-0.5 lowercase">
              {filteredPages.length} found
            </span>
          )}
        </div>
        <ul className="space-y-4 px-10">
          {filteredPages.map((page) => {
            const isMatchInContent = !page.title.toLowerCase().includes(searchTerm.toLowerCase()) && 
                                    page.content.toLowerCase().includes(searchTerm.toLowerCase());
            
            return (
              <li key={page.id}>
                <button
                  onClick={() => {
                    onSelectPage(page.id);
                    setSearchTerm('');
                  }}
                  className={cn(
                    "w-full text-left transition-all group outline-none flex flex-col",
                    currentPageId === page.id
                      ? "text-accent"
                      : "text-ink hover:text-accent"
                  )}
                >
                  <span className={cn(
                    "text-[15px] font-medium truncate",
                    currentPageId === page.id && "underline underline-offset-4 decoration-2"
                  )}>
                    {page.title}
                  </span>
                  {searchTerm && isMatchInContent && (
                    <span className="text-[10px] text-gray-mid uppercase tracking-widest mt-0.5">
                      Match in content
                    </span>
                  )}
                </button>
              </li>
            );
          })}
          {filteredPages.length === 0 && (
            <li className="text-sm text-gray-mid italic border-2 border-dashed border-gray-light p-4 text-center">
              No results for "{searchTerm}"
            </li>
          )}
        </ul>
      </nav>

      <div className="p-10 border-t border-gray-light">
        <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-gray-mid">
          <Clock className="w-3.5 h-3.5" />
          <span>Sync Operational</span>
        </div>
      </div>
    </aside>
  );
};
