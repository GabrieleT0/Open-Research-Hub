const { timingSafeEqual } = require('node:crypto');

const allowedDomains = new Set([
  'osu.cz', 'usv.ro', 'usm.ro', 'unic.ac.cy', 'oru.se', 'svako.lt',
  'ujaen.es', 'univ-tours.fr', 'uni-bielefeld.de', 'unisa.it', 'osu.eu',
  'inrae.fr', 'cnrs.fr', 'inserm.fr', 'sumdu.edu.ua', 'kubg.edu.ua',
]);

function authMode() {
  const mode = (process.env.AUTH_MODE || 'otp').toLowerCase();
  if (!['otp', 'shibboleth'].includes(mode)) {
    throw new Error('AUTH_MODE must be otp or shibboleth');
  }
  return mode;
}

function allowedEmail(value) {
  if (typeof value !== 'string' || value.includes(',') || value.includes('\n')) return null;
  const email = value.trim().toLowerCase();
  if (!/^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/.test(email)) return null;
  return allowedDomains.has(email.split('@')[1]) ? email : null;
}

function proxySecretMatches(value) {
  const expected = process.env.SHIBBOLETH_PROXY_SECRET;
  if (!expected || typeof value !== 'string') return false;
  const a = Buffer.from(value);
  const b = Buffer.from(expected);
  return a.length === b.length && timingSafeEqual(a, b);
}

module.exports = { authMode, allowedEmail, proxySecretMatches };
