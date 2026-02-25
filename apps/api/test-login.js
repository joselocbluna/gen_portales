const fetch = require('node-fetch');
fetch('http://localhost:3002/auth/login', {
  method: 'POST',
  body: JSON.stringify({ email: "admin@empresa.com", password: "admin" }),
  headers: { "Content-Type": "application/json" }
}).then(async r => console.log(r.status, await r.text()));
