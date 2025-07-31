const express = require('express');
const cors = require('cors');
const session = require('express-session');
const mysql = require('mysql2');
const fs = require('fs');
const path = require('path');

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
    connectToAppDb(); // Continue with app
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

// Login
app.post('/login', (req, res) => {
  const { fname, username, password } = req.body;

  if (!fname || !username || !password) {
    return res.json({ status: 'error', message: 'All fields are required' });
  }

  const sql = 'SELECT * FROM login WHERE fname = ? AND username = ? AND password = ?';
  db.query(sql, [fname, username, password], (err, data) => {
    if (err) return res.json({ status: 'error', message: 'DB error' });

    if (data.length > 0) {
      const user = data[0];
      req.session.user = { id: user.id, fname: user.fname, username: user.username };
      return res.json({ status: 'success', user: req.session.user });
    } else {
      return res.json({ status: 'no_record', message: 'Invalid credentials' });
    }
  });
});

// Register
app.post('/register', (req, res) => {
  const { fname, username, password } = req.body;

  if (!fname || !username || !password) {
    return res.json({ status: 'error', message: 'All fields are required' });
  }

  const check = 'SELECT * FROM login WHERE username = ?';
  db.query(check, [username], (err, results) => {
    if (err) return res.json({ status: 'error', message: 'DB error' });

    if (results.length > 0) {
      return res.json({ status: 'exists', message: 'User already exists' });
    }

    const insert = 'INSERT INTO login (fname, username, password) VALUES (?, ?, ?)';
    db.query(insert, [fname, username, password], err => {
      if (err) return res.json({ status: 'error', message: 'Insert error' });
      return res.json({ status: 'success', message: 'User registered' });
    });
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

// Start server
function startServer() {
  app.listen(PORT, () => {
    console.log(`🚀 Server is running at http://localhost:${PORT}`);
  });
}
