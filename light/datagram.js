const dgram = require(`dgram`);
const s = dgram.createSocket(`udp4`);

// Listen to lamp
// See @docs http://www.yeelight.com/download/Yeelight_Inter-Operation_Spec.pdf

const PORT = 1982;
const MULTICAST_ADDRESS = '239.255.255.250';

s.on(`message`, function(msg, rinfo) {
  console.log(`I got this message: ` + msg.toString());
  console.log(`Rinfo: ${rinfo}`);
});

s.bind(PORT, function() {
  this.setBroadcast(true);
  this.addMembership(MULTICAST_ADDRESS);
});
