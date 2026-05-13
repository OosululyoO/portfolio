import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

const getAssetPath = (path) => {
  if (!path) return '';
  if (path.startsWith('http')) return path;
  const cleanPath = path.startsWith('/') ? path.slice(1) : path;
  return `/portfolio/${cleanPath}`;
};

const DetailModal = ({ isOpen, onClose, content }) => {
  const [imgIdx, setImgIdx] = useState(0);
  if (!content) return null;

  const { title, categories, main_images, extra_images, body, description, date } = content;

  // 主圖輪播邏輯
  useEffect(() => {
    if (main_images?.length <= 1) return;
    const interval = setInterval(() => {
      setImgIdx(prev => (prev + 1) % main_images.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [main_images]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} className="fixed inset-0 bg-slate-900/80 backdrop-blur-xl z-[200]" />
          <motion.div initial={{ y: 100, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 100, opacity: 0 }} className="fixed inset-x-0 bottom-0 top-[5%] md:inset-x-10 md:top-[10%] md:bottom-[5%] bg-white rounded-t-[3rem] md:rounded-[3rem] shadow-2xl z-[201] overflow-hidden flex flex-col">
            
            {/* 頂部關閉按鈕 */}
            <button onClick={onClose} className="absolute top-8 right-8 z-50 p-4 bg-slate-100 rounded-full hover:bg-black hover:text-white transition-colors">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" /></svg>
            </button>

            <div className="overflow-y-auto h-full custom-scrollbar pb-20">
              <div className="max-w-4xl mx-auto px-8 py-16">
                
                {/* 1. 標題區塊 */}
                <header className="mb-12">
                  <div className="flex flex-wrap gap-2 mb-6">
                    {categories.map(cat => (
                      <span key={cat} className="text-xs font-black uppercase tracking-widest text-blue-600 bg-blue-50 px-4 py-1.5 rounded-full">{cat}</span>
                    ))}
                  </div>
                  <h2 className="text-4xl md:text-6xl font-black tracking-tighter text-slate-900 mb-4">{title}</h2>
                  <div className="flex items-center text-slate-400 font-bold uppercase tracking-widest text-xs">
                    <span>{date}</span>
                    <span className="mx-4">/</span>
                    <span className="text-slate-500">{description}</span>
                  </div>
                </header>

                {/* 2. 主要照片呈現 (輪播) */}
                {main_images?.length > 0 && (
                  <div className="mb-16 rounded-[2.5rem] overflow-hidden aspect-video bg-slate-100 shadow-inner relative">
                    <img src={getAssetPath(main_images[imgIdx])} className="w-full h-full object-cover transition-opacity duration-1000" alt="Main" />
                    {main_images.length > 1 && (
                      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2">
                        {main_images.map((_, i) => (
                          <div key={i} className={`h-1.5 rounded-full transition-all ${i === imgIdx ? 'w-8 bg-white' : 'w-2 bg-white/40'}`} />
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {/* 3. Markdown RTX 內容區塊 */}
                <article className="prose prose-slate prose-lg max-w-none mb-20 
                  prose-headings:text-slate-900 prose-headings:font-black prose-headings:tracking-tight
                  prose-h1:text-4xl prose-h2:text-3xl prose-h3:text-2xl
                  prose-p:text-slate-600 prose-p:leading-loose prose-p:whitespace-pre-line
                  prose-strong:text-blue-600 prose-strong:font-bold
                  prose-img:rounded-[2rem] prose-img:shadow-xl">
                  <ReactMarkdown remarkPlugins={[remarkGfm]}>{body}</ReactMarkdown>
                </article>

                {/* 4. 補充詳細頁末尾照片 */}
                {extra_images?.length > 0 && (
                  <div className="space-y-8">
                    <h4 className="text-xs font-black uppercase tracking-[0.3em] text-slate-300 mb-8 border-b pb-4">Gallery</h4>
                    {extra_images.map((img, i) => (
                      <div key={i} className="rounded-[2.5rem] overflow-hidden border border-slate-100 shadow-sm">
                        <img src={getAssetPath(img)} className="w-full h-auto" alt={`Extra ${i}`} />
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default DetailModal;