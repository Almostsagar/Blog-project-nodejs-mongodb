const mongoose = require('mongoose')
const Schema = mongoose.Schema

const commentSchema = new Schema({
    body: {
        type: String,
        required: true
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: 'user'
    },
    date: {
        type: Date,
        default: Date.now()
    },
    commentisapproved: {
        type: Boolean,
        default: false
    }
})

module.exports = {Comment: mongoose.model('comment', commentSchema )};
