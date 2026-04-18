import React, { useState, useEffect } from 'react';
import { Sidebar } from './components/Sidebar';
import { WikiContent } from './components/WikiContent';
import { WikiEditor } from './components/WikiEditor';
import { wikiService } from './services/wikiService';
import { WikiPage, AppView } from './types';
import { Search, Plus, BookOpen, Clock, Activity, History } from 'lucide-react';

export default function App() {
  const [pages, setPages] = useState<WikiPage[]>([]);
  const [currentPageId, setCurrentPageId] = useState<string | null>(null);
  const [view, setView] = useState<AppView>('home');
  const [isLoading, setIsLoading] = useState(true);
  const [currentIp, setCurrentIp] = useState<string>('');

  useEffect(() => {
    // Initial load
    const loadedPages = wikiService.getPages();
    setPages(loadedPages);

    // Fetch IP
    fetch('/api/ip')
      .then(res => res.json())
      .then(data => setCurrentIp(data.ip || 'unknown'))
      .catch(() => setCurrentIp('unknown'));
    
    // Set default page if welcome exists
    const welcome = loadedPages.find(p => p.id === 'welcome');
    if (welcome) {
      setCurrentPageId('welcome');
      setView('view');
    } else if (loadedPages.length > 0) {
      setCurrentPageId(loadedPages[0].id);
      setView('view');
    }
    
    setIsLoading(false);
  }, []);

  const handleSelectPage = (id: string) => {
    setCurrentPageId(id);
    setView('view');
  };

  const handleNewPage = () => {
    setCurrentPageId(null);
    setView('edit');
  };

  const handleSavePage = (page: WikiPage) => {
    wikiService.savePage(page);
    const updatedPages = wikiService.getPages();
    setPages(updatedPages);
    setCurrentPageId(page.id);
    setView('view');
  };

  const handleCancelEdit = () => {
    if (currentPageId) {
      setView('view');
    } else if (pages.length > 0) {
      setCurrentPageId(pages[0].id);
      setView('view');
    } else {
      setView('home');
    }
  };

  const currentPage = currentPageId ? pages.find(p => p.id === currentPageId) : null;

  if (isLoading) {
    return (
      <div className="h-screen w-screen flex items-center justify-center bg-wiki-bg">
        <div className="flex flex-col items-center gap-4">
          <BookOpen className="w-12 h-12 text-wiki-accent animate-pulse" />
          <p className="text-slate-500 font-medium">위키마스터 불러오는 중...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-paper text-ink selection:bg-accent selection:text-white">
      {/* Top Bar */}
      <header className="h-16 border-b-2 border-ink flex items-center justify-between px-10 shrink-0">
        <div className="font-black text-2xl tracking-tighter uppercase leading-none">Ω WIKIFLOW</div>
        <div className="flex items-center gap-6">
          <div className="text-[12px] font-bold uppercase tracking-wider text-gray-mid">
            <span className="text-gray-mid mr-2">Address</span>
            <span className="text-blue-600">{currentIp || 'detecting...'}</span>
          </div>
          <div className="text-[12px] font-bold uppercase tracking-wider">
            <span className="text-gray-mid mr-2">Status</span>
            <span className="text-emerald-600">Operational</span>
          </div>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <Sidebar
          pages={pages}
          currentPageId={currentPageId}
          onSelectPage={handleSelectPage}
          onNewPage={handleNewPage}
        />
        
        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto border-r border-gray-light">
          {view === 'edit' && (
            <WikiEditor
              page={currentPage || {}}
              currentUserIp={currentIp}
              onSave={handleSavePage}
              onCancel={handleCancelEdit}
            />
          )}
          
          {view === 'view' && currentPage && (
            <WikiContent
              page={currentPage}
              currentUserIp={currentIp}
              onEdit={() => setView('edit')}
            />
          )}

          {view === 'home' && pages.length === 0 && (
            <div className="h-full flex items-center justify-center p-20">
              <div className="text-left max-w-lg border-4 border-ink p-12">
                <h1 className="text-8xl font-black lowercase tracking-tighter leading-[0.8] mb-12">
                  No Knowledge assets found.
                </h1>
                <p className="text-xl font-medium text-gray-mid mb-12 uppercase tracking-tight">
                  Initiate the system by creating the first architectural entry.
                </p>
                <button
                  onClick={handleNewPage}
                  className="w-full bg-ink text-paper py-6 text-sm font-black uppercase tracking-widest hover:bg-gray-mid transition-all shadow-none"
                >
                  Create Knowledge Link
                </button>
              </div>
            </div>
          )}
        </main>

        {/* Right Sidebar (TOC Style) */}
        <aside className="w-64 bg-paper p-10 hidden xl:block shrink-0">
          <div className="text-[11px] font-black text-gray-mid uppercase tracking-[1px] mb-8">
            Global Activity
          </div>
          
          <div className="space-y-10">
            <div>
              <div className="text-[12px] font-bold uppercase tracking-wider mb-2">Sync Probability</div>
              <div className="h-1 w-full bg-gray-light rounded-none">
                <div className="h-full bg-ink" style={{ width: `${Math.min(pages.length * 10, 100)}%` }} />
              </div>
            </div>

            <div className="space-y-6">
              <div className="text-[12px] font-bold uppercase tracking-wider flex items-center gap-2">
                <History className="w-4 h-4 text-gray-mid" />
                Recent Nodes
              </div>
              <div className="space-y-4">
                {pages.slice(0, 5).map(page => (
                  <div key={page.id} className="border-l-2 border-ink pl-4 py-1">
                    <p className="text-xs font-bold text-ink truncate lowercase tracking-tight">{page.title}</p>
                    <p className="text-[9px] font-black uppercase tracking-widest text-gray-mid mt-1">Confirmed</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
