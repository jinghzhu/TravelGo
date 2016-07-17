'use strict';

//////////////////////////////
// Requires
//////////////////////////////
const express = require('express');
const path = require('path');

const appEnv = require('./lib/env');
const renderer = require('./lib/render');

const dataSource = require('./lib/dataSource');

//////////////////////////////
// App Variables
//////////////////////////////
const app = express();

app.engine('html', renderer);
app.set('view engine', 'html');

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'src')));

app.get('/', (req, res) => {
  res.render('index');
});

app.get('/main', (req, res) => {
  res.render('main');
});

app.get('/list', (req, res) => {
  res.render('list');
});

app.get('/map', (req, res) => {
  res.render('map');
});

//////////////////////////////
// APIs
//////////////////////////////
const router = new express.Router();
router.route('/list/:activityId').get(dataSource.getActivity);
router.route('/list/:location/:startDate/:endDate').get(dataSource.getActivities);
router.route('/routing').post(dataSource.getRouting);
app.use('/api/v1/', router);

//////////////////////////////
// Start the server
//////////////////////////////
app.listen(appEnv.port, () => {
  // Mean to console.log out, so disabling
  console.log(`Server starting on ${appEnv.url}`); // eslint-disable-line no-console
});
