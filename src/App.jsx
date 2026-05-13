import { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route, useParams, Link, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import ParticleBackground from './components/ParticleBackground';
import DetailModal from './components/DetailModal';
import yaml from 'js-yaml';
import { motion, AnimatePresence } from 'framer-motion';

// Swiper 核心組件
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Autoplay, Pagination, EffectFade } from 'swiper/modules';

// Swiper 樣式
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/effect-fade';

export const getAssetPath = (path) => {
  if (!path) return '';
  if (path.startsWith('http')) return path;
  const cleanPath = path.startsWith('/') ? path.slice(1) : path;
  return `/portfolio/${cleanPath}`;
};

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

        return {
          ...frontmatter,
          body,
          slug,
          categories: Array.isArray(frontmatter.categories) 
            ? frontmatter.categories 
            : (frontmatter.category ? [frontmatter.category] : []),
          date: frontmatter.date || ''
        };
      } catch (e) { return null; }
    }
    return null;
  }).filter(Boolean);
};

const ContentCard = ({ title, description, main_images, categories, date, onClick }) => {
  const hasMultipleImages = main_images && main_images.length > 1;

  return (
    <div className="group relative bg-white/70 backdrop-blur-sm rounded-[2.5rem] overflow-hidden border border-white shadow-sm hover:shadow-2xl transition-all duration-500 h-full flex flex-col">
      <div className="aspect-[4/3] overflow-hidden relative" onClick={onClick}>
        {hasMultipleImages ? (
          <Swiper
            modules={[Autoplay, EffectFade]}
            effect="fade"
            loop={true}
            autoplay={{ delay: 3000, disableOnInteraction: false }}
            className="w-full h-full cursor-pointer"
          >
            {main_images.map((img, idx) => (
              <SwiperSlide key={idx}>
                <img src={getAssetPath(img)} alt={`${title}-${idx}`} className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700" />
              </SwiperSlide>
            ))}
          </Swiper>
        ) : (
          <img src={getAssetPath(main_images?.[0])} alt={title} className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700 cursor-pointer" />
        )}
      </div>
      <div className="p-8 flex-grow flex flex-col cursor-pointer" onClick={onClick}>
        <div className="flex justify-between items-start mb-4">
          <div className="flex flex-wrap gap-2">
            {categories.map(cat => (
              <span key={cat} className="text-[10px] font-black uppercase tracking-widest text-blue-600 bg-blue-50 px-2 py-1 rounded-full">{cat}</span>
            ))}
          </div>
          <span className="text-[10px] font-bold text-slate-400">{date}</span>
        </div>
        <h3 className="text-2xl font-black text-slate-900 mb-3 group-hover:text-blue-600 transition-colors uppercase leading-tight">{title}</h3>
        <p className="text-slate-500 line-clamp-2 font-medium leading-relaxed mt-auto">{description}</p>
      </div>
    </div>
  );
};

const BackToHomeButton = () => {
  const location = useLocation();
  if (location.pathname === '/') return null;

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.5, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      className="fixed bottom-8 right-8 z-[90]"
    >
      <Link 
        to="/" 
        className="w-14 h-14 bg-blue-600/40 backdrop-blur-md shadow-lg rounded-full flex items-center justify-center text-white hover:bg-blue-600/60 transition-all border border-white/20"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
        </svg>
      </Link>
    </motion.div>
  );
};

