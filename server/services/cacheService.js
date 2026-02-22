const NodeCache = require("node-cache");

// Create cache with 10 minute TTL
const cache = new NodeCache({ stdTTL: 600 });

module.exports = cache;
