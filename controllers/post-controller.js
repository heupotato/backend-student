const postService = require('../services/post')

const getAllCategories = (req, res) => {
    return postService.getAllCategories(req, res)
}

const getAllPost = (req, res) => {
    return postService.getAllPost(req, res)
}

const getOnePost = (req, res) => {
    return postService.getOnePost(req, res)
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

const createPost = (req, res) => {
    return postService.createPost(req, res)
}

const postController = {
    getAllCategories,
    getAllPost,
    getOnePost,
    getPostByCategory,
    updatePost,
    deletePost,
    createPost
}

module.exports = postController