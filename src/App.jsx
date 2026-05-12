import { useEffect, useState } from 'react';
import Navbar from './components/Navbar';
import ParticleBackground from './components/ParticleBackground';
import DetailModal from './components/DetailModal';
import yaml from 'js-yaml';

// --- Utility: 強化版內容讀取器 (相容生產環境) ---
const loadContent = (modules) => {
  return Object.keys(modules).map((path) => {
    const mod = modules[path];
    // 關鍵修正：Vite 在生產環境有時會將內容放在 .default，有時則是純字串
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

        // 統一處理 Decap CMS 可能產生的圖片路徑格式
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

// --- 子組件: 內容卡片 ---
const ContentCard = ({ title, category, main_images, description, onClick }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const images = Array.isArray(main_images) ? main_images : [];

  useEffect(() => {
    if (images.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % images.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [images]);

  return (
    <div 
      className="group cursor-pointer flex flex-col h-full p-4 rounded-[2.5rem] bg-white border border-slate-100 shadow-sm hover:shadow-xl hover:border-blue-100 transition-all duration-500 ease-out" 
      onClick={onClick}
    >
      <div className="relative overflow-hidden rounded-[2rem] aspect-[4/3] mb-6 bg-slate-50 border border-slate-50 shadow-inner group-hover:-translate-y-1 transition-transform duration-500">
        {images.length > 0 ? (
          <img 
            key={images[currentImageIndex]} 
            src={images[currentImageIndex]} 
            alt={title} 
            className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
          />
        ) : (
          <div className="flex items-center justify-center h-full text-slate-300 font-black italic bg-slate-50 uppercase">NO IMAGE</div>
        )}
        
        {images.length > 1 && (
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5 z-10">
            {images.map((_, i) => (
              <div key={i} className={`h-1 rounded-full transition-all duration-300 ${i === currentImageIndex ? 'w-5 bg-white' : 'w-1 bg-white/40'}`} />
            ))}
          </div>
        )}
      </div>

      <div className="px-3 pb-4 flex-grow">
        {category && (
          <span className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-600 bg-blue-50/50 px-3 py-1 rounded-full inline-block mb-3 border border-blue-100/30">
            {category}
          </span>
        )}
        <h3 className="text-xl md:text-2xl font-black tracking-tighter text-slate-900 group-hover:text-blue-600 transition-colors duration-300 mb-2 leading-tight">
          {title}
        </h3>
        <p className="text-slate-500 text-sm font-medium line-clamp-2 leading-relaxed opacity-80 group-hover:opacity-100">
          {description}
        </p>
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

  useEffect(() => {
    // 載入 Hero 設定 (處理 GitHub Pages 路徑)
    const heroModule = import.meta.glob('./content/settings/hero.yml', { query: '?raw', eager: true });
    const heroPath = Object.keys(heroModule)[0];
    if (heroPath) {
      try {
        const mod = heroModule[heroPath];
        const rawHero = typeof mod === 'string' ? mod : (mod?.default || mod);
        setHero(yaml.load(rawHero));
      } catch (e) { console.error("Hero 解析失敗:", e); }
    }

    // 載入各類 Markdown 模組
    const pModules = import.meta.glob('./content/portfolio/*.md', { query: '?raw', eager: true });
    const acModules = import.meta.glob('./content/achievements/*.md', { query: '?raw', eager: true });
    const actModules = import.meta.glob('./content/activities/*.md', { query: '?raw', eager: true });
    const abModules = import.meta.glob('./content/about/*.md', { query: '?raw', eager: true });

    // 解析資料
    const pData = loadContent(pModules);
    const acData = loadContent(acModules);
    const actData = loadContent(actModules);
    const abData = loadContent(abModules);

    // Debug 用：在 Console 檢查資料是否解析成功
    console.log("解析後的作品集:", pData);

    // 更新狀態
    setPortfolio(pData);
    setAchievements(acData);
    setActivities(actData);
    setAbout(abData);
  }, []);

  return (
    <div className="min-h-screen bg-[#fcfdfe] font-sans text-slate-900 selection:bg-blue-600 selection:text-white">
      <ParticleBackground />
      <Navbar />
      
      <main className="relative pt-32 px-6 max-w-7xl mx-auto">
        <section className="py-24">
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
          <p className="text-slate-400 text-[10px] font-black tracking-[0.4em] uppercase">© 2026 LIU JIN AN</p>
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