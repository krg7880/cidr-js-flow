var noflo = require('noflo');
var long2ip = require('long2ip');

/**
 * Returns the IP range (start & end)
 * for a given IP/CIDR
 * @param ip
 * @returns {Object}
 */
exports.getComponent = function () {
  var c = new noflo.Component();

  c.inPorts.add('in', function (event, payload) {
    if (event !== 'data') {
      return;
    }
    
    if ((payload.indexOf('/')) < 0) {
      console.log('Sending out out');
      return c.outPorts.out.send(new Error('Invalid ips'));
    }
    
    var range = {};
    
    var parts = payload.split('/');
    
    if (parts[1] > 32) {
      console.log('Sending out out');
      return c.outPorts.out.send(new Error('Invalid ip'));
    }
    
    range.start = long2ip((ip2long(parts[0])) & ((-1 << (32 - +parts[1]))));
    range.end = long2ip((ip2long(parts[0])) + math.pow(2, (32 - +parts[1])) - 1); 
    
    // Do something with the packet, then
    console.log('Sending out out 3');
    c.outPorts.out.send(range);
  });
  c.outPorts.add('out');
  return c;
};