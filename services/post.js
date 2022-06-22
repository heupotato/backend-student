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
            message: ERROR.CATEGORY_LIST_NOT_EXIST,
            res: 0
        }
        return handleError(res, err)
    }

    return res.json({
        msg: SUCCEED.GET_CATEGORYLIST_SUCCESS,
        data: categoryList, 
        res: 1
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
        data: postList, 
        res: 1
    })
}

const getOnePost = async (req, res) => {
    const { id } = req.params
    const post = await Post.findOne({ _id: id, isDeleted: false }).populate({
        path: 'id_user',
        select: 'full_name url_avatar'
    })
    if (!post) {
        const err = {
            code: 400,
            message: ERROR.POST_NOT_FOUND, 
            res: 0
        }
        return handleError(res, err)
    }
    return res.json({
        msg: SUCCEED.GET_POST_SUCCESS,
        data: post, 
        res: 1
    })
}

const getPostByCategory = async (req, res) => {
    const { id } = req.params
    const postList = await Post.find({ id_category: id })
    return res.json({
        msg: SUCCEED.GET_POST_SUCCESS,
        data: postList, 
        res: 1
    })
}

const updatePost = async (req, res) => {
    const { id } = req.params
    const validate = await validateUser(req)

    if (!validate.isValid)
        return handleError(res, validate.err)

    try {
        const newPost = await Post.findByIdAndUpdate(id, req.body, { new: true, })
        return res.json({
            msg: SUCCEED.UPDATE_POST_SUCCESS,
            data: newPost, 
            res: 1
        })
    }
    catch (error) {
        const err = {
            code: 400,
            message: error.message, 
            res: 0
        }
        return handleError(res, err)
    }

}

const deletePost = async (req, res) => {
    const { id } = req.params
    const validate = await validateUser(req)

    if (!validate.isValid)
        return handleError(res, validate.err)

    const today = new Date()
    try {
        await Post.findByIdAndUpdate(id, { isDeleted: true, deletedAt: today }, { new: true })

        return res.json({
            msg: SUCCEED.DELETE_POST_SUCCESS,
            res: 1
        })
    }
    catch (error) {
        const err = {
            code: 400,
            message: error.message, 
            res: 0
        }
        return handleError(res, err)
    }
}

const createPost = async (req, res) => {
    const newPost = await Post.create(req.body)
    return res.json({
        message: SUCCEED.CREATE_POST_SUCCESS,
        data: newPost,
        res: 1
    })

}

const validateUser = async (req) => {
    const { userId, id } = req.params
    const { id_user } = await Post.findById(id)
    if (id_user.toString() !== userId) {
        const err = {
            code: 405,
            message: ERROR.NOT_ALLOW, 
            res: 0
        }
        return {
            isValid: false,
            err: err
        }
    }
    return {
        isValid: true
    }
}

const postService = {
    getAllCategories,
    getAllPost,
    getOnePost,
    getPostByCategory,
    updatePost,
    deletePost,
    createPost
}

module.exports = postService