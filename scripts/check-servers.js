const http = require('http');
const urls = ['http://localhost:5000/', 'http://localhost:5173/'];

urls.forEach(url => {
  http.get(url, res => {
    let data = '';
    res.on('data', c => data += c);
    res.on('end', () => {
      console.log(`GET ${url} -> ${res.statusCode}`);
      console.log(data.substring(0, 200));
      console.log('---');
    });
  }).on('error', err => {
    console.error(`GET ${url} -> ERROR: ${err.message}`);
  });
});
