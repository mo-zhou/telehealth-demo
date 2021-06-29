require("dotenv").config();

const http = require("http");
const express = require("express");
const path = require("path");
const app = express();

// use passport to do a log in page
const passport = require('passport');
const Strategy = require('passport-local').Strategy;
const db = require('./db');

// add some log in page protection
passport.use(new Strategy(
  function(username, password, cb) {
    db.users.findByUsername(username, function(err, user) {
      if (err) { return cb(err); }
      if (!user) { return cb(null, false); }
      if (user.password != password) { return cb(null, false); }
      return cb(null, user);
    });
  }));

passport.serializeUser(function(user, cb) {
  cb(null, user.id);
});

passport.deserializeUser(function(id, cb) {
  db.users.findById(id, function (err, user) {
    if (err) { return cb(err); }
    cb(null, user);
  });
});

// Configure view engine to render EJS templates.

app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

// Use application-level middleware for common functionality, including
// logging, parsing, and session handling.
app.use(require('morgan')('combined'));
app.use(require('cookie-parser')());
app.use(require('body-parser').urlencoded({ extended: true }));
app.use(require('express-session')({ secret: 'keyboard cat', resave: false, saveUninitialized: false }));
// Initialize Passport and restore authentication state, if any, from the
// session.
app.use(passport.initialize());
app.use(passport.session());
app.use(express.static(path.join(__dirname)));


app.get('/',
  function(req, res){
    res.render('index');
  });


// patient login
app.post('/patientlogin',
  passport.authenticate('local', { successRedirect: '/patientloggedin',
                                   failureRedirect: '/patientlogin',
                                   failureFlash: true })
);

app.get('/patientlogin',
  function(req, res){
    res.render('patientlogin');
  });

app.get('/patientloggedin',
  function (req, res) {
    res.render('patienthome',{ user: req.user });
  })
  
app.post('/patientlogin', 
  passport.authenticate('local', { failureRedirect: '/patientlogin' }),
  function(req, res) {
    res.redirect('/patient');
  });
  
app.get('/patientlogout',
  function(req, res){
    req.logout();
    res.redirect('/patientlogin');
  });

app.get('/patient',
  require('connect-ensure-login').ensureLoggedIn('/patientlogin'),
  function(req, res){
    res.sendFile(path.join(__dirname + '/public/patient.html'));

  });

// provider login
app.post('/providerlogin',
  passport.authenticate('local', { successRedirect: '/providerloggedin',
                                   failureRedirect: '/providerlogin',
                                   failureFlash: true })
);
app.get('/providerlogin',
  function(req, res){
    res.render('providerlogin');
  });

app.get('/providerloggedin',
  function (req, res) {
    res.render('providerhome',{ user: req.user });
  })
  
app.post('/providerlogin', 
  passport.authenticate('local', { failureRedirect: '/providerlogin' }),
  function(req, res) {
    res.redirect('/provider');
  });
  
app.get('/providerlogout',
  function(req, res){
    req.logout();
    res.redirect('/providerlogin');
  });

app.get('/provider',
  require('connect-ensure-login').ensureLoggedIn('providerlogin'),
  function(req, res){
    res.sendFile(path.join(__dirname + '/public/provider.html'));

  });

// done with the log in page
// intiatilize the actual telhealth demo 

const client = require('twilio')(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);

const AccessToken = require("twilio").jwt.AccessToken;
const VideoGrant = AccessToken.VideoGrant;
const ROOM_NAME = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15); //unique uuid each room name

app.get("/generateRoomName", function (request, response) {

response.send({ROOM_NAME}); // send the unique room name for client-side consumption

});

app.post('/api/messages', (req, res) => {

  const baseUrl = process.env.INVITE_BASE_URL;
  const url = `${baseUrl}`+`/${ROOM_NAME}/thirdParty`;
  res.header('Content-Type', 'application/json');

  client.messages
    .create({
      from: process.env.TWILIO_PHONE_NUMBER,
      to:req.body.phoneNumber,
      body: `please join the telehealth visit at ${url}`
    })
    .then(() => {
      res.send({message: `successfully sent an invitation to ${req.body.phoneNumber}`});
    })
    .catch(err => {
      console.log(err);
      res.send({message: `error message: ${err}`});
    });
});

// Max. period that a Participant is allowed to be in a Room (currently 14400 seconds or 4 hours)
const MAX_ALLOWED_SESSION_DURATION = 3600; // assume a demo lasts no longer than 1 hour
const providerPath = path.join(__dirname, "./public/provider.html");
app.use("/provider", express.static(providerPath));

const patientPath = path.join(__dirname, "./public/patient.html");
app.use("/patient", express.static(patientPath));

const thirdPartyPath = path.join(__dirname, "./public/thirdParty.html");
app.use(`/${ROOM_NAME}/thirdParty`, express.static(thirdPartyPath));


app.use(express.static(__dirname + "/public"));

app.get("/token", function (request, response) {
 const identity = request.query.identity;

 // Create an access token which we will sign and return to the client,
 // containing the grant we just created.

 const token = new AccessToken(
   process.env.TWILIO_ACCOUNT_SID,
   process.env.TWILIO_API_KEY,
   process.env.TWILIO_API_SECRET,
   { ttl: MAX_ALLOWED_SESSION_DURATION }
 );

 // Assign the generated identity to the token.
 token.identity = identity;

 // Grant the access token Twilio Video capabilities.
 const grant = new VideoGrant({ room: ROOM_NAME });
 token.addGrant(grant);

 // Serialize the token to a JWT string and include it in a JSON response.
 response.send({
   identity: identity,
   token: token.toJwt(),
 });
});

let server = http.createServer(app);
let port = process.env.PORT || 3000;
server.listen(port, () => {
  console.log(`Express Server listening on *:${port}`);
});``