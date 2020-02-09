const express = require('express');
const path = require('path');
const helmet = require('helmet');
const cors = require('cors');
const compression = require('compression');

const app = express();
const PORT = process.env.PORT || 5000;

// body parser
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// ejs view engine
app.set('view engine', 'ejs');
app.set('view options', {
  delimiter: '?',
  localsName: 'data',
  _with: false,
  compileDebug: false,
  rmWhitespace: true
});
app.set('views', path.join(__dirname, 'views'));

app.use(helmet());
app.use(cors());
app.use(compression());

// prevent scss files & sass folder
app.use('/assets', (req, res, next) => {
  if (req.path.endsWith('.scss') || req.path.endsWith('/sass'))
    res.status(404).render('404', { url: `/assets${req.path}` });
  else next();
});

// static files
app.use('/assets', express.static(path.join(__dirname, 'public')));

// favicon
app.use('/favicon.ico', (req, res) =>
  res.sendFile(path.join(__dirname, 'public', 'img', 'favicon.ico'))
);

// API route
app.use('/api', require('./routes/api'));

// home page
app.get('/', (req, res) => res.render('index'));

// not found (404)
app.use((req, res) => res.status(404).render('404', { url: req.path }));

app.listen(PORT, () =>
  console.log(
    `running on: ${
      process.env.NODE_ENV === 'development' ? `http://localhost:${PORT}` : PORT
    }`
  )
);
