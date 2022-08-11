require('dotenv').config();
var secretKey = process.env.JWT_SECRET;

module.exports = secretKey