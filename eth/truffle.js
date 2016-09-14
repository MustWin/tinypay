module.exports = {
  build: {
    "index.html": "index.html",
    "app.js": [
    ],
    "app.css": [
    ],
    "images/": "images/"
  },
  rpc: {
    host: "localhost",
    port: 8545
  },
  "live": {
    network_id: 1, // Ethereum public network
  },
  "morden": {
    network_id: 2,        // Official Ethereum test network
  },
  "staging": {
    network_id: 1337 // custom private network
    // use default rpc settings
  },
  "development": {
    network_id: "default",
  }
};
