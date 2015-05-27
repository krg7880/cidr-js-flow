var long2ip = require('long2ip');
var noflo = require('noflo');
var _Component = noflo.Component;
var util = require('util');

var Component = function() {
  if (!(this instanceof Component)) {
    return new Component();
  }

  _Component.call(this);

  this.inPorts = new noflo.InPorts({
    in: {
      datatype: 'array',
      description: 'array of IPs to generate CIDR blocks'
    }
  });

  this.outPorts = new noflo.OutPorts({
    out: {
      datatype: 'object',
      description: 'Object of CIDR blocks'
    }
  });

  this.inPorts.in.on('data', function(payload) {
    if ((payload.indexOf('/')) < 0) {
      return this.outPorts.error.send(new Error('Invalid ips'));
    }

    var range = {};

    var parts = payload.split('/');

    if (parts[1] > 32) {
      return this.outPorts.error.send(new Error('Invalid ip'));
    }

    range.start = long2ip((ip2long(parts[0])) & ((-1 << (32 - +parts[1]))));
    range.end = long2ip((ip2long(parts[0])) + math.pow(2, (32 - +parts[1])) - 1);
    return this.outPorts.out.send(payload);
  }.bind(this));
};

util.inherits(Component, _Component);

exports.getComponent = function() {
  return new Component();
};