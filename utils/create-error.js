const createError = (statusCode,message) => {
    const errObj = new Error(message);
    // console.log(typeof(errObj))
    errObj.statusCode = statusCode
    // console.log(errObj)
    return errObj
};

module.exports = createError;