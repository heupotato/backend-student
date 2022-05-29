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

const postController = {
    getAllCategories,
    getAllPost,
    getPostById
}

module.exports = postController