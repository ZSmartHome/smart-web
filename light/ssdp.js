// SSDP protocol in action example

const ssdp = require('ssdp2')({
  port: 1982
});

const start = Date.now();
ssdp.on('response', function(response){
  console.log(response);
  console.log(`Answered in: ${Date.now() - start}ms`);
});

ssdp.search('wifi_bulb');