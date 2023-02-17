const { unitatSchema } = require('./schemas.js');

const ExpressError = require('./utils/ExpressError');
const Unitat = require('./models/unitat');

 
module.exports.isLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
        //res.session.returnTo = req.originalUrl;
        req.flash('error', "Has d'estar connectat/da");
        return res.redirect('/login');
    }
    next();
}



module.exports.validateUnitat = (req, res, next) => {
    const { error } = unitatSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(',');
        throw new ExpressError(msg, 400)
    } else {
        next();
    }

}


module.exports.isResponsable = async (req, res, next) => {
    const { id } = req.params;
    const unitat = await Unitat.findById(id);
    if (!unitat.responsable.equals(req.user._id)) {
        req.flash('error', 'No tens permisos per fer això!');
        return res.redirect(`/unitats/${id}`);
    }
    next();
}




