/**
 * AuthController
 *
 * @description :: Server-side logic for managing auths
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

var request = require('request'); // "Request" library
var querystring = require('querystring');
var stateKey = 'spotify_auth_state';
var client_id = 'e90f69e4b8264e04baddd7b7973575ad'; // Your client id
var client_secret = '1020e38a5c284be1b4bdbf3c58d97781'; // Your client secret
var redirect_uri = 'http://localhost:1337/callback'; // Your redirect uri

var SpotifyWebApi = require('spotify-web-api-node');

// credentials are optional
var spotifyApi = new SpotifyWebApi({
    clientId : client_id,
    clientSecret : client_secret,
    redirectUri : redirect_uri
});

/**
 * Generates a random string containing numbers and letters
 * @param  {number} length The length of the string
 * @return {string} The generated string
 */
var generateRandomString = function(length) {
    var text = '';
    var possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

    for (var i = 0; i < length; i++) {
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
};

module.exports = {
	


  /**
   * `AuthController.login()`
   */
  login: function (req, res) {
      var state = generateRandomString(16);
      res.cookie(stateKey, state);

      // your application requests authorization
      var scope = 'user-read-private user-read-email';
      res.redirect('https://accounts.spotify.com/authorize?' +
          querystring.stringify({
              response_type: 'code',
              client_id: client_id,
              scope: scope,
              redirect_uri: redirect_uri,
              state: state
          }));
  },


  /**
   * `AuthController.callback()`
   */
  callback: function (req, res) {
      // your application requests refresh and access tokens
      // after checking the state parameter

      var code = req.query.code || null;
      var state = req.query.state || null;
      var storedState = req.cookies ? req.cookies[stateKey] : null;

      if (state === null || state !== storedState) {
          res.redirect('/#' +
              querystring.stringify({
                  error: 'state_mismatch'
              }));
      } else {
          res.clearCookie(stateKey);
          var authOptions = {
              url: 'https://accounts.spotify.com/api/token',
              form: {
                  code: code,
                  redirect_uri: redirect_uri,
                  grant_type: 'authorization_code'
              },
              headers: {
                  'Authorization': 'Basic ' + (new Buffer(client_id + ':' + client_secret).toString('base64'))
              },
              json: true
          };

          request.post(authOptions, function(error, response, body) {
              if (!error && response.statusCode === 200) {

                  var access_token = body.access_token;
                  var refresh_token = body.refresh_token;

                  var options = {
                      url: 'https://api.spotify.com/v1/me',
                      headers: { 'Authorization': 'Bearer ' + access_token },
                      json: true
                  };

                  // use the access token to access the Spotify Web API
                  request.get(options, function(error, response, body) {
                      req.session.user = body;
                  });

                  // we can also pass the token to the browser to make requests from there
                  res.redirect('/app');
              } else {
                  res.redirect('/#' +
                      querystring.stringify({
                          error: 'invalid_token'
                      }));
              }
          });
      }
  },


  /**
   * `AuthController.refresh_token()`
   */
  refresh_token: function (req, res) {
    return res.json({
      todo: 'refresh_token() is not implemented yet!'
    });
  }
};

