import { useEffect, useState } from 'react';
import Navbar from './components/Navbar';
import ParticleBackground from './components/ParticleBackground';

// 建立一個簡單的作品卡片組件
const PortfolioCard = ({ title, category, thumbnail }) => (
  <div className="group relative bg-white/50 backdrop-blur-sm border border-gray-100 p-4 rounded-xl hover:shadow-lg transition-all">
    {thumbnail && (
      <img 
        src={thumbnail} 
        alt={title} 
        className="w-full h-48 object-cover rounded-lg mb-4"
      />
    )}
    <span className="text-xs font-bold tracking-widest uppercase text-gray-400">{category}</span>
    <h3 className="text-xl font-bold mt-1 group-hover:text-blue-600 transition-colors">{title}</h3>
  </div>
);

function App() {
  const [projects, setProjects] = useState([]);

  useEffect(() => {
    // 讀取所有作品內容 (Vite 內建功能)
    const modules = import.meta.glob('./content/portfolio/*.md', { eager: true });
    
    const projectList = Object.keys(modules).map((path) => {
      const { attributes } = modules[path];
      return { ...attributes };
    });

    setProjects(projectList);
  }, []);

  return (
    <div className="min-h-screen font-sans text-gray-900 selection:bg-gray-100">
      <ParticleBackground />
      <Navbar />
      
      <main className="relative pt-32 px-6 max-w-5xl mx-auto">
        <section className="py-12 border-b border-gray-100">
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6">
            Building AIoT & <br />Software Solutions.
          </h1>
          <p className="text-xl text-gray-500 max-w-2xl leading-relaxed">
            我是劉晉安，專注於嵌入式系統開發與軟體架構優化。
          </p>
        </section>

        {/* 作品集展示區塊 */}
        <section className="py-20">
          <div className="flex justify-between items-end mb-12">
            <h2 className="text-3xl font-bold tracking-tight">Portfolio</h2>
            <p className="text-gray-400 text-sm">({projects.length} Projects)</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {projects.length > 0 ? (
              projects.map((item, index) => (
                <PortfolioCard key={index} {...item} />
              ))
            ) : (
              <p className="text-gray-400 italic">尚未發布作品，請前往後台新增內容。</p>
            )}
          </div>
        </section>
      </main>
    </div>
  );
}

export default App;