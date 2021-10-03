const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20");
const FacebookStrategy = require("passport-facebook");
const KEYS = require("./keys");

// set cookie base on this user
passport.serializeUser((user, done) => {
  let sessionUser = {
    _id: user.googleID,
    accessToken: user.accesstoken,
    name: user.name,
    pic_url: user.pic_url,
    email: user.email,
  };
  done(null, sessionUser);
});

// get cookie & get relevent session data
passport.deserializeUser((sessionUser, done) => {
  done(null, sessionUser); // now can access request.user
});

passport.use(
  // google login
  new GoogleStrategy(
    // google keys
    {
      clientID: KEYS.googleOauth.clientID,
      clientSecret: KEYS.googleOauth.clientSecret,
      callbackURL: KEYS.googleOauth.callback,
      passReqToCallback: true,
    },
    (request, accessToken, refreshToken, profile, done) => {
      //save data in session
      user = {
        accesstoken: accessToken,
        googleId: profile.id,
        name: profile.displayName,
        pic_url: profile._json.picture,
        email: profile._json.email,
      };
      done(null, user);
    }
  )
);
// facebook login
passport.use(
  new FacebookStrategy(
    {
      clientID: KEYS.clientID_FB,
      clientSecret: KEYS.clientSecret_FB,
      callbackURL: "http://localhost:3000/auth/facebook/redirect",
      profileFields: [
        "id",
        "displayName",
        "name",
        "gender",
        "picture.type(large)",
        "email",
      ],
    },
    function (accessToken, refreshToken, profile, done) {
      user = {
        accesstoken: accessToken,
        facebookID: profile.id,
        name: profile.displayName,
        pic_url: profile._json.picture.data.url,
        email: profile._json.email,
        firstName: profile._json.first_name,
        lastName: profile._json.last_name,
      };
      console.log(user);
      return done(null, user);
    }
  )
);
