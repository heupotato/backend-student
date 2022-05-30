const Post = require('../models/Post')
const Category = require('../models/Category')
const handleError = require('../general/Error')
const ERROR = require('../constants/error')
const SUCCEED = require('../constants/succeed')

const getAllCategories = async (req, res) => {
    const categoryList = await Category.find().populate([
        {
            path: 'post',
            populate: {
                path: 'id_user',
                select: '_id full_name url_avatar'
            }
        }
    ])
    if (!categoryList) {
        const err = {
            code: 400,
            message: ERROR.CATEGORY_LIST_NOT_EXIST
        }
        return handleError(res, err)
    }

    return res.json({
        msg: SUCCEED.GET_CATEGORYLIST_SUCCESS,
        categoryList
    })
}

const getAllPost = async (req, res) => {
    const postList = await Post.find({ isDeleted: false });
    if (!postList) {
        const err = {
            code: 400,
            message: 'error'
        }
        return handleError(res, err)
    }

    return res.json({
        msg: 'success',
        postList
    })
}

const getPostById = async (req, res) => {
    const { id } = req.params
    console.log(id)
    const post = await Post.findOne({ _id: id, isDeleted: false }).populate({
        path: 'id_user',
        select: 'full_name url_avatar'
    })
    if (!post) {
        const err = {
            code: 400,
            message: ERROR.POST_NOT_FOUND
        }
        return handleError(res, err)
    }
    return res.json({
        msg: SUCCEED.GET_POST_SUCCESS,
        post
    })
}

const getPostByCategory = async (req, res) => {
    const { id_category } = req.body
    const postList = await Post.find({ id_category: id_category })
    return res.json({
        msg: SUCCEED.GET_POST_SUCCESS,
        postList
    })
}

const updatePost = async (req, res) => {
    const { id, userId } = req.params
    const { id_user } = await Post.findById(id)
    if (id_user.toString() !== userId) {
        const err = {
            code: 405,
            message: ERROR.NOT_ALLOW
        }
        return handleError(res, err)
    }
    const newPost = await Post.findByIdAndUpdate(id, req.body, { new: true, })
        .catch(error => {
            const err = {
                code: 400,
                message: error.message
            }
            return handleError(res, err)
        })
    return res.json({
        msg: SUCCEED.UPDATE_POST_SUCCESS,
        newPost
    })
}

const deletePost = async (req, res) => {
    const { id, userId } = req.params
    const { id_user } = await Post.findById(id)
    if (id_user.toString() !== userId) {
        const err = {
            code: 405,
            message: ERROR.NOT_ALLOW
        }
        return handleError(res, err)
    }
    const today = new Date()

    await Post.findByIdAndUpdate(id, { isDeleted: true, deletedAt: today }, { new: true })
        .catch(error => {
            const err = {
                code: 400,
                message: error.message
            }
            return handleError(res, err)
        })
    return res.json({
        msg: SUCCEED.DELETE_POST_SUCCESS,
    })
}

const postService = {
    getAllCategories,
    getAllPost,
    getPostById,
    getPostByCategory,
    updatePost,
    deletePost
}

module.exports = postService