const express = require('express')
const router = express.Router()
const adminController = require('../controllers/adminController')
const {isUserAuthenticated} = require('../config/customFuns')
const passport = require('passport')

router.all('/*',isUserAuthenticated, (req, res, next) => {
    req.app.locals.layout = 'admin'
    next()
})

router.route('/')
    .get(adminController.index)

router.route('/posts')
    .get(adminController.getPosts)

router.route('/posts/create')
    .get(adminController.createPosts)
    .post(adminController.submitPosts)

router.route('/posts/edit/:id')
    .get(adminController.editPosts)
    .put(adminController.editPostSubmit)


router.route('/posts/delete/:id')
    .delete(adminController.deletePosts)

router.route('/category')
    .get(adminController.getCategory)
    .post(adminController.createCategories)

router.route('/categories/edit/:id')
    .get(adminController.editCategoriesGetRoute)
    .post(adminController.editCategoriesPostRoute)

router.route('/categories/delete/:id')
    .delete(adminController.deleteCategoriesPostRoute)

router.route('/comment')
    .get(adminController.getComments)

module.exports = router