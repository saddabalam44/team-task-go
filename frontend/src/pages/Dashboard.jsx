import React, { useState, useEffect } from 'react';
import api from '../lib/api.js';
import { useAuth } from '../contexts/AuthContext.jsx';
import { motion } from 'motion/react';
import { 
  Briefcase, 
  CheckSquare, 
  Clock, 
  AlertCircle,
  TrendingUp,
  Sparkles,
  Megaphone
} from 'lucide-react';

export default function Dashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    totalTasks: 0,
    completedTasks: 0,
    pendingTasks: 0,
    overdueTasks: 0,
  });
  const [recentTasks, setRecentTasks] = useState([]);
  const [recentCompleted, setRecentCompleted] = useState([]);
  const [loading, setLoading] = useState(true);
  const [notice, setNotice] = useState('Loading notice...');
  const [isEditingNotice, setIsEditingNotice] = useState(false);
  const [editNoticeText, setEditNoticeText] = useState('');

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const { data: tasks } = await api.get('/tasks');
        const now = new Date();
        
        const total = tasks.length;
        const completed = tasks.filter((t) => t.status === 'Completed').length;
        const pending = tasks.filter((t) => t.status !== 'Completed').length;
        const overdue = tasks.filter((t) => {
          return t.status !== 'Completed' && t.deadline && new Date(t.deadline) < now;
        }).length;

        setStats({
          totalTasks: total,
          completedTasks: completed,
          pendingTasks: pending,
          overdueTasks: overdue
        });
        setRecentTasks(tasks.filter(t => t.status !== 'Completed').slice(0, 5));
        setRecentCompleted(tasks.filter(t => t.status === 'Completed').slice(0, 5));

        try {
          const { data: noticeData } = await api.get('/notices');
          setNotice(noticeData.message);
          setEditNoticeText(noticeData.message);
        } catch (err) {
          setNotice('Welcome to TeamTaskGo.');
          setEditNoticeText('Welcome to TeamTaskGo.');
        }
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const handleUpdateNotice = async () => {
    try {
      if (!editNoticeText.trim()) return handleClearNotice();
      await api.post('/notices', { message: editNoticeText });
      setNotice(editNoticeText);
      setIsEditingNotice(false);
    } catch (err) {
      console.error('Error updating notice:', err);
    }
  };

  const handleClearNotice = async () => {
    try {
      const defaultMsg = "Welcome to TeamTaskGo! Watch this space for team announcements.";
      await api.post('/notices', { message: defaultMsg });
      setNotice(defaultMsg);
      setEditNoticeText(defaultMsg);
      setIsEditingNotice(false);
    } catch (err) {
      console.error('Error clearing notice:', err);
    }
  };

  if (loading) return <div className="flex items-center justify-center h-64 text-[#3eb368] font-semibold">Syncing workspace...</div>;

  const statCards = [
    { name: 'Total Tasks', value: stats.totalTasks, icon: Briefcase, color: 'text-blue-600', bg: 'bg-blue-100' },
    { name: 'Completed', value: stats.completedTasks, icon: CheckSquare, color: 'text-[#3eb368]', bg: 'bg-[#e3f5ea]' },
    { name: 'Pending', value: stats.pendingTasks, icon: Clock, color: 'text-amber-500', bg: 'bg-amber-100' },
    { name: 'Overdue', value: stats.overdueTasks, icon: AlertCircle, color: 'text-red-500', bg: 'bg-red-100' },
  ];

  return (
    <div className="space-y-10">
      <header>
        <h2 className="text-sm font-bold text-[#3eb368] uppercase tracking-widest mb-1">Overview</h2>
        <h1 className="text-4xl font-bold text-gray-800 tracking-tight">Welcome back, {user?.name}</h1>
        <p className="text-gray-500 mt-2 text-lg font-medium">Here is what's happening with your projects today.</p>
      </header>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, idx) => (
          <motion.div
            key={stat.name}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            className="bg-white p-6 rounded-[2rem] shadow-[0_8px_20px_rgba(0,0,0,0.03)] hover:shadow-[0_12px_25px_rgba(0,0,0,0.06)] transition-all group border border-transparent"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-bold text-gray-400 uppercase tracking-wider">{stat.name}</p>
                <p className="text-4xl font-bold text-gray-800 mt-2">{stat.value}</p>
              </div>
              <div className={`p-4 rounded-[1.5rem] ${stat.bg} ${stat.color} group-hover:scale-110 transition-transform`}>
                <stat.icon size={28} strokeWidth={2.5} />
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="bg-white rounded-[2rem] p-8 shadow-[0_8px_30px_rgba(0,0,0,0.04)] lg:col-span-2">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-2xl font-bold text-gray-800 tracking-tight">Active Assignments</h3>
            <span className="text-sm font-bold text-[#3eb368] bg-[#e3f5ea] px-3 py-1 rounded-lg">Recent</span>
          </div>
          <div className="space-y-4">
            {recentTasks.length > 0 ? (
              recentTasks.map((task, idx) => (
                <motion.div 
                  key={task._id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  className="group flex items-center justify-between p-5 rounded-2xl hover:bg-[#f4fbfa] border-2 border-transparent hover:border-[#e3f5ea] transition-all cursor-default"
                >
                  <div className="flex items-center gap-4">
                    <div className={`w-3 h-3 rounded-full shadow-inner ${
                      task.status === 'In Progress' ? 'bg-amber-400' : 
                      task.status === 'In Review' ? 'bg-blue-400' :
                      task.status === 'Needs Revision' ? 'bg-red-400' :
                      'bg-gray-300'
                    }`} />
                    <div>
                      <p className="font-bold text-gray-800 group-hover:text-[#3eb368] transition-colors text-lg">{task.title}</p>
                      <p className="text-sm text-gray-500 font-medium">{task.project?.title || 'No Project'}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className={`inline-block px-3 py-1 rounded-lg text-xs font-bold uppercase tracking-wider ${
                      task.status === 'In Progress' ? 'bg-amber-100 text-amber-700' : 
                      task.status === 'In Review' ? 'bg-blue-100 text-blue-700' :
                      task.status === 'Needs Revision' ? 'bg-red-100 text-red-700' :
                      'bg-gray-100 text-gray-600'
                    }`}>
                      {task.status}
                    </span>
                  </div>
                </motion.div>
              ))
            ) : (
              <p className="text-gray-500 text-center py-8 font-medium">No active tasks right now. You're all caught up!</p>
            )}
          </div>
        </div>

        <div className="bg-white rounded-[2rem] p-8 shadow-[0_8px_30px_rgba(0,0,0,0.04)] lg:col-span-2">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-2xl font-bold text-gray-800 tracking-tight">Recently Completed</h3>
            <span className="text-sm font-bold text-gray-500 bg-gray-100 px-3 py-1 rounded-lg">History</span>
          </div>
          <div className="space-y-4">
            {recentCompleted.length > 0 ? (
              recentCompleted.map((task, idx) => (
                <motion.div 
                  key={task._id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  className="group flex items-center justify-between p-5 rounded-2xl bg-gray-50 border-2 border-transparent transition-all cursor-default opacity-70"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-3 h-3 rounded-full shadow-inner bg-[#3eb368]" />
                    <div>
                      <p className="font-bold text-gray-800 line-through text-lg">{task.title}</p>
                      <p className="text-sm text-gray-500 font-medium">{task.project?.title || 'No Project'}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="inline-block px-3 py-1 rounded-lg text-xs font-bold uppercase tracking-wider bg-[#e3f5ea] text-[#3eb368]">
                      COMPLETED
                    </span>
                  </div>
                </motion.div>
              ))
            ) : (
              <p className="text-gray-500 text-center py-8 font-medium">No completed tasks yet.</p>
            )}
          </div>
        </div>

        <div className="bg-[#3eb368] text-white rounded-[2rem] p-8 flex flex-col justify-between relative overflow-hidden group shadow-[0_10px_30px_rgba(62,179,104,0.3)] lg:col-span-1">
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold tracking-tight flex items-center gap-3">
                <div className="p-2.5 bg-white rounded-[1rem] shadow-sm transform -rotate-6">
                  <Megaphone size={24} className="text-[#3eb368] fill-[#3eb368]/20" />
                </div>
                Notice Board
              </h3>
              {user?.role === 'Admin' && !isEditingNotice && (
                <button 
                  onClick={() => setIsEditingNotice(true)} 
                  className="text-emerald-50 hover:text-white text-sm font-bold bg-black/10 hover:bg-black/20 px-4 py-2 rounded-xl transition-all shadow-sm"
                >
                  Edit Notice
                </button>
              )}
            </div>
            
            {isEditingNotice ? (
              <div className="space-y-4 relative z-20">
                <div className="relative">
                  <textarea 
                    value={editNoticeText}
                    onChange={(e) => setEditNoticeText(e.target.value)}
                    className="w-full bg-emerald-900/20 border-2 border-emerald-400/30 rounded-2xl p-5 text-white placeholder-emerald-100/40 focus:outline-none focus:border-white focus:bg-emerald-900/40 resize-none font-medium transition-all shadow-inner custom-scrollbar"
                    rows="5"
                    placeholder="Type a new notice for the team..."
                  />
                </div>
                <div className="flex items-center gap-2">
                  <button 
                    onClick={handleUpdateNotice} 
                    className="flex-[1.5] bg-white text-[#3eb368] py-3 rounded-xl text-sm font-bold shadow-[0_4px_15px_rgba(0,0,0,0.1)] hover:-translate-y-0.5 transition-all active:scale-95"
                  >
                    Publish
                  </button>
                  <button 
                    onClick={handleClearNotice} 
                    className="flex-1 bg-red-500/20 text-red-50 py-3 rounded-xl text-sm font-bold hover:bg-red-500 hover:text-white transition-all active:scale-95"
                  >
                    Clear
                  </button>
                  <button 
                    onClick={() => {setIsEditingNotice(false); setEditNoticeText(notice);}} 
                    className="flex-1 bg-transparent border-2 border-emerald-300/30 text-white py-2.5 rounded-xl text-sm font-bold hover:bg-white/10 transition-all active:scale-95"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <p className="text-white/95 leading-relaxed font-medium text-lg min-h-[5rem] whitespace-pre-wrap">
                {notice}
              </p>
            )}
          </div>
          <div className="absolute -bottom-12 -right-12 w-48 h-48 bg-white/20 rounded-full blur-3xl group-hover:scale-125 transition-transform duration-500" />
        </div>
      </div>
    </div>
  );
}
