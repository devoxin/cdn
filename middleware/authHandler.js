const { discord, server } = require('../config.json');
const express = require('express');
const snekfetch = require('snekfetch'); /** @TODO bad */
const jwt = require('jsonwebtoken');

const handler = express.Router();
const CLIENT_ID = discord.client_id;
const CLIENT_SECRET = discord.client_secret;
const REDIRECT_URL = process.platform === 'win32' ? 'http://localhost:9004/auth/handshake' : 'LIVE DOMAIN';
const API_URL = 'https://discordapp.com/api/v8';
const DISCORD_URL = `https://discordapp.com/api/oauth2/authorize?client_id=${CLIENT_ID}&redirect_uri=${encodeURIComponent(REDIRECT_URL)}&response_type=code&scope=identify&prompt=none`;

function sign (content, key, options = {}) {
  return new Promise((resolve, reject) => {
    jwt.sign(content, key, options, (err, token) => {
      if (err) {
        reject(err);
      } else {
        resolve(token);
      }
    });
  });
}

function verify (token, key, options = {}) {
  return new Promise((resolve, reject) => {
    jwt.verify(token, key, options, (err, decoded) => {
      if (err) {
        reject(err);
      } else {
        resolve(decoded);
      }
    });
  });
}

async function getUser (req, res, next) {
  const { cdn } = req.cookies;
  req.user = await verify(cdn, server.seed).catch(() => ({}));
  next();
}

handler.get('/login', (req, res) => {
  res.redirect(DISCORD_URL);
});

handler.get('/handshake', async (req, res) => {
  const { code } = req.query;

  if (!code) {
    return res.redirect('/');
  }

  const auth = await snekfetch.post(`${API_URL}/oauth2/token`)
    .set('Content-Type', 'application/x-www-form-urlencoded')
    .set('User-Agent', 'cdn (https://github.com/devoxin/cdn, v1)') /** @TODO proper versioning. Pull from package.json? */
    .send({
      client_id: CLIENT_ID,
      client_secret: CLIENT_SECRET,
      grant_type: 'authorization_code',
      code,
      redirect_uri: REDIRECT_URL,
      scope: 'identify'
    })
    .catch(e => console.log(e));

  if (!auth) {
    console.log('no auth');
    return res.redirect('/');
  }

  const currentUser = await snekfetch.get(`${API_URL}/users/@me`)
    .set('Authorization', `Bearer ${auth.body.access_token}`)
    .then(r => r.body)
    .catch(() => null);

  if (!currentUser) {
    console.log('no current user');
    return res.redirect('/');
  }

  const webToken = await sign(currentUser, server.seed);

  if (!webToken) {
    console.log('no web token');
    return res.redirect('/');
  }

  res
    .cookie('cdn', webToken, { maxAge: 604800000 })
    .redirect('/');
});

handler.get('/logout', (req, res) => {
  res
    .cookie('cdn', '', { expires: new Date() })
    .redirect('/');
});

module.exports = {
  name: 'AuthHandler',
  options: {},
  getUser, handler,  /** This ugly mess isn't permanent, dw. @TODO */
  setup: (server) => {
    server.use(getUser);
    server.use('/auth', handler);
  }
};
