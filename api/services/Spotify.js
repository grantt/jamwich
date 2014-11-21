// Spotify.js - in api/services

var SpotifyWebApi = require('spotify-web-api-node');

exports.credentials = {
    client_id: 'e90f69e4b8264e04baddd7b7973575ad',
    client_secret: '1020e38a5c284be1b4bdbf3c58d97781'
};

exports.redirect_uri = 'http://localhost:1337/callback';
exports.state_key = 'spotify_auth_state';
exports.scope = 'user-read-private user-read-email';

exports.api = new SpotifyWebApi({
    clientId : exports.credentials.client_id,
    clientSecret : exports.credentials.client_secret,
    redirectUri : exports.redirect_uri
});