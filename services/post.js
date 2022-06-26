const Post = require('../models/Post')
const Category = require('../models/Category')
const handleError = require('../general/Error')
const ERROR = require('../constants/error')
const SUCCEED = require('../constants/succeed')
const { populate } = require('../models/Post')

const ObjectId = require('mongoose').Types.ObjectId;

const getAllCategories = async (req, res) => {
    const categoryList = await Category.find()
        .populate([
            {
                path: 'post',
                populate: {
                    path: 'id_user',
                    select: '_id full_name url_avatar'
                },
                match: {
                    isDeleted: false
                }
            }
        ])
        .sort({
            order: 1
        })
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
    const post = await Post.findOne({ _id: id, isDeleted: false }).populate([
        {
            path: 'id_user',
            select: 'full_name url_avatar'
        },
        {
            path: 'comment_ids',
            select: 'id_user createdAt content',
            populate: {
                path: 'id_user',
                select: 'full_name url_avatar'
            },
            match: { isDeleted: false },
            options: {
                sort: {
                    createdAt: -1
                }
            }
        }
    ])
    if (!post) {
        const err = {
            code: 400,
            message: ERROR.POST_NOT_FOUND,
            res: 0
        }
        return handleError(res, err)
    }

    const popularPosts = await getPopularPosts([id])

    const relatedPosts = await getRelatedPosts(id, post.id_category)
    return res.json({
        msg: SUCCEED.GET_POST_SUCCESS,
        data: {
            post,
            popularPosts,
            relatedPosts
        },
        res: 1
    })
}

const getPostByCategory = async (req, res) => {
    const { id } = req.params
    const postList = await Post.find({ id_category: id, isDeleted: false }).populate('id_user', 'full_name')
    const popularPosts = await getPopularPosts()
    return res.json({
        msg: SUCCEED.GET_POST_SUCCESS,
        data: {
            postList,
            popularPosts
        },
        res: 1
    })
}

const updatePost = async (req, res) => {
    const { id } = req.params
    const validate = await validateUser(req)

    if (!validate.isValid)
        return handleError(res, validate.err)

    const today = new Date()
    try {
        const newPost = await Post.findByIdAndUpdate(id, { ...req.body, lastUpdatedAt: today }, { new: true, })
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
    const id_user = req.user.uid
    const newPost = await Post.create({ ...req.body, id_user: id_user })
    return res.json({
        message: SUCCEED.CREATE_POST_SUCCESS,
        data: newPost,
        res: 1
    })

}

const index = async (req, res) => {
    const annouceCategoryId = "6278e9e29bd772a459685450"
    const announcementPostList = await Post
        .find({
            id_category: annouceCategoryId,
            isDeleted: false
        })
        .populate('id_user', 'full_name')
        .limit(4)
        .sort({ lastUpdatedAt: -1 })
    const announcementLatest = announcementPostList.shift()

    const justInArray = await Post.find({ isDeleted: false })
        .populate('id_user', 'full_name')
        .limit(6)
        .sort({ lastUpdatedAt: -1 })
    const justInLatest = justInArray.shift()

    const listCate = await Category.find().sort({ order: 1 })

    let listPostCategory = await Promise.all(
        listCate.map(async function (category) {
            const id = category.id
            const listPosts = await Post.find({ id_category: id, isDeleted: false })
                .populate('id_user', 'full_name')
                .limit(4)
                .sort({ lastUpdatedAt: -1 })
            console.log(listPosts.length)
            return {
                category: category.category,
                posts: listPosts
            }
        })
    )
    return res.json({
        msg: SUCCEED.GET_POST_SUCCESS,
        data: {
            announcementPostList,
            announcementLatest,
            justIn: {
                justInLatest,
                justInArray
            },
            listPostCategory
        },
        res: 1
    })
}

const validateUser = async (req) => {
    const { id } = req.params
    const { uid } = req.user
    const { id_user } = await Post.findById(id)
    if (id_user.toString() !== uid) {
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

const getPopularPosts = async (idPosts) => {
    const popularPosts = await Post
        .find({
            id: {
                $ni: idPosts
            },
            isDeleted: false
        })
        .sort({ comment_length: -1 })
        .limit(5)
        .populate('id_user', 'full_name url_avatar')

    return popularPosts
}

const getRelatedPosts = async (idPost, idCate) => {
    const relatedPosts = await Post
        .find({
            id: {
                $ne: idPost
            },
            isDeleted: false,
            id_category: idCate
        })
        .sort({ createdAt: -1 })
        .limit(3)
        .populate('id_user', 'full_name url_avatar')

    return relatedPosts
}
const postService = {
    getAllCategories,
    getAllPost,
    getOnePost,
    getPostByCategory,
    updatePost,
    deletePost,
    createPost,
    index
}

module.exports = postService