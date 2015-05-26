var noflo = require('noflo');

exports.getComponent = function () {
  var c = new noflo.Component();

  c.inPorts.add('in', function (event, payload) {
    if (event !== 'data') {
      return;
    }
    // Do something with the packet, then
    c.outPorts.out.send(payload);
  });
  c.outPorts.add('out');
  return c;
};

/**
 * Returns the IP range (start & end)
 * for a given IP/CIDR
 * @param ip
 * @returns {Object}
 */
CIDR.prototype.range = function(ip) {
    if (!(ip.indexOf('/') > -1)) {
        return null;
    }

    var range = {};
    var parts = ip.split('/');

    if ((parts[1] > 32)) {
        return null;
    }

    range.start = long2ip((ip2long(parts[0])) & ((-1 << (32 - +parts[1]))));
    range.end = long2ip((ip2long(parts[0])) + math.pow(2, (32 - +parts[1])) - 1);

    return range;
};