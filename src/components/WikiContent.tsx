import React from 'react';
import ReactMarkdown from 'react-markdown';
import { Edit2, Share2, History, User, Calendar, Lock } from 'lucide-react';
import { WikiPage } from '../types';
import { formatDate } from '../lib/utils';
import { motion } from 'motion/react';

interface WikiContentProps {
  page: WikiPage;
  currentUserIp: string;
  onEdit: () => void;
}

export const WikiContent: React.FC<WikiContentProps> = ({ page, currentUserIp, onEdit }) => {
  const isAuthorized = !page.authorIp || page.authorIp === 'system' || page.authorIp === currentUserIp;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="max-w-[1000px] py-[60px] px-10"
    >
      <header className="mb-10">
        <div className="flex justify-between items-center mb-4">
          <div className="text-[12px] font-bold text-gray-mid uppercase tracking-wider">
            Documentation / Core / {page.title}
          </div>
          {!isAuthorized && (
            <div className="flex items-center gap-2 text-[10px] font-black bg-red-50 text-red-600 px-3 py-1 uppercase tracking-widest border border-red-100">
              <Lock className="w-3 h-3" />
              Immutable Node (IP Locked)
            </div>
          )}
        </div>
        
        <h1 className="text-[84px] leading-[0.85] tracking-[-4px] font-black lowercase mb-10 text-ink">
          {page.title}
        </h1>

        <div className="flex gap-10 mb-10 border-b border-gray-light pb-8">
          <div className="meta-item">
            <span className="block text-[12px] font-bold uppercase tracking-wider text-gray-mid mb-1">Contributor</span>
            <span className="text-sm font-semibold">{page.author}</span>
          </div>
          <div className="meta-item">
            <span className="block text-[12px] font-bold uppercase tracking-wider text-gray-mid mb-1">Writer IP</span>
            <span className="text-sm font-semibold text-gray-mid">{page.authorIp || 'unrecorded'}</span>
          </div>
          <div className="meta-item">
            <span className="block text-[12px] font-bold uppercase tracking-wider text-gray-mid mb-1">Last Edit</span>
            <span className="text-sm font-semibold">{formatDate(page.updatedAt)}</span>
          </div>
        </div>
      </header>

      <div className="markdown-content">
        <ReactMarkdown>{page.content}</ReactMarkdown>
      </div>

      <div className="mt-12 flex gap-4">
        {isAuthorized ? (
          <button
            onClick={onEdit}
            className="inline-flex items-center justify-center px-6 py-3 bg-ink text-paper font-bold text-[12px] uppercase tracking-wider hover:bg-gray-mid transition-colors cursor-pointer"
          >
            Edit This Article
          </button>
        ) : (
          <div className="inline-flex items-center justify-center px-6 py-3 bg-gray-light text-gray-mid font-bold text-[12px] uppercase tracking-wider cursor-not-allowed">
            Editing Restricted
          </div>
        )}
        <button className="inline-flex items-center justify-center px-6 py-3 bg-paper border-2 border-ink text-ink font-bold text-[12px] uppercase tracking-wider hover:bg-gray-light transition-colors cursor-pointer">
          Share
        </button>
      </div>

      <footer className="mt-32 pt-10 border-t border-gray-light text-[11px] font-medium text-gray-mid uppercase tracking-widest flex justify-between items-center decoration-accent underline-offset-4">
        <p>© 2026 WikiFlow - Structure is Freedom</p>
        <div className="flex gap-8">
          <a href="#" className="hover:text-accent">Privacy</a>
          <a href="#" className="hover:text-accent">Terms</a>
        </div>
      </footer>
    </motion.div>
  );
};
