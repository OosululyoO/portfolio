const Navbar = () => {
const navItems = [
  { name: 'Home', path: '#' },
  { name: 'Portfolio', path: '#portfolio' },
  { name: 'Achievements', path: '#achievements' },
  { name: 'Activities', path: '#activities' },
  { name: 'About', path: '#about' }
];

  return (
    <nav className="fixed top-0 w-full z-50 backdrop-blur-md bg-white/70 border-b border-gray-100">
      <div className="max-w-5xl mx-auto px-6 h-16 flex items-center justify-between">
        <span className="text-lg font-semibold tracking-tighter text-gray-900">LIU CHIN AN</span>
        <div className="space-x-8">
          {navItems.map(item => (
            <a key={item.name} href={item.path} className="text-sm font-medium text-gray-500 hover:text-black transition-colors">
              {item.name}
            </a>
          ))}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;