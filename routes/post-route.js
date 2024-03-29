const express = require('express')
const postRoutes = express.Router()

const postController = require('../controllers/post-controller')

const auth = require('../middleware/authenticator')
const paramsValidate = require('../validation/params-validate')
const postValidate = require('../validation/post-validate')

const multer = require('multer')

const upload = multer()

postRoutes.get('/categories',
    postController.getAllCategories
);

postRoutes.get('/posts',
    postController.getAllPost
)

postRoutes.get('/posts/:id',
    paramsValidate.idParamValidate,
    postController.getOnePost
)

postRoutes.get('/categories/:id/posts',
    postValidate.getPostByCategoryValidate,
    postController.getPostByCategory
)

postRoutes.put('/posts/:id', upload.single('img'),
    auth.authenticateToken,
    postController.updatePost
)

postRoutes.delete('/posts/:id',
    auth.authenticateToken,
    postController.deletePost
)

postRoutes.post('/posts', upload.single('img'),
    auth.authenticateToken,
    auth.checkManagerRoles,
    postValidate.createPostValidate,
    postController.createPost
)

postRoutes.get('/index',
    postController.index)

module.exports = postRoutes;