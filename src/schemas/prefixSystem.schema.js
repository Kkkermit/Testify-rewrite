const { Schema, model } = require('mongoose');
const config = require('../config.js');

const prefixSystemSchema = new Schema({
    Guild: String,
    Prefix: {
        type: String,
        default: `${config.defaultPrefix}`,
    },
    Enabled: {
        type: Boolean,
        default: false,
    },
});

module.exports = model('prefixSystem', prefixSystemSchema);
