var noflo = require('noflo');
var long2ip = require('long2ip');
var noflo = require("noflo");

/**
 * Returns the IP range (start & end)
 * for a given IP/CIDR
 * @param ip
 * @returns {Object}
 */
exports.getComponent = function() {
  var component = new noflo.Component();
  component.description = "Filters the given IP into CIDR blocks";

  // Register ports and event handlers
  component.inPorts.add('in', { datatype: 'array' }, function(event, payload) {
    switch (event) {
      case 'data':
        if ((payload.indexOf('/')) < 0) {
          return c.outPorts.error.send(new Error('Invalid ips'));
        }
    
        var range = {};
    
        var parts = payload.split('/');
    
        if (parts[1] > 32) {
          return c.outPorts.error.send(new Error('Invalid ip'));
        }
    
        range.start = long2ip((ip2long(parts[0])) & ((-1 << (32 - +parts[1]))));
        range.end = long2ip((ip2long(parts[0])) + math.pow(2, (32 - +parts[1])) - 1);
        return component.outPorts.out.send(payload);
      case 'disconnect':
        // Disconnect output port when input port disconnects
        return component.outPorts.out.disconnect();
    }
  });
  component.outPorts.add('out', { datatype: 'all' });

  return component; // Return new instance
};