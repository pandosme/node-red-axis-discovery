# node-red-contrib-axis-discovery

Discovers Axis devices with SSD (UpnP) and Bonjour.

## Known limitations
When running Node-RED in Docker, discovery will not work unless you set container to use host network instead of defining ports.

Docker-compose example
```
    network_mode: "host"
#   ports:
#      - '1880:1880'
```
