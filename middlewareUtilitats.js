const { utilitatSchema } = require('./schemas.js');

const ExpressError = require('./utils/ExpressError');
const Utilitat = require('./models/utilitat');

 
module.exports.isLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
        //res.session.returnTo = req.originalUrl;
        req.flash('error', "Has d'estar connectat/da");
        return res.redirect('/login');
    }
    next();
}



module.exports.validateUtilitat = (req, res, next) => {
    const { error } = utilitatSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(',');
        throw new ExpressError(msg, 400)
    } else {
        next();
    }

}


module.exports.isResponsable = async (req, res, next) => {
    const { id } = req.params;
    const utilitat = await Utilitat.findById(id);
    if (!utilitat.responsable.equals(req.user._id)) {
        req.flash('error', 'No tens permisos per fer això!');
        return res.redirect(`/utilitats/${id}`);
    }
    next();
}




