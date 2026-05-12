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
        const data = yaml.load(parts[1]);
        // 自動生成 slug (檔案名稱)，方便未來擴充路由
        const slug = path.split('/').pop().replace('.md', '');
        return { ...data, slug };
      } catch (e) {
        console.error("YAML 解析失敗:", path, e);
        return null;
      }
    }
    return null;
  }).filter(Boolean);
};

// --- 子組件: PortfolioCard ---
const PortfolioCard = ({ title, category, thumbnail, description, tags }) => (
  <div className="group cursor-pointer">
    <div className="relative overflow-hidden rounded-[2.5rem] aspect-[4/3] mb-6 bg-slate-200 shadow-inner border border-slate-100">
      {thumbnail ? (
        <img 
          src={thumbnail} 
          alt={title} 
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
        />
      ) : (
        <div className="flex items-center justify-center h-full text-slate-400 font-black italic uppercase tracking-tighter">No Image</div>
      )}
      {/* 懸浮遮罩預留 Lightbox 接口 */}
      <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-900/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex flex-col justify-end p-8">
         <span className="text-white font-black text-xl mb-2 translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
           View Details
         </span>
         <div className="flex gap-2 mb-4 translate-y-4 group-hover:translate-y-0 transition-transform duration-500 delay-75">
            {tags?.slice(0, 3).map((tag, i) => (
              <span key={i} className="text-[10px] text-slate-300 border border-white/20 px-2 py-0.5 rounded-full uppercase tracking-widest bg-white/10 backdrop-blur-md">
                {tag}
              </span>
            ))}
         </div>
      </div>
    </div>
    <div className="px-2">
      <span className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-600 bg-blue-50 px-2.5 py-1 rounded-md inline-block mb-3">
        {category || 'Project'}
      </span>
      <h3 className="text-3xl font-[900] tracking-tighter text-slate-900 group-hover:text-blue-600 transition-colors duration-300">
        {title}
      </h3>
      <p className="text-slate-500 mt-2 line-clamp-2 font-medium leading-relaxed">
        {description}
      </p>
    </div>
  </div>
);

// --- 子組件: AchievementCard ---
const AchievementCard = ({ title, year, description, organization }) => (
  <div className="group relative p-8 bg-white border border-slate-200 rounded-[2rem] hover:border-blue-500/50 transition-all duration-500 shadow-sm hover:shadow-2xl">
    <div className="flex justify-between items-start mb-6">
      <div className="flex items-center gap-3">
        <span className="text-blue-600 font-black text-2xl tracking-tighter">/ {year}</span>
        <div className="h-px w-8 bg-blue-100 group-hover:w-12 transition-all duration-500"></div>
      </div>
      {organization && (
        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest bg-slate-50 px-3 py-1 rounded-full border border-slate-100">
          {organization}
        </span>
      )}
    </div>
    <h4 className="text-2xl font-black tracking-tight text-slate-800 mb-3 group-hover:text-blue-600 transition-colors">
      {title}
    </h4>
    <p className="text-slate-500 leading-relaxed font-medium">
      {description}
    </p>
  </div>
);

function App() {
  const [projects, setProjects] = useState([]);
  const [achievements, setAchievements] = useState([]);

  useEffect(() => {
    // 同時抓取不同內容類別
    const portfolioModules = import.meta.glob('./content/portfolio/*.md', { query: '?raw', eager: true });
    const achievementModules = import.meta.glob('./content/achievements/*.md', { query: '?raw', eager: true });

    setProjects(loadContent(portfolioModules));
    setAchievements(loadContent(achievementModules));
  }, []);

  return (
    <div className="min-h-screen bg-[#fcfdfe] font-sans text-slate-900 selection:bg-blue-600 selection:text-white">
      <ParticleBackground />
      <Navbar />
      
      <main className="relative pt-32 px-6 max-w-7xl mx-auto">
        
        {/* --- Hero Section --- */}
        <section className="py-24 mb-12">
          <div className="max-w-4xl">
            <h1 className="text-6xl md:text-[9rem] font-[900] tracking-tighter leading-[0.85] mb-12">
              Building <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-br from-blue-600 via-cyan-500 to-indigo-600">
                Future AIoT.
              </span>
            </h1>
            <p className="text-xl md:text-3xl text-slate-500 font-medium max-w-2xl leading-[1.2]">
              我是劉晉安，致力於將 <span className="text-slate-950 font-bold underline decoration-blue-500/20 underline-offset-8">AI 邊緣運算</span> 與硬體整合，為生態保育與生理感測提供更直觀的解決方案。
            </p>
          </div>
        </section>

        {/* --- Portfolio Section --- */}
        <section id="portfolio" className="py-32 border-t border-slate-200">
          <div className="flex items-baseline justify-between mb-20">
            <div>
              <h2 className="text-5xl font-black tracking-tighter">Selected Works</h2>
              <p className="text-slate-400 mt-2 font-bold uppercase tracking-widest text-[10px]">Embedded Systems & Software</p>
            </div>
            <div className="hidden md:block h-[1px] flex-grow mx-12 bg-slate-100"></div>
            <div className="text-right">
              <span className="text-4xl font-black tracking-tighter text-blue-600">{projects.length < 10 ? `0${projects.length}` : projects.length}</span>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-10 gap-y-20">
            {projects.length > 0 ? (
              projects.map((p, i) => <PortfolioCard key={p.slug || i} {...p} />)
            ) : (
              <div className="col-span-full py-24 text-center border-2 border-dashed border-slate-200 rounded-[3rem] text-slate-400 font-bold uppercase tracking-widest italic">
                Awaiting Content...
              </div>
            )}
          </div>
        </section>

        {/* --- Achievements Section --- */}
        <section id="achievements" className="py-32 border-t border-slate-200">
          <div className="max-w-3xl mb-20">
            <h2 className="text-5xl font-black tracking-tighter mb-4">Achievements</h2>
            <p className="text-slate-500 text-lg font-medium italic">「技術的價值在於解決真實世界的問題。」</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {achievements.length > 0 ? (
              achievements.map((item, i) => <AchievementCard key={item.slug || i} {...item} />)
            ) : (
              // 備用靜態內容（當 Markdown 資料夾尚無內容時顯示）
              <div className="p-8 bg-slate-50 rounded-[2rem] border border-slate-100 flex items-center justify-center min-h-[200px]">
                <p className="text-slate-400 font-bold tracking-widest uppercase text-xs">Loading Achievement Data...</p>
              </div>
            )}
          </div>
        </section>

        {/* --- Footer --- */}
        <footer className="py-24 text-center border-t border-slate-100">
          <p className="text-slate-400 text-xs font-black tracking-[0.3em] uppercase">
            © 2026 LIU JIN AN — NFU COMPUTER SCIENCE
          </p>
          <div className="mt-4 flex justify-center gap-6">
             <span className="text-[10px] font-bold text-slate-300">VITE 8</span>
             <span className="text-[10px] font-bold text-slate-300">TAILWIND v4</span>
             <span className="text-[10px] font-bold text-slate-300">DECAP CMS</span>
          </div>
        </footer>
      </main>
    </div>
  );
}

export default App;