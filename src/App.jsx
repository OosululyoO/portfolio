import Navbar from './components/Navbar';
import ParticleBackground from './components/ParticleBackground';

function App() {
  return (
    <div className="min-h-screen font-sans text-gray-900">
      <ParticleBackground />
      <Navbar />
      
      <main className="relative pt-32 px-6 max-w-5xl mx-auto">
        <section className="py-20">
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6">
            Building AIoT & <br />Software Solutions.
          </h1>
          <p className="text-xl text-gray-500 max-w-2xl leading-relaxed">
            我是劉晉安，專注於嵌入式系統開發與軟體架構優化。
            在這裡記錄我從 AIoT 硬體研發到前端技術的探索路程。
          </p>
        </section>
      </main>
    </div>
  );
}

export default App;