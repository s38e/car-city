const NodeCache = require("node-cache");
const cache = new NodeCache({ stdTTL: 3600 }); // التوكن سيظل في الكاش لمدة ساعة

module.exports = cache;
