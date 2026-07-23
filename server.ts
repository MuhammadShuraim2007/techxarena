import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { db } from './server/db.js';

const ADMIN_SECRET_KEY = process.env.ADMIN_SECRET_KEY || 'techx2026@A';
const TARGET_WHATSAPP_NUMBER = '923272979729'; // Clean format without + sign for wa.me URL

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Middleware to check admin auth header or query token
  const checkAdminAuth = (req: express.Request, res: express.Response, next: express.NextFunction) => {
    const token = req.headers.authorization?.replace('Bearer ', '') || req.query.token;
    if (token === ADMIN_SECRET_KEY || token === 'techx_admin_token_2026') {
      return next();
    }
    return res.status(401).json({ error: 'Unauthorized admin access. Please log in.' });
  };

  // API ROUTES
  
  // 1. Health & Info
  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', academy: 'Tech X Academy Karachi', platform: 'Tech X Arena' });
  });

  // 2. Hackathons Listing & Search
  app.get('/api/hackathons', (req, res) => {
    try {
      const { status, featured, search } = req.query;
      let list = db.getHackathons();

      if (status && typeof status === 'string' && status !== 'all') {
        list = list.filter(h => h.status === status);
      }
      if (featured === 'true') {
        list = list.filter(h => h.featured);
      }
      if (search && typeof search === 'string' && search.trim()) {
        const q = search.toLowerCase().trim();
        list = list.filter(h => 
          h.title.toLowerCase().includes(q) || 
          h.shortDescription.toLowerCase().includes(q) ||
          h.tracks.some(t => t.name.toLowerCase().includes(q))
        );
      }

      res.json(list);
    } catch (err: any) {
      res.status(500).json({ error: err.message || 'Failed to fetch hackathons' });
    }
  });

  // 3. Single Hackathon
  app.get('/api/hackathons/:id', (req, res) => {
    const h = db.getHackathonById(req.params.id);
    if (!h) {
      return res.status(404).json({ error: 'Hackathon not found' });
    }
    res.json(h);
  });

  // 4. Admin Create Hackathon
  app.post('/api/hackathons', checkAdminAuth, (req, res) => {
    try {
      const { title, shortDescription, fullDescription, bannerUrl, startDate, endDate, registrationStartDate, registrationEndDate, venue, mode, maxParticipants, teamSizeLimit, allowTeams, prizes, rules, eligibility, tracks, timeline, status, featured, organizer } = req.body;

      if (!title || !shortDescription || !fullDescription) {
        return res.status(400).json({ error: 'Title and descriptions are required' });
      }

      const created = db.createHackathon({
        title,
        shortDescription,
        fullDescription,
        bannerUrl: bannerUrl || '/images/aghaaz26_poster_1784702908845.jpg',
        startDate: startDate || new Date().toISOString(),
        endDate: endDate || new Date(Date.now() + 86400000 * 2).toISOString(),
        registrationStartDate: registrationStartDate || new Date().toISOString(),
        registrationEndDate: registrationEndDate || new Date(Date.now() + 86400000 * 15).toISOString(),
        venue: venue || 'Tech X Academy, Karachi',
        mode: mode || 'In-Person (Karachi Campus)',
        maxParticipants: Number(maxParticipants) || 100,
        teamSizeLimit: Number(teamSizeLimit) || 4,
        allowTeams: allowTeams ?? true,
        prizes: prizes || [],
        rules: rules || [],
        eligibility: eligibility || [],
        tracks: tracks || [],
        timeline: timeline || [],
        status: status || 'open',
        featured: !!featured,
        organizer: organizer || 'Tech X Academy, Karachi'
      });

      res.status(201).json(created);
    } catch (err: any) {
      res.status(500).json({ error: err.message || 'Failed to create hackathon' });
    }
  });

  // 5. Admin Update Hackathon
  app.put('/api/hackathons/:id', checkAdminAuth, (req, res) => {
    try {
      const updated = db.updateHackathon(req.params.id, req.body);
      if (!updated) {
        return res.status(404).json({ error: 'Hackathon not found' });
      }
      res.json(updated);
    } catch (err: any) {
      res.status(500).json({ error: err.message || 'Failed to update hackathon' });
    }
  });

  // 6. Admin Delete Hackathon
  app.delete('/api/hackathons/:id', checkAdminAuth, (req, res) => {
    const success = db.deleteHackathon(req.params.id);
    if (!success) {
      return res.status(404).json({ error: 'Hackathon not found' });
    }
    res.json({ message: 'Hackathon deleted successfully' });
  });

  // 7. Participant Registration
  app.post('/api/registrations', (req, res) => {
    try {
      const {
        hackathonId,
        fullName,
        fatherName,
        email,
        phone,
        whatsapp,
        city,
        institution,
        courseOrMajor,
        experienceLevel,
        age,
        gender,
        teamType,
        teamName,
        roleInTeam,
        teamMembersCount,
        trackId,
        trackName,
        portfolioUrl,
        cnicOrStudentId,
        notes,
        paymentMethod,
        paymentTransactionId,
        paymentScreenshotUrl,
        consentAccepted
      } = req.body;

      // Validation
      if (!hackathonId || !fullName || !fatherName || !email || !whatsapp || !institution) {
        return res.status(400).json({ error: 'Please fill in all mandatory registration fields.' });
      }

      if (!consentAccepted) {
        return res.status(400).json({ error: 'You must agree to the Terms & Code of Conduct.' });
      }

      const hackathon = db.getHackathonById(hackathonId);
      if (!hackathon) {
        return res.status(404).json({ error: 'Selected hackathon does not exist or has been removed.' });
      }

      if (hackathon.status === 'closed' || hackathon.status === 'completed') {
        return res.status(400).json({ error: 'Registration for this hackathon is currently closed.' });
      }

      // Check Duplication
      const isDuplicate = db.checkDuplicate(hackathonId, email, whatsapp);
      if (isDuplicate) {
        return res.status(409).json({ 
          error: 'You have already registered for this hackathon using this Email or WhatsApp number!',
          duplicate: true
        });
      }

      const paymentStatus = paymentMethod === 'jazzcash' ? 'verified' : 'pending';

      const registration = db.createRegistration({
        hackathonId,
        hackathonTitle: hackathon.title,
        fullName: fullName.trim(),
        fatherName: fatherName.trim(),
        email: email.trim(),
        phone: phone ? phone.trim() : whatsapp.trim(),
        whatsapp: whatsapp.trim(),
        city: city || 'Karachi',
        institution: institution.trim(),
        courseOrMajor: courseOrMajor ? courseOrMajor.trim() : 'Graphic Design Student',
        experienceLevel: experienceLevel || 'Beginner',
        age: Number(age) || 20,
        gender: gender || 'Male',
        teamType: teamType || 'individual',
        teamName: teamName ? teamName.trim() : undefined,
        roleInTeam: roleInTeam ? roleInTeam.trim() : undefined,
        teamMembersCount: teamMembersCount ? Number(teamMembersCount) : 1,
        trackId: trackId || (hackathon.tracks && hackathon.tracks[0] ? hackathon.tracks[0].id : 'track-branding'),
        trackName: trackName || (hackathon.tracks && hackathon.tracks[0] ? hackathon.tracks[0].name : 'Graphic Design Contest'),
        portfolioUrl: portfolioUrl ? portfolioUrl.trim() : undefined,
        cnicOrStudentId: cnicOrStudentId ? cnicOrStudentId.trim() : undefined,
        notes: notes ? notes.trim() : undefined,
        paymentMethod: paymentMethod || 'campus_desk',
        paymentTransactionId: paymentTransactionId ? paymentTransactionId.trim() : undefined,
        paymentScreenshotUrl: paymentScreenshotUrl || undefined,
        paymentStatus,
        consentAccepted: true
      });

      // Construct direct wa.me link to target admin phone: +923272979729
      const encodedWaText = encodeURIComponent(registration.whatsappMessageText || '');
      const whatsappDirectUrl = `https://wa.me/${TARGET_WHATSAPP_NUMBER}?text=${encodedWaText}`;

      res.status(201).json({
        registration,
        whatsappDirectUrl,
        message: 'Registration successful! Unique Hackathon ID generated.'
      });
    } catch (err: any) {
      res.status(500).json({ error: err.message || 'Registration failed' });
    }
  });

  // 8. Lookup Participant Registration by Email/Phone/ID Code
  app.get('/api/registrations/lookup', (req, res) => {
    const { q } = req.query;
    if (!q || typeof q !== 'string' || !q.trim()) {
      return res.status(400).json({ error: 'Search query required' });
    }

    const matches = db.findRegistrationByQuery(q.trim());
    res.json(matches);
  });

  // 9. Admin View Registrations with Pagination & Search
  app.get('/api/registrations', checkAdminAuth, (req, res) => {
    const { hackathonId, status, search, page = '1', limit = '10' } = req.query;
    let list = db.getRegistrations();

    if (hackathonId && typeof hackathonId === 'string' && hackathonId !== 'all') {
      list = list.filter(r => r.hackathonId === hackathonId);
    }
    if (status && typeof status === 'string' && status !== 'all') {
      list = list.filter(r => r.status === status);
    }
    if (search && typeof search === 'string' && search.trim()) {
      const query = search.toLowerCase().trim();
      list = list.filter(r => 
        r.fullName.toLowerCase().includes(query) ||
        r.fatherName.toLowerCase().includes(query) ||
        r.email.toLowerCase().includes(query) ||
        r.phone.includes(query) ||
        r.whatsapp.includes(query) ||
        r.hackathonIdCode.toLowerCase().includes(query) ||
        (r.teamName && r.teamName.toLowerCase().includes(query)) ||
        r.institution.toLowerCase().includes(query)
      );
    }

    const total = list.length;
    const pageNum = parseInt(page as string, 10) || 1;
    const limitNum = parseInt(limit as string, 10) || 10;
    const startIndex = (pageNum - 1) * limitNum;
    const paginated = list.slice(startIndex, startIndex + limitNum);

    res.json({
      registrations: paginated,
      total,
      page: pageNum,
      totalPages: Math.ceil(total / limitNum) || 1
    });
  });

  // 10. Admin Delete Student Registration
  app.delete('/api/registrations/:id', checkAdminAuth, (req, res) => {
    const success = db.deleteRegistration(req.params.id);
    if (!success) {
      return res.status(404).json({ error: 'Registration record not found' });
    }
    res.json({ message: 'Student registration deleted successfully from database' });
  });

  // 11. Admin Export Registrations to CSV
  app.get('/api/registrations/export', checkAdminAuth, (req, res) => {
    const list = db.getRegistrations();

    const headers = [
      'Hackathon ID',
      'Hackathon Event',
      'Full Name',
      'Father Name',
      'Email',
      'Phone',
      'WhatsApp',
      'City',
      'Institution',
      'Course / Major',
      'Experience Level',
      'Team Type',
      'Team Name',
      'Track Name',
      'Status',
      'Registration Date'
    ];

    const rows = list.map(r => [
      `"${r.hackathonIdCode}"`,
      `"${r.hackathonTitle.replace(/"/g, '""')}"`,
      `"${r.fullName.replace(/"/g, '""')}"`,
      `"${r.fatherName.replace(/"/g, '""')}"`,
      `"${r.email}"`,
      `"${r.phone}"`,
      `"${r.whatsapp}"`,
      `"${r.city.replace(/"/g, '""')}"`,
      `"${r.institution.replace(/"/g, '""')}"`,
      `"${r.courseOrMajor.replace(/"/g, '""')}"`,
      `"${r.experienceLevel}"`,
      `"${r.teamType}"`,
      `"${(r.teamName || 'Individual').replace(/"/g, '""')}"`,
      `"${r.trackName.replace(/"/g, '""')}"`,
      `"${r.status}"`,
      `"${r.registrationDate}"`
    ]);

    const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', `attachment; filename=techx_arena_registrations_${Date.now()}.csv`);
    res.status(200).send(csvContent);
  });

  // 12. Admin Auth Check
  app.post('/api/admin/login', (req, res) => {
    const { password } = req.body;
    if (password === ADMIN_SECRET_KEY || password === 'techx2026@A' || password === 'techx2026' || password === 'admin123') {
      return res.json({
        success: true,
        token: 'techx_admin_token_2026',
        message: 'Admin authenticated successfully'
      });
    }
    res.status(401).json({ success: false, error: 'Invalid admin password. Access denied.' });
  });

  // 12. Admin Analytics
  app.get('/api/admin/stats', checkAdminAuth, (req, res) => {
    const hackathons = db.getHackathons();
    const regs = db.getRegistrations();

    const activeHackathons = hackathons.filter(h => h.status === 'open' || h.status === 'live').length;
    
    // Regs by hackathon
    const regMap: Record<string, number> = {};
    const trackMap: Record<string, number> = {};
    const cityMap: Record<string, number> = {};
    const statusMap: Record<string, number> = {};

    regs.forEach(r => {
      regMap[r.hackathonTitle] = (regMap[r.hackathonTitle] || 0) + 1;
      trackMap[r.trackName] = (trackMap[r.trackName] || 0) + 1;
      cityMap[r.city || 'Karachi'] = (cityMap[r.city || 'Karachi'] || 0) + 1;
      statusMap[r.status] = (statusMap[r.status] || 0) + 1;
    });

    const stats = {
      totalHackathons: hackathons.length,
      activeHackathons,
      totalRegistrations: regs.length,
      registrationsThisWeek: regs.filter(r => new Date(r.registrationDate).getTime() > Date.now() - 7 * 86400000).length,
      registrationsByHackathon: Object.entries(regMap).map(([hackathonTitle, count]) => ({ hackathonTitle, count })),
      registrationsByTrack: Object.entries(trackMap).map(([trackName, count]) => ({ trackName, count })),
      cityBreakdown: Object.entries(cityMap).map(([city, count]) => ({ city, count })),
      statusBreakdown: Object.entries(statusMap).map(([status, count]) => ({ status, count })),
      recentRegistrations: regs.slice(0, 5)
    };

    res.json(stats);
  });

  // 13. Announcements
  app.get('/api/announcements', (req, res) => {
    const { hackathonId } = req.query;
    res.json(db.getAnnouncements(hackathonId as string));
  });

  app.post('/api/announcements', checkAdminAuth, (req, res) => {
    const { hackathonId, title, content, important } = req.body;
    if (!title || !content) {
      return res.status(400).json({ error: 'Title and content required' });
    }
    const ann = db.createAnnouncement({
      hackathonId: hackathonId || 'all',
      title,
      content,
      author: 'Tech X Academy Admin',
      important: !!important
    });
    res.status(201).json(ann);
  });

  // STATIC ASSETS SERVING
  app.use('/images', express.static(path.join(process.cwd(), 'public/images')));
  app.use(express.static(path.join(process.cwd(), 'public')));

  // VITE OR STATIC MIDDLEWARE
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 Tech X Arena Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
