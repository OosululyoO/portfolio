import { useEffect, useState } from 'react';
import Navbar from './components/Navbar';
import ParticleBackground from './components/ParticleBackground';
import yaml from 'js-yaml';

// --- Utility: 通用內容讀取器 ---
const loadContent = (modules) => {
  return Object.keys(modules).map((path) => {
    const rawContent = modules[path].default;
    const parts = rawContent.split('---');
    if (parts.length >= 3) {
      try {
        const frontmatter = yaml.load(parts[1]);
        const body = parts.slice(2).join('---').trim(); // 取得 Markdown 主體內容
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
// 適用於作品、競賽、活動，統一顯示：TITLE, CATEGORY, IMAGE, SHORT DESCRIPTION
const ContentCard = ({ title, category, thumbnail, description }) => (
  <div className="group cursor-pointer">
    <div className="relative overflow-hidden rounded-[2.5rem] aspect-[4/3] mb-6 bg-slate-200 shadow-inner border border-slate-100">
      {thumbnail ? (
        <img 
          src={thumbnail} 
          alt={title} 
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
        />
      ) : (
        <div className="flex items-center justify-center h-full text-slate-400 font-[900] italic uppercase tracking-tighter bg-slate-50">
          No Image
        </div>
      )}
      {/* 懸浮遮罩 */}
      <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-900/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex flex-col justify-end p-8">
         <span className="text-white font-black text-xl mb-1 translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
           Read More
         </span>
      </div>
    </div>

    <div className="px-2">
      {/* 選配 GATEGORY */}
      {category && (
        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-600 bg-blue-50 px-2.5 py-1 rounded-md inline-block mb-3">
          {category}
        </span>
      )}
      
      <h3 className="text-3xl font-[900] tracking-tighter text-slate-900 group-hover:text-blue-600 transition-colors duration-300">
        {title}
      </h3>
      
      <p className="text-slate-500 mt-2 line-clamp-2 font-medium leading-relaxed">
        {description}
      </p>
    </div>
  </div>
);

function App() {
  const [portfolio, setPortfolio] = useState([]);
  const [achievements, setAchievements] = useState([]);
  const [activities, setActivities] = useState([]);

  useEffect(() => {
    // 同時抓取三個不同資料夾的內容
    const portfolioModules = import.meta.glob('./content/portfolio/*.md', { query: '?raw', eager: true });
    const achievementModules = import.meta.glob('./content/achievements/*.md', { query: '?raw', eager: true });
    const activityModules = import.meta.glob('./content/activities/*.md', { query: '?raw', eager: true });

    setPortfolio(loadContent(portfolioModules));
    setAchievements(loadContent(achievementModules));
    setActivities(loadContent(activityModules));
  }, []);

  return (
    <div className="min-h-screen bg-[#fcfdfe] font-sans text-slate-900 selection:bg-blue-600 selection:text-white">
      <ParticleBackground />
      <Navbar />
      
      <main className="relative pt-32 px-6 max-w-7xl mx-auto">
        
        {/* Hero Section */}
        <section className="py-24">
          <div className="max-w-4xl">
            <h1 className="text-6xl md:text-[9rem] font-[900] tracking-tighter leading-[0.85] mb-12">
              LIU <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-br from-blue-600 to-indigo-600">
                JIN AN.
              </span>
            </h1>
            <p className="text-xl md:text-3xl text-slate-500 font-medium max-w-2xl leading-[1.2]">
              國立虎尾科技大學。專注於 <span className="text-slate-950 font-bold underline decoration-blue-500/20 underline-offset-8">AIoT 系統集成</span> 與硬體開發，透過技術實踐生態與生理感測方案。
            </p>
          </div>
        </section>

        {/* Portfolio Section */}
        <section id="portfolio" className="py-32 border-t border-slate-200">
          <div className="flex items-baseline justify-between mb-20">
            <h2 className="text-5xl font-black tracking-tighter uppercase">Portfolio</h2>
            <div className="hidden md:block h-[1px] flex-grow mx-12 bg-slate-100"></div>
            <span className="text-slate-400 font-bold uppercase tracking-widest text-xs">Total: {portfolio.length}</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-10 gap-y-20">
            {portfolio.map((item) => <ContentCard key={item.slug} {...item} />)}
          </div>
        </section>

        {/* Achievements Section */}
        <section id="achievements" className="py-32 border-t border-slate-200">
          <div className="flex items-baseline justify-between mb-20">
            <h2 className="text-5xl font-black tracking-tighter uppercase">Achievements</h2>
            <div className="hidden md:block h-[1px] flex-grow mx-12 bg-slate-100"></div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-10 gap-y-20">
            {achievements.map((item) => <ContentCard key={item.slug} {...item} />)}
          </div>
        </section>

        {/* Activities Section */}
        <section id="activities" className="py-32 border-t border-slate-200">
          <div className="flex items-baseline justify-between mb-20">
            <h2 className="text-5xl font-black tracking-tighter uppercase">Activities</h2>
            <div className="hidden md:block h-[1px] flex-grow mx-12 bg-slate-100"></div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-10 gap-y-20">
            {activities.map((item) => <ContentCard key={item.slug} {...item} />)}
          </div>
        </section>

        {/* Footer */}
        <footer className="py-24 text-center border-t border-slate-100">
          <p className="text-slate-400 text-xs font-black tracking-[0.3em] uppercase">
            © 2026 LIU JIN AN — NFU COMPUTER SCIENCE
          </p>
        </footer>
      </main>
    </div>
  );
}

export default App;