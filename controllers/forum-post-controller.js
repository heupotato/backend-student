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

const getAllCommentsByPostId = (req, res) => {
    return forumPostService.getAllCommentsByPostId(req, res)
}

const createReact = (req, res) => {
    return forumPostService.createReact(req, res)
}

const createTopic = (req, res) => {
    return forumPostService.createTopic(req, res)
}

const updateTopic = (req, res) => {
    return forumPostService.updateTopic(req, res)
}
const forumPostController = {
    getAllThreads,
    getAllTopicsByThreadId,
    getAllPostsByTopicId,
    getAllCommentsByPostId,
    createReact,
    createTopic,
    updateTopic
}

module.exports = forumPostController