const http = require('http');

const options = {
  hostname: 'localhost',
  port: 5000,
  path: '/properties',
  method: 'GET'
};

const req = http.request(options, (res) => {
  let data = '';
  res.on('data', (chunk) => {
    data += chunk;
  });
  res.on('end', () => {
    const properties = JSON.parse(data);
    console.log("Total properties:", properties.length);
    properties.forEach(p => {
        console.log(`ID: ${p.id} | Title: ${p.title} | Image: ${p.image ? 'Present' : 'MISSING'} | Gallery: ${p.gallery ? p.gallery.length : 0} items`);
        if (p.title.toLowerCase().includes('atp')) {
             // console.log(JSON.stringify(p, null, 2));
        }
    });
  });
});

req.on('error', (error) => {
  console.error(error);
});

req.end();