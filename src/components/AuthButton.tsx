import { useAuth } from '../contexts/AuthContext';
import { LogIn, LogOut, User as UserIcon, Shield, ChevronDown, X, Mail, Lock, Loader2 } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import { createPortal } from 'react-dom';

export default function AuthButton({ mobile = false }: { mobile?: boolean }) {
  const { user, profile, loading, signInWithEmail, signOut, isAdmin } = useAuth();
  
  // Auth Modal State
  const [modalOpen, setModalOpen] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [authLoading, setAuthLoading] = useState(false);
  const [authError, setAuthError] = useState('');

  // Dropdown State (Logged In)
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  // Close dropdown menu on outside click
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthLoading(true);
    setAuthError('');

    const { error: err } = await signInWithEmail(email, password);

    if (err) {
      setAuthError(err.message || 'Authentication failed');
      setAuthLoading(false);
    } else {
      setModalOpen(false);
      setAuthLoading(false);
      // Wait a moment for auth state to update before navigating
      setTimeout(() => navigate('/dashboard'), 500);
    }
  };

  if (loading) {
    if (mobile) return null;
    return (
      <div className="w-8 h-8 rounded-full bg-white/5 animate-pulse" />
    );
  }

  // Not signed in — show Log In button + Auth Modal
  if (!user) {
    return (
      <>
        {/* Log In Button */}
        <button
          onClick={() => setModalOpen(true)}
          className={mobile
            ? "block w-full px-4 py-3.5 bg-gradient-to-r from-red-600 to-red-500 text-white text-center font-bold rounded-xl tracking-wide cyber-btn"
            : "hidden lg:flex cyber-btn items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-red-600 to-red-500 hover:from-red-500 hover:to-rose-400 text-white text-sm font-bold rounded-lg transition-all duration-300 shadow-lg shadow-red-600/20 hover:shadow-red-500/40 hover:scale-[1.03]"
          }
        >
          <LogIn className={`w-4 h-4 ${mobile ? 'hidden' : 'inline-block'}`} />
          Log In
        </button>

        {/* Auth Modal Overlay - Using Portal to escape parent transforms */}
        {modalOpen && createPortal(
          <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4">
            <div 
              className="absolute inset-0 bg-black/60 dark:bg-[#070707]/90 backdrop-blur-sm dark:backdrop-blur-md" 
              onClick={() => setModalOpen(false)} 
            />
            
            <div className="relative w-full max-w-md bg-white dark:bg-[#0a0a0a] border border-black/10 dark:border-white/10 rounded-3xl p-6 md:p-8 shadow-2xl animate-in zoom-in-95 duration-200 overflow-hidden">
              {/* Top accent light */}
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-red-600 to-red-500" />

              <button 
                onClick={() => setModalOpen(false)}
                className="absolute top-4 right-4 p-2 text-gray-500 hover:text-red-500 bg-black/5 dark:bg-white/5 hover:bg-black/10 dark:hover:bg-white/10 rounded-xl transition-colors"
                aria-label="Close modal"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="text-center mb-8 pt-2">
                <h2 className="text-3xl font-orbitron font-black text-black dark:text-white mb-2 uppercase tracking-tighter italic">Member Portal</h2>
                <p className="text-xs text-gray-700 dark:text-gray-400 font-bold uppercase tracking-widest">IEEE RAS ENIS Student Branch</p>
              </div>

              {/* Form */}
              <form onSubmit={handleEmailAuth} className="space-y-4">
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 dark:text-gray-500" />
                  <input
                    type="email"
                    placeholder="Email Address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-black/[0.02] dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-xl pl-11 pr-4 py-3.5 text-sm text-black dark:text-white placeholder-gray-500 dark:placeholder-gray-600 focus:border-red-500/50 focus:outline-none focus:ring-1 focus:ring-red-500/50 transition-all font-medium"
                    required
                  />
                </div>

                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 dark:text-gray-500" />
                  <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-black/[0.02] dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-xl pl-11 pr-4 py-3.5 text-sm text-black dark:text-white placeholder-gray-500 dark:placeholder-gray-600 focus:border-red-500/50 focus:outline-none focus:ring-1 focus:ring-red-500/50 transition-all font-medium"
                    required
                    minLength={6}
                  />
                </div>

                {authError && (
                  <p className="text-xs text-red-500 dark:text-red-400 text-center font-bold animate-pulse">{authError}</p>
                )}

                <button
                  type="submit"
                  disabled={authLoading}
                  className="w-full py-3.5 bg-black dark:bg-white text-white dark:text-black text-xs font-black uppercase tracking-widest rounded-xl hover:bg-gray-800 dark:hover:bg-gray-200 transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-50 shadow-xl"
                >
                  {authLoading && <Loader2 className="w-4 h-4 animate-spin" />}
                  Sign In
                </button>
              </form>

              <div className="mt-8 pt-6 border-t border-black/5 dark:border-white/10 text-center">
                <p className="text-[11px] text-gray-500 dark:text-gray-400 leading-relaxed">
                  Access is restricted to authorized members only. <br />
                  <span className="text-red-500 dark:text-red-400 font-bold uppercase tracking-wider mt-2 block">
                    Contact the chapter administrator to get your credentials.
                  </span>
                </p>
              </div>
            </div>
          </div>,
          document.body
        )}
      </>
    );
  }

  if (mobile) return null;

  // Signed in — show avatar + dropdown (Unchanged)
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
              <UserIcon className="w-4 h-4" />
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
