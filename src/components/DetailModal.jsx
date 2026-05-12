// src/components/DetailModal.jsx
import { motion, AnimatePresence } from 'framer-motion';
import ReactMarkdown from 'react-markdown';

const DetailModal = ({ isOpen, onClose, content }) => {
  if (!content) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-10">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} className="absolute inset-0 bg-slate-900/60 backdrop-blur-md" />
          
          <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} className="relative bg-white w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-[2.5rem] shadow-2xl z-10">
            <button onClick={onClose} className="fixed md:absolute top-6 right-8 text-slate-400 hover:text-slate-900 font-black text-2xl z-50 p-2">✕</button>

            <div className="p-8 md:p-16">
              {/* 詳細頁上方顯示第一張主圖 */}
              {content.main_images?.[0] && (
                <img src={content.main_images[0]} alt={content.title} className="w-full aspect-video object-cover rounded-3xl mb-10 shadow-lg" />
              )}

              <h2 className="text-4xl md:text-6xl font-black tracking-tighter mb-8">{content.title}</h2>

              {/* Markdown 內容 */}
              <div className="prose prose-slate max-w-none mb-12">
                <ReactMarkdown>{content.body}</ReactMarkdown>
              </div>

              {/* 額外照片顯示在 Markdown 之後 */}
              {content.extra_images && content.extra_images.length > 0 && (
                <div className="space-y-8 pt-10 border-t border-slate-100">
                  <h4 className="text-sm font-black uppercase tracking-widest text-slate-400">Project Gallery</h4>
                  <div className="grid grid-cols-1 gap-6">
                    {content.extra_images.map((img, idx) => (
                      <img key={idx} src={img} alt="Extra" className="w-full rounded-2xl shadow-sm border border-slate-100" />
                    ))}
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default DetailModal;