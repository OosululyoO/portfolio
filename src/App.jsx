import { useEffect, useState, useRef } from 'react';
import Navbar from './components/Navbar';
import ParticleBackground from './components/ParticleBackground';
import DetailModal from './components/DetailModal';
import yaml from 'js-yaml';

// --- Utility: 處理靜態資源路徑 (修復 GitHub Pages 子路徑問題) ---
const getAssetPath = (path) => {
  if (!path) return '';
  if (path.startsWith('http')) return path;
  const cleanPath = path.startsWith('/') ? path.slice(1) : path;
  const base = '/portfolio/'; 
  return `${base}${cleanPath}`;
};

// --- Utility: 強化版內容讀取器 ---
const loadContent = (modules) => {
  return Object.keys(modules).map((path) => {
    const mod = modules[path];
    const rawContent = typeof mod === 'string' ? mod : (mod?.default || mod);
    
    if (!rawContent || typeof rawContent !== 'string') return null;

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
      } catch (e) { return null; }
    }
    return null;
  }).filter(Boolean);
};

// --- 子組件: 內容卡片 (已精準修正 hover 範圍) ---
const ContentCard = ({ title, category, main_images, description, onClick }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const images = Array.isArray(main_images) ? main_images : [];

  useEffect(() => {
    if (images.length <= 1) return;
    const randomInterval = Math.floor(Math.random() * 3000) + 3000;
    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % images.length);
    }, randomInterval);
    return () => clearInterval(interval);
  }, [images]);

  return (
    // 關鍵修正：確保 'group' 放在卡片層級，這樣 hover 效果才會精確作用於單一項目
    <div 
      className="group cursor-pointer flex flex-col h-full p-4 rounded-[2.5rem] bg-white border border-slate-100 shadow-sm hover:shadow-xl hover:border-blue-100 transition-all duration-500 ease-out" 
      onClick={onClick}
    >
      <div className="relative overflow-hidden rounded-[2rem] aspect-[4/3] mb-6 bg-slate-50 border border-slate-50 shadow-inner group-hover:-translate-y-1 transition-transform duration-500">
        {images.length > 0 ? (
          <img 
            key={images[currentImageIndex]} 
            src={getAssetPath(images[currentImageIndex])} 
            alt={title} 
            className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
          />
        ) : (
          <div className="flex items-center justify-center h-full text-slate-300 font-black italic bg-slate-50 uppercase">NO IMAGE</div>
        )}
      </div>

      <div className="px-3 pb-4 flex-grow flex flex-col">
        {category && (
          <span className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-600 bg-blue-50/50 px-3 py-1 rounded-full inline-block mb-3 border border-blue-100/30 self-start">
            {category}
          </span>
        )}
        <h3 className="text-xl md:text-2xl font-black tracking-tighter text-slate-900 group-hover:text-blue-600 transition-colors duration-300 mb-2 leading-tight">
          {title}
        </h3>
        <p className="text-slate-500 text-sm font-medium line-clamp-2 leading-relaxed opacity-80 mb-6">
          {description}
        </p>
        
        <div className="mt-auto pt-4 flex items-center text-[10px] font-black tracking-[0.2em] text-blue-600 uppercase">
          Read More
          <svg className="w-3 h-3 ml-2 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M17 8l4 4m0 0l-4 4m4-4H3" />
          </svg>
        </div>
      </div>
    </div>
  );
};

