import { useAuth } from '../contexts/AuthContext';
import { LogIn, LogOut, User, Shield, ChevronDown } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function AuthButton() {
  const { user, profile, loading, signInWithGoogle, signOut, isAdmin } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  // Close menu on outside click
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  if (loading) {
    return (
      <div className="w-8 h-8 rounded-full bg-white/5 animate-pulse" />
    );
  }

  // Not signed in — show Sign In button
  if (!user) {
    return (
      <button
        onClick={signInWithGoogle}
        id="auth-sign-in-btn"
        className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white 
                   bg-white/5 border border-white/10 rounded-lg
                   hover:bg-white/10 hover:border-red-500/30
                   transition-all duration-300 group"
      >
        <LogIn className="w-4 h-4 text-gray-400 group-hover:text-red-400 transition-colors" />
        <span className="hidden sm:inline">Sign In</span>
      </button>
    );
  }

  // Signed in — show avatar + dropdown
  const avatarUrl = user.user_metadata?.avatar_url || profile?.avatar_url;
  const displayName = profile?.full_name || user.user_metadata?.full_name || user.email?.split('@')[0] || 'User';

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setMenuOpen(!menuOpen)}
        id="auth-user-menu-btn"
        className="flex items-center gap-2 px-2 py-1.5 rounded-lg 
                   bg-white/5 border border-white/10 
                   hover:bg-white/10 hover:border-white/20
                   transition-all duration-300"
      >
        {avatarUrl ? (
          <img
            src={avatarUrl}
            alt={displayName}
            className="w-7 h-7 rounded-full border border-white/20 object-cover"
          />
        ) : (
          <div className="w-7 h-7 rounded-full bg-gradient-to-br from-red-500 to-purple-600 
                        flex items-center justify-center text-xs font-bold text-white">
            {displayName.charAt(0).toUpperCase()}
          </div>
        )}
        <span className="hidden sm:inline text-sm text-gray-300 font-medium max-w-[100px] truncate">
          {displayName}
        </span>
        <ChevronDown className={`w-3 h-3 text-gray-500 transition-transform duration-200 ${menuOpen ? 'rotate-180' : ''}`} />
      </button>

      {/* Dropdown Menu */}
      {menuOpen && (
        <div
          className="absolute right-0 top-full mt-2 w-56 py-2 
                     bg-[#0e0e0e]/95 backdrop-blur-xl border border-white/10 rounded-xl 
                     shadow-2xl shadow-black/50 z-[60]
                     animate-in fade-in slide-in-from-top-2 duration-200"
        >
          {/* User info header */}
          <div className="px-4 py-3 border-b border-white/5">
            <p className="text-sm font-semibold text-white truncate">{displayName}</p>
            <p className="text-xs text-gray-500 truncate">{user.email}</p>
            {profile?.role && (
              <span className={`inline-block mt-1.5 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider rounded-full
                ${profile.role === 'admin'
                  ? 'bg-red-500/15 text-red-400 border border-red-500/20'
                  : profile.role === 'member'
                    ? 'bg-purple-500/15 text-purple-400 border border-purple-500/20'
                    : 'bg-white/5 text-gray-500 border border-white/10'
                }`}>
                {profile.role}
              </span>
            )}
          </div>

          {/* Menu items */}
          <div className="py-1">
            <button
              onClick={() => { setMenuOpen(false); navigate('/dashboard'); }}
              className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-300 
                         hover:text-white hover:bg-white/5 transition-colors"
            >
              <User className="w-4 h-4" />
              Dashboard
            </button>

            {isAdmin && (
              <button
                onClick={() => { setMenuOpen(false); navigate('/admin'); }}
                className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-300 
                           hover:text-white hover:bg-white/5 transition-colors"
              >
                <Shield className="w-4 h-4 text-red-400" />
                Admin Panel
              </button>
            )}
          </div>

          {/* Sign out */}
          <div className="border-t border-white/5 pt-1">
            <button
              onClick={() => { setMenuOpen(false); signOut(); navigate('/'); }}
              id="auth-sign-out-btn"
              className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-400 
                         hover:text-red-400 hover:bg-red-500/5 transition-colors"
            >
              <LogOut className="w-4 h-4" />
              Sign Out
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
