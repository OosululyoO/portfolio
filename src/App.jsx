import { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route, useParams } from 'react-router-dom';
import Navbar from './components/Navbar';
import ParticleBackground from './components/ParticleBackground';
import DetailModal from './components/DetailModal';
import yaml from 'js-yaml';
import { motion } from 'framer-motion';

// Swiper 核心組件
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Autoplay, Pagination, EffectFade } from 'swiper/modules';

// Swiper 樣式
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/effect-fade';

// --- Utility: 處理路徑 ---
export const getAssetPath = (path) => {
  if (!path) return '';
  if (path.startsWith('http')) return path;
  const cleanPath = path.startsWith('/') ? path.slice(1) : path;
  return `/portfolio/${cleanPath}`;
};

// --- Utility: 內容讀取器 ---
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

// --- 組件: 卡片 (內含小輪播) ---
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

// --- 頁面: 首頁 (恢復卡片間輪播) ---
const Home = ({ data, onOpenModal }) => {
  // 2. 修正：主頁區塊配置，包含 About, Project, Achievements, Activities
  const sections = [
    { id: 'about', title: 'About', data: data.about },
    { id: 'portfolio', title: 'Project', data: data.portfolio },
    { id: 'achievements', title: 'Achievements', data: data.achievements },
    { id: 'activities', title: 'Activities', data: data.activities }
  ];

  return (
    <main className="relative pt-32 pb-20">
      <section className="px-6 mb-24 text-center">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-7xl md:text-9xl font-black tracking-tighter text-slate-900 mb-8 uppercase leading-none">
            LIU CHIN AN
          </h1>
          <p className="text-xl md:text-2xl text-slate-500 font-medium max-w-3xl mx-auto leading-relaxed italic">
            AIoT Developer & Student at National Formosa University.
          </p>
        </motion.div>
      </section>

      {sections.map((section) => (
        <section key={section.id} id={section.id} className="mb-24 px-4 md:px-10">
          <h2 className="text-4xl font-black tracking-tight uppercase mb-10 px-4">{section.title}</h2>
          
          {/* 3. 恢復：不同 Card 間的輪播效果 */}
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

// --- 頁面: 分類過濾頁 ---
const CategoryPage = ({ data, onOpenModal }) => {
  const { slug } = useParams();
  const allItems = [...data.about, ...data.portfolio, ...data.achievements, ...data.activities];
  
  // 篩選邏輯：檢查 categories 陣列或資料夾 slug
  const filteredItems = allItems.filter(item => 
    item.categories?.some(c => c.toLowerCase() === slug.toLowerCase()) || 
    slug.toLowerCase() === 'about' && data.about.includes(item) // 特殊處理 About
  );

  return (
    <main className="pt-40 pb-20 px-10 min-h-[70vh]">
      <h1 className="text-5xl font-black mb-12 uppercase tracking-tighter">
        Category: <span className="text-blue-600">{slug}</span>
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredItems.map(item => (
          <ContentCard key={item.slug} {...item} onClick={() => onOpenModal(item)} />
        ))}
      </div>
    </main>
  );
};

export default function App() {
  const [data, setData] = useState({ about: [], portfolio: [], achievements: [], activities: [] });
  const [modal, setModal] = useState({ isOpen: false, content: null });

  useEffect(() => {
    const loadAll = async () => {
      // 讀取 content 下的所有資料夾
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
          <Route path="/" element={<Home data={data} onOpenModal={(item) => setModal({ isOpen: true, content: item })} />} />
          <Route path="/category/:slug" element={<CategoryPage data={data} onOpenModal={(item) => setModal({ isOpen: true, content: item })} />} />
        </Routes>
        <DetailModal 
          isOpen={modal.isOpen} 
          onClose={() => setModal({ isOpen: false, content: null })} 
          content={modal.content} 
        />
      </div>
    </BrowserRouter>
  );
}