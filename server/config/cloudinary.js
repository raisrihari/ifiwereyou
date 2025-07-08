// server/config/cloudinary.js
const cloudinary = require('cloudinary').v2;
require('dotenv').config({ path: '../.env' });

cloudinary.config({
    cloud_name: 'dzu8f7i8t',
    api_key: 788876494751186,
    api_secret: 'CZaXs48W6kRiXwvWLWntBdWDhh4',
});

module.exports = cloudinary;