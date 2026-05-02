import React, { useState, useEffect } from 'react';
import api from '../lib/api.js';
import { useAuth } from '../contexts/AuthContext.jsx';
import { motion, AnimatePresence } from 'motion/react';
import { format } from 'date-fns';
import {
  Plus,
  User as UserIcon,
  Calendar,
  X,
  Trash2,
  Filter,
  Check,
  Briefcase,
  Clock
} from 'lucide-react';

export default function Tasks() {
  const { user } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [filter, setFilter] = useState('All');

  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    project: '',
    assignedTo: '',
    deadline: '',
    status: 'Pending'
  });

  const [members, setMembers] = useState([]);

  useEffect(() => {
    fetchTasks();
    if (user?.role === 'Admin') {
      fetchProjectsAndMembers();
    }
  }, [user]);

  const fetchTasks = async () => {
    try {
      const { data } = await api.get('/tasks');
      setTasks(data);
    } catch (error) {
      console.error('Error fetching tasks:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchProjectsAndMembers = async () => {
    try {
      const [projRes, usersRes] = await Promise.all([
        api.get('/projects'),
        api.get('/users')
      ]);
      setProjects(projRes.data);
      setMembers(usersRes.data);
    } catch (error) {
      console.error('Error fetching context for tasks:', error);
    }
  };

  const handleCreateTask = async (e) => {
    e.preventDefault();
    try {
      await api.post('/tasks', newTask);
      setShowModal(false);
      setNewTask({ title: '', description: '', project: '', assignedTo: '', deadline: '', status: 'Pending' });
      fetchTasks();
    } catch (error) {
      console.error('Error creating task:', error);
      alert(error.response?.data?.message || 'Failed to create task');
    }
  };

  const updateTaskStatus = async (id, status) => {
    try {
      await api.put(`/tasks/${id}`, { status });
      fetchTasks();
    } catch (error) {
      console.error('Error updating status:', error);
    }
  };

  const handleDeleteTask = async (id) => {
    if (window.confirm('Delete this task?')) {
      try {
        await api.delete(`/tasks/${id}`);
        fetchTasks();
      } catch (error) {
        console.error('Error deleting task:', error);
      }
    }
  };

  const filteredTasks = tasks.filter((t) => {
    if (filter === 'All') return true;
    return t.status === filter;
  });

  if (loading) return <div className="flex items-center justify-center h-64 text-[#3eb368] font-semibold">Loading tasks...</div>;

  return (
    <div className="space-y-10">
      <header className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h2 className="text-sm font-bold text-[#3eb368] uppercase tracking-widest mb-1">Workload</h2>
          <h1 className="text-4xl font-bold text-gray-800 tracking-tight">Tasks</h1>
          <p className="text-gray-500 mt-2 text-lg font-medium">Manage assignments and track daily progress.</p>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative group">
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-hover:text-[#3eb368] transition-colors">
              <Filter size={18} />
            </div>
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="pl-12 pr-10 py-3.5 bg-white rounded-2xl text-sm font-bold text-gray-700 focus:outline-none focus:ring-4 focus:ring-[#3eb368]/10 appearance-none cursor-pointer shadow-sm border-2 border-transparent hover:border-gray-100"
            >
              <option>All</option>
              <option>Pending</option>
              <option>In Progress</option>
              <option>In Review</option>
              <option>Completed</option>
              <option>Needs Revision</option>
            </select>
          </div>

          {user?.role === 'Admin' && (
            <button
              onClick={() => setShowModal(true)}
              className="bg-[#3eb368] hover:bg-[#349e5b] text-white rounded-2xl px-6 py-3.5 flex items-center gap-2 font-bold transition-all shadow-[0_8px_20px_rgba(62,179,104,0.3)] active:scale-95"
            >
              <Plus size={20} strokeWidth={2.5} />
              New Task
            </button>
          )}
        </div>
      </header>

      <div className="space-y-4">
        {filteredTasks.length > 0 ? (
          filteredTasks.map((task, idx) => (
            <motion.div
              key={task._id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.05 }}
              className="bg-white rounded-3xl border border-transparent p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-6 shadow-[0_4px_15px_rgba(0,0,0,0.02)] hover:shadow-[0_10px_30px_rgba(0,0,0,0.06)] transition-all group"
            >
              <div className="flex items-start gap-5 flex-1">
                <button
                  onClick={() => updateTaskStatus(task._id, task.status === 'Completed' ? 'In Progress' : 'Completed')}
                  disabled={user?.role !== 'Admin' && task.assignedTo?._id !== user?._id}
                  className={`mt-1.5 w-8 h-8 rounded-xl border-2 flex items-center justify-center transition-all flex-shrink-0 ${
                    task.status === 'Completed' ? 'bg-[#3eb368] border-[#3eb368] text-white' :
                    task.status === 'In Review' ? 'bg-blue-500 border-blue-500 text-white' :
                    task.status === 'Needs Revision' ? 'bg-red-100 border-red-300 text-red-500' :
                    'border-gray-200 hover:border-[#3eb368] text-transparent hover:text-[#3eb368]/30 bg-gray-50'
                  } ${user?.role !== 'Admin' && task.assignedTo?._id !== user?._id ? 'cursor-not-allowed opacity-60 hover:border-gray-200 hover:text-transparent' : ''}`}
                >
                  {task.status === 'In Review' ? <Clock size={16} strokeWidth={3} /> : <Check size={18} strokeWidth={3} />}
                </button>
                <div>
                  <h3 className={`font-bold text-xl tracking-tight transition-colors ${task.status === 'Completed' ? 'line-through text-gray-400' : 'text-gray-800'}`}>
                    {task.title}
                  </h3>
                  <div className="flex flex-wrap items-center gap-x-6 gap-y-3 mt-3">
                    <span className="flex items-center gap-1.5 text-xs font-bold text-[#3eb368] uppercase tracking-wider bg-[#e3f5ea] px-3 py-1.5 rounded-lg">
                      <Briefcase size={14} />
                      {task.project?.title || 'General'}
                    </span>
                    <span className="flex items-center gap-1.5 text-sm font-medium text-gray-500">
                      <UserIcon size={16} />
                      {task.assignedTo?.name}
                    </span>
                    {task.deadline && (
                      <span className="flex items-center gap-1.5 text-sm font-medium text-gray-500">
                        <Calendar size={16} />
                        {format(new Date(task.deadline), 'MMM d, yyyy')}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-4 ml-13 sm:ml-0">
                <select
                  value={task.status}
                  onChange={(e) => updateTaskStatus(task._id, e.target.value)}
                  disabled={user?.role !== 'Admin' && task.assignedTo?._id !== user?._id}
                  className={`text-xs font-bold uppercase tracking-widest px-5 py-2.5 rounded-xl transition-all appearance-none border-2 border-transparent focus:outline-none focus:ring-4 focus:ring-[#3eb368]/10 ${
                    user?.role !== 'Admin' && task.assignedTo?._id !== user?._id ? 'cursor-not-allowed opacity-80' : 'cursor-pointer'
                  } ${
                    task.status === 'Completed' ? 'bg-[#e3f5ea] text-[#3eb368]' :
                    task.status === 'In Review' ? 'bg-blue-100 text-blue-700' :
                    task.status === 'Needs Revision' ? 'bg-red-100 text-red-700' :
                    task.status === 'In Progress' ? 'bg-amber-100 text-amber-700' :
                    'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  <option value="Pending">Pending</option>
                  <option value="In Progress">In Progress</option>
                  <option value="In Review">In Review</option>
                  {user?.role === 'Admin' && (
                    <>
                      <option value="Completed">Completed</option>
                      <option value="Needs Revision">Needs Revision</option>
                    </>
                  )}
                  {user?.role !== 'Admin' && (task.status === 'Completed' || task.status === 'Needs Revision') && (
                    <option value={task.status}>{task.status}</option>
                  )}
                </select>

                {user?.role === 'Admin' && (
                  <button
                    onClick={() => handleDeleteTask(task._id)}
                    className="text-gray-300 hover:text-red-500 hover:bg-red-50 transition-colors p-2.5 rounded-xl"
                  >
                    <Trash2 size={20} />
                  </button>
                )}
              </div>
            </motion.div>
          ))
        ) : (
          <div className="py-20 text-center bg-white/40 rounded-[2rem] border-2 border-dashed border-gray-200">
            <p className="text-gray-500 font-medium">No tasks found matching your selection.</p>
          </div>
        )}
      </div>

      <AnimatePresence>
        {showModal && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-gray-900/40 backdrop-blur-sm z-[100]"
              onClick={() => setShowModal(false)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-lg bg-white rounded-[2.5rem] shadow-2xl z-[101] overflow-hidden"
            >
              <div className="p-8 md:p-10">
                <div className="flex items-center justify-between mb-8">
                  <h3 className="text-2xl font-bold text-gray-800 tracking-tight">Create Task</h3>
                  <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-800 bg-gray-50 hover:bg-gray-100 p-2 rounded-xl transition-colors">
                    <X size={24} />
                  </button>
                </div>

                <form onSubmit={handleCreateTask} className="space-y-5">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2 ml-1">Task Name</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Design Homepage"
                      className="w-full px-5 py-4 rounded-2xl border-2 border-transparent bg-[#f4fbfa] focus:bg-white focus:outline-none focus:border-[#3eb368] focus:ring-4 focus:ring-[#3eb368]/10 transition-all text-gray-800 font-medium"
                      value={newTask.title}
                      onChange={(e) => setNewTask({...newTask, title: e.target.value})}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2 ml-1">Project</label>
                      <select
                        required
                        className="w-full px-5 py-4 rounded-2xl border-2 border-transparent bg-[#f4fbfa] focus:bg-white focus:outline-none focus:border-[#3eb368] focus:ring-4 focus:ring-[#3eb368]/10 transition-all text-gray-800 font-medium"
                        value={newTask.project}
                        onChange={(e) => setNewTask({...newTask, project: e.target.value})}
                      >
                        <option value="">Select Project</option>
                        {projects.map((p) => (
                          <option key={p._id} value={p._id}>{p.title}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2 ml-1">Assignee</label>
                      <select
                        required
                        className="w-full px-5 py-4 rounded-2xl border-2 border-transparent bg-[#f4fbfa] focus:bg-white focus:outline-none focus:border-[#3eb368] focus:ring-4 focus:ring-[#3eb368]/10 transition-all text-gray-800 font-medium"
                        value={newTask.assignedTo}
                        onChange={(e) => setNewTask({...newTask, assignedTo: e.target.value})}
                      >
                        <option value="">Select Member</option>
                        {members.map((m) => (
                          <option key={m._id} value={m._id}>{m.name}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2 ml-1">Deadline</label>
                    <input
                      type="date"
                      required
                      className="w-full px-5 py-4 rounded-2xl border-2 border-transparent bg-[#f4fbfa] focus:bg-white focus:outline-none focus:border-[#3eb368] focus:ring-4 focus:ring-[#3eb368]/10 transition-all text-gray-800 font-medium"
                      value={newTask.deadline}
                      onChange={(e) => setNewTask({...newTask, deadline: e.target.value})}
                    />
                  </div>

                  <div className="pt-4 flex gap-4">
                    <button
                      type="submit"
                      className="w-full bg-[#3eb368] hover:bg-[#349e5b] text-white font-bold text-lg py-4 rounded-2xl transition-all shadow-[0_8px_20px_rgba(62,179,104,0.3)] active:scale-[0.98]"
                    >
                      Save Task
                    </button>
                  </div>
                </form>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
