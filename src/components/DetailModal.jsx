import { motion, AnimatePresence } from 'framer-motion';
import ReactMarkdown from 'react-markdown';

const DetailModal = ({ isOpen, onClose, content }) => {
  if (!content) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-10">
          {/* 背景遮罩 */}
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} 
            onClick={onClose} 
            className="absolute inset-0 bg-slate-900/60 backdrop-blur-md" 
          />
          
          {/* 視窗主體 */}
          <motion.div 
            initial={{ y: 50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 50, opacity: 0 }} 
            className="relative bg-white w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-[2.5rem] shadow-2xl z-10"
          >
            {/* 關閉按鈕 */}
            <button 
              onClick={onClose} 
              className="absolute top-6 right-8 text-slate-400 hover:text-blue-600 transition-colors font-black text-2xl z-50 p-2"
            >
              ✕
            </button>

            <div className="p-8 md:p-16">
              {/* 第一張主圖作為 Header */}
              {content.main_images?.[0] && (
                <img 
                  src={content.main_images[0]} 
                  alt={content.title} 
                  className="w-full aspect-video object-cover rounded-3xl mb-12 shadow-lg" 
                />
              )}

              <div className="max-w-3xl mx-auto">
                <span className="text-xs font-black uppercase tracking-[0.2em] text-blue-600 mb-4 block">
                  {content.category}
                </span>
                <h2 className="text-4xl md:text-6xl font-black tracking-tighter mb-10 leading-[0.9]">
                  {content.title}
                </h2>

                {/* Markdown 渲染內容 */}
                <div className="prose prose-slate prose-lg max-w-none 
                  prose-headings:font-black prose-headings:tracking-tighter 
                  prose-p:text-slate-600 prose-p:leading-relaxed
                  prose-strong:text-slate-900 prose-a:text-blue-600
                  mb-20">
                  <ReactMarkdown>{content.body}</ReactMarkdown>
                </div>

                {/* 延伸圖庫 */}
                {content.extra_images && content.extra_images.length > 0 && (
                  <div className="space-y-8 pt-16 border-t border-slate-100">
                    <h4 className="text-sm font-black uppercase tracking-widest text-slate-400">Project Gallery</h4>
                    <div className="grid grid-cols-1 gap-8">
                      {content.extra_images.map((img, idx) => (
                        <img 
                          key={idx} 
                          src={img} 
                          alt={`Gallery ${idx}`} 
                          className="w-full rounded-2xl shadow-sm border border-slate-100" 
                        />
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default DetailModal;