//Copyright (c) 2021 Fred Juhlin

const axis = require('axis-discovery');

module.exports = function(RED) {
	function AxisDiscovery(config) {
		RED.nodes.createNode(this, config);
		const discovery = new axis.Discovery();

		discovery.on('hello', (device) => {
			var devices = node.context().get("devices");
			if(!devices)
				devices = {};
			if( node.output === "Once" && devices.hasOwnProperty(device.macAddress) )
				return;
			
			var newDevice = {
				serial: device.macAddress,
				address: device.address,
				linkLocal: device.linkLocalAddress?device.linkLocalAddress:null,
				name: device.friendlyName,
				port: device.port,
				timestamp: new Date().getTime()
			}
			devices[device.macAddress] = newDevice;
			node.context().set("devices",devices);
			node.send({
				topic: newDevice.name,
				payload: newDevice
			});
		})
		
		var discoveryMode = false;
		this.output = config.output;
		var node = this;
		node.status({fill:"red",shape:"dot",text:"Discovery stopped"});
		node.on("input", function(msg) {
			if(msg.payload === "start" || msg.payload === true ) {
				if( discoveryMode === true )
					return;
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
	RED.nodes.registerType("Axis Discovery", AxisDiscovery, {
		name: { type:"text" },
		output: { type:"text" }
	});
};
