const mongoose = require('mongoose')
const Schema = mongoose.Schema

const postSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    status: {
        type: String,
    },
    description: {
        type: String,
        required: true
    },
    creationDate: {
        type: Date,
        default: Date.now()
    },
    user:{
        type: Schema.Types.ObjectId,
        ref: 'user'
    },
    category: {
        type: Schema.Types.ObjectId,
        ref: 'category'
    },
    comments: [{
        type: Schema.Types.ObjectId,
        ref: 'comment'
    }],
    allowComments: {
        type: Boolean,
        default: false
    },
    commentsApprovalRequired: {
        type: Boolean,
        default: true
    },
    file: {
        type: String,
        default: ''
    }
})

module.exports = {Post: mongoose.model('post', postSchema )};
