const express = require('express');
const cors = require('cors');
const session = require('express-session');
const mysql = require('mysql2');
const fs = require('fs');
const path = require('path');
const multer = require('multer');

const app = express();
const PORT = `8081`;

app.use(express.json());

app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true,
}));

app.use(session({
  secret: 'secret',
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: false,
    httpOnly: true,
    maxAge: 24 * 60 * 60 * 1000,
  },
}));

let db;

// Initial connection (without DB) for migration
const migrationDb = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'StrongRoot@123',
  multipleStatements: true,
});

migrationDb.connect(err => {
  if (err) {
    console.error('❌ Error connecting to MySQL:', err);
    process.exit(1);
  }

  console.log('✅ Connected to MySQL');
  const migrationSQL = fs.readFileSync(path.join(__dirname, 'migrations/init.sql'), 'utf8');

  migrationDb.query(migrationSQL, err => {
    if (err) {
      console.error('❌ Migration failed:', err.message);
      process.exit(1);
    }

    console.log('✅ Migration completed');
    migrationDb.end();
    connectToAppDb(); 
  });
});

// Connect to app DB after migration
function connectToAppDb() {
  db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'StrongRoot@123',
    database: 'Crud',
  });

  db.connect(err => {
    if (err) {
      console.error('❌ DB connection error:', err);
      process.exit(1);
    }

    console.log('✅ Connected to Crud database');
    startServer();
  });
}

// Authentication middleware
function requireAuth(req, res, next) {
  if (!req.session.user) {
    return res.status(401).json({ 
      status: 'error', 
      message: 'Authentication required. Please log in.' 
    });
  }
  next();
}

// Multer configuration with better error handling
const upload = multer({
  storage: multer.diskStorage({
    destination: function (req, file, cb) {
      const uploadDir = path.join(__dirname, 'uploads');
      // Create directory if it doesn't exist
      if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
      }
      cb(null, uploadDir);
    },
    filename: function (req, file, cb) {
      const uniqueName = `${Date.now()}-${Math.round(Math.random() * 1E9)}-${file.originalname}`;
      cb(null, uniqueName);
    },
  }),
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
  fileFilter: (req, file, cb) => {
    // Allow only image files
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'));
    }
  }
});

