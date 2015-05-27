var long2ip = require('long2ip');
var noflo = require('noflo');
exports.getComponent = function() {
  var component = new noflo.Component();
  component.description = "Filters the given IP into CIDR blocks";

  component.inPorts = {
    in: new noflo.Port('array')
  };

  component.outPorts = {
    out: new noflo.Port('object'),
    error: new noflo.Port('object')
  };

  component.inPorts.in.on('data', function(payload) {
    if ((payload.indexOf('/')) < 0) {
      return component.outPorts.error.send(new Error('Invalid ips'));
    }

    var range = {};

    var parts = payload.split('/');

    if (parts[1] > 32) {
      return component.outPorts.error.send(new Error('Invalid ip'));
    }

    range.start = long2ip((ip2long(parts[0])) & ((-1 << (32 - +parts[1]))));
    range.end = long2ip((ip2long(parts[0])) + math.pow(2, (32 - +parts[1])) - 1);
    return component.outPorts.out.send(payload);
  });

  return component; // Return new instance
};
