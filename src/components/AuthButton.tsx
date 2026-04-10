import { useAuth } from '../contexts/AuthContext';
import { LogIn, LogOut, User as UserIcon, Shield, ChevronDown, X, Mail, Lock, Loader2 } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function AuthButton({ mobile = false }: { mobile?: boolean }) {
  const { user, profile, loading, signInWithGoogle, signInWithEmail, signUpWithEmail, signOut, isAdmin } = useAuth();
  
  // Auth Modal State
  const [modalOpen, setModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState<'signin' | 'signup'>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
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

    let err;
    if (authMode === 'signin') {
      const res = await signInWithEmail(email, password);
      err = res.error;
    } else {
      if (!name) {
        setAuthError('Please enter your name.');
        setAuthLoading(false);
        return;
      }
      const res = await signUpWithEmail(email, password, name);
      err = res.error;
    }

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

  // Not signed in — show Join Now button + Auth Modal
  if (!user) {
    return (
      <>
        {/* Join Now Button */}
        <button
          onClick={() => setModalOpen(true)}
          className={mobile
            ? "block w-full px-4 py-3.5 bg-gradient-to-r from-red-600 to-red-500 text-white text-center font-bold rounded-xl tracking-wide cyber-btn"
            : "hidden lg:flex cyber-btn items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-red-600 to-red-500 hover:from-red-500 hover:to-rose-400 text-white text-sm font-bold rounded-lg transition-all duration-300 shadow-lg shadow-red-600/20 hover:shadow-red-500/40 hover:scale-[1.03]"
          }
        >
          <LogIn className={`w-4 h-4 ${mobile ? 'hidden' : 'inline-block'}`} />
          Join Now
        </button>

        {/* Auth Modal Overlay */}
        {modalOpen && (
          <div className="fixed inset-0 z-[9999] flex flex-col items-center justify-center px-4">
            <div className="absolute inset-0 bg-[#070707]/90 backdrop-blur-md" onClick={() => setModalOpen(false)} />
            
            <div className="relative w-full max-w-md bg-[#0a0a0a] border border-white/10 rounded-2xl p-6 md:p-8 shadow-2xl animate-in zoom-in-95 duration-200">
              <button 
                onClick={() => setModalOpen(false)}
                className="absolute top-4 right-4 p-2 text-gray-500 hover:text-white bg-white/5 hover:bg-white/10 rounded-lg transition-colors"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="text-center mb-8">
                <h2 className="text-2xl font-orbitron font-bold text-white mb-2">Welcome</h2>
                <p className="text-sm text-gray-400">IEEE RAS ENIS Student Branch</p>
              </div>

              {/* Toggle Mode */}
              <div className="flex bg-white/5 p-1 rounded-xl mb-6">
                <button 
                  onClick={() => { setAuthMode('signin'); setAuthError(''); }}
                  className={`flex-1 py-2 text-sm font-semibold rounded-lg transition-all duration-300
                    ${authMode === 'signin' ? 'bg-red-500 text-white shadow-lg shadow-red-500/20' : 'text-gray-400 hover:text-white'}`}
                >
                  Sign In
                </button>
                <button 
                  onClick={() => { setAuthMode('signup'); setAuthError(''); }}
                  className={`flex-1 py-2 text-sm font-semibold rounded-lg transition-all duration-300
                    ${authMode === 'signup' ? 'bg-red-500 text-white shadow-lg shadow-red-500/20' : 'text-gray-400 hover:text-white'}`}
                >
                  Sign Up
                </button>
              </div>

              {/* Form */}
              <form onSubmit={handleEmailAuth} className="space-y-4">
                {authMode === 'signup' && (
                  <div className="relative">
                    <UserIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                    <input
                      type="text"
                      placeholder="Full Name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full bg-white/5 border border-white/10 rounded-xl pl-11 pr-4 py-3 text-sm text-white placeholder-gray-500 focus:border-red-500/50 focus:outline-none focus:ring-1 focus:ring-red-500/50 transition-all"
                      required={authMode === 'signup'}
                    />
                  </div>
                )}
                
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                  <input
                    type="email"
                    placeholder="Email Address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-xl pl-11 pr-4 py-3 text-sm text-white placeholder-gray-500 focus:border-red-500/50 focus:outline-none focus:ring-1 focus:ring-red-500/50 transition-all"
                    required
                  />
                </div>

                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                  <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-xl pl-11 pr-4 py-3 text-sm text-white placeholder-gray-500 focus:border-red-500/50 focus:outline-none focus:ring-1 focus:ring-red-500/50 transition-all"
                    required
                    minLength={6}
                  />
                </div>

                {authError && (
                  <p className="text-xs text-red-400 text-center animate-in fade-in slide-in-from-top-1">{authError}</p>
                )}

                <button
                  type="submit"
                  disabled={authLoading}
                  className="w-full py-3 bg-white text-black text-sm font-bold rounded-xl hover:bg-gray-200 transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {authLoading && <Loader2 className="w-4 h-4 animate-spin" />}
                  {authMode === 'signin' ? 'Sign In' : 'Create Account'}
                </button>
              </form>

              <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-white/10"></div>
                </div>
                <div className="relative flex justify-center text-xs">
                  <span className="bg-[#0a0a0a] px-2 text-gray-500 font-semibold uppercase tracking-wider">Or continue with</span>
                </div>
              </div>

              <button
                onClick={async () => {
                  setAuthLoading(true);
                  await signInWithGoogle();
                }}
                disabled={authLoading}
                className="w-full py-3 bg-white/5 border border-white/10 rounded-xl text-white text-sm font-semibold hover:bg-white/10 transition-colors flex items-center justify-center gap-3 disabled:opacity-50"
              >
                <img src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google" className="w-4 h-4" />
                Google
              </button>
            </div>
          </div>
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
