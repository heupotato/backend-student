const express = require('express')
const postRoutes = express.Router()

const postController = require('../controllers/post-controller')

const auth = require('../middleware/authenticator')
const paramsValidate = require('../validation/params-validate')
const postValidate = require('../validation/post-validate')

postRoutes.get('/categories',
    postController.getAllCategories
);

postRoutes.get('/posts',
    postController.getAllPost
)

postRoutes.get('/posts/:id',
    paramsValidate.idParamValidate,
    postController.getPostById
)

postRoutes.get('/categories/:id/posts',
    postValidate.getPostByCategoryValidate,
    postController.getPostByCategory
)

postRoutes.put('/user/:userId/posts/:id',
    auth.authenticateToken,
    postController.updatePost
)

postRoutes.delete('/user/:userId/posts/:id',
    auth.authenticateToken,
    postController.deletePost
)

postRoutes.post('/posts/new',
    auth.authenticateToken,
    auth.checkManagerRoles,
    postValidate.createPostValidate,
    postController.createPost
)

module.exports = postRoutes;