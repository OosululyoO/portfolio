import { useEffect, useState } from 'react';
import Navbar from './components/Navbar';
import ParticleBackground from './components/ParticleBackground';
import DetailModal from './components/DetailModal';
import yaml from 'js-yaml';

// --- Utility: 處理靜態資源路徑 (修復 GitHub Pages 子路徑問題) ---
const getAssetPath = (path) => {
  if (!path) return '';
  // 如果是外部連結 (http/https)，直接回傳
  if (path.startsWith('http')) return path;
  
  // 移除路徑開頭的斜線，避免拼接時出現雙斜線
  const cleanPath = path.startsWith('/') ? path.slice(1) : path;
  
  // 取得 Vite 設定的 base 路徑 (生產環境為 /portfolio/)
  const base = import.meta.env.BASE_URL;
  
  return `${base}${cleanPath}`;
};

// --- Utility: 強化版內容讀取器 (相容生產環境) ---
const loadContent = (modules) => {
  return Object.keys(modules).map((path) => {
    const mod = modules[path];
    const rawContent = typeof mod === 'string' ? mod : (mod?.default || mod);
    
    if (!rawContent || typeof rawContent !== 'string') {
      console.warn("無法讀取內容或格式錯誤:", path);
      return null;
    }

    const parts = rawContent.split('---');
    if (parts.length >= 3) {
      try {
        const frontmatter = yaml.load(parts[1]);
        const body = parts.slice(2).join('---').trim();
        const slug = path.split('/').pop().replace('.md', '');

        const normalizeImages = (imgData) => {
          if (!imgData) return [];
          return Array.isArray(imgData) 
            ? imgData.map(item => (typeof item === 'object' ? item.image : item))
            : [imgData];
        };

        return { 
          ...frontmatter, 
          main_images: normalizeImages(frontmatter.main_images),
          extra_images: normalizeImages(frontmatter.extra_images),
          body, 
          slug 
        };
      } catch (e) {
        console.error("YAML 解析失敗:", path, e);
        return null;
      }
    }
    return null;
  }).filter(Boolean);
};

const ContentCard = ({ title, category, main_images, description, onClick }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const images = main_images || [];

  useEffect(() => {
    if (images.length <= 1) return;
    const timer = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % images.length);
    }, 4000);
    return () => clearInterval(timer);
  }, [images]);

  return (
    <div 
      onClick={onClick}
      className="group relative bg-white/40 backdrop-blur-md rounded-[2.5rem] overflow-hidden border border-white/40 hover:border-slate-400/30 transition-all duration-500 cursor-pointer hover:shadow-2xl hover:shadow-slate-200/50"
    >
      <div className="relative h-64 overflow-hidden">
        {images.length > 0 ? (
          <img 
            key={images[currentImageIndex]} 
            src={getAssetPath(images[currentImageIndex])} // 使用修正後的路徑
            alt={title} 
            className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
          />
        ) : (
          <div className="flex items-center justify-center h-full text-slate-300 font-black italic bg-slate-50 uppercase">NO IMAGE</div>
        )}
        <div className="absolute top-6 left-6">
          <span className="px-4 py-1.5 bg-black text-white text-[10px] font-black tracking-widest uppercase rounded-full">
            {category}
          </span>
        </div>
      </div>
      
      <div className="p-8">
        <h3 className="text-xl font-black text-slate-800 mb-3 tracking-tighter uppercase">{title}</h3>
        <p className="text-slate-500 text-sm leading-relaxed line-clamp-2 font-medium">{description}</p>
        <div className="mt-6 flex items-center text-[10px] font-black tracking-[0.2em] text-slate-400 group-hover:text-black transition-colors uppercase">
          View Project 
          <svg className="w-3 h-3 ml-2 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M17 8l4 4m0 0l-4 4m4-4H3" />
          </svg>
        </div>
      </div>
    </div>
  );
};

function App() {
  const [portfolio, setPortfolio] = useState([]);
  const [achievements, setAchievements] = useState([]);
  const [activities, setActivities] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);

  useEffect(() => {
    const portfolioModules = import.meta.glob('./content/portfolio/*.md', { query: '?raw', eager: true });
    const achievementModules = import.meta.glob('./content/achievements/*.md', { query: '?raw', eager: true });
    const activityModules = import.meta.glob('./content/activities/*.md', { query: '?raw', eager: true });

    setPortfolio(loadContent(portfolioModules));
    setAchievements(loadContent(achievementModules));
    setActivities(loadContent(activityModules));
  }, []);

  const handleOpenModal = (item) => {
    // 傳遞前先處理圖片路徑，確保 Modal 內部也能正確顯示
    const processedItem = {
      ...item,
      main_images: item.main_images.map(getAssetPath),
      extra_images: item.extra_images.map(getAssetPath)
    };
    setSelectedItem(processedItem);
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] font-sans selection:bg-black selection:text-white">
      <ParticleBackground />
      <Navbar />
      
      <main className="max-w-7xl mx-auto px-6 pt-32 pb-20 relative z-10">
        <header className="mb-24 mt-10">
          <div className="inline-block px-4 py-1 rounded-full bg-slate-200/50 text-slate-500 text-[10px] font-black tracking-[0.3em] uppercase mb-6">
            Creative Portfolio
          </div>
          <h1 className="text-7xl md:text-8xl font-black tracking-[ -0.05em] leading-[0.9] text-slate-900 uppercase">
            LIU JIN AN<span className="text-slate-300">.</span>
          </h1>
          <p className="mt-8 text-lg text-slate-500 max-w-xl font-medium leading-relaxed">
            目前就讀於國立虎尾科技大學，專注於 AIoT 嵌入式系統開發與硬體整合。
          </p>
        </header>

        {[
          { id: 'portfolio', title: 'Portfolio', data: portfolio },
          { id: 'achievements', title: 'Achievements', data: achievements },
          { id: 'activities', title: 'Activities', data: activities }
        ].map(section => (
          <section key={section.id} id={section.id} className="py-16">
            <div className="flex items-baseline justify-between mb-8">
              <h2 className="text-3xl font-black tracking-tighter uppercase text-slate-800 ml-4">{section.title}</h2>
              <div className="hidden md:block h-[1px] flex-grow mx-8 bg-slate-200/40"></div>
            </div>

            <div className="bg-slate-50/50 backdrop-blur-sm border border-slate-100/50 rounded-[4rem] p-6 md:p-10">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                {section.data.map((item) => (
                  <ContentCard key={item.slug} {...item} onClick={() => handleOpenModal(item)} />
                ))}
              </div>
              {section.data.length === 0 && (
                <div className="py-10 text-center text-slate-400 italic">暫無內容</div>
              )}
            </div>
          </section>
        ))}

        <footer className="py-24 text-center border-t border-slate-100/50 mt-20">
          <p className="text-slate-400 text-[10px] font-black tracking-[0.5em] uppercase">© 2026 LIU JIN AN — ALL RIGHTS RESERVED</p>
        </footer>
      </main>

      <DetailModal 
        isOpen={!!selectedItem} 
        onClose={() => setSelectedItem(null)} 
        item={selectedItem} 
      />
    </div>
  );
}

export default App;