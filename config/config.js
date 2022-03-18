
module.exports.mongourl = 'mongodb://localhost:27017/cms-db';
module.exports.PORT = process.env.PORT || 3000;
module.exports.globalVariables = (req,res,next) => {
    res.locals.success_message = req.flash('success-message');
    res.locals.error_message = req.flash('error-message');
    res.locals.user = req.user || null;
    next()
}