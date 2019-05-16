var mongoose = require('mongoose')

var DiscSchema = mongoose.Schema(
    {
        brand: {type: String, required: true},
        type: {type: String, required: true, enum: ['Distance Driver', 'Fairwar Driver', 'Mid-range', 'Putter'], },
        speed: {type: Number, min: 1, max: 13},
        glide: {type: Number, min: 1, max: 7},
        turn: {type: Number, min: -5, max: 1},
        fade: {type: Number, min: 0, max: 6},
        purchase_date: {type: Date, default: Date.now()}
    }
)

DiscSchema.pre('save', function(next) {
    console.log('before you save');
    next();
});

module.exports = mongoose.model('Disc', DiscSchema);
