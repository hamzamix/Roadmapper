import React from 'react';
import { FolderIcon, LightBulbIcon, MoonIcon, SunIcon } from './Icons';

type ActiveView = 'projects' | 'recent';

interface SidebarProps {
  activeView: ActiveView;
  onSelectView: (view: ActiveView) => void;
  theme: 'light' | 'dark';
  setTheme: (theme: 'light' | 'dark') => void;
}

const navItems: { id: ActiveView, label: string, icon: React.FC<React.HTMLAttributes<SVGElement>> }[] = [
    { id: 'projects', label: 'All Projects', icon: FolderIcon },
    { id: 'recent', label: 'Recent Ideas', icon: LightBulbIcon },
];

const Sidebar: React.FC<SidebarProps> = ({ activeView, onSelectView, theme, setTheme }) => {
  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };
  
  return (
    <aside className="w-64 bg-slate-100 dark:bg-gray-950 border-r border-slate-200 dark:border-gray-700 p-4 flex flex-col h-full shrink-0">
      <div className="flex items-center mb-8">
        <div className="w-8 h-8 bg-indigo-600 rounded-lg mr-3 flex items-center justify-center font-bold text-white text-lg">R</div>
        <h1 className="text-xl font-bold text-slate-900 dark:text-gray-50">Roadmapper</h1>
      </div>
      
      <nav className="flex-1 overflow-y-auto -mr-4 pr-4">
        <ul className="space-y-1">
          {navItems.map(item => (
              <li key={item.id}>
                <button
                  onClick={() => onSelectView(item.id)}
                  className={`flex items-center w-full text-left py-2 px-3 rounded-md text-sm transition-colors ${
                    activeView === item.id 
                    ? 'bg-slate-200 dark:bg-gray-800 text-slate-900 dark:text-white font-semibold' 
                    : 'text-slate-600 dark:text-gray-400 hover:bg-slate-200/50 dark:hover:bg-gray-800 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  <item.icon className="w-4 h-4 mr-3" />
                  {item.label}
                </button>
              </li>
          ))}
        </ul>
      </nav>
      <div className="mt-auto">
        <button
          onClick={toggleTheme}
          className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-md text-sm transition-colors text-slate-600 dark:text-gray-400 hover:bg-slate-200/50 dark:hover:bg-gray-800 hover:text-slate-900 dark:hover:text-white"
        >
          {theme === 'light' ? <MoonIcon className="w-4 h-4" /> : <SunIcon className="w-4 h-4" />}
          Switch Theme
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;