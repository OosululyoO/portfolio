import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// --- Utility: 處理靜態資源路徑 (與 App.jsx 保持一致) ---
const getAssetPath = (path) => {
  if (!path) return '';
  if (path.startsWith('http')) return path;
  const cleanPath = path.startsWith('/') ? path.slice(1) : path;
  const base = '/portfolio/'; 
  return `${base}${cleanPath}`;
};

const DetailModal = ({ isOpen, onClose, content }) => {
  if (!content) return null;

  const { title, category, main_images, extra_images, body, description } = content;
  
  // 合併所有圖片並套用路徑修正
  const allImages = [...(main_images || []), ...(extra_images || [])];

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* 背景遮罩 */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-[100] cursor-zoom-out"
          />

          {/* 視窗主體 */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed inset-x-4 top-[10%] bottom-[5%] md:inset-x-24 md:top-[12%] md:bottom-[8%] bg-white rounded-[3rem] shadow-2xl z-[101] overflow-hidden flex flex-col border border-white/20"
          >
            {/* 頂部控制列 */}
            <div className="absolute top-8 right-8 z-[102]">
              <button
                onClick={onClose}
                className="p-4 bg-slate-100 hover:bg-black hover:text-white rounded-full transition-all duration-300 group"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="flex-grow overflow-y-auto custom-scrollbar">
              <div className="max-w-5xl mx-auto px-8 py-16">
                {/* 標題區域 */}
                <header className="mb-12">
                  <span className="text-[10px] font-black uppercase tracking-[0.3em] text-blue-600 mb-4 block">
                    {category}
                  </span>
                  <h2 className="text-4xl md:text-6xl font-black tracking-tighter text-slate-900 mb-6 uppercase leading-none">
                    {title}
                  </h2>
                  <p className="text-xl text-slate-500 font-medium leading-relaxed max-w-3xl">
                    {description}
                  </p>
                </header>

                {/* 內容區塊 */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                  <div className="lg:col-span-12">
                    {/* 主要內容 (Markdown Body) */}
                    <article className="prose prose-slate prose-lg max-w-none 
                      prose-headings:font-black prose-headings:tracking-tighter prose-headings:uppercase
                      prose-p:text-slate-600 prose-p:leading-relaxed
                      prose-strong:text-slate-900 prose-strong:font-bold">
                      {body}
                    </article>

                    {/* 圖片展示牆 */}
                    {allImages.length > 0 && (
                      <div className="mt-16 space-y-8">
                        {allImages.map((img, index) => (
                          <div key={index} className="rounded-[2.5rem] overflow-hidden border border-slate-100 bg-slate-50 shadow-sm">
                            <img 
                              src={getAssetPath(img)} 
                              alt={`${title} - ${index}`} 
                              className="w-full h-auto object-cover"
                            />
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
};

export default DetailModal;