// --- 主組件: App ---
export default function App() {
  const [hero, setHero] = useState({ titleLine1: 'Building', titleAccent: 'Solutions.', heroDescription: '載入中...' });
  const [portfolio, setPortfolio] = useState([]);
  const [achievements, setAchievements] = useState([]);
  const [activities, setActivities] = useState([]);
  const [about, setAbout] = useState([]);
  
  const [selectedItem, setSelectedItem] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleOpenModal = (item) => {
    setSelectedItem(item);
    setIsModalOpen(true);
  };

  const scrollContainer = (ref, direction) => {
    if (ref.current) {
      const scrollAmount = direction === 'left' ? -400 : 400;
      ref.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  useEffect(() => {
    const heroModule = import.meta.glob('./content/settings/hero.yml', { query: '?raw', eager: true });
    const heroPath = Object.keys(heroModule)[0];
    if (heroPath) {
      const mod = heroModule[heroPath];
      setHero(yaml.load(typeof mod === 'string' ? mod : (mod?.default || mod)));
    }

    const pModules = import.meta.glob('./content/portfolio/*.md', { query: '?raw', eager: true });
    const acModules = import.meta.glob('./content/achievements/*.md', { query: '?raw', eager: true });
    const actModules = import.meta.glob('./content/activities/*.md', { query: '?raw', eager: true });
    const abModules = import.meta.glob('./content/about/*.md', { query: '?raw', eager: true });

    setPortfolio(loadContent(pModules));
    setAchievements(loadContent(acModules));
    setActivities(loadContent(actModules));
    setAbout(loadContent(abModules));
  }, []);

  return (
    <div className="min-h-screen bg-[#fcfdfe] font-sans text-slate-900 selection:bg-blue-600 selection:text-white">
      <ParticleBackground />
      <Navbar />
      
      <main className="relative pt-32 px-0 max-w-7xl mx-auto overflow-hidden">
        <section className="py-24 px-6">
          <div className="max-w-4xl">
            <h1 className="text-6xl md:text-[8rem] font-black tracking-tighter leading-[0.85] mb-12">
              {hero.titleLine1} <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-br from-blue-600 to-indigo-600">
                {hero.titleAccent}
              </span>
            </h1>
            <p className="text-xl md:text-3xl text-slate-500 font-medium max-w-2xl leading-tight opacity-90">
              {hero.heroDescription}
            </p>
          </div>
        </section>

        {[
          { id: 'about', title: 'About', data: about },
          { id: 'portfolio', title: 'Portfolio', data: portfolio },
          { id: 'achievements', title: 'Achievements', data: achievements },
          { id: 'activities', title: 'Activities', data: activities }
        ].map(section => {
          const sectionRef = useRef(null);
          return (
            // 關鍵修正：將 'group' 從 section 移除，避免全局懸停觸發
            <section key={section.id} id={section.id} className="py-16 relative">
              <div className="flex items-baseline justify-between mb-8 px-6">
                <h2 className="text-3xl font-black tracking-tighter uppercase text-slate-800 ml-4">{section.title}</h2>
                <div className="hidden md:block h-[1px] flex-grow mx-8 bg-slate-200/40"></div>
              </div>

              {/* 左右導覽按鈕改用獨立的 hover 控制邏輯或 CSS */}
              {section.data.length > 0 && (
                <div className="hidden md:block">
                  <button 
                    onClick={() => scrollContainer(sectionRef, 'left')}
                    className="absolute left-4 top-[60%] -translate-y-1/2 z-20 p-4 bg-white/80 backdrop-blur-md rounded-full shadow-lg border border-slate-100 text-slate-900 hover:bg-black hover:text-white transition-all duration-300"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M15 19l-7-7 7-7" /></svg>
                  </button>
                  <button 
                    onClick={() => scrollContainer(sectionRef, 'right')}
                    className="absolute right-4 top-[60%] -translate-y-1/2 z-20 p-4 bg-white/80 backdrop-blur-md rounded-full shadow-lg border border-slate-100 text-slate-900 hover:bg-black hover:text-white transition-all duration-300"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M9 5l7 7-7 7" /></svg>
                  </button>
                </div>
              )}

              <div 
                ref={sectionRef}
                className="flex gap-6 overflow-x-auto pb-10 px-6 snap-x snap-mandatory no-scrollbar scroll-smooth"
              >
                {section.data.map((item) => (
                  <div key={item.slug} className="min-w-[85%] md:min-w-[45%] lg:min-w-[30%] snap-center">
                    <ContentCard {...item} onClick={() => handleOpenModal(item)} />
                  </div>
                ))}
                {section.data.length === 0 && (
                  <div className="w-full py-10 text-center text-slate-400 italic px-6">暫無內容</div>
                )}
              </div>
            </section>
          );
        })}

        <footer className="py-24 text-center border-t border-slate-100/50 mt-20">
          <p className="text-slate-400 text-[10px] font-black tracking-[0.4em] uppercase">© 2026 LIU CHIN AN — ALL RIGHTS RESERVED</p>
        </footer>
      </main>

      <DetailModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        content={selectedItem} 
      />
    </div>
  );
}