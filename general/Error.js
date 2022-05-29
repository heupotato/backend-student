const handleError = (res = {}, err = {}) => {
    res.status(err.code).json({
        errors: {
            msg: err.message
        }
    })
}

module.exports = handleError