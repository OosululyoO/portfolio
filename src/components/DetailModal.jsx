import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination } from 'swiper/modules';
import { getAssetPath } from '../App';

import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

const DetailModal = ({ isOpen, onClose, content }) => {
  if (!content) return null;
  // 修正：解構欄位以符合新的數據結構 (使用 categories 而非 category)
  const { title, categories, main_images, extra_images, body, description, date } = content;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} 
            onClick={onClose} 
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-[100] cursor-zoom-out" 
          />
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }} 
            className="fixed inset-x-4 top-[8%] bottom-[4%] md:inset-x-24 md:top-[10%] md:bottom-[6%] bg-white rounded-[3rem] shadow-2xl z-[101] overflow-y-auto no-scrollbar"
          >
            <div className="sticky top-0 right-0 p-8 flex justify-end z-[102] pointer-events-none">
              <button 
                onClick={onClose}
                className="w-12 h-12 bg-white/80 backdrop-blur shadow-lg rounded-full flex items-center justify-center text-slate-900 hover:bg-black hover:text-white transition-all pointer-events-auto"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>

            <div className="max-w-5xl mx-auto px-8 md:px-16 pb-24 -mt-12">
              <header className="mb-16">
                <div className="flex flex-wrap items-center gap-3 mb-6">
                  {categories?.map(cat => (
                    <span key={cat} className="text-[10px] font-black uppercase tracking-[0.3em] text-blue-600 bg-blue-50 px-3 py-1 rounded-full border border-blue-100">{cat}</span>
                  ))}
                  {date && <span className="text-[10px] font-bold text-slate-400 ml-auto tracking-widest uppercase italic">{date}</span>}
                </div>
                <h2 className="text-5xl md:text-7xl font-black tracking-tighter text-slate-900 mb-8 uppercase leading-[0.9]">{title}</h2>
                <p className="text-xl md:text-2xl text-slate-500 font-medium leading-relaxed">{description}</p>
              </header>

              {main_images?.length > 0 && (
                <div className="mb-20 rounded-[3rem] overflow-hidden shadow-2xl">
                  <Swiper modules={[Navigation, Pagination]} navigation pagination={{ clickable: true }} loop={main_images.length > 1} className="aspect-video">
                    {main_images.map((img, i) => (
                      <SwiperSlide key={i}><img src={getAssetPath(img)} className="w-full h-full object-cover" alt={`${title}-${i}`} /></SwiperSlide>
                    ))}
                  </Swiper>
                </div>
              )}

              <article className="prose prose-slate prose-lg max-w-none prose-headings:font-black prose-headings:uppercase prose-p:text-slate-600 whitespace-pre-wrap">
                <ReactMarkdown remarkPlugins={[remarkGfm]}>{body}</ReactMarkdown>
              </article>

              {extra_images?.length > 0 && (
                <div className="mt-24">
                  <h3 className="text-sm font-black uppercase tracking-[0.4em] text-slate-300 mb-10 text-center">Gallery</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {extra_images.map((img, index) => (
                      <div key={index} className="rounded-[2rem] overflow-hidden border border-slate-100 shadow-lg"><img src={getAssetPath(img)} className="w-full h-auto" alt="gallery" /></div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default DetailModal;