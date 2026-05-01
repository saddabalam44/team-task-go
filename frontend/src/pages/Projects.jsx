import React, { useState, useEffect } from 'react';
import api from '../lib/api.js';
import { useAuth } from '../contexts/AuthContext.jsx';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Plus, 
  Briefcase, 
  Users, 
  Trash2, 
  X
} from 'lucide-react';

export default function Projects() {
  const { user } = useAuth();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [newProject, setNewProject] = useState({ title: '', description: '' });

  useEffect(() => {
    fetchProjects();
  }, [user]);

  const fetchProjects = async () => {
    try {
      const { data } = await api.get('/projects');
      setProjects(data);
    } catch (error) {
      console.error('Error fetching projects:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateProject = async (e) => {
    e.preventDefault();
    try {
      await api.post('/projects', newProject);
      setShowModal(false);
      setNewProject({ title: '', description: '' });
      fetchProjects();
    } catch (error) {
      console.error('Error creating project:', error);
      alert(error.response?.data?.message || 'Failed to create project');
    }
  };


  const handleDeleteProject = async (id) => {
    if (window.confirm('Delete this project?')) {
      try {
        await api.delete(`/projects/${id}`);
        fetchProjects();
      } catch (error) {
        console.error('Error deleting project:', error);
      }
    }
  };

  if (loading) return <div className="flex items-center justify-center h-64 text-[#3eb368] font-semibold">Loading projects...</div>;

  return (
    <div className="space-y-10">
      <header className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h2 className="text-sm font-bold text-[#3eb368] uppercase tracking-widest mb-1">Portfolios</h2>
          <h1 className="text-4xl font-bold text-gray-800 tracking-tight">Projects</h1>
          <p className="text-gray-500 mt-2 text-lg font-medium">Manage and view all active team projects.</p>
        </div>
        
        {user?.role === 'Admin' && (
          <button 
            onClick={() => setShowModal(true)}
            className="bg-[#3eb368] hover:bg-[#349e5b] text-white rounded-2xl px-6 py-3.5 flex items-center gap-2 font-bold transition-all shadow-[0_8px_20px_rgba(62,179,104,0.3)] active:scale-95"
          >
            <Plus size={20} strokeWidth={2.5} />
            New Project
          </button>
        )}
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
        {projects.length > 0 ? (
          projects.map((project, idx) => (
            <motion.div
              key={project._id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: idx * 0.05 }}
              className="bg-white rounded-[2rem] shadow-[0_8px_20px_rgba(0,0,0,0.03)] hover:shadow-[0_15px_30px_rgba(0,0,0,0.08)] transition-all group flex flex-col border border-transparent"
            >
              <div className="p-8 flex-1">
                <div className="flex items-start justify-between mb-6">
                  <div className="p-4 bg-[#e3f5ea] rounded-2xl text-[#3eb368] shadow-sm">
                    <Briefcase size={28} strokeWidth={2.5} />
                  </div>
                  {user?.role === 'Admin' && (
                    <button 
                      onClick={() => handleDeleteProject(project._id)}
                      className="text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-xl transition-colors p-2.5"
                    >
                      <Trash2 size={20} />
                    </button>
                  )}
                </div>
                <h3 className="text-2xl font-bold text-gray-800 group-hover:text-[#3eb368] transition-colors tracking-tight">{project.title}</h3>
                <p className="text-gray-500 mt-3 text-sm line-clamp-3 leading-relaxed font-medium">
                  {project.description || 'No description provided.'}
                </p>
                
                <div className="mt-8 pt-6 border-t border-gray-100 flex items-center justify-between">
                  <div className="flex items-center gap-2 text-gray-500 bg-[#f4fbfa] px-3 py-1.5 rounded-xl">
                    <Users size={16} className="text-[#3eb368]" />
                    <span className="text-xs font-bold uppercase tracking-wider text-[#3eb368]">{project.members?.length || 0} Members</span>
                  </div>
                </div>
              </div>
            </motion.div>
          ))
        ) : (
          <div className="col-span-full py-20 text-center bg-white/40 rounded-[2rem] border-2 border-dashed border-gray-200">
            <p className="text-gray-500 font-medium">No projects found. Create one to get started.</p>
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
                  <h3 className="text-2xl font-bold text-gray-800 tracking-tight">Create Project</h3>
                  <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-800 bg-gray-50 hover:bg-gray-100 p-2 rounded-xl transition-colors">
                    <X size={24} />
                  </button>
                </div>
                
                <form onSubmit={handleCreateProject} className="space-y-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2 ml-1">Project Title</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Website Redesign"
                      className="w-full px-5 py-4 rounded-2xl border-2 border-transparent bg-[#f4fbfa] focus:bg-white focus:outline-none focus:border-[#3eb368] focus:ring-4 focus:ring-[#3eb368]/10 transition-all text-gray-800 font-medium"
                      value={newProject.title}
                      onChange={(e) => setNewProject({...newProject, title: e.target.value})}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2 ml-1">Description</label>
                    <textarea
                      rows={4}
                      placeholder="What is this project about?"
                      className="w-full px-5 py-4 rounded-2xl border-2 border-transparent bg-[#f4fbfa] focus:bg-white focus:outline-none focus:border-[#3eb368] focus:ring-4 focus:ring-[#3eb368]/10 transition-all text-gray-800 font-medium resize-none"
                      value={newProject.description}
                      onChange={(e) => setNewProject({...newProject, description: e.target.value})}
                    />
                  </div>
                  
                  <div className="pt-4 flex gap-4">
                    <button
                      type="submit"
                      className="w-full bg-[#3eb368] hover:bg-[#349e5b] text-white font-bold text-lg py-4 rounded-2xl transition-all shadow-[0_8px_20px_rgba(62,179,104,0.3)] active:scale-[0.98]"
                    >
                      Save Project
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
