import type { VercelRequest, VercelResponse } from '@vercel/node';
import { createClient } from '@supabase/supabase-js';

/**
 * Vercel Serverless Function: /api/events
 * 
 * GET    /api/events          → list all events (public)
 * POST   /api/events          → create event (admin only)
 * DELETE /api/events?id=xxx   → delete event (admin only)
 */

const supabase = createClient(
  process.env.VITE_SUPABASE_URL || '',
  process.env.SUPABASE_SERVICE_ROLE_KEY || ''
);

async function getAdminUser(req: VercelRequest) {
  const token = req.headers.authorization?.replace('Bearer ', '');
  if (!token) return null;

  const { data: { user }, error } = await supabase.auth.getUser(token);
  if (error || !user) return null;

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single();

  if (profile?.role !== 'admin') return null;
  return user;
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  switch (req.method) {
    case 'GET': {
      const { data, error } = await supabase
        .from('events')
        .select('*')
        .order('date', { ascending: true });

      if (error) return res.status(500).json({ error: error.message });
      return res.status(200).json(data);
    }

    case 'POST': {
      const admin = await getAdminUser(req);
      if (!admin) return res.status(403).json({ error: 'Admin access required' });

      const { title, description, date, location, max_attendees, category, image_url } = req.body;

      if (!title || !date) {
        return res.status(400).json({ error: 'Title and date are required' });
      }

      const { data, error } = await supabase
        .from('events')
        .insert({
          title,
          description: description || null,
          date: new Date(date).toISOString(),
          location: location || null,
          max_attendees: max_attendees ? parseInt(max_attendees) : null,
          category: category || 'workshop',
          image_url: image_url || null,
          created_by: admin.id,
        })
        .select()
        .single();

      if (error) return res.status(500).json({ error: error.message });
      return res.status(201).json(data);
    }

    case 'DELETE': {
      const admin = await getAdminUser(req);
      if (!admin) return res.status(403).json({ error: 'Admin access required' });

      const id = req.query.id as string;
      if (!id) return res.status(400).json({ error: 'Event ID required' });

      const { error } = await supabase.from('events').delete().eq('id', id);
      if (error) return res.status(500).json({ error: error.message });
      return res.status(200).json({ success: true });
    }

    default:
      res.setHeader('Allow', 'GET, POST, DELETE');
      return res.status(405).json({ error: 'Method not allowed' });
  }
}