// Posts endpoint with authentication and proper validation
app.post('/api/posts', requireAuth, upload.single('photo'), (req, res) => {
  console.log('📝 Request body:', req.body);
  console.log('📷 Uploaded file:', req.file);
  console.log('👤 Session user:', req.session.user);

  const {
    title,
    category,
    conditions,
    description,
    location,
    price,
    negotiable,
  } = req.body;

  // Validate required fields based on your schema
  if (!title || !category || !conditions || !description || !price) {
    return res.status(400).json({ 
      status: 'error', 
      message: 'Title, category, conditions, description, and price are required' 
    });
  }

  // Check if photo is uploaded (required by your schema)
  if (!req.file) {
    return res.status(400).json({ 
      status: 'error', 
      message: 'Photo is required' 
    });
  }

  const photo = req.file.filename;
  const user_id = req.session.user.id; // Get user_id from session

  const sql = `
    INSERT INTO posts (user_id, title, category, conditions, description, location, price, negotiable, photo)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;

  const values = [
    user_id,
    title, 
    category, 
    conditions, 
    description, 
    location, 
    parseFloat(price), 
    negotiable === 'true', 
    photo
  ];

  console.log('📊 SQL values:', values);

  db.query(sql, values, (err, result) => {
    if (err) {
      console.error('❌ DB error details:', err);
      return res.status(500).json({ 
        status: 'error', 
        message: 'Failed to create post',
        error: process.env.NODE_ENV === 'development' ? err.message : 'Database error'
      });
    }

    console.log('✅ Post created successfully:', result);
    return res.json({ 
      status: 'success', 
      message: 'Post created successfully',
      postId: result.insertId
    });
  });
});

// Get all posts endpoint
app.get('/api/posts', (req, res) => {
  const sql = `
    SELECT p.*, l.fname as author_name, l.username as author_username
    FROM posts p
    JOIN login l ON p.user_id = l.id
    ORDER BY p.created_at DESC
  `;

  db.query(sql, (err, results) => {
    if (err) {
      console.error('❌ Error fetching posts:', err);
      return res.status(500).json({ 
        status: 'error', 
        message: 'Failed to fetch posts' 
      });
    }

    return res.json({ 
      status: 'success', 
      posts: results 
    });
  });
});

// Get user's posts endpoint
app.get('/api/posts/my', requireAuth, (req, res) => {
  const user_id = req.session.user.id;
  
  const sql = `
    SELECT * FROM posts 
    WHERE user_id = ? 
    ORDER BY created_at DESC
  `;

  db.query(sql, [user_id], (err, results) => {
    if (err) {
      console.error('❌ Error fetching user posts:', err);
      return res.status(500).json({ 
        status: 'error', 
        message: 'Failed to fetch your posts' 
      });
    }

    return res.json({ 
      status: 'success', 
      posts: results 
    });
  });
});

// Static file serving for uploads
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Login
app.post('/login', (req, res) => {
  const { fname, username, password } = req.body;

  if (!fname || !username || !password) {
    return res.status(400).json({ status: 'error', message: 'All fields are required' });
  }

  const sql = 'SELECT * FROM login WHERE fname = ? AND username = ? AND password = ?';
  db.query(sql, [fname, username, password], (err, data) => {
    if (err) {
      console.error('❌ Login DB error:', err);
      return res.status(500).json({ status: 'error', message: 'Database error' });
    }

    if (data.length > 0) {
      const user = data[0];
      req.session.user = { id: user.id, fname: user.fname, username: user.username };
      console.log('✅ User logged in:', req.session.user);
      return res.json({ status: 'success', user: req.session.user });
    } else {
      return res.status(401).json({ status: 'no_record', message: 'Invalid credentials' });
    }
  });
});

// Register
app.post('/register', (req, res) => {
  const { fname, username, password } = req.body;

  if (!fname || !username || !password) {
    return res.status(400).json({ status: 'error', message: 'All fields are required' });
  }

  // Basic validation
  if (password.length < 6) {
    return res.status(400).json({ status: 'error', message: 'Password must be at least 6 characters' });
  }

  const check = 'SELECT * FROM login WHERE username = ?';
  db.query(check, [username], (err, results) => {
    if (err) {
      console.error('❌ Register check DB error:', err);
      return res.status(500).json({ status: 'error', message: 'Database error' });
    }

    if (results.length > 0) {
      return res.status(409).json({ status: 'exists', message: 'Username already exists' });
    }

    const insert = 'INSERT INTO login (fname, username, password) VALUES (?, ?, ?)';
    db.query(insert, [fname, username, password], (err, result) => {
      if (err) {
        console.error('❌ Register insert DB error:', err);
        return res.status(500).json({ status: 'error', message: 'Failed to create account' });
      }
      
      console.log('✅ User registered:', { id: result.insertId, fname, username });
      return res.json({ status: 'success', message: 'User registered successfully' });
    });
  });
});

// Logout endpoint
app.post('/logout', (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).json({ status: 'error', message: 'Failed to logout' });
    }
    res.clearCookie('connect.sid'); // Clear session cookie
    return res.json({ status: 'success', message: 'Logged out successfully' });
  });
});

// Auth status
app.get('/api/auth/status', (req, res) => {
  if (req.session.user) {
    return res.json({ authenticated: true, user: req.session.user });
  } else {
    return res.json({ authenticated: false });
  }
});

// Error handling middleware for multer
app.use((error, req, res, next) => {
  if (error instanceof multer.MulterError) {
    if (error.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({
        status: 'error',
        message: 'File too large. Maximum size is 5MB'
      });
    }
    return res.status(400).json({
      status: 'error',
      message: `Upload error: ${error.message}`
    });
  }
  
  if (error.message === 'Only image files are allowed') {
    return res.status(400).json({
      status: 'error',
      message: error.message
    });
  }
  
  next(error);
});

// Global error handler
app.use((err, req, res, next) => {
  console.error('❌ Unhandled error:', err);
  res.status(500).json({
    status: 'error',
    message: 'Internal server error'
  });
});

// Start server
function startServer() {
  app.listen(PORT, () => {
    console.log(`🚀 Server is running at http://localhost:${PORT}`);
  });
}