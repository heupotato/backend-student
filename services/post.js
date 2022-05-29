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
                select: 'full_name id'
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
    const postList = await Post.find();
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
    const post = await Post.findById(id).populate({
        path: 'id_user',
        select: 'full_name url_avatar'
    })
    if (!post) {
        const err = {
            code: 400,
            message: ERROR.USER_NOT_FOUND
        }
        return handleError(res, err)
    }
    return res.json({
        msg: SUCCEED.GET_POST_SUCCESS,
        post
    })
}

const postService = {
    getAllCategories,
    getAllPost,
    getPostById
}

module.exports = postService