var mongoose = require('mongoose')

var DiscSchema = mongoose.Schema(
    {
        owner: {type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true},
        brand: {type: String, required: true},
        name: {type: String, required: true},
        color: {type: String, required: true},
        weight: {type: Number, min: 120, max: 180},
        type: {type: String, required: true, enum: ['Distance Driver', 'Fairway Driver', 'Mid-range', 'Putter'], },
        speed: {type: Number, min: 1, max: 13},
        glide: {type: Number, min: 1, max: 7},
        turn: {type: Number, min: -5, max: 1},
        fade: {type: Number, min: 0, max: 6},
        purchase_date: {type: Date, default: Date.now()}
    }
)

DiscSchema
.virtual('url')
.get(function() {
    return '/disc/' + this._id;
})

module.exports = mongoose.model('Disc', DiscSchema);
