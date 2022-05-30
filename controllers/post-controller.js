const postService = require('../services/post')

const getAllCategories = (req, res) => {
    return postService.getAllCategories(req, res)
}

const getAllPost = (req, res) => {
    return postService.getAllPost(req, res)
}

const getPostById = (req, res) => {
    return postService.getPostById(req, res)
}

const getPostByCategory = (req, res) => {
    return postService.getPostByCategory(req, res)
}

const updatePost = (req, res) => {
    return postService.updatePost(req, res)
}

const deletePost = (req, res) => {
    return postService.deletePost(req, res)
}

const postController = {
    getAllCategories,
    getAllPost,
    getPostById,
    getPostByCategory,
    updatePost,
    deletePost
}

module.exports = postController