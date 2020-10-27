const mongoose = require('mongoose');
const Scheme = mongoose.Schema;
const TokenSchema = new mongoose.Schema({
    _userId:{
        type: mongoose.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    token: {
        type: String, 
        required: true
    },
    createAt:{
        type:Date,
        required: true,
        default: Date.now,
        expires: 43200
    }
}); 

module.exports = mongoose.model('Token', TokenSchema);
