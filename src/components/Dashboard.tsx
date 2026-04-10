import { useEffect, useState, useRef } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';
import { useNavigate } from 'react-router-dom';
import { gsap } from 'gsap';
import {
  ArrowLeft, Calendar, FolderGit2, BookOpen, Award,
  Edit3, Save, X, Loader2, MapPin, ExternalLink
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
        {/* Back button */}
        <button
          onClick={() => navigate('/')}
          className="dash-animate flex items-center gap-2 text-sm text-gray-400 hover:text-white 
                   transition-colors mb-8 group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          Back to Home
        </button>

        {/* Profile Header Card */}
        <div className="dash-animate premium-card rounded-2xl p-6 sm:p-8 mb-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
            {/* Avatar */}
            <div className="relative">
              {avatarUrl ? (
                <img
                  src={avatarUrl}
                  alt={displayName}
                  className="w-20 h-20 rounded-2xl border-2 border-white/10 object-cover"
                />
              ) : (
                <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-red-500 to-purple-600 
                              flex items-center justify-center text-2xl font-bold text-white">
                  {displayName.charAt(0).toUpperCase()}
                </div>
              )}
              <div className={`absolute -bottom-1 -right-1 w-5 h-5 rounded-full border-2 border-[#070707]
                ${profile?.role === 'admin' ? 'bg-red-500' : profile?.role === 'member' ? 'bg-purple-500' : 'bg-gray-500'}`} 
              />
            </div>

            {/* Info */}
            <div className="flex-1">
              {isEditing ? (
                <input
                  type="text"
                  value={editForm.full_name}
                  onChange={e => setEditForm(prev => ({ ...prev, full_name: e.target.value }))}
                  className="text-2xl font-orbitron font-bold text-white bg-transparent border-b border-white/20 
                           focus:border-red-500 outline-none pb-1 w-full"
                  placeholder="Your name"
                />
              ) : (
                <h1 className="text-2xl font-orbitron font-bold text-white">{displayName}</h1>
              )}
              <p className="text-gray-500 text-sm mt-1">{user?.email}</p>
              <div className="flex items-center gap-3 mt-2">
                <span className={`px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider rounded-full
                  ${profile?.role === 'admin' ? 'bg-red-500/15 text-red-400 border border-red-500/20'
                    : profile?.role === 'member' ? 'bg-purple-500/15 text-purple-400 border border-purple-500/20'
                    : 'bg-white/5 text-gray-500 border border-white/10'}`}>
                  {profile?.role || 'visitor'}
                </span>
                {profile?.ieee_member_id && !isEditing && (
                  <span className="flex items-center gap-1 text-xs text-gray-500">
                    <Award className="w-3 h-3" />
                    IEEE: {profile.ieee_member_id}
                  </span>
                )}
              </div>
            </div>

            {/* Edit/Save buttons */}
            <div className="flex gap-2">
              {isEditing ? (
                <>
                  <button
                    onClick={() => setIsEditing(false)}
                    className="p-2.5 rounded-lg bg-white/5 border border-white/10 text-gray-400 
                             hover:text-white hover:bg-white/10 transition-all"
                  >
                    <X className="w-4 h-4" />
                  </button>
                  <button
                    onClick={handleSave}
                    disabled={saving}
                    className="flex items-center gap-2 px-4 py-2.5 rounded-lg 
                             bg-gradient-to-r from-red-600 to-red-500 text-white text-sm font-semibold
                             hover:from-red-500 hover:to-rose-400 transition-all disabled:opacity-50"
                  >
                    {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                    Save
                  </button>
                </>
              ) : (
                <button
                  onClick={() => setIsEditing(true)}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-lg 
                           bg-white/5 border border-white/10 text-gray-300 text-sm font-medium
                           hover:bg-white/10 hover:text-white transition-all"
                >
                  <Edit3 className="w-4 h-4" />
                  Edit Profile
                </button>
              )}
            </div>
          </div>

          {/* Bio */}
          {isEditing ? (
            <div className="mt-6">
              <label className="block text-xs text-gray-500 uppercase tracking-wider mb-2">Bio</label>
              <textarea
                value={editForm.bio}
                onChange={e => setEditForm(prev => ({ ...prev, bio: e.target.value }))}
                rows={3}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white 
                         placeholder-gray-600 focus:border-red-500/50 focus:outline-none transition-colors resize-none"
                placeholder="Tell us about yourself..."
              />
            </div>
          ) : profile?.bio && (
            <p className="mt-4 text-sm text-gray-400 leading-relaxed">{profile.bio}</p>
          )}

          {/* IEEE Member ID (edit mode) */}
          {isEditing && (
            <div className="mt-4">
              <label className="block text-xs text-gray-500 uppercase tracking-wider mb-2">IEEE Member ID</label>
              <input
                type="text"
                value={editForm.ieee_member_id}
                onChange={e => setEditForm(prev => ({ ...prev, ieee_member_id: e.target.value }))}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white 
                         placeholder-gray-600 focus:border-red-500/50 focus:outline-none transition-colors"
                placeholder="e.g. 12345678"
              />
            </div>
          )}

          {/* Skills */}
          <div className="mt-6">
            <h3 className="text-xs text-gray-500 uppercase tracking-wider mb-3">Skills</h3>
            {isEditing ? (
              <div className="flex flex-wrap gap-2">
                {AVAILABLE_SKILLS.map(skill => (
                  <button
                    key={skill}
                    onClick={() => toggleSkill(skill)}
                    className={`px-3 py-1.5 text-xs font-medium rounded-lg border transition-all duration-200
                      ${editForm.skills.includes(skill)
                        ? 'bg-red-500/15 text-red-400 border-red-500/30'
                        : 'bg-white/3 text-gray-500 border-white/8 hover:border-white/20 hover:text-gray-300'
                      }`}
                  >
                    {skill}
                  </button>
                ))}
              </div>
            ) : profile?.skills && profile.skills.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {profile.skills.map(skill => (
                  <span key={skill} className="px-3 py-1.5 text-xs font-medium text-red-400 
                                              bg-red-500/10 border border-red-500/20 rounded-lg">
                    {skill}
                  </span>
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-600">No skills added yet</p>
            )}
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
