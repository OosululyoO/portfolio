import { useEffect, useState } from 'react';
import Navbar from './components/Navbar';
import ParticleBackground from './components/ParticleBackground';
import yaml from 'js-yaml';

/**
 * 作品卡片組件 (PortfolioCard)
 * 負責顯示從 Markdown 讀取進來的 frontmatter 資料
 */
const PortfolioCard = ({ title, category, thumbnail, description }) => (
  <div className="group relative bg-white/40 backdrop-blur-md border border-white/20 p-5 rounded-2xl hover:shadow-2xl hover:-translate-y-1 transition-all duration-300">
    {thumbnail && (
      <div className="overflow-hidden rounded-xl mb-4 h-48">
        <img 
          src={thumbnail} 
          alt={title} 
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
      </div>
    )}
    <div className="space-y-2">
      <span className="px-2 py-1 text-[10px] font-black tracking-widest uppercase bg-blue-100 text-blue-600 rounded-md">
        {category || 'Uncategorized'}
      </span>
      <h3 className="text-2xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
        {title}
      </h3>
      <p className="text-gray-500 text-sm line-clamp-2 leading-relaxed">
        {description}
      </p>
    </div>
  </div>
);

function App() {
  const [projects, setProjects] = useState([]);
useEffect(() => {
    // 1. 加入 query: '?raw'，讓 Vite 不要去解析內容，只當純文字讀取
    const modules = import.meta.glob('./content/portfolio/*.md', { 
      query: '?raw', 
      eager: true 
    });
    
    const projectList = Object.keys(modules).map((path) => {
      const rawContent = modules[path].default;
      
      // 2. 手動切分 YAML 區塊 (取出兩個 --- 之間的內容)
      const parts = rawContent.split('---');
      if (parts.length >= 3) {
        try {
          return yaml.load(parts[1]); // 解析 YAML 部分
        } catch (e) {
          console.error("YAML 解析失敗:", path, e);
          return null;
        }
      }
      return null;
    }).filter(p => p !== null);

    setProjects(projectList);
  }, []);
  
  return (
    <div className="min-h-screen bg-slate-50 font-sans text-gray-900 selection:bg-blue-100 selection:text-blue-900">
      {/* 背景裝飾 */}
      <ParticleBackground />
      
      {/* 導覽列 */}
      <Navbar />
      
      <main className="relative pt-32 px-6 max-w-6xl mx-auto">
        {/* Hero Section */}
        <section className="py-20 mb-12">
          <div className="max-w-3xl">
            <h1 className="text-6xl md:text-8xl font-black tracking-tighter mb-8 bg-gradient-to-br from-gray-900 to-gray-500 bg-clip-text text-transparent">
              Building AIoT & <br />Software Solutions.
            </h1>
            <p className="text-xl md:text-2xl text-gray-500 font-medium leading-relaxed">
              我是劉晉安，來自國立虎尾科技大學。專注於 <span className="text-gray-900">ESP32 硬體開發</span>、<span className="text-gray-900">AIoT 系統集成</span> 與軟體架構優化。
            </p>
          </div>
        </section>

        {/* Portfolio Section - 使用 id="portfolio" 供 Navbar 錨點跳轉 */}
        <section id="portfolio" className="py-24 border-t border-gray-200">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-4">
            <div>
              <h2 className="text-4xl font-black tracking-tight text-gray-900">Selected Works</h2>
              <p className="text-gray-400 mt-2 font-medium">從嵌入式硬體到全端軟體應用</p>
            </div>
            <div className="px-4 py-2 bg-white rounded-full border border-gray-100 shadow-sm">
              <span className="text-sm font-bold text-blue-600">{projects.length}</span>
              <span className="text-sm font-bold text-gray-400 ml-1">Projects</span>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {projects.length > 0 ? (
              projects.map((project, index) => (
                <PortfolioCard key={index} {...project} />
              ))
            ) : (
              <div className="col-span-full py-20 text-center border-2 border-dashed border-gray-200 rounded-3xl">
                <p className="text-gray-400 font-medium">目前尚無作品資料，請透過 CMS 後台發布內容。</p>
              </div>
            )}
          </div>
        </section>

        {/* Achievements Section - 使用 id="achievements" */}
        <section id="achievements" className="py-24 border-t border-gray-200">
          <h2 className="text-4xl font-black tracking-tight text-gray-900 mb-16">Achievements</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="p-8 bg-white rounded-3xl border border-gray-100 shadow-sm">
              <span className="text-blue-600 font-bold">2025</span>
              <h4 className="text-xl font-bold mt-2">雲科盃 AI x ESG 創新競賽 - 入圍決賽</h4>
              <p className="text-gray-500 mt-2 text-sm">運用 AI 偵測技術於生態環境保護之創新方案。</p>
            </div>
            {/* 這裡之後可以依照同樣邏輯讀取 achievements 的 markdown */}
            <div className="p-8 bg-gray-100/50 rounded-3xl border border-dashed border-gray-300 flex items-center justify-center">
              <p className="text-gray-400 font-medium italic">更多獎項內容整理中...</p>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="py-20 text-center border-t border-gray-100">
          <p className="text-gray-400 text-sm font-medium">
            © 2026 LIU JIN AN. Built with React, Tailwind & Decap CMS.
          </p>
        </footer>
      </main>
    </div>
  );
}

export default App;