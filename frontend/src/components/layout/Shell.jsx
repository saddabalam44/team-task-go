import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext.jsx';
import {
  LayoutDashboard,
  Briefcase,
  CheckSquare,
  LogOut,
  Menu,
  X,
  User as UserIcon,
  Users
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function Shell({ children }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navItems = [
    { name: 'Dashboard', path: '/', icon: LayoutDashboard },
    { name: 'Projects', path: '/projects', icon: Briefcase },
    { name: 'Tasks', path: '/tasks', icon: CheckSquare },
    { name: 'Members', path: '/members', icon: Users },
  ];

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-[#c8ebd6] font-sans">
      <div className="md:hidden flex items-center justify-between p-4 bg-[#3eb368] text-white shadow-md">
        <h1 className="text-xl font-bold tracking-tight">TeamTaskGo</h1>
        <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="p-2 hover:bg-white/10 rounded-lg transition-colors">
          {isMobileMenuOpen ? <X /> : <Menu />}
        </button>
      </div>

      <aside className={`
        fixed inset-y-0 left-0 z-40 md:static transform transition-transform duration-300 ease-in-out
        ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
        w-64 bg-[#3eb368] text-white md:m-6 md:rounded-3xl shadow-[0_8px_30px_rgba(62,179,104,0.3)] flex flex-col
      `}>
        <div className="p-8 pb-4">
          <h1 className="text-3xl font-bold tracking-tight">TeamTaskGo</h1>
          <p className="text-xs text-emerald-100 uppercase tracking-widest mt-1 font-semibold">Workspace</p>
        </div>

        <nav className="flex-1 px-4 space-y-2 mt-4">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              onClick={() => setIsMobileMenuOpen(false)}
              className={({ isActive }) => `
                flex items-center gap-3 px-4 py-3.5 rounded-2xl transition-all duration-200 font-medium text-sm
                ${isActive
                  ? 'bg-white/20 text-white shadow-sm'
                  : 'text-emerald-50 hover:bg-white/10 hover:text-white'}
              `}
            >
              {({ isActive }) => (
                <>
                  <item.icon size={20} strokeWidth={isActive ? 2.5 : 2} />
                  <span>{item.name}</span>
                </>
              )}
            </NavLink>
          ))}
        </nav>

        <div className="p-4 mt-auto mb-2 mx-4 bg-white/10 rounded-2xl border border-white/10">
          <div className="flex items-center gap-3 p-2">
            <div className="w-10 h-10 rounded-full bg-white text-[#3eb368] flex items-center justify-center shadow-inner">
              <UserIcon size={20} strokeWidth={2.5} />
            </div>
            <div className="flex-1 overflow-hidden">
              <p className="text-sm font-bold truncate">{user?.name}</p>
              <p className="text-xs text-emerald-100 font-medium tracking-wide">{user?.role}</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 mt-2 text-white bg-red-500/80 hover:bg-red-500 rounded-xl transition-all text-sm font-bold shadow-sm"
          >
            <LogOut size={16} strokeWidth={2.5} />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      <main className="flex-1 overflow-auto overflow-x-hidden relative">
        <div className="max-w-7xl mx-auto p-4 md:p-8 lg:py-10 lg:px-12">
          {children}
        </div>
      </main>

      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsMobileMenuOpen(false)}
            className="fixed inset-0 bg-black/30 backdrop-blur-sm z-30 md:hidden"
          />
        )}
      </AnimatePresence>
    </div>
  );
}
