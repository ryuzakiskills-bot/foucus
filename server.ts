import express from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import crypto from 'crypto';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DB_PATH = path.join(__dirname, 'data', 'db.json');

// Ensure data directory exists
if (!fs.existsSync(path.join(__dirname, 'data'))) {
  fs.mkdirSync(path.join(__dirname, 'data'));
}

// Initial DB structure
const initialDB = {
  users: [
    {
      id: 'admin-1',
      name: 'System Admin',
      email: 'admin@focusflow.app',
      password: 'admin', // In a real app, this would be hashed
      role: 'admin',
      is_approved: true,
      created_at: new Date().toISOString()
    }
  ],
  invitations: [
    {
      id: crypto.randomUUID(),
      email: 'user@example.com',
      token: 'WELCOME-2024',
      role: 'user',
      expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
      used: false,
      created_at: new Date().toISOString()
    }
  ]
};

if (!fs.existsSync(DB_PATH)) {
  fs.writeFileSync(DB_PATH, JSON.stringify(initialDB, null, 2));
}

function getDB() {
  return JSON.parse(fs.readFileSync(DB_PATH, 'utf-8'));
}

function saveDB(db: any) {
  fs.writeFileSync(DB_PATH, JSON.stringify(db, null, 2));
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API Routes
  app.post('/api/auth/register', (req, res) => {
    const { name, email, password, token } = req.body;
    const db = getDB();

    const invitation = db.invitations.find((i: any) => i.token === token);

    if (!invitation) {
      return res.status(403).json({ message: 'Access Denied – Invitation Required' });
    }

    if (invitation.used) {
      return res.status(403).json({ message: 'Invitation already used' });
    }

    if (new Date(invitation.expires_at) < new Date()) {
      return res.status(403).json({ message: 'Invitation expired' });
    }

    if (invitation.email !== email) {
      return res.status(403).json({ message: 'Email does not match invitation' });
    }

    // Create user
    const newUser = {
      id: crypto.randomUUID(),
      name,
      email,
      password, // In a real app, this would be hashed
      role: invitation.role || 'user',
      is_approved: true,
      created_at: new Date().toISOString()
    };

    db.users.push(newUser);
    invitation.used = true;
    saveDB(db);

    const { password: _, ...userWithoutPassword } = newUser;
    res.json(userWithoutPassword);
  });

  app.post('/api/auth/login', (req, res) => {
    const { email, password } = req.body;
    const db = getDB();

    const user = db.users.find((u: any) => u.email === email && u.password === password);

    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    if (!user.is_approved) {
      return res.status(403).json({ message: 'Account disabled. Please contact admin.' });
    }

    const { password: _, ...userWithoutPassword } = user;
    res.json(userWithoutPassword);
  });

  // Admin Routes Middleware
  const adminOnly = (req: any, res: any, next: any) => {
    const userId = req.headers['x-user-id'];
    if (!userId) return res.status(401).json({ message: 'Unauthorized' });

    const db = getDB();
    const user = db.users.find((u: any) => u.id === userId);

    if (!user || user.role !== 'admin') {
      return res.status(403).json({ message: 'Forbidden' });
    }
    next();
  };

  app.get('/api/admin/users', adminOnly, (req, res) => {
    const db = getDB();
    res.json(db.users.filter((u: any) => !u.is_deleted).map(({ password, ...u }: any) => u));
  });

  app.post('/api/admin/users/:id/approve', adminOnly, (req, res) => {
    const { id } = req.params;
    const { is_approved } = req.body;
    const db = getDB();
    const user = db.users.find((u: any) => u.id === id);
    if (user) {
      user.is_approved = is_approved;
      saveDB(db);
      res.json(user);
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  });

  app.post('/api/admin/users/:id/role', adminOnly, (req, res) => {
    const { id } = req.params;
    const { role } = req.body;
    const db = getDB();
    const user = db.users.find((u: any) => u.id === id);
    if (user) {
      user.role = role;
      saveDB(db);
      res.json(user);
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  });

  app.delete('/api/admin/users/:id', adminOnly, (req, res) => {
    const { id } = req.params;
    const db = getDB();
    const user = db.users.find((u: any) => u.id === id);
    if (user) {
      user.is_deleted = true;
      saveDB(db);
      res.json({ message: 'User soft-deleted' });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  });

  app.get('/api/admin/invitations', adminOnly, (req, res) => {
    const db = getDB();
    res.json(db.invitations);
  });

  app.post('/api/admin/invitations', adminOnly, (req, res) => {
    const { email, role, expires_in_days } = req.body;
    const db = getDB();
    const newInvitation = {
      id: crypto.randomUUID(),
      email,
      token: crypto.randomBytes(4).toString('hex').toUpperCase(),
      role: role || 'user',
      expires_at: new Date(Date.now() + (expires_in_days || 7) * 24 * 60 * 60 * 1000).toISOString(),
      used: false,
      created_at: new Date().toISOString()
    };
    db.invitations.push(newInvitation);
    saveDB(db);
    res.json(newInvitation);
  });

  app.delete('/api/admin/invitations/:id', adminOnly, (req, res) => {
    const { id } = req.params;
    const db = getDB();
    db.invitations = db.invitations.filter((i: any) => i.id !== id);
    saveDB(db);
    res.json({ message: 'Invitation revoked' });
  });

  app.get('/api/admin/stats', adminOnly, (req, res) => {
    const db = getDB();
    res.json({
      totalUsers: db.users.length,
      activeUsers: db.users.filter((u: any) => u.is_approved).length,
      totalInvitations: db.invitations.length,
      usedInvitations: db.invitations.filter((i: any) => i.used).length
    });
  });

  // Vite middleware for development
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
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
