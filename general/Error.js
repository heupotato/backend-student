const handleError = (res = {}, err = {}) => {
    res.status(err.code).json({
        errors: {
            msg: err.message
        }, 
        res: 0
    })
}

module.exports = handleError