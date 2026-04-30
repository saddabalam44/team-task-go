import React, { useState, useEffect } from 'react';
import api from '../lib/api.js';
import { useAuth } from '../contexts/AuthContext.jsx';
import { motion } from 'motion/react';
import { Users, Mail, Shield, Trash2, Search, Plus, X } from 'lucide-react';

export default function Members() {
  const { user } = useAuth();
  const [members, setMembers] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newMember, setNewMember] = useState({ name: '', email: '', password: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchMembersAndTasks();
  }, []);

  const fetchMembersAndTasks = async () => {
    try {
      const [usersRes, tasksRes] = await Promise.all([
        api.get('/users'),
        api.get('/tasks')
      ]);
      setMembers(usersRes.data);
      setTasks(tasksRes.data);
    } catch (error) {
      console.error('Error fetching members data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteMember = async (id, name) => {
    if (window.confirm(`Are you sure you want to permanently delete ${name}? This action cannot be undone.`)) {
      try {
        await api.delete(`/users/${id}`);
        fetchMembersAndTasks();
      } catch (error) {
        console.error('Error deleting member:', error);
      }
    }
  };

  const handleAddMember = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await api.post('/users', newMember);
      setIsModalOpen(false);
      setNewMember({ name: '', email: '', password: '' });
      fetchMembersAndTasks();
      alert('Member added successfully! An email with credentials has been sent.');
    } catch (error) {
      console.error('Error adding member:', error);
      const errorMsg = error.response?.data?.message || error.message || 'Failed to add member.';
      alert(errorMsg);
    } finally {
      setIsSubmitting(false);
    }
  };

  const filteredMembers = members.filter(m => 
    m.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    m.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return <div className="flex items-center justify-center h-64 text-[#3eb368] font-semibold">Loading members...</div>;

  return (
    <div className="space-y-10">
      <header className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
        <div>
          <h2 className="text-sm font-bold text-[#3eb368] uppercase tracking-widest mb-1">Directory</h2>
          <h1 className="text-4xl font-bold text-gray-800 tracking-tight">Members</h1>
          <p className="text-gray-500 mt-2 text-lg font-medium">View and manage team workspace members.</p>
        </div>
        <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
          <div className="relative w-full sm:w-72">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input 
              type="text" 
              placeholder="Search members..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-11 pr-4 py-3 rounded-2xl border-2 border-transparent bg-white shadow-sm focus:border-[#3eb368] focus:ring-4 focus:ring-[#3eb368]/10 transition-all font-medium text-gray-700 outline-none"
            />
          </div>
          {user?.role === 'Admin' && (
            <button 
              onClick={() => setIsModalOpen(true)}
              className="w-full sm:w-auto bg-[#3eb368] text-white px-6 py-3 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-[#2a7a47] transition-all shadow-[0_4px_15px_rgba(62,179,104,0.3)] active:scale-95"
            >
              <Plus size={20} />
              Add Member
            </button>
          )}
        </div>
      </header>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            className="bg-white rounded-[2.5rem] w-full max-w-md p-8 shadow-2xl relative"
          >
            <button 
              onClick={() => setIsModalOpen(false)}
              className="absolute top-6 right-6 text-gray-400 hover:text-gray-600 p-2 rounded-xl hover:bg-gray-100 transition-all"
            >
              <X size={24} />
            </button>
            
            <h2 className="text-3xl font-bold text-gray-800 mb-2">Add Member</h2>
            <p className="text-gray-500 mb-8">Create a new team member. We'll email them their credentials.</p>
            
            <form onSubmit={handleAddMember} className="space-y-5">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2 ml-1">Full Name</label>
                <input 
                  type="text" 
                  required
                  value={newMember.name}
                  onChange={(e) => setNewMember({...newMember, name: e.target.value})}
                  className="w-full px-5 py-3.5 rounded-2xl border-2 border-gray-100 focus:border-[#3eb368] focus:ring-4 focus:ring-[#3eb368]/5 outline-none transition-all font-medium"
                  placeholder="Enter full name"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2 ml-1">Email Address</label>
                <input 
                  type="email" 
                  required
                  value={newMember.email}
                  onChange={(e) => setNewMember({...newMember, email: e.target.value})}
                  className="w-full px-5 py-3.5 rounded-2xl border-2 border-gray-100 focus:border-[#3eb368] focus:ring-4 focus:ring-[#3eb368]/5 outline-none transition-all font-medium"
                  placeholder="Enter email address"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2 ml-1">Password</label>
                <input 
                  type="text" 
                  required
                  value={newMember.password}
                  onChange={(e) => setNewMember({...newMember, password: e.target.value})}
                  className="w-full px-5 py-3.5 rounded-2xl border-2 border-gray-100 focus:border-[#3eb368] focus:ring-4 focus:ring-[#3eb368]/5 outline-none transition-all font-medium"
                  placeholder="Set a password"
                />
              </div>
              <button 
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-[#3eb368] text-white py-4 rounded-2xl font-bold text-lg shadow-[0_4px_15px_rgba(62,179,104,0.3)] hover:bg-[#2a7a47] transition-all disabled:opacity-50 disabled:cursor-not-allowed mt-4"
              >
                {isSubmitting ? 'Creating Account...' : 'Add Member & Send Email'}
              </button>
            </form>
          </motion.div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredMembers.length > 0 ? (
          filteredMembers.map((member, idx) => (
            <motion.div
              key={member._id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: idx * 0.05 }}
              className="bg-white rounded-[2.5rem] shadow-[0_8px_20px_rgba(0,0,0,0.03)] hover:shadow-[0_15px_30px_rgba(0,0,0,0.08)] transition-all group p-8 border border-transparent flex flex-col relative overflow-hidden"
            >
              <div className="flex items-center justify-between mb-6">
                <div className="w-16 h-16 rounded-full bg-[#e3f5ea] flex items-center justify-center text-[#3eb368] shadow-inner text-2xl font-bold">
                  {member.name.charAt(0).toUpperCase()}
                </div>
                {user?.role === 'Admin' && member._id !== user._id && (
                  <button 
                    onClick={() => handleDeleteMember(member._id, member.name)}
                    title={`Delete ${member.name}`}
                    className="text-red-400 bg-red-50 hover:text-white hover:bg-red-500 rounded-xl transition-all p-2.5 z-10 shadow-sm"
                  >
                    <Trash2 size={20} />
                  </button>
                )}
              </div>
              
              <h3 className="text-2xl font-bold text-gray-800 tracking-tight">{member.name}</h3>
              
              <div className="mt-6 space-y-3 flex-1">
                <div className="flex items-center gap-3 text-gray-500 font-medium">
                  <div className="p-2 bg-gray-50 rounded-lg"><Mail size={16} /></div>
                  <span className="text-sm truncate">{member.email}</span>
                </div>
                <div className="flex items-center justify-between gap-3 text-gray-500 font-medium">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-gray-50 rounded-lg"><Shield size={16} /></div>
                    <span className={`text-sm font-bold px-2 py-0.5 rounded-md ${member.role === 'Admin' ? 'bg-[#e3f5ea] text-[#3eb368]' : 'bg-gray-100 text-gray-600'}`}>
                      {member.role}
                    </span>
                  </div>
                  {member.role !== 'Admin' && (
                    <span className="text-xs font-bold bg-[#e3f5ea] text-[#3eb368] px-2.5 py-1 rounded-lg">
                      {tasks.filter(t => t.assignedTo?._id === member._id && t.status === 'Completed').length} Completed
                    </span>
                  )}
                </div>
                
                {member.role !== 'Admin' && (
                  <div className="pt-4 mt-2 border-t border-gray-100">
                    {(() => {
                      const memberTasks = tasks.filter(t => t.assignedTo?._id === member._id && t.status !== 'Completed');
                      if (memberTasks.length > 0) {
                        return (
                          <div className="space-y-2">
                            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Current Workload</p>
                            <div className="space-y-2 max-h-32 overflow-y-auto pr-2 custom-scrollbar">
                              {memberTasks.map(task => (
                                <div key={task._id} className="text-sm bg-gray-50 p-2 rounded-xl border border-gray-100 flex flex-col gap-1">
                                  <span className="font-bold text-gray-700 truncate">{task.title}</span>
                                  <span className="text-[#3eb368] text-xs font-semibold">{task.project?.title || 'General Workspace'}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        );
                      }
                      return (
                        <div className="flex items-center gap-2 mt-2 bg-[#e3f5ea]/50 p-3 rounded-xl border border-[#3eb368]/20">
                          <div className="w-2 h-2 rounded-full bg-[#3eb368] animate-pulse"></div>
                          <span className="text-sm font-bold text-[#3eb368]">Available / Not Assigned</span>
                        </div>
                      );
                    })()}
                  </div>
                )}
              </div>
            </motion.div>
          ))
        ) : (
          <div className="col-span-full py-20 text-center bg-white/40 rounded-[2rem] border-2 border-dashed border-gray-200">
            <p className="text-gray-500 font-medium">No members found.</p>
          </div>
        )}
      </div>
    </div>
  );
}
