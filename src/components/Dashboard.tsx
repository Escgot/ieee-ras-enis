import { useEffect, useState, useRef } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';
import { useNavigate } from 'react-router-dom';
import { gsap } from 'gsap';
import {
  ArrowLeft, Calendar, FolderGit2, BookOpen, Award,
  Edit3, Save, X, Loader2, MapPin, ExternalLink, Shield, Camera
} from 'lucide-react';
import type { Event, EventRegistration, Project } from '../types/database';

// Skill tags available for selection
const AVAILABLE_SKILLS = [
  'ROS', 'Arduino', 'Python', 'C/C++', 'MATLAB', 'SolidWorks',
  'PCB Design', 'Computer Vision', 'Machine Learning', 'PLC',
  'Raspberry Pi', 'Embedded Systems', 'Control Systems', '3D Printing',
  'IoT', 'Drone', 'Autonomous Navigation', 'Simulation',
];

export default function Dashboard() {
  const { user, profile, refreshProfile } = useAuth();
  const navigate = useNavigate();
  const containerRef = useRef<HTMLDivElement>(null);

  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [editForm, setEditForm] = useState({
    full_name: '',
    bio: '',
    ieee_member_id: '',
    skills: [] as string[],
  });

  const [registeredEvents, setRegisteredEvents] = useState<(EventRegistration & { event: Event })[]>([]);
  const [myProjects, setMyProjects] = useState<Project[]>([]);
  const [loadingData, setLoadingData] = useState(true);

  // Sync form with profile
  useEffect(() => {
    if (profile) {
      setEditForm({
        full_name: profile.full_name || '',
        bio: profile.bio || '',
        ieee_member_id: profile.ieee_member_id || '',
        skills: profile.skills || [],
      });
    }
  }, [profile]);

  // Fetch registered events & projects
  useEffect(() => {
    if (!user) return;

    const fetchData = async () => {
      setLoadingData(true);

      // Registered events
      const { data: regData } = await supabase
        .from('event_registrations')
        .select('*, event:events(*)')
        .eq('user_id', user.id)
        .order('registered_at', { ascending: false });

      if (regData) {
        setRegisteredEvents(regData as unknown as (EventRegistration & { event: Event })[]);
      }

      // Projects I'm part of
      const { data: projData } = await supabase
        .from('projects')
        .select('*')
        .contains('team_members', [user.id])
        .order('created_at', { ascending: false });

      if (projData) setMyProjects(projData);

      setLoadingData(false);
    };

    fetchData();
  }, [user]);

  // Entrance animation
  useEffect(() => {
    if (!containerRef.current) return;
    const ctx = gsap.context(() => {
      gsap.fromTo('.dash-animate',
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 0.6, stagger: 0.08, ease: 'power3.out' }
      );
    }, containerRef);
    return () => ctx.revert();
  }, [loadingData]);

  // Save profile edits
  const handleSave = async () => {
    if (!user) return;
    setSaving(true);
    const { error } = await supabase
      .from('profiles')
      .update({
        full_name: editForm.full_name,
        bio: editForm.bio,
        ieee_member_id: editForm.ieee_member_id,
        skills: editForm.skills,
        updated_at: new Date().toISOString(),
      })
      .eq('id', user.id);

    if (error) {
      console.error('Profile update error:', error);
    } else {
      await refreshProfile();
      setIsEditing(false);
    }
    setSaving(false);
  };

  const toggleSkill = (skill: string) => {
    setEditForm(prev => ({
      ...prev,
      skills: prev.skills.includes(skill)
        ? prev.skills.filter(s => s !== skill)
        : [...prev.skills, skill],
    }));
  };

  const avatarUrl = user?.user_metadata?.avatar_url || profile?.avatar_url;
  const displayName = profile?.full_name || user?.user_metadata?.full_name || 'Member';

  return (
    <div ref={containerRef} className="min-h-screen bg-[#070707] pt-20 pb-16 px-4 sm:px-6 lg:px-8">
      {/* Background effects */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-0 left-1/4 w-[500px] h-[500px] rounded-full 
                      bg-red-500/5 blur-[120px]" />
        <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] rounded-full 
                      bg-purple-500/5 blur-[100px]" />
      </div>

      <div className="relative z-10 max-w-5xl mx-auto">
        {/* Header with Progress */}
        <div className="dash-animate flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <button
              onClick={() => navigate('/')}
              className="flex items-center gap-2 text-xs font-bold text-gray-500 hover:text-white 
                       transition-all mb-2 group uppercase tracking-[0.2em]"
            >
              <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-1 transition-transform" />
              Terminal / Home
            </button>
            <h1 className="text-3xl font-orbitron font-black text-white uppercase italic tracking-tighter">Member <span className="text-gradient">Control Center</span></h1>
          </div>

          {/* Profile Completion Bar */}
          <div className="bg-white/5 border border-white/10 rounded-2xl p-4 min-w-[240px]">
            <div className="flex justify-between items-center mb-2">
              <span className="text-[10px] font-black uppercase tracking-widest text-gray-500">Profile Progress</span>
              <span className="text-[10px] font-black text-red-500">
                {Math.round(((editForm.full_name ? 1 : 0) + (editForm.bio ? 1 : 0) + (editForm.skills.length > 0 ? 1 : 0) + (editForm.ieee_member_id ? 1 : 0)) / 4 * 100)}%
              </span>
            </div>
            <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-red-600 to-purple-600 transition-all duration-1000"
                style={{ width: `${((editForm.full_name ? 1 : 0) + (editForm.bio ? 1 : 0) + (editForm.skills.length > 0 ? 1 : 0) + (editForm.ieee_member_id ? 1 : 0)) / 4 * 100}%` }}
              />
            </div>
          </div>
        </div>

        {/* Profile Header Card */}
        <div className="dash-animate relative overflow-hidden premium-card rounded-[2rem] p-6 sm:p-8 mb-8 group">
          {/* Animated Background Orbs */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-red-600/10 blur-[100px] rounded-full -translate-y-1/2 translate-x-1/2 group-hover:bg-red-600/20 transition-all duration-700" />
          
          <div className="relative z-10">
            <div className="flex flex-col gap-10">
              {/* Profile Main Section: Horizontal on mobile */}
              <div className="flex flex-row items-start gap-6 sm:gap-10">
                {/* Left Side: Avatar & Role */}
                <div className="flex flex-col items-center gap-4 shrink-0">
                <div className="relative group/avatar">
                  <div className="absolute -inset-1.5 bg-gradient-to-tr from-red-600 to-purple-600 rounded-[2.5rem] blur-sm opacity-20 group-hover/avatar:opacity-40 transition-opacity" />
                  
                  {/* Avatar Image / Placeholder */}
                  <div className="relative w-32 h-32 rounded-[2.2rem] overflow-hidden border border-white/10 shadow-2xl bg-[#0f0f0f]">
                    {avatarUrl ? (
                      <img
                        src={avatarUrl}
                        alt={displayName}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <div className="absolute inset-0 bg-gradient-to-br from-red-500/20 to-purple-600/20" />
                        <span className="text-4xl font-orbitron font-black text-white relative z-10">
                          {displayName.charAt(0).toUpperCase()}
                        </span>
                      </div>
                    )}

                    {/* Photo Edit Overlay */}
                    {isEditing && (
                      <label className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center cursor-pointer opacity-0 group-hover/avatar:opacity-100 transition-opacity backdrop-blur-sm">
                        <Camera className="w-6 h-6 text-white mb-1" />
                        <span className="text-[8px] font-black text-white uppercase tracking-widest">Update</span>
                        <input 
                          type="file" 
                          className="hidden" 
                          accept="image/*"
                          onChange={async (e) => {
                            const file = e.target.files?.[0];
                            if (!file || !user) return;
                            
                            const fileExt = file.name.split('.').pop();
                            const fileName = `${user.id}-${Math.random()}.${fileExt}`;
                            const filePath = `avatars/${fileName}`;

                            const { error: uploadError } = await supabase.storage
                              .from('profiles')
                              .upload(filePath, file);

                            if (uploadError) {
                              console.error('Upload error:', uploadError);
                              return;
                            }

                            const { data: { publicUrl } } = supabase.storage
                              .from('profiles')
                              .getPublicUrl(filePath);

                            const { error: updateError } = await supabase
                              .from('profiles')
                              .update({ avatar_url: publicUrl })
                              .eq('id', user.id);

                            if (!updateError) await refreshProfile();
                          }}
                        />
                      </label>
                    )}
                  </div>

                  <div className={`absolute -bottom-2 -right-2 p-2 rounded-xl border-2 border-[#070707] shadow-xl
                    ${profile?.role === 'admin' ? 'bg-red-500' : 'bg-purple-600'}`}>
                    {profile?.role === 'admin' ? <Shield className="w-4 h-4 text-white" /> : <Award className="w-4 h-4 text-white" />}
                  </div>
                </div>

                <div className="flex flex-col items-center gap-3 w-full">
                  <span className={`px-4 py-1.5 text-[10px] font-black uppercase tracking-[0.2em] rounded-full border
                    ${profile?.role === 'admin' ? 'bg-red-500/10 text-red-500 border-red-500/20'
                      : 'bg-purple-500/10 text-purple-400 border-purple-500/20'}`}>
                    System {profile?.role || 'Member'}
                  </span>

                </div>
              </div>

              {/* Right Side: Identity, Accreditation, and Core Actions */}
              <div className="flex-1 min-w-0 pt-1">
                <div className="space-y-4">
                  {/* Name/Identity */}
                  <div className="space-y-1">
                    {isEditing ? (
                      <input
                        type="text"
                        value={editForm.full_name}
                        onChange={e => setEditForm(prev => ({ ...prev, full_name: e.target.value }))}
                        className="w-full text-2xl sm:text-4xl font-orbitron font-black text-white bg-white/5 border border-white/10 
                                 rounded-xl px-4 py-2 sm:py-3 focus:border-red-500/50 outline-none transition-all uppercase italic"
                        placeholder="Full Name"
                      />
                    ) : (
                      <h2 className="text-2xl sm:text-4xl font-orbitron font-black text-white tracking-tighter uppercase italic truncate">
                        {displayName}
                      </h2>
                    )}
                  </div>

                  {/* IEEE Link */}
                  <div className="flex flex-col gap-1">
                    <p className="text-[10px] font-black uppercase tracking-widest text-gray-500">IEEE Accreditation</p>
                    {isEditing ? (
                      <input
                        type="text"
                        value={editForm.ieee_member_id}
                        onChange={e => setEditForm(prev => ({ ...prev, ieee_member_id: e.target.value }))}
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-xs text-white focus:border-red-500/50 transition-all outline-none"
                        placeholder="Member ID"
                      />
                    ) : (
                      <p className="text-white font-orbitron font-bold tracking-[0.2em] text-sm sm:text-lg italic opacity-80 uppercase">
                        {profile?.ieee_member_id || "NOT LINKED"}
                      </p>
                    )}
                  </div>

                  {/* Actions for Desktop/Tablet */}
                  <div className="hidden sm:flex items-center gap-3 pt-2">
                     {isEditing ? (
                       <>
                         <button onClick={handleSave} disabled={saving} className="flex-1 flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-white text-black text-[10px] font-black uppercase hover:bg-red-500 hover:text-white transition-all">
                           {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                           Sync Profile
                         </button>
                         <button onClick={() => setIsEditing(false)} className="px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-gray-500 hover:text-white transition-all text-[10px] font-black uppercase">
                           Abort
                         </button>
                       </>
                     ) : (
                       <button onClick={() => setIsEditing(true)} className="flex items-center gap-3 px-6 py-3 rounded-xl bg-white/5 border border-white/10 text-white text-[10px] font-black uppercase hover:bg-white/10 transition-all">
                         <Edit3 className="w-4 h-4" />
                         Edit Profile
                       </button>
                     )}
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom Row Mobile: Edit Buttons & Bio & Skills */}
            <div className="flex flex-col gap-8">
              {/* Mobile Only Action Buttons */}
              <div className="sm:hidden flex flex-col gap-2">
                 {isEditing ? (
                   <div className="flex gap-2">
                     <button onClick={handleSave} disabled={saving} className="flex-[2] flex items-center justify-center gap-2 py-4 rounded-xl bg-white text-black text-[10px] font-black uppercase tracking-widest">
                       {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                       Sync
                     </button>
                     <button onClick={() => setIsEditing(false)} className="flex-1 py-4 rounded-xl bg-white/5 border border-white/10 text-gray-500 text-[10px] font-black uppercase tracking-widest">
                       Cancel
                     </button>
                   </div>
                 ) : (
                   <button onClick={() => setIsEditing(true)} className="w-full flex items-center justify-center gap-3 py-4 rounded-xl bg-white/5 border border-white/10 text-white text-[10px] font-black uppercase tracking-widest">
                     <Edit3 className="w-4 h-4" />
                     Edit Profile
                   </button>
                 )}
              </div>

              <div className="grid lg:grid-cols-2 gap-8">
                <div>
                  <p className="text-[10px] font-black uppercase tracking-widest text-gray-500 mb-3 ml-1">Expertise Node Cluster</p>
                  <div className="flex flex-wrap gap-2">
                    {(isEditing ? AVAILABLE_SKILLS : (profile?.skills || [])).map(skill => (
                      <button
                        key={skill}
                        disabled={!isEditing}
                        onClick={() => toggleSkill(skill)}
                        className={`px-3 py-2 text-[10px] font-black uppercase tracking-widest rounded-xl border transition-all duration-200
                          ${editForm.skills.includes(skill)
                            ? 'bg-red-500 text-white border-red-500 shadow-xl shadow-red-500/30'
                            : isEditing 
                              ? 'bg-white/5 text-gray-500 border-white/10 hover:border-white/30'
                              : 'bg-white/5 text-gray-400 border-white/5'
                          }`}
                      >
                        {skill}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <p className="text-[10px] font-black uppercase tracking-widest text-gray-500 mb-3 ml-1">Log Entries / Biography</p>
                  {isEditing ? (
                    <textarea
                      value={editForm.bio}
                      onChange={e => setEditForm(prev => ({ ...prev, bio: e.target.value }))}
                      rows={6}
                      className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-sm text-white focus:border-red-500/50 outline-none transition-colors resize-none"
                      placeholder="Record biography logs..."
                    />
                  ) : (
                    <div className="p-6 bg-white/[0.02] border border-white/5 rounded-3xl min-h-[140px]">
                      <p className="text-sm text-gray-400 leading-relaxed italic">
                        {profile?.bio || "No biography log found for this node entry."}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
            </div>
          </div>
        </div>

        {/* Grid: Events + Projects */}
        <div className="grid md:grid-cols-2 gap-6">
          {/* Registered Events */}
          <div className="dash-animate premium-card rounded-2xl p-6">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-10 h-10 rounded-xl bg-red-500/10 border border-red-500/20 
                            flex items-center justify-center">
                <Calendar className="w-5 h-5 text-red-400" />
              </div>
              <div>
                <h2 className="text-lg font-orbitron font-bold text-white">My Events</h2>
                <p className="text-xs text-gray-500">{registeredEvents.length} registered</p>
              </div>
            </div>

            {loadingData ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="w-5 h-5 text-red-500 animate-spin" />
              </div>
            ) : registeredEvents.length === 0 ? (
              <div className="text-center py-8">
                <Calendar className="w-8 h-8 text-gray-700 mx-auto mb-2" />
                <p className="text-sm text-gray-600">No events registered yet</p>
                <button
                  onClick={() => navigate('/')}
                  className="mt-3 text-xs text-red-400 hover:text-red-300 transition-colors"
                >
                  Browse events →
                </button>
              </div>
            ) : (
              <div className="space-y-3 max-h-[400px] overflow-y-auto no-scrollbar">
                {registeredEvents.map(reg => (
                  <div key={reg.id}
                    className="p-4 rounded-xl bg-white/3 border border-white/5 
                             hover:border-white/10 transition-colors"
                  >
                    <h4 className="text-sm font-semibold text-white">{reg.event?.title}</h4>
                    <div className="flex items-center gap-3 mt-2 text-xs text-gray-500">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {new Date(reg.event?.date).toLocaleDateString()}
                      </span>
                      {reg.event?.location && (
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3 h-3" />
                          {reg.event.location}
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* My Projects */}
          <div className="dash-animate premium-card rounded-2xl p-6">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/20 
                            flex items-center justify-center">
                <FolderGit2 className="w-5 h-5 text-purple-400" />
              </div>
              <div>
                <h2 className="text-lg font-orbitron font-bold text-white">My Projects</h2>
                <p className="text-xs text-gray-500">{myProjects.length} projects</p>
              </div>
            </div>

            {loadingData ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="w-5 h-5 text-purple-500 animate-spin" />
              </div>
            ) : myProjects.length === 0 ? (
              <div className="text-center py-8">
                <FolderGit2 className="w-8 h-8 text-gray-700 mx-auto mb-2" />
                <p className="text-sm text-gray-600">No projects yet</p>
              </div>
            ) : (
              <div className="space-y-3 max-h-[400px] overflow-y-auto no-scrollbar">
                {myProjects.map(proj => (
                  <div key={proj.id}
                    className="p-4 rounded-xl bg-white/3 border border-white/5 
                             hover:border-white/10 transition-colors"
                  >
                    <div className="flex items-start justify-between">
                      <h4 className="text-sm font-semibold text-white">{proj.title}</h4>
                      {proj.github_url && (
                        <a href={proj.github_url} target="_blank" rel="noopener noreferrer"
                          className="text-gray-500 hover:text-white transition-colors">
                          <ExternalLink className="w-3.5 h-3.5" />
                        </a>
                      )}
                    </div>
                    {proj.technologies && proj.technologies.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 mt-2">
                        {proj.technologies.slice(0, 4).map(tech => (
                          <span key={tech} className="px-2 py-0.5 text-[10px] font-medium 
                                                     bg-purple-500/10 text-purple-400 rounded-md">
                            {tech}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Resources Section */}
        <div className="dash-animate premium-card rounded-2xl p-6 mt-6">
          <div className="flex items-center gap-3 mb-5">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 
                          flex items-center justify-center">
              <BookOpen className="w-5 h-5 text-emerald-400" />
            </div>
            <div>
              <h2 className="text-lg font-orbitron font-bold text-white">Resources</h2>
              <p className="text-xs text-gray-500">Datasheets, tutorials & more</p>
            </div>
          </div>
          <div className="text-center py-8">
            <BookOpen className="w-8 h-8 text-gray-700 mx-auto mb-2" />
            <p className="text-sm text-gray-600">Resources library coming soon</p>
          </div>
        </div>
      </div>
    </div>
  );
}
