const { Schema, model } = require('mongoose');

const prefixSchema = new Schema({
    Guild: {
        type: String,
        required: true,
        unique: true,
        index: true
    },
    Prefix: {
        type: String,
        required: true,
        maxlength: 4
    },
    Enabled: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true // Adds createdAt and updatedAt fields
});

module.exports = model('GuildPrefix', prefixSchema);
