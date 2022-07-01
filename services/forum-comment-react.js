const ForumComment = require('../models/ForumComment')
const SUCCEED = require('../constants/succeed')
const ERROR = require('../constants/error')
const validateRole = require('./validate-role')
const handleError = require('../general/Error')
const ForumReact = require('../models/ForumReact')
const ForumPost = require('../models/ForumPost')
const path = require('path')
const fileUploadService = require('../utils/FileUpload')

const getAllCommentsByPostId = async (req, res) => {
    const { id } = req.params
    const commentList = await ForumComment.find({ id_post: id, isDeleted: false })
        .sort({
            createdAt: -1
        })
        .populate('id_user', 'full_name url_avatar')

    return res.json({
        msg: SUCCEED.GET_COMMENT_SUCCESS,
        data: commentList,
        res: 1
    })
}

const createComment = async (req, res) => {
    const { id } = req.params
    const { uid } = req.user
    try {
        let newComment = await ForumComment.create({ ...req.body, id_user: uid, id_post: id })

        const file = req.file
        if (file) {
            const filename = newComment.id.toString() + '_forum_comment' + path.extname(file.originalname)
            try {
                await fileUploadService.upload(file, filename)

            }
            catch (error) {
                await ForumComment.findByIdAndDelete(newComment.id)
                const err = {
                    code: 400,
                    message: error,
                    res: 0
                }
                return handleError(res, err)
            }

            const url = fileUploadService.bucketUrl + filename
            console.log(url)
            newComment = await ForumComment.findByIdAndUpdate(newComment.id, { img_url: url }, { new: true })
        }

        await ForumPost.findByIdAndUpdate(id,
            {
                '$addToSet': { 'comment_ids': newComment._id }
            }
        )
        return res.json({
            msg: SUCCEED.CREATE_COMMENT_SUCCESS,
            data: newComment,
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

const deleteComment = async (req, res) => {
    const { id } = req.params

    const oldComment = await ForumComment.findById(id)
    if (!oldComment) {
        const err = {
            code: 404,
            message: ERROR.COMMENT_NOT_FOUND,
            res: 0
        }
        return handleError(res, err)
    }
    const { id_user } = oldComment

    const validateUser = validateRole.validateOwner(req, id_user)
    if (!validateRole.checkManagerRole(req)) {
        if (!validateUser.isValid)
            return handleError(res, validateUser.err)
    }

    try {
        await ForumComment.findByIdAndUpdate(id, { isDeleted: true })
        return res.json({
            msg: SUCCEED.DELETE_COMMENT_SUCCESS,
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

const updateComment = async (req, res) => {
    const { id } = req.params

    const oldComment = await ForumComment.findById(id)
    if (!oldComment) {
        const err = {
            code: 404,
            message: ERROR.COMMENT_NOT_FOUND,
            res: 0
        }
        return handleError(res, err)
    }
    const { id_user, img_url } = oldComment

    const validateUser = validateRole.validateOwner(req, id_user)
    if (!validateUser.isValid)
        return handleError(res, validateUser.err)

    try {
        const file = req.file
        if (file) {
            const filename = id.toString() + '_forum_comment' + path.extname(file.originalname)
            const oldFilename = img_url.replace(fileUploadService.bucketUrl, '')
            try {
                await fileUploadService.deleteFile(oldFilename)
                await fileUploadService.upload(file, filename)
            }
            catch (error) {
                const err = {
                    code: 400,
                    message: error,
                    res: 0
                }
                return handleError(res, err)
            }

            const url = fileUploadService.bucketUrl + filename
            console.log(url)
            await ForumComment.findByIdAndUpdate(id, { img_url: url }, { new: true })
        }
        const today = new Date()

        const newComment = await ForumComment.findByIdAndUpdate(id, { ...req.body, lastUpdated: today }, { new: true })
        return res.json({
            msg: SUCCEED.UPDATE_COMMENT_SUCCESS,
            data: newComment,
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

const createReact = async (req, res) => {
    const { id } = req.params
    const { uid } = req.user
    const { reactType } = req.query
    const type = reactType === '0' ? 'Dislike' : 'Like'
    var newReact
    try {
        if (await ForumReact.findOne({ id_post: id, id_user: uid })) {
            newReact = await ForumReact.findOneAndUpdate({ id_post: id, id_user: uid }, { type: type, isDeleted: false }, { new: true })
        }
        else {
            newReact = await ForumReact.create({ id_post: id, id_user: uid, type: type })
            await ForumPost.findByIdAndUpdate(id,
                {
                    '$addToSet': { 'react_ids': newReact._id }
                }
            )
        }


        return res.json({
            msg: SUCCEED.CREATE_REACT_SUCCESS,
            data: newReact,
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

const deleteReact = async (req, res) => {
    const { id } = req.params
    const { id_user } = await ForumReact.findById(id)

    const validateUser = validateRole.validateOwner(req, id_user)
    if (!validateUser.isValid)
        return handleError(res, validateUser.err)

    try {
        const newReact = await ForumReact.findByIdAndUpdate(id, { isDeleted: true }, { new: true })
        return res.json({
            msg: SUCCEED.DELETE_REACT_SUCCESS,
            res: 1
        })
    }
    catch (error) {
        const err = {
            code: 400,
            message: error.message,
            res: 1
        }
        return handleError(res, err)
    }

}

const getAllReactsByPostIds = async (req, res) => {
    const { id } = req.params
    const reactList = await ForumReact.find({ id_post: id, isDeleted: false })

    return res.json({
        msg: SUCCEED.GET_REACT_SUCCESS,
        data: reactList,
        res: 1
    })
}
const forumCommentService = {
    getAllCommentsByPostId,
    createComment,
    deleteComment,
    updateComment,
    createReact,
    deleteReact,
    getAllReactsByPostIds
}

module.exports = forumCommentService