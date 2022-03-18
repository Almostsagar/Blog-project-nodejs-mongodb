const { Post } = require('../models/postModel');
const { Category } = require('../models/categoryModel');
const { Comment } = require('../models/commentModel');
const { isEmpty } = require('../config/customFuns')


const post = require('../models/postModel').Post
module.exports.index = (req, res) => {
    res.render('admin/index')
};
module.exports.getPosts = (req, res) => {
    Post.find().lean().populate('category').then(posts => {
        res.render('admin/posts/index', { posts: posts })
    })
};
module.exports.submitPosts = (req, res) => {
    const commentsAllowed = req.body.allowComments ? true : false

    // Check for the input file
    let filename = ''
    if (!isEmpty(req.files)) {
        let file = req.files.uploadedFile
        filename = file.name
        let uploadDir = './public/uploads/'
        file.mv(uploadDir+filename, (err) => {
            if (err) {
                throw err
            }
        })
    }

    const newPost = new post({
        title: req.body.title,
        status: req.body.status,
        description: req.body.description,
        allowComments: commentsAllowed,
        category: req.body.category,
        file: `/uploads/${filename}`
    })
    newPost.save().then(post => {
        console.log(post)
        req.flash('success-message', 'Post created successfully')
        res.redirect('/admin/posts')
    })
};
module.exports.createPosts = (req, res) => {
    Category.find().lean().then(cats => {
        res.render('admin/posts/create', { categories: cats })
    })
};
module.exports.editPosts = (req, res) => {
    const id = req.params.id;
    Post.findById(id)
        .lean()
        .then(post => {
            Category.find().lean().then(cats => {
                res.render('admin/posts/edit', { post: post, categories: cats });
            });
        })
};
module.exports.editPostSubmit = (req, res) => {
    const commentsAllowed = req.body.allowComments ? true : false;
    const id = req.params.id;
    Post.findById(id)
        .then(post => {
            post.title = req.body.title;
            post.status = req.body.status;
            post.allowComments = commentsAllowed;
            post.description = req.body.description;
            post.category = req.body.category;
            post.save().then(updatePost => {
                req.flash('success-message', `The Post ${updatePost.title} has been updated.`);
                res.redirect('/admin/posts');
            });
        });

},
    module.exports.deletePosts = (req, res) => {
        const id = req.params.id
        Post.findByIdAndDelete(id).then(deletedPost => {
            req.flash(`success-message`, `Post ${deletedPost.title} has been deleted successfully`)
            res.redirect('/admin/posts')
        })
    }
module.exports.getCategory = (req, res) => {
    Category.find().lean().then(cats => {
        res.render('admin/category/index', { categories: cats })
    })
}
module.exports.createCategories = (req, res) => {
    var catname = req.body.name
    if (catname) {
        const newCategory = Category({
            title: catname,
        })
        newCategory.save().then(category => {
            res.status(200).json(category)
        })
    }
}
module.exports.editCategoriesGetRoute = async (req, res) => {
    const catId = req.params.id
    const cats = await Category.find()

    Category.findById(catId).lean().then(cat => {
        req.flash('success-message', 'Category created successfully')
        res.render('admin/category/edit', { category: cat, categories: cats })
    })
}
module.exports.editCategoriesPostRoute = (req, res) => {
    const catId = req.params.id
    const newTitle = req.body.name

    if (newTitle) {
        Category.findById(catId).then(cat => {
            cat.title = newTitle
            cat.save().then(updated => {
                res.status(200).json({ url: '/admin/category' })
            })
        })
    }
}
module.exports.deletePosts = (req, res) => {
    const id = req.params.id
    Post.findByIdAndDelete(id).then(deletedPost => {
        req.flash(`success-message`, `Post ${deletedPost.title} has been deleted successfully`)
        res.redirect('/admin/posts')
    })
}
module.exports.deleteCategoriesPostRoute = (req, res) => {
    const catId = req.params.id
    Category.findByIdAndDelete(catId).then(deletedCat => {
        // req.flash(`success-message`, `Post ${deletedCat.title} has been deleted successfully`)
        res.redirect('/admin/category')
    })
}
module.exports.getComments = (req, res) => {
        Comment.find()
            .populate('user')
            .lean()
            .then(comments => {
                res.render(`admin/comments/index`, {comments: comments})
            })
}
