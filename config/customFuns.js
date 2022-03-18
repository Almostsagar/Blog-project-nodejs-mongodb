
module.exports.selectOption = (status, options) => {
    return options.fn(this).replace(new RegExp('value=\"' + status + '\"'), '$&selected="selected"');
}
module.exports.isEmpty = function (obj1) {
    for (let key in obj1) {
        if (Object.prototype.hasOwnProperty.call(obj1, key)) {
            return false;
        }
    }

    return true;
}
module.exports.isUserAuthenticated = function (req,res,next) {
    if (req.isAuthenticated()) { 
        next()
    } else {
        res.redirect('/login')
    }
}