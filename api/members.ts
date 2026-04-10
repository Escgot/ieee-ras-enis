import type { VercelRequest, VercelResponse } from '@vercel/node';
import { createClient } from '@supabase/supabase-js';

/**
 * Vercel Serverless Function: /api/members
 * 
 * Admin-only endpoint for managing member roles.
 * Uses the service role key (server-side only) to bypass RLS.
 * 
 * GET  /api/members        → list all members (admin only)
 * PATCH /api/members       → update member role { userId, role }
 */

const supabase = createClient(
  process.env.VITE_SUPABASE_URL || '',
  process.env.SUPABASE_SERVICE_ROLE_KEY || ''
);

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Verify auth — get the user's token from the Authorization header
  const token = req.headers.authorization?.replace('Bearer ', '');
  if (!token) {
    return res.status(401).json({ error: 'No authorization token' });
  }

  // Verify the token and get the user
  const { data: { user }, error: authError } = await supabase.auth.getUser(token);
  if (authError || !user) {
    return res.status(401).json({ error: 'Invalid token' });
  }

  // Check if the user is an admin
  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single();

  if (profile?.role !== 'admin') {
    return res.status(403).json({ error: 'Admin access required' });
  }

  switch (req.method) {
    case 'GET': {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .order('joined_at', { ascending: false });

      if (error) return res.status(500).json({ error: error.message });
      return res.status(200).json(data);
    }

    case 'PATCH': {
      const { userId, role } = req.body;
      if (!userId || !role || !['visitor', 'member', 'admin'].includes(role)) {
        return res.status(400).json({ error: 'Invalid userId or role' });
      }

      const { error } = await supabase
        .from('profiles')
        .update({ role })
        .eq('id', userId);

      if (error) return res.status(500).json({ error: error.message });
      return res.status(200).json({ success: true });
    }

    default:
      res.setHeader('Allow', 'GET, PATCH');
      return res.status(405).json({ error: 'Method not allowed' });
  }
}
