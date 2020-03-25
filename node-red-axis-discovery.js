const axis = require('axis-discovery');

module.exports = function(RED) {
	function AxisDiscovery(config) {
		RED.nodes.createNode(this, config);
		var node = this;
		node.status({fill:"red",shape:"dot",text:"Discovery stopped"});
		var devices = {};
		const discovery = new axis.Discovery();
		var discoveryMode = false;
		node.on("input", function(msg) {
			if(msg.payload === "start" || msg.payload === true ) {
				if( discoveryMode === true )
					return;
				devices = {};
				discovery.onHello(device => {
					if( devices.hasOwnProperty(device.macAddress) )
						return;
					var newDevice = {
						serial: device.macAddress,
						address: device.address,
						linkLocal: device.linkLocalAddress,
						name: device.friendlyName,
						port: device.port
					}
					devices[device.macAddress] = newDevice;
					node.send({payload:newDevice});
				})
				discovery.start();
				discovery.search();
				discoveryMode = true;
				node.status({fill:"green",shape:"dot",text:"Discovery running"});
				return;
			}
			
			if(msg.payload === "stop" || msg.payload === false ) {
				if( discoveryMode === false )
					return;
				discovery.stop();
				node.status({fill:"red",shape:"dot",text:"Discovery stopped"});
				discoveryMode = false;
			}
		});
		
	}
	RED.nodes.registerType("Axis Discovery", AxisDiscovery);
};
