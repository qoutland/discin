const mongoose = require('mongoose');

var FriendSchema = mongoose.Schema(
    {
        requester: {type: String, required: true},
        requestee: {type: String, required: true},
        requester_status: {type: String},
        requestee_status: {type: String}
    }

)

module.exports = mongoose.model('Friends', FriendSchema);