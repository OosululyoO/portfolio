import { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route, useParams } from 'react-router-dom';
import Navbar from './components/Navbar';
import ParticleBackground from './components/ParticleBackground';
import DetailModal from './components/DetailModal';
import yaml from 'js-yaml';
import { motion } from 'framer-motion';

// Swiper 核心組件
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Autoplay, Pagination } from 'swiper/modules';

// Swiper 樣式
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

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

const ContentCard = ({ title, description, main_images, categories, date, onClick }) => (
  <div onClick={onClick} className="group relative bg-white/70 backdrop-blur-sm rounded-[2.5rem] overflow-hidden border border-white shadow-sm hover:shadow-2xl transition-all duration-500 cursor-pointer h-full">
    <div className="aspect-[4/3] overflow-hidden">
      <img src={getAssetPath(main_images?.[0])} alt={title} className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700" />
    </div>
    <div className="p-8">
      <div className="flex justify-between items-start mb-4">
        <div className="flex flex-wrap gap-2">
          {categories.map(cat => (
            <span key={cat} className="text-[10px] font-black uppercase tracking-widest text-blue-600 bg-blue-50 px-2 py-1 rounded-full">{cat}</span>
          ))}
        </div>
        <span className="text-[10px] font-bold text-slate-400">{date}</span>
      </div>
      <h3 className="text-2xl font-black text-slate-900 mb-3 group-hover:text-blue-600 transition-colors uppercase">{title}</h3>
      <p className="text-slate-500 line-clamp-2 font-medium leading-relaxed">{description}</p>
    </div>
  </div>
);

const Home = ({ data, onOpenModal }) => {
  const sections = [
    { title: 'Project Portfolio', data: data.portfolio },
    { title: 'Achievements', data: data.achievements },
    { title: 'Activities', data: data.activities }
  ];

  return (
    <main className="relative pt-32 pb-20">
      <section className="px-6 mb-24 text-center">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-7xl md:text-9xl font-black tracking-tighter text-slate-900 mb-8 uppercase leading-none">LIU CHIN AN</h1>
          <p className="text-xl md:text-2xl text-slate-500 font-medium max-w-3xl mx-auto leading-relaxed italic">AIoT Developer & Student at National Formosa University.</p>
        </motion.div>
      </section>

      {sections.map((section) => (
        <section key={section.title} className="mb-24 px-4 md:px-10">
          <h2 className="text-4xl font-black tracking-tight uppercase mb-10 px-4">{section.title}</h2>
          <Swiper
            modules={[Navigation, Autoplay, Pagination]}
            spaceBetween={30}
            slidesPerView={1.2}
            loop={section.data.length > 3}
            autoplay={{ delay: 5000, disableOnInteraction: false }}
            navigation
            pagination={{ clickable: true }}
            breakpoints={{ 768: { slidesPerView: 2.2 }, 1024: { slidesPerView: 3.2 } }}
            className="pb-12"
          >
            {section.data.map((item) => (
              <SwiperSlide key={item.slug}>
                <ContentCard {...item} onClick={() => onOpenModal(item)} />
              </SwiperSlide>
            ))}
          </Swiper>
        </section>
      ))}
    </main>
  );
};

const CategoryPage = ({ data, onOpenModal }) => {
  const { slug } = useParams();
  const allItems = [...data.portfolio, ...data.achievements, ...data.activities];
  const filteredItems = allItems.filter(item => item.categories?.some(c => c.toLowerCase() === slug.toLowerCase()));

  return (
    <main className="pt-40 pb-20 px-10">
      <h1 className="text-5xl font-black mb-12 uppercase tracking-tighter">Category: <span className="text-blue-600">{slug}</span></h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredItems.map(item => <ContentCard key={item.slug} {...item} onClick={() => onOpenModal(item)} />)}
      </div>
    </main>
  );
};

export default function App() {
  const [data, setData] = useState({ portfolio: [], achievements: [], activities: [] });
  const [modal, setModal] = useState({ isOpen: false, content: null });

  useEffect(() => {
    const loadAll = async () => {
      const pModules = import.meta.glob('./content/portfolio/*.md', { query: '?raw', eager: true });
      const achModules = import.meta.glob('./content/achievements/*.md', { query: '?raw', eager: true });
      const actModules = import.meta.glob('./content/activities/*.md', { query: '?raw', eager: true });
      setData({ portfolio: loadContent(pModules), achievements: loadContent(achModules), activities: loadContent(actModules) });
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
        <DetailModal isOpen={modal.isOpen} onClose={() => setModal({ isOpen: false, content: null })} content={modal.content} />
      </div>
    </BrowserRouter>
  );
}
