import { useEffect, useState } from 'react';
import Navbar from './components/Navbar';
import ParticleBackground from './components/ParticleBackground';
import DetailModal from './components/DetailModal';
import yaml from 'js-yaml';

// --- Utility: 通用內容讀取器 ---
const loadContent = (modules) => {
  return Object.keys(modules).map((path) => {
    const rawContent = modules[path].default;
    const parts = rawContent.split('---');
    if (parts.length >= 3) {
      try {
        const frontmatter = yaml.load(parts[1]);
        const body = parts.slice(2).join('---').trim();
        const slug = path.split('/').pop().replace('.md', '');
        return { ...frontmatter, body, slug };
      } catch (e) {
        console.error("YAML 解析失敗:", path, e);
        return null;
      }
    }
    return null;
  }).filter(Boolean);
};

// --- 通用組件: ContentCard ---
const ContentCard = ({ title, category, main_images, description, onClick }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const images = main_images || [];

  useEffect(() => {
    if (images.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % images.length);
    }, 3000); // 每 3 秒換一張圖
    return () => clearInterval(interval);
  }, [images]);

  return (
    <div className="group cursor-pointer" onClick={onClick}>
      <div className="relative overflow-hidden rounded-[2.5rem] aspect-[4/3] mb-6 bg-slate-200 shadow-inner border border-slate-100">
        {images.length > 0 ? (
          <img 
            src={images[currentImageIndex]} 
            alt={title} 
            className="w-full h-full object-cover transition-opacity duration-1000 ease-in-out"
          />
        ) : (
          <div className="flex items-center justify-center h-full text-slate-400 font-[900] italic uppercase bg-slate-50">No Image</div>
        )}
        
        {/* 輪播指示點 */}
        {images.length > 1 && (
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5 z-10">
            {images.map((_, i) => (
              <div key={i} className={`h-1 rounded-full transition-all ${i === currentImageIndex ? 'w-4 bg-white' : 'w-1 bg-white/50'}`} />
            ))}
          </div>
        )}

        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex flex-col justify-end p-8">
           <span className="text-white font-black text-xl translate-y-4 group-hover:translate-y-0 transition-transform duration-500">View Project</span>
        </div>
      </div>
      <div className="px-2">
        {category && (
          <span className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-600 bg-blue-50 px-2.5 py-1 rounded-md inline-block mb-3">{category}</span>
        )}
        <h3 className="text-3xl font-[900] tracking-tighter text-slate-900 group-hover:text-blue-600 transition-colors duration-300">{title}</h3>
        <p className="text-slate-500 mt-2 line-clamp-2 font-medium">{description}</p>
      </div>
    </div>
  );
};
export default function App() {
  // 狀態管理
  const [hero, setHero] = useState({ titleLine1: 'Building', titleAccent: 'Solutions.', heroDescription: '正在載入個人簡介...' });
  const [portfolio, setPortfolio] = useState([]);
  const [achievements, setAchievements] = useState([]);
  const [activities, setActivities] = useState([]);
  const [about, setAbout] = useState([]);
  
  // Modal 狀態
  const [selectedItem, setSelectedItem] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleOpenModal = (item) => {
    setSelectedItem(item);
    setIsModalOpen(true);
  };

  useEffect(() => {
    // 讀取首頁 Hero 設定
    const heroModule = import.meta.glob('./content/settings/hero.yml', { query: '?raw', eager: true });
    const heroPath = Object.keys(heroModule)[0];
    if (heroPath) {
      try {
        setHero(yaml.load(heroModule[heroPath].default));
      } catch (e) { console.error("Hero 設定讀取失敗", e); }
    }

    // 讀取各集合內容
    const portfolioModules = import.meta.glob('./content/portfolio/*.md', { query: '?raw', eager: true });
    const achievementModules = import.meta.glob('./content/achievements/*.md', { query: '?raw', eager: true });
    const activityModules = import.meta.glob('./content/activities/*.md', { query: '?raw', eager: true });
    const aboutModules = import.meta.glob('./content/about/*.md', { query: '?raw', eager: true });

    setPortfolio(loadContent(portfolioModules));
    setAchievements(loadContent(achievementModules));
    setActivities(loadContent(activityModules));
    setAbout(loadContent(aboutModules));
  }, []);

  return (
    <div className="min-h-screen bg-[#fcfdfe] font-sans text-slate-900 selection:bg-blue-600 selection:text-white">
      <ParticleBackground />
      <Navbar />
      
      <main className="relative pt-32 px-6 max-w-7xl mx-auto">
        
        {/* --- Hero Section --- */}
        <section className="py-24">
          <div className="max-w-4xl">
            <h1 className="text-6xl md:text-[9rem] font-[900] tracking-tighter leading-[0.85] mb-12">
              {hero.titleLine1} <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-br from-blue-600 to-indigo-600">
                {hero.titleAccent}
              </span>
            </h1>
            <p className="text-xl md:text-3xl text-slate-500 font-medium max-w-2xl leading-[1.2]">
              {hero.heroDescription}
            </p>
          </div>
        </section>

        {/* --- About Section --- */}
        <section id="about" className="py-32 border-t border-slate-200">
          <div className="flex items-baseline justify-between mb-20">
            <h2 className="text-5xl font-black tracking-tighter uppercase">About</h2>
            <div className="hidden md:block h-[1px] flex-grow mx-12 bg-slate-100"></div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-10 gap-y-20">
            {about.map((item) => (
              <ContentCard key={item.slug} {...item} onClick={() => handleOpenModal(item)} />
            ))}
          </div>
        </section>

        {/* --- Portfolio Section --- */}
        <section id="portfolio" className="py-32 border-t border-slate-200">
          <div className="flex items-baseline justify-between mb-20">
            <h2 className="text-5xl font-black tracking-tighter uppercase">Portfolio</h2>
            <div className="hidden md:block h-[1px] flex-grow mx-12 bg-slate-100"></div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-10 gap-y-20">
            {portfolio.map((item) => (
              <ContentCard key={item.slug} {...item} onClick={() => handleOpenModal(item)} />
            ))}
          </div>
        </section>

        {/* --- Achievements Section --- */}
        <section id="achievements" className="py-32 border-t border-slate-200">
          <div className="flex items-baseline justify-between mb-20">
            <h2 className="text-5xl font-black tracking-tighter uppercase">Achievements</h2>
            <div className="hidden md:block h-[1px] flex-grow mx-12 bg-slate-100"></div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-10 gap-y-20">
            {achievements.map((item) => (
              <ContentCard key={item.slug} {...item} onClick={() => handleOpenModal(item)} />
            ))}
          </div>
        </section>

        {/* --- Activities Section --- */}
        <section id="activities" className="py-32 border-t border-slate-200">
          <div className="flex items-baseline justify-between mb-20">
            <h2 className="text-5xl font-black tracking-tighter uppercase">Activities</h2>
            <div className="hidden md:block h-[1px] flex-grow mx-12 bg-slate-100"></div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-10 gap-y-20">
            {activities.map((item) => (
              <ContentCard key={item.slug} {...item} onClick={() => handleOpenModal(item)} />
            ))}
          </div>
        </section>

        <footer className="py-24 text-center border-t border-slate-100">
          <p className="text-slate-400 text-xs font-black tracking-[0.3em] uppercase">© 2026 LIU JIN AN</p>
        </footer>
      </main>

      {/* 彈窗組件 */}
      <DetailModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        content={selectedItem} 
      />
    </div>
  );
}