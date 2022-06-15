const forumPostService = require('../services/forum-post')

const getAllThreads = (req, res) => {
    return forumPostService.getAllThreads(req, res)
}

const getAllTopicsByThreadId = (req, res) => {
    return forumPostService.getAllTopicsByThreadId(req, res)
}

const getAllPostsByTopicId = (req, res) => {
    return forumPostService.getAllPostsByTopicId(req, res)
}

const createTopic = (req, res) => {
    return forumPostService.createTopic(req, res)
}

const updateTopic = (req, res) => {
    return forumPostService.updateTopic(req, res)
}

const deleteTopic = (req, res) => {
    return forumPostService.deleteTopic(req, res)
}

const getPostById = (req, res) => {
    return forumPostService.getPostById(req, res)
}

const createPost = (req, res) => {
    return forumPostService.createPost(req, res)
}

const updatePost = (req, res) => {
    return forumPostService.updatePost(req, res)
}

const deletePost = (req, res) => {
    return forumPostService.deletePost(req, res)
}
const forumPostController = {
    getAllThreads,
    getAllTopicsByThreadId,
    getAllPostsByTopicId,
    createTopic,
    updateTopic,
    deleteTopic,
    getPostById,
    createPost,
    updatePost,
    deletePost
}

module.exports = forumPostController