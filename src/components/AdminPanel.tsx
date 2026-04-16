import { useEffect, useState, useRef } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';
import { useNavigate } from 'react-router-dom';
import { gsap } from 'gsap';
import {
  ArrowLeft, Users, Calendar, FileText,
  Shield, Search, ChevronDown, Loader2, Trash2,
  Plus, X, Save, Eye, EyeOff, Inbox, Mail
} from 'lucide-react';
import type { Profile, Event as DbEvent, Resource, UserRole } from '../types/database';

type AdminTab = 'members' | 'events' | 'projects' | 'resources' | 'inbox';

export default function AdminPanel() {
  const { profile } = useAuth();
  const navigate = useNavigate();
  const containerRef = useRef<HTMLDivElement>(null);

  const [activeTab, setActiveTab] = useState<AdminTab>('members');
  const [members, setMembers] = useState<Profile[]>([]);
  const [events, setEvents] = useState<DbEvent[]>([]);
  const [resources, setResources] = useState<Resource[]>([]);
  const [messages, setMessages] = useState<any[]>([]); // Using any for messages
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  // Event creation form
  const [showEventForm, setShowEventForm] = useState(false);
  const [eventForm, setEventForm] = useState({
    title: '', description: '', date: '', location: '',
    max_attendees: '', category: 'workshop', image_url: '',
  });
  const [savingEvent, setSavingEvent] = useState(false);

  // Entrance animation
  useEffect(() => {
    if (!containerRef.current) return;
    const ctx = gsap.context(() => {
      gsap.fromTo('.admin-animate',
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.5, stagger: 0.06, ease: 'power3.out' }
      );
    }, containerRef);
    return () => ctx.revert();
  }, [activeTab, loading]);

  // Fetch data based on active tab
  useEffect(() => {
    const fetchTab = async () => {
      setLoading(true);
      switch (activeTab) {
        case 'members': {
          const { data } = await supabase
            .from('profiles')
            .select('*')
            .order('joined_at', { ascending: false });
          setMembers((data as Profile[]) || []);
          break;
        }
        case 'events': {
          const { data } = await supabase
            .from('events')
            .select('*')
            .order('date', { ascending: false });
          setEvents((data as DbEvent[]) || []);
          break;
        }
        case 'resources': {
          const { data } = await supabase
            .from('resources')
            .select('*')
            .order('created_at', { ascending: false });
          setResources((data as Resource[]) || []);
          break;
        }
        case 'inbox': {
          const { data } = await supabase
            .from('contact_messages')
            .select('*')
            .order('created_at', { ascending: false });
          setMessages(data || []);
          break;
        }
      }
      setLoading(false);
    };
    fetchTab();
  }, [activeTab]);

  // Change a member's role
  const changeRole = async (userId: string, newRole: UserRole) => {
    const { error } = await supabase
      .from('profiles')
      .update({ role: newRole })
      .eq('id', userId);

    if (!error) {
      setMembers(prev => prev.map(m => m.id === userId ? { ...m, role: newRole } : m));
    }
  };

  // Delete an event
  const deleteEvent = async (eventId: string) => {
    if (!confirm('Delete this event? This will also remove all registrations.')) return;
    const { error } = await supabase.from('events').delete().eq('id', eventId);
    if (!error) {
      setEvents(prev => prev.filter(e => e.id !== eventId));
    }
  };

  // Create a new event
  const createEvent = async () => {
    if (!eventForm.title || !eventForm.date) return;
    setSavingEvent(true);

    const { data, error } = await supabase
      .from('events')
      .insert({
        title: eventForm.title,
        description: eventForm.description || null,
        date: new Date(eventForm.date).toISOString(),
        location: eventForm.location || null,
        max_attendees: eventForm.max_attendees ? parseInt(eventForm.max_attendees) : null,
        category: eventForm.category,
        image_url: eventForm.image_url || null,
        created_by: profile?.id || null,
      })
      .select()
      .single();

    if (!error && data) {
      setEvents(prev => [data as DbEvent, ...prev]);
      setShowEventForm(false);
      setEventForm({ title: '', description: '', date: '', location: '', max_attendees: '', category: 'workshop', image_url: '' });
    }
    setSavingEvent(false);
  };

  // Toggle resource visibility
  const toggleResourceVisibility = async (resourceId: string, currentlyMembersOnly: boolean) => {
    const { error } = await supabase
      .from('resources')
      .update({ members_only: !currentlyMembersOnly })
      .eq('id', resourceId);

    if (!error) {
      setResources(prev => prev.map(r =>
        r.id === resourceId ? { ...r, members_only: !currentlyMembersOnly } : r
      ));
    }
  };

  // Filter members by search
  const filteredMembers = members.filter(m =>
    (m.full_name?.toLowerCase() || '').includes(searchQuery.toLowerCase()) ||
    (m.email?.toLowerCase() || '').includes(searchQuery.toLowerCase())
  );

  const tabs: { key: AdminTab; label: string; icon: typeof Users; count: number }[] = [
    { key: 'members', label: 'Members', icon: Users, count: members.length },
    { key: 'events', label: 'Events', icon: Calendar, count: events.length },
    { key: 'resources', label: 'Resources', icon: FileText, count: resources.length },
    { key: 'inbox', label: 'Inbox', icon: Inbox, count: messages.length },
  ];

  return (
    <div ref={containerRef} className="min-h-screen bg-[#070707] pt-20 pb-16 px-4 sm:px-6 lg:px-8">
      {/* Background effects */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-0 right-1/4 w-[500px] h-[500px] rounded-full 
                      bg-red-500/4 blur-[120px]" />
      </div>

      <div className="relative z-10 max-w-6xl mx-auto">
        {/* Header */}
        <div className="admin-animate flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate('/')}
              className="p-2 rounded-lg bg-white/5 border border-white/10 text-gray-400 
                       hover:text-white hover:bg-white/10 transition-all"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
            <div>
              <div className="flex items-center gap-2">
                <Shield className="w-5 h-5 text-red-400" />
                <h1 className="text-2xl font-orbitron font-bold text-white">Admin Panel</h1>
              </div>
              <p className="text-xs text-gray-500 mt-1">Manage members, events, and resources</p>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="admin-animate flex gap-2 mb-6 overflow-x-auto no-scrollbar">
          {tabs.map(tab => (
            <button
              key={tab.key}
              onClick={() => { setActiveTab(tab.key); setSearchQuery(''); }}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium 
                        transition-all duration-300 whitespace-nowrap border
                ${activeTab === tab.key
                  ? 'bg-red-500/10 text-red-400 border-red-500/20'
                  : 'bg-white/3 text-gray-500 border-white/5 hover:bg-white/5 hover:text-gray-300'
                }`}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
              <span className={`px-1.5 py-0.5 text-[10px] font-bold rounded-md
                ${activeTab === tab.key ? 'bg-red-500/20 text-red-400' : 'bg-white/5 text-gray-600'}`}>
                {tab.count}
              </span>
            </button>
          ))}
        </div>

        {/* Content */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-6 h-6 text-red-500 animate-spin" />
          </div>
        ) : (
          <>
            {/* ===== MEMBERS TAB ===== */}
            {activeTab === 'members' && (
              <div className="admin-animate">
                {/* Search bar */}
                <div className="relative mb-6">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                    placeholder="Search members by name or email..."
                    className="w-full pl-11 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl 
                             text-sm text-white placeholder-gray-600 
                             focus:border-red-500/30 focus:outline-none transition-colors"
                  />
                </div>

                {/* Members table */}
                <div className="premium-card rounded-2xl overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-white/5">
                          <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Member</th>
                          <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider hidden sm:table-cell">IEEE ID</th>
                          <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Role</th>
                          <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider hidden md:table-cell">Joined</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredMembers.map(member => (
                          <tr key={member.id} className="border-b border-white/3 hover:bg-white/3 transition-colors">
                            <td className="px-6 py-4">
                              <div className="flex items-center gap-3">
                                {member.avatar_url ? (
                                  <img src={member.avatar_url} alt="" className="w-8 h-8 rounded-lg object-cover" />
                                ) : (
                                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-red-500/30 to-purple-500/30 
                                                flex items-center justify-center text-xs font-bold text-white">
                                    {(member.full_name || '?').charAt(0).toUpperCase()}
                                  </div>
                                )}
                                <div>
                                  <p className="text-sm font-medium text-white">{member.full_name || 'Unnamed'}</p>
                                  <p className="text-xs text-gray-600">{member.email}</p>
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4 text-xs text-gray-500 hidden sm:table-cell">
                              {member.ieee_member_id || '—'}
                            </td>
                            <td className="px-6 py-4">
                              <div className="relative inline-block">
                                <select
                                  value={member.role}
                                  onChange={e => changeRole(member.id, e.target.value as UserRole)}
                                  className={`appearance-none pl-3 pr-7 py-1.5 text-[11px] font-bold uppercase tracking-wider 
                                           rounded-lg border cursor-pointer focus:outline-none transition-colors
                                    ${member.role === 'admin' ? 'bg-red-500/15 text-red-400 border-red-500/20'
                                      : member.role === 'member' ? 'bg-purple-500/15 text-purple-400 border-purple-500/20'
                                      : 'bg-white/5 text-gray-500 border-white/10'}`}
                                >
                                  <option value="visitor">Visitor</option>
                                  <option value="member">Member</option>
                                  <option value="admin">Admin</option>
                                </select>
                                <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-3 h-3 text-gray-500 pointer-events-none" />
                              </div>
                            </td>
                            <td className="px-6 py-4 text-xs text-gray-600 hidden md:table-cell">
                              {new Date(member.joined_at).toLocaleDateString()}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  {filteredMembers.length === 0 && (
                    <div className="text-center py-12">
                      <Users className="w-8 h-8 text-gray-700 mx-auto mb-2" />
                      <p className="text-sm text-gray-600">No members found</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* ===== EVENTS TAB ===== */}
            {activeTab === 'events' && (
              <div className="admin-animate">
                <div className="flex items-center justify-between mb-6">
                  <p className="text-sm text-gray-500">{events.length} events total</p>
                  <button
                    onClick={() => setShowEventForm(!showEventForm)}
                    className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold
                             bg-gradient-to-r from-red-600 to-red-500 text-white
                             hover:from-red-500 hover:to-rose-400 transition-all"
                  >
                    {showEventForm ? <X className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                    {showEventForm ? 'Cancel' : 'New Event'}
                  </button>
                </div>

                {/* New Event Form */}
                {showEventForm && (
                  <div className="premium-card rounded-2xl p-6 mb-6">
                    <h3 className="text-lg font-orbitron font-bold text-white mb-4">Create Event</h3>
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs text-gray-500 uppercase tracking-wider mb-1.5">Title *</label>
                        <input type="text" value={eventForm.title}
                          onChange={e => setEventForm(p => ({ ...p, title: e.target.value }))}
                          className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white 
                                   placeholder-gray-600 focus:border-red-500/50 focus:outline-none"
                          placeholder="Workshop: Intro to ROS" />
                      </div>
                      <div>
                        <label className="block text-xs text-gray-500 uppercase tracking-wider mb-1.5">Date *</label>
                        <input type="datetime-local" value={eventForm.date}
                          onChange={e => setEventForm(p => ({ ...p, date: e.target.value }))}
                          className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white 
                                   focus:border-red-500/50 focus:outline-none [color-scheme:dark]" />
                      </div>
                      <div>
                        <label className="block text-xs text-gray-500 uppercase tracking-wider mb-1.5">Location</label>
                        <input type="text" value={eventForm.location}
                          onChange={e => setEventForm(p => ({ ...p, location: e.target.value }))}
                          className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white 
                                   placeholder-gray-600 focus:border-red-500/50 focus:outline-none"
                          placeholder="ENIS, Room 201" />
                      </div>
                      <div>
                        <label className="block text-xs text-gray-500 uppercase tracking-wider mb-1.5">Max Attendees</label>
                        <input type="number" value={eventForm.max_attendees}
                          onChange={e => setEventForm(p => ({ ...p, max_attendees: e.target.value }))}
                          className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white 
                                   placeholder-gray-600 focus:border-red-500/50 focus:outline-none"
                          placeholder="30" />
                      </div>
                      <div>
                        <label className="block text-xs text-gray-500 uppercase tracking-wider mb-1.5">Category</label>
                        <select value={eventForm.category}
                          onChange={e => setEventForm(p => ({ ...p, category: e.target.value }))}
                          className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white 
                                   focus:border-red-500/50 focus:outline-none appearance-none">
                          <option value="workshop">Workshop</option>
                          <option value="competition">Competition</option>
                          <option value="seminar">Seminar</option>
                          <option value="meetup">Meetup</option>
                          <option value="other">Other</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-xs text-gray-500 uppercase tracking-wider mb-1.5">Image URL</label>
                        <input type="url" value={eventForm.image_url}
                          onChange={e => setEventForm(p => ({ ...p, image_url: e.target.value }))}
                          className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white 
                                   placeholder-gray-600 focus:border-red-500/50 focus:outline-none"
                          placeholder="https://..." />
                      </div>
                      <div className="sm:col-span-2">
                        <label className="block text-xs text-gray-500 uppercase tracking-wider mb-1.5">Description</label>
                        <textarea value={eventForm.description}
                          onChange={e => setEventForm(p => ({ ...p, description: e.target.value }))}
                          rows={3}
                          className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white 
                                   placeholder-gray-600 focus:border-red-500/50 focus:outline-none resize-none"
                          placeholder="Describe the event..." />
                      </div>
                    </div>
                    <div className="flex justify-end mt-4">
                      <button onClick={createEvent} disabled={savingEvent || !eventForm.title || !eventForm.date}
                        className="flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold
                                 bg-gradient-to-r from-red-600 to-red-500 text-white
                                 hover:from-red-500 hover:to-rose-400 transition-all disabled:opacity-50">
                        {savingEvent ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                        Create Event
                      </button>
                    </div>
                  </div>
                )}

                {/* Events list */}
                <div className="space-y-3">
                  {events.map(event => (
                    <div key={event.id} className="premium-card rounded-xl p-5 flex items-center justify-between gap-4">
                      <div className="min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider 
                                        bg-red-500/10 text-red-400 border border-red-500/20 rounded-md">
                            {event.category}
                          </span>
                          <h4 className="text-sm font-semibold text-white truncate">{event.title}</h4>
                        </div>
                        <div className="flex items-center gap-4 text-xs text-gray-500">
                          <span>{new Date(event.date).toLocaleDateString()}</span>
                          {event.location && <span>{event.location}</span>}
                          {event.max_attendees && <span>Max: {event.max_attendees}</span>}
                        </div>
                      </div>
                      <button
                        onClick={() => deleteEvent(event.id)}
                        className="p-2 rounded-lg text-gray-600 hover:text-red-400 
                                 hover:bg-red-500/10 transition-all flex-shrink-0"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                  {events.length === 0 && (
                    <div className="text-center py-12">
                      <Calendar className="w-8 h-8 text-gray-700 mx-auto mb-2" />
                      <p className="text-sm text-gray-600">No events yet. Create one above.</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* ===== RESOURCES TAB ===== */}
            {activeTab === 'resources' && (
              <div className="admin-animate">
                <div className="space-y-3">
                  {resources.map(resource => (
                    <div key={resource.id} className="premium-card rounded-xl p-5 flex items-center justify-between gap-4">
                      <div className="min-w-0">
                        <h4 className="text-sm font-semibold text-white">{resource.title}</h4>
                        <p className="text-xs text-gray-500 mt-1 truncate">{resource.description}</p>
                      </div>
                      <button
                        onClick={() => toggleResourceVisibility(resource.id, resource.members_only)}
                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium 
                                  border transition-all
                          ${resource.members_only
                            ? 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20'
                            : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'}`}
                      >
                        {resource.members_only ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                        {resource.members_only ? 'Members Only' : 'Public'}
                      </button>
                    </div>
                  ))}
                  {resources.length === 0 && (
                    <div className="text-center py-12">
                      <FileText className="w-8 h-8 text-gray-700 mx-auto mb-2" />
                      <p className="text-sm text-gray-600">No resources uploaded yet</p>
                    </div>
                  )}
                </div>
              </div>
            )}
            {/* ===== INBOX TAB ===== */}
            {activeTab === 'inbox' && (
              <div className="admin-animate space-y-4">
                {messages.length === 0 ? (
                  <div className="text-center py-20 bg-white/[0.02] border border-white/5 rounded-3xl">
                    <Mail className="w-8 h-8 text-gray-700 mx-auto mb-2" />
                    <p className="text-sm text-gray-600">No messages in your inbox yet</p>
                  </div>
                ) : (
                  <div className="grid gap-4">
                    {messages.map((msg) => (
                      <div key={msg.id} className="premium-card rounded-2xl p-6 border-l-4 border-l-red-500/50">
                        <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 mb-4">
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <span className="px-2 py-0.5 text-[8px] font-black uppercase tracking-widest bg-red-500/10 text-red-500 rounded-md border border-red-500/20">
                                {msg.subject}
                              </span>
                              <span className="text-[10px] text-gray-600 font-bold uppercase tracking-widest">
                                {new Date(msg.created_at).toLocaleString()}
                              </span>
                            </div>
                            <h4 className="text-lg font-orbitron font-bold text-white uppercase italic">
                              {msg.first_name} {msg.last_name}
                            </h4>
                            <p className="text-xs text-red-400 font-medium">{msg.email}</p>
                          </div>
                          
                          <button 
                            onClick={async () => {
                              if (!confirm('Permanently delete this message?')) return;
                              const { error } = await supabase.from('contact_messages').delete().eq('id', msg.id);
                              if (!error) setMessages(prev => prev.filter(m => m.id !== msg.id));
                            }}
                            className="p-2.5 rounded-xl bg-white/5 text-gray-500 hover:text-red-400 hover:bg-red-500/10 transition-all self-start"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                        
                        <div className="p-4 bg-white/[0.03] border border-white/5 rounded-xl">
                          <p className="text-sm text-gray-300 leading-relaxed italic whitespace-pre-wrap">
                            "{msg.message}"
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
