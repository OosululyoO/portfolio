import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ReactMarkdown from 'react-markdown';

// --- 子組件: 獨立輪播器 ---
const ImageCarousel = ({ images, title, aspectRatio = "aspect-video" }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  if (!images || images.length === 0) return null;

  const handleNext = (e) => {
    e.stopPropagation();
    setCurrentIndex((prev) => (prev + 1) % images.length);
  };

  const handlePrev = (e) => {
    e.stopPropagation();
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  return (
    <div className={`relative group w-full ${aspectRatio} overflow-hidden rounded-[2.5rem] bg-slate-100 border border-slate-100 shadow-sm mb-10`}>
      <AnimatePresence mode="wait">
        <motion.img
          key={currentIndex}
          src={images[currentIndex]}
          alt={`${title}-${currentIndex}`}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.3 }}
          className="w-full h-full object-cover"
        />
      </AnimatePresence>

      {images.length > 1 && (
        <>
          <button onClick={handlePrev} className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/20 hover:bg-white/90 text-white hover:text-blue-600 backdrop-blur-md transition-all opacity-0 group-hover:opacity-100 flex items-center justify-center">
            ←
          </button>
          <button onClick={handleNext} className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/20 hover:bg-white/90 text-white hover:text-blue-600 backdrop-blur-md transition-all opacity-0 group-hover:opacity-100 flex items-center justify-center">
            →
          </button>
          <div className="absolute bottom-6 right-8 px-3 py-1 rounded-full bg-black/30 backdrop-blur-md text-white text-[10px] font-black tracking-widest">
            {currentIndex + 1} / {images.length}
          </div>
        </>
      )}
    </div>
  );
};

const DetailModal = ({ isOpen, onClose, content }) => {
  // 重置滾動位置或狀態可在內容變化時進行
  useEffect(() => {
    if (isOpen) {
      const modalElement = document.getElementById('modal-content');
      if (modalElement) modalElement.scrollTop = 0;
    }
  }, [isOpen, content]);

  if (!content) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-10">
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} 
            onClick={onClose} 
            className="absolute inset-0 bg-slate-900/80 backdrop-blur-xl" 
          />
          
          <motion.div 
            id="modal-content"
            initial={{ scale: 0.95, opacity: 0, y: 20 }} 
            animate={{ scale: 1, opacity: 1, y: 0 }} 
            exit={{ scale: 0.95, opacity: 0, y: 20 }} 
            className="relative bg-white w-full max-w-5xl max-h-[90vh] overflow-y-auto rounded-[3.5rem] shadow-2xl z-10"
          >
            <button 
              onClick={onClose} 
              className="absolute top-6 right-8 text-slate-400 hover:text-blue-600 transition-colors font-black text-2xl z-50 bg-white/80 backdrop-blur-md w-12 h-12 rounded-full flex items-center justify-center shadow-sm"
            >
              ✕
            </button>

            <div className="p-8 md:p-14">
              {/* 1. 主要照片輪播 (位置不變，位於頂部) */}
              <ImageCarousel images={content.main_images} title={content.title} />

              <div className="max-w-3xl mx-auto">
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-600 bg-blue-50 px-4 py-1.5 rounded-full border border-blue-100/50 inline-block mb-6">
                  {content.category || "PROJECT"}
                </span>
                
                <h2 className="text-4xl md:text-6xl font-black tracking-tighter mb-10 leading-[0.95] text-slate-900">
                  {content.title}
                </h2>

                {/* 2. Markdown 內容顯示 */}
                <div className="prose prose-slate prose-lg max-w-none 
                  prose-headings:font-black prose-headings:tracking-tighter 
                  prose-p:text-slate-600 prose-p:leading-relaxed
                  prose-strong:text-slate-900 prose-a:text-blue-600
                  prose-img:rounded-3xl prose-img:shadow-md
                  mb-16">
                  <ReactMarkdown>{content.body}</ReactMarkdown>
                </div>

                {/* 3. 附加照片輪播 (位於 Markdown 後面) */}
                {content.extra_images && content.extra_images.length > 0 && (
                  <div className="pt-12 border-t border-slate-100 mb-12">
                    <h4 className="text-xs font-black uppercase tracking-[0.3em] text-slate-400 mb-8 text-center">相關資料</h4>
                    <ImageCarousel images={content.extra_images} title={`${content.title}-extra`} aspectRatio="aspect-[16/10]" />
                  </div>
                )}

                <div className="h-[1px] w-full bg-slate-100 mb-10" />
                <p className="text-slate-400 text-[10px] font-black tracking-widest uppercase">
                  Project Archive / {content.slug}
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default DetailModal;