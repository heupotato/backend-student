const express = require('express')
const postRoutes = express.Router()

const postController = require('../controllers/post-controller')

const auth = require('../middleware/authenticator')

postRoutes.get('/categories',
    postController.getAllCategories
);

postRoutes.get('/news',
    postController.getAllPost
)

postRoutes.get('/news/:id',
    postController.getPostById)

module.exports = postRoutes;