import { useEffect, useState, useRef } from 'react';
import { BrowserRouter as Router, Routes, Route, useParams, Link } from 'react-router-dom';
import Navbar from './components/Navbar';
import ParticleBackground from './components/ParticleBackground';
import DetailModal from './components/DetailModal';
import yaml from 'js-yaml';

// --- Utility: 處理靜態資源路徑 ---
const getAssetPath = (path) => {
  if (!path) return '';
  if (path.startsWith('http')) return path;
  const cleanPath = path.startsWith('/') ? path.slice(1) : path;
  return `/portfolio/${cleanPath}`;
};

// --- Utility: 內容讀取器 (支援多分類與日期) ---
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
          return Array.isArray(imgData) ? imgData.map(item => (typeof item === 'object' ? item.image : item)) : [imgData];
        };

        return { 
          ...frontmatter, 
          // 支援多個 Category
          categories: Array.isArray(frontmatter.category) ? frontmatter.category : [frontmatter.category].filter(Boolean),
          main_images: normalizeImages(frontmatter.main_images),
          extra_images: normalizeImages(frontmatter.extra_images),
          date: frontmatter.date ? new Date(frontmatter.date).toLocaleDateString('zh-TW') : null,
          body, 
          slug 
        };
      } catch (e) { return null; }
    }
    return null;
  }).filter(Boolean);
};

// --- 子組件: 內容卡片 ---
const ContentCard = ({ title, categories, main_images, description, date, onClick }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const images = main_images || [];

  useEffect(() => {
    if (images.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % images.length);
    }, Math.floor(Math.random() * 3000) + 3000);
    return () => clearInterval(interval);
  }, [images]);

  return (
    <div className="group cursor-pointer flex flex-col h-full p-4 rounded-[2.5rem] bg-white border border-slate-100 shadow-sm hover:shadow-xl transition-all duration-500" onClick={onClick}>
      <div className="relative overflow-hidden rounded-[2rem] aspect-[4/3] mb-6 bg-slate-50">
        {images.length > 0 && (
          <img src={getAssetPath(images[currentImageIndex])} alt={title} className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105" />
        )}
      </div>
      <div className="px-3 flex-grow flex flex-col">
        <div className="flex flex-wrap gap-2 mb-3">
          {categories.map(cat => (
            <span key={cat} className="text-[9px] font-black uppercase tracking-widest text-blue-600 bg-blue-50 px-2 py-1 rounded-md">{cat}</span>
          ))}
          {date && <span className="text-[9px] font-bold text-slate-400 ml-auto">{date}</span>}
        </div>
        <h3 className="text-xl font-black text-slate-900 group-hover:text-blue-600 mb-2">{title}</h3>
        <p className="text-slate-500 text-sm line-clamp-2 mb-6">{description}</p>
        <div className="mt-auto text-[10px] font-black text-blue-600 uppercase flex items-center">
          Read More <span className="ml-2">→</span>
        </div>
      </div>
    </div>
  );
};

// --- 頁面組件: 分類清單頁 ---
const CategoryPage = ({ allData }) => {
  const { categoryName } = useParams();
  const filteredData = allData.filter(item => item.categories.includes(categoryName));

  return (
    <div className="pt-32 px-6 max-w-7xl mx-auto min-h-screen">
      <h1 className="text-5xl font-black mb-12 uppercase tracking-tighter">
        Category: <span className="text-blue-600">{categoryName}</span>
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredData.map(item => (
          <ContentCard key={item.slug} {...item} />
        ))}
      </div>
    </div>
  );
};

// --- 主頁面 ---
const HomePage = ({ sections, handleOpenModal }) => {
  return (
    <main className="relative pt-32 px-0 max-w-7xl mx-auto overflow-hidden">
      <section className="py-24 px-6 text-center md:text-left">
        <h1 className="text-6xl md:text-[8rem] font-black tracking-tighter leading-none mb-8">
          LIU CHIN AN<span className="text-blue-600">.</span>
        </h1>
        <p className="text-xl text-slate-500 max-w-2xl">Building innovative AIoT solutions and exploring sustainable futures.</p>
      </section>

      {sections.map(section => {
        const sectionRef = useRef(null);
        // 環狀輪播邏輯：將資料複製一份接在後面
        const displayData = [...section.data, ...section.data];

        return (
          <section key={section.id} id={section.id} className="py-16 relative">
            <div className="flex items-baseline justify-between mb-8 px-6">
              <h2 className="text-3xl font-black tracking-tighter uppercase">{section.title}</h2>
            </div>
            <div ref={sectionRef} className="flex gap-6 overflow-x-auto pb-10 px-6 no-scrollbar snap-x scroll-smooth">
              {displayData.map((item, idx) => (
                <div key={`${item.slug}-${idx}`} className="min-w-[85%] md:min-w-[30%] snap-center">
                  <ContentCard {...item} onClick={() => handleOpenModal(item)} />
                </div>
              ))}
            </div>
          </section>
        );
      })}
    </main>
  );
};

export default function App() {
  const [data, setData] = useState({ portfolio: [], achievements: [], activities: [], about: [] });
  const [selectedItem, setSelectedItem] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const p = import.meta.glob('./content/portfolio/*.md', { query: '?raw', eager: true });
    const ac = import.meta.glob('./content/achievements/*.md', { query: '?raw', eager: true });
    const act = import.meta.glob('./content/activities/*.md', { query: '?raw', eager: true });
    const ab = import.meta.glob('./content/about/*.md', { query: '?raw', eager: true });

    setData({
      portfolio: loadContent(p),
      achievements: loadContent(ac),
      activities: loadContent(act),
      about: loadContent(ab)
    });
  }, []);

  const allData = [...data.portfolio, ...data.achievements, ...data.activities, ...data.about];

  return (
    <Router basename="/portfolio">
      <div className="min-h-screen bg-[#fcfdfe]">
        <ParticleBackground />
        <Navbar />
        <Routes>
          <Route path="/" element={
            <HomePage 
              handleOpenModal={(item) => { setSelectedItem(item); setIsModalOpen(true); }}
              sections={[
                { id: 'about', title: 'About', data: data.about },
                { id: 'portfolio', title: 'Portfolio', data: data.portfolio },
                { id: 'achievements', title: 'Achievements', data: data.achievements },
                { id: 'activities', title: 'Activities', data: data.activities }
              ]} 
            />
          } />
          <Route path="/category/:categoryName" element={<CategoryPage allData={allData} />} />
        </Routes>
        <footer className="py-24 text-center border-t border-slate-100/50">
          <p className="text-slate-400 text-[10px] font-black tracking-[0.4em] uppercase">© 2026 LIU CHIN AN — ALL RIGHTS RESERVED</p>
        </footer>
        <DetailModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} content={selectedItem} />
      </div>
    </Router>
  );
}