const express       = require('express'),
      bodyParser    = require('body-parser'),
      session       = require('express-session'),
      massive       = require('massive'),
      cors          = require('cors'),
      passport      = require('passport'),
      Auth0Strategy = require('passport-auth0'),
      config        = require('./config'),
      port          = 3000;

let conn = massive.connectSync({
    connectionString: config.elephantSQL
});

const app = module.exports = express();

app.use(session({
    resave: true,
    saveUninitialized: true,
    secret: config.sessionSecret
}));

app.use(passport.initialize());
app.use(passport.session());
app.use(express.static(__dirname + './../public'));
app.use(cors());

app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));

app.set('db', conn);
const db = app.get('db');
const serverCtrl = require('./serverCtrl');

passport.use(new Auth0Strategy({
    domain: config.auth0.domain,
    clientID: config.auth0.clientID,
    clientSecret: config.auth0.clientSecret,
    callbackURL: '/auth/callback'
},
    function (accessToken, refreshToken, extraParams, profile, done) {
        db.get_user([profile.id], function (err, user) {
            user = user[0];
            if (!user) {
                console.log('CREATING USER');
                db.create_user([profile.name.givenName, profile.emails[0].value, profile.picture, profile.id], function (err, user) {
                    console.log('USER CREATED', user);
                    return done(err, user[0]);
                })
            } else {
                console.log('FOUND USER', user);
                return done(err, user);
            }
        })
    }
));

//THIS IS INVOKED ONE TIME TO SET THINGS UP
passport.serializeUser(function (userA, done) {
    console.log('serializing', userA);
    var userB = userA;
    done(null, userB); //PUTS 'USER' ON THE SESSION
});

//USER COMES FROM SESSION - THIS IS INVOKED FOR EVERY ENDPOINT
passport.deserializeUser(function (userB, done) {
    var userC = userB;
    done(null, userC); //PUTS 'USER' ON REQ.USER
});

app.get('/auth', passport.authenticate('auth0'));
app.get('/auth/callback',
  passport.authenticate('auth0', {successRedirect: '/#!/projects', failureRedirect: '/#!/'}), function(req, res) {
    res.status(200).send(req.user);
});

app.get('/auth/me', function(req, res) {
  if (!req.user) return res.sendStatus(404);
  res.status(200).send(req.user);
});

app.get('/auth/logout', function(req, res) {
  req.logout();
  res.redirect('/');
});

// ENDPOINTS
app.get("/api/projects/:id", serverCtrl.getProjects);
app.post("/api/projects", serverCtrl.createProject);
app.put("/api/project", serverCtrl.updateProject);
app.put("/api/project/fav", serverCtrl.updateFav);
app.delete("/api/projects/:wf_id", serverCtrl.deleteProject);

app.listen(port, () => console.log('Wireframe app is wired on port:', port));