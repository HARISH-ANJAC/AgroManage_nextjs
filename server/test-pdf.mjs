import http from 'http';

const req = http.request({
  hostname: 'localhost',
  port: 5000,
  path: '/api/purchase-invoices/pdf/PI%2F2026%2F03%2F001',
  method: 'GET',
}, (res) => {
  let data = '';
  res.on('data', (c) => data += c);
  res.on('end', () => console.log('STATUS:', res.statusCode, 'BODY:', data));
});
req.on('error', (e) => console.error(e));
req.end();