const Home = ({ data, hero, onOpenModal }) => {
  const sections = [
    { id: 'about', title: 'About', data: data.about },
    { id: 'portfolio', title: 'Project', data: data.portfolio },
    { id: 'achievements', title: 'Achievements', data: data.achievements },
    { id: 'activities', title: 'Activities', data: data.activities }
  ];

  return (
    <main className="relative pt-32 pb-20">
      <section className="px-10 md:px-24 mb-24 text-left max-w-7xl">
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8 }}>
          {/* 從 hero.yml 讀取主標題 */}
          <h1 className="text-7xl md:text-9xl font-black tracking-tighter text-slate-900 mb-2 uppercase leading-none">
            {hero.mainTitle || "劉晉安"}
          </h1>
          {/* 從 hero.yml 讀取副標題 */}
          <h2 className="text-4xl md:text-6xl font-black tracking-tighter mb-8 bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent uppercase">
            {hero.accentTitle || "CHIN AN LIU"}
          </h2>
          {/* 從 hero.yml 讀取描述 */}
          <p className="text-xl md:text-2xl text-slate-500 font-medium leading-relaxed italic">
            {hero.description || "很高興認識你：）"}
          </p>
        </motion.div>
      </section>

      {sections.map((section) => (
        <section key={section.id} id={section.id} className="mb-24 px-4 md:px-10">
          <h2 className="text-4xl font-black tracking-tight uppercase mb-10 px-4">{section.title}</h2>
          <Swiper
            modules={[Navigation, Autoplay, Pagination]}
            spaceBetween={30}
            slidesPerView={1.2}
            loop={section.data.length > 3}
            autoplay={{ delay: 5000, disableOnInteraction: false, pauseOnMouseEnter: true }}
            navigation
            pagination={{ clickable: true }}
            breakpoints={{
              768: { slidesPerView: 2.2 },
              1024: { slidesPerView: 3.2 }
            }}
            className="pb-12"
          >
            {section.data.map((item) => (
              <SwiperSlide key={item.slug} className="h-auto">
                <ContentCard {...item} onClick={() => onOpenModal(item)} />
              </SwiperSlide>
            ))}
            {section.data.length === 0 && (
                <div className="text-slate-400 italic py-10 text-center w-full">Coming Soon...</div>
            )}
          </Swiper>
        </section>
      ))}
    </main>
  );
};

const CategoryPage = ({ data, onOpenModal }) => {
  const { slug } = useParams();
  
  const poolMap = {
    'about': { title: 'ABOUT', items: data.about },
    'portfolio': { title: 'PROJECT', items: data.portfolio },
    'project': { title: 'PROJECT', items: data.portfolio },
    'achievements': { title: 'ACHIEVEMENTS', items: data.achievements },
    'activities': { title: 'ACTIVITIES', items: data.activities }
  };

  const categoryData = poolMap[slug.toLowerCase()] || { title: slug.toUpperCase(), items: [] };

  return (
    <main className="pt-40 pb-20 px-10 md:px-24 min-h-[70vh]">
      <motion.h1 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-6xl md:text-8xl font-black mb-16 tracking-tighter bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent uppercase leading-none"
      >
        {categoryData.title}
      </motion.h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {categoryData.items.map(item => (
          <ContentCard key={item.slug} {...item} onClick={() => onOpenModal(item)} />
        ))}
      </div>
      {categoryData.items.length === 0 && (
        <p className="text-slate-500 mt-10 italic text-xl">目前此分類尚無內容</p>
      )}
    </main>
  );
};

export default function App() {
  const [data, setData] = useState({ about: [], portfolio: [], achievements: [], activities: [] });
  const [hero, setHero] = useState({}); // 新增 Hero 狀態
  const [modal, setModal] = useState({ isOpen: false, content: null });

  useEffect(() => {
    const loadAll = async () => {
      // 載入設定檔案
      const heroModules = import.meta.glob('./content/settings/hero.yml', { query: '?raw', eager: true });
      const heroKey = Object.keys(heroModules)[0];
      if (heroKey) {
        setHero(yaml.load(heroModules[heroKey]));
      }

      // 載入內容檔案
      const abModules = import.meta.glob('./content/about/*.md', { query: '?raw', eager: true });
      const pModules = import.meta.glob('./content/portfolio/*.md', { query: '?raw', eager: true });
      const achModules = import.meta.glob('./content/achievements/*.md', { query: '?raw', eager: true });
      const actModules = import.meta.glob('./content/activities/*.md', { query: '?raw', eager: true });

      setData({
        about: loadContent(abModules),
        portfolio: loadContent(pModules),
        achievements: loadContent(achModules),
        activities: loadContent(actModules)
      });
    };
    loadAll();
  }, []);

  return (
    <BrowserRouter basename="/portfolio">
      <div className="min-h-screen bg-[#fcfdfe] text-slate-900">
        <ParticleBackground />
        <Navbar />
        <Routes>
          <Route path="/" element={<Home data={data} hero={hero} onOpenModal={(item) => setModal({ isOpen: true, content: item })} />} />
          <Route path="/category/:slug" element={<CategoryPage data={data} onOpenModal={(item) => setModal({ isOpen: true, content: item })} />} />
        </Routes>
        <DetailModal 
          isOpen={modal.isOpen} 
          onClose={() => setModal({ isOpen: false, content: null })} 
          content={modal.content} 
        />
        <BackToHomeButton />
      </div>
    </BrowserRouter>
  );
}