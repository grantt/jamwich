/**
 * AuthController
 *
 * @description :: Server-side logic for managing auths
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

var request = require('request'); // "Request" library
var querystring = require('querystring');

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
      res.cookie(Spotify.state_key, state);

      res.redirect('https://accounts.spotify.com/authorize?' +
          querystring.stringify({
              response_type: 'code',
              client_id: Spotify.credentials.client_id,
              scope: Spotify.scope,
              redirect_uri: Spotify.redirect_uri,
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
      var storedState = req.cookies ? req.cookies[Spotify.state_key] : null;

      if (state === null || state !== storedState) {
          res.redirect('/#' +
              querystring.stringify({
                  error: 'state_mismatch'
              }));
      } else {
          res.clearCookie(Spotify.state_key);
          var authOptions = {
              url: 'https://accounts.spotify.com/api/token',
              form: {
                  code: code,
                  redirect_uri: Spotify.redirect_uri,
                  grant_type: 'authorization_code'
              },
              headers: {
                  'Authorization': 'Basic ' + (new Buffer(Spotify.credentials.client_id + ':' + Spotify.credentials.client_secret).toString('base64'))
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
                      // Redirect the user to the app
                      res.redirect('/app');
                  });
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

