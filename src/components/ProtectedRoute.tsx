import { useAuth } from '../contexts/AuthContext';
import { Navigate } from 'react-router-dom';
import type { ReactNode } from 'react';
import type { UserRole } from '../types/database';
import { Loader2, ShieldX } from 'lucide-react';

interface ProtectedRouteProps {
  children: ReactNode;
  requiredRole?: UserRole;
}

export default function ProtectedRoute({ children, requiredRole }: ProtectedRouteProps) {
  const { user, profile, loading } = useAuth();

  // Show a loading spinner while checking auth state
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#070707]">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-8 h-8 text-red-500 animate-spin" />
          <p className="text-sm text-gray-500 font-mono tracking-wider">AUTHENTICATING...</p>
        </div>
      </div>
    );
  }

  // Not signed in → redirect to home
  if (!user) {
    return <Navigate to="/" replace />;
  }

  // Signed in but role insufficient
  if (requiredRole) {
    const roleHierarchy: Record<UserRole, number> = {
      visitor: 0,
      member: 1,
      admin: 2,
    };

    const userLevel = roleHierarchy[profile?.role || 'visitor'];
    const requiredLevel = roleHierarchy[requiredRole];

    if (userLevel < requiredLevel) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-[#070707]">
          <div className="flex flex-col items-center gap-6 text-center max-w-md px-6">
            <div className="w-16 h-16 rounded-2xl bg-red-500/10 border border-red-500/20 
                          flex items-center justify-center">
              <ShieldX className="w-8 h-8 text-red-400" />
            </div>
            <div>
              <h2 className="text-xl font-orbitron font-bold text-white mb-2">Access Denied</h2>
              <p className="text-gray-400 text-sm leading-relaxed">
                You need <span className="text-red-400 font-semibold">{requiredRole}</span> access 
                to view this page. Contact an admin to upgrade your role.
              </p>
            </div>
            <a
              href="/"
              className="px-6 py-2.5 text-sm font-semibold text-white 
                       bg-gradient-to-r from-red-600 to-red-500 rounded-lg
                       hover:from-red-500 hover:to-rose-400 transition-all duration-300"
            >
              Back to Home
            </a>
          </div>
        </div>
      );
    }
  }

  return <>{children}</>;
}
