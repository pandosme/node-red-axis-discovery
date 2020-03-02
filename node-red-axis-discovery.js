const axis = require('axis-discovery');

module.exports = function(RED) {
  function AxisDiscovery(config) {
    RED.nodes.createNode(this, config);

    var node = this;

    const discovery = new axis.Discovery();
    
    node.on("input", function(msg) {
      const devices = [];

      discovery.onHello(device => {
        devices.push(device);
      })

      setTimeout(
        () => {
          discovery.stop();

          msg.payload = devices;
          node.send(msg);  
        },
        5000);

        discovery.start();
        discovery.search();

      // msg.payload = msg.payload.toLowerCase();
      // msg.payload = "Some message";
      // node.send(msg);
    });
  }
  
  RED.nodes.registerType("Axis Discovery", AxisDiscovery);
};
