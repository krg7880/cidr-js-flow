var long2ip = require('long2ip');
var noflo = require('noflo');

exports.getComponent = function() {
  var component = new noflo.Component();
  component.description = "Filter the given IPs into CIDR blocks";

  component.inPorts.add('in', {datatype: 'array'}, function(e, payload) {
    switch(e) {
      case 'data':
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
    }
  });
  
  return component;
};