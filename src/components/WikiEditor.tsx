import React, { useState, useEffect } from 'react';
import { Save, X, Sparkles, Loader2 } from 'lucide-react';
import { WikiPage } from '../types';
import { generateWikiDraft } from '../services/geminiService';
import { motion, AnimatePresence } from 'motion/react';

interface WikiEditorProps {
  page: Partial<WikiPage>;
  currentUserIp: string;
  onSave: (page: WikiPage) => void;
  onCancel: () => void;
}

export const WikiEditor: React.FC<WikiEditorProps> = ({ page, currentUserIp, onSave, onCancel }) => {
  const [title, setTitle] = useState(page.title || '');
  const [content, setContent] = useState(page.content || '');
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSave = () => {
    if (!title.trim() || !content.trim()) {
      setError('제목과 내용을 모두 입력해주세요.');
      return;
    }
    
    // Check if editing an existing page and if user is authorized (IP match)
    // If it's a new page (no id), any user can create it.
    if (page.id && page.authorIp && page.authorIp !== currentUserIp) {
      setError('이 문서를 수정할 권한이 없습니다. (작성자 IP 불일치)');
      return;
    }

    onSave({
      id: page.id || `page-${Date.now()}`,
      title,
      content,
      updatedAt: Date.now(),
      author: page.author || '나',
      authorIp: page.authorIp || currentUserIp,
    });
  };

  const handleAiDraft = async () => {
    if (!title.trim()) {
      setError('AI 초안을 생성하려면 먼저 제목을 입력해주세요.');
      return;
    }
    
    setIsGenerating(true);
    setError(null);
    try {
      const draft = await generateWikiDraft(title);
      setContent(draft);
    } catch (err: any) {
      setError(err.message || 'AI 초안 생성에 실패했습니다.');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="max-w-[1000px] py-[60px] px-10">
      <div className="flex items-center justify-between mb-12">
        <h2 className="text-[24px] font-black uppercase tracking-tight">Drafting: {page.id ? 'Refining' : 'New Framework'}</h2>
        <div className="flex items-center gap-4">
          <button
            onClick={onCancel}
            className="text-[12px] font-bold uppercase tracking-widest text-gray-mid hover:text-ink transition-colors"
          >
            Abort
          </button>
          <button
            onClick={handleSave}
            className="flex items-center gap-2 px-8 py-3 bg-ink text-paper text-[12px] font-bold uppercase tracking-wider hover:bg-gray-mid transition-colors"
          >
            Commit Changes
          </button>
        </div>
      </div>

      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="mb-8 p-6 bg-red-50 border-2 border-red-200 text-red-700 text-xs font-bold uppercase tracking-wider"
          >
            Error: {error}
          </motion.div>
        )}
      </AnimatePresence>

      <div className="space-y-12">
        <div className="space-y-4">
          <label className="text-[11px] font-black text-gray-mid uppercase tracking-[2px]">Asset Title</label>
          <input
            type="text"
            className="w-full text-[42px] font-black lowercase bg-transparent border-b-2 border-ink py-2 focus:outline-none placeholder:text-gray-light transition-all"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="System architecture..."
            disabled={isGenerating}
          />
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <label className="text-[11px] font-black text-gray-mid uppercase tracking-[2px]">Core Logic (Markdown)</label>
            <button
              onClick={handleAiDraft}
              disabled={isGenerating}
              className="flex items-center gap-2 text-[10px] font-black px-4 py-2 bg-accent text-white uppercase tracking-widest hover:opacity-90 transition-opacity disabled:opacity-50"
            >
              {isGenerating ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <Sparkles className="w-3.5 h-3.5" />
              )}
              AI Synthesizer
            </button>
          </div>
          <textarea
            className="w-full h-[600px] p-8 bg-paper border-2 border-ink text-ink font-medium text-lg leading-[1.6] focus:outline-none transition-all resize-none placeholder:text-gray-light"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Define the modular micro-frontend architecture..."
            disabled={isGenerating}
          />
        </div>
      </div>
    </div>
  );
};
