import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  // 修正：定義分類路徑，使用 Link 跳轉至 /category/:slug
  const navLinks = [
    { name: 'AIoT', path: '/category/aiot' },
    { name: 'Research', path: '/category/research' },
    { name: 'Portfolio', path: '/category/portfolio' },
    { name: 'Activities', path: '/category/activities' },
  ];

  return (
    <nav className="fixed top-0 w-full z-[100] bg-white/80 backdrop-blur-md border-b border-slate-100">
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        {/* Logo 點擊回到首頁 */}
        <Link to="/" className="text-xl font-black tracking-tighter text-slate-900 hover:opacity-80 transition-opacity">
          LIU CHIN AN<span className="text-blue-600">.</span>
        </Link>

        {/* 桌面版選單 (md 以上顯示) */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => {
            const isActive = location.pathname.toLowerCase() === link.path.toLowerCase();
            return (
              <Link
                key={link.name}
                to={link.path}
                className={`text-xs font-black uppercase tracking-[0.2em] transition-colors ${
                  isActive ? 'text-blue-600' : 'text-slate-500 hover:text-blue-600'
                }`}
              >
                {link.name}
              </Link>
            );
          })}
        </div>

        {/* 手機版漢堡按鈕 (md 以下顯示) */}
        <button 
          className="md:hidden p-2 text-slate-600"
          onClick={() => setIsOpen(!isOpen)}
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            {isOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
      </div>

      {/* 手機版展開選單 */}
      {isOpen && (
        <div className="md:hidden bg-white border-b border-slate-100 px-6 py-6 space-y-4 shadow-lg absolute w-full">
          <Link
            to="/"
            onClick={() => setIsOpen(false)}
            className="block text-sm font-black uppercase tracking-[0.1em] text-slate-700 hover:text-blue-600 pb-2 border-b border-slate-50"
          >
            Home
          </Link>
          {navLinks.map((link) => {
            const isActive = location.pathname.toLowerCase() === link.path.toLowerCase();
            return (
              <Link
                key={link.name}
                to={link.path}
                onClick={() => setIsOpen(false)}
                className={`block text-sm font-black uppercase tracking-[0.1em] ${
                  isActive ? 'text-blue-600' : 'text-slate-700 hover:text-blue-600'
                }`}
              >
                {link.name}
              </Link>
            );
          })}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
