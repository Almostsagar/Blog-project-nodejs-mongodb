const { Post } = require('../models/postModel')
const { Category } = require('../models/categoryModel')
const { Comment } = require('../models/commentModel')
const { User } = require('../models/userModel')
const bcrypt = require('bcryptjs')
module.exports.index = (req, res) => {
    Category.find().lean().then(cats => {
        Post.find().lean().then(posts => {
            res.render('default/index', { posts: posts, categories: cats })
        })
    })
};
module.exports.loginGet = (req, res) => {
    res.render('default/login')
};
module.exports.loginPost = (req, res) => {
    res.send(`contratulations you've submitted data`)
};
module.exports.registerGet = (req, res) => {
    res.render('default/register')
};
module.exports.registerPost = (req, res) => {
    let errors = []
    if (!req.body.firstName) {
        errors.push({ message: "First name is mandatory..." })
    }
    if (!req.body.lastName) {
        errors.push({ message: "Last name is mandatory..." })
    }
    if (!req.body.email) {
        errors.push({ message: "Email Field is mandatory..." })
    }
    if (req.body.password !== req.body.passwordConfirm) {
        errors.push({ message: "passwords should match..." })
    }
    if (errors.length > 0) {
        res.render('default/register', {
            errors: errors,
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            email: req.body.email
        })
    } else {
        User.findOne({ email: req.body.email }).lean().then(user => {
            if (user) {
                req.flash('error-message', 'Email already exists, try to login')
                res.redirect('/login')
            }
            else {
                const newUser = User({
                    firstname: req.body.firstName,
                    lastname: req.body.lastName,
                    email: req.body.email,
                    password: req.body.password

                })
                bcrypt.genSalt(10, (err, salt) => {
                    bcrypt.hash(newUser.password, salt, (err, hash) => {
                        newUser.password = hash
                        newUser.save().then(user => {
                            req.flash('success-message', 'You are now registered')
                            res.redirect('/login')
                        })
                    })
                })
            }
        })
    }
};

module.exports.admin = (req, res) => {
    res.render('default/admin')
};
module.exports.getSinglePost = (req, res) => {
    const id = req.params.id
    User.find().lean().then(user => {

        Category.find().lean().then(cats => {
            Post.findById(id)
                .populate({ path: 'comments', populate: { path: 'user', model: 'user' } })
                .lean().then(post => {
                    if (!post) {
                        res.status(404).JSON({ message: 'No Post Found' })
                    }
                    else {
                        // res.status(200).json(post)
                        res.render('default/singlePost', { post: post, categories: cats, user: user , comments: post.comments})
                    }
                })
        })
    })

};
module.exports.submitComment = (req, res) => {
    if (req.user) {
        Post.findById(req.body.id)
            .then(post => {
                const newComment = new Comment({
                    user: req.user.id,
                    body: req.body.comment_body
                })
                post.comments.push(newComment)
                post.save().then(savedPost => {
                    newComment.save().then(savedComment => {
                        req.flash('success-message', 'Your comment was submitted for review..')
                        res.redirect(`/post/${post._id}`)
                    })
                })
            })
    } else {
        req.flash('error-message', 'Login first to comment')
        res.redirect('/login')
    }

};
