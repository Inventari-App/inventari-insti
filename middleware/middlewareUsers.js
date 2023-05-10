const { userSchema } = require('../schemas.js');

const ExpressError = require('../utils/ExpressError');
const User = require('./models/user');

 
module.exports.isLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
        //res.session.returnTo = req.originalUrl;
        req.flash('error', "Has d'estar connectat/da");
        return res.redirect('/login');
    }
    next();
}



module.exports.validateUser = (req, res, next) => {
    const { error } = userSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(',');
        throw new ExpressError(msg, 400)
    } else {
        next();
    }

}


module.exports.isResponsable = async (req, res, next) => {
    const { id } = req.params;
    const user = await User.findById(id);
    if (!user.responsable.equals(req.user._id)) {
        req.flash('error', 'No tens permisos per fer això!');
        return res.redirect(`/users/${id}`);
    }
    next();
}

module.exports.isAdmin = async (req, res, next) => {
    const { id,  } = req.params;
    const { id: userId, isAdmin } = req.user
    const invoice = await Invoice.findById(id);
    if (invoice.responsable._id != userId && !isAdmin) {
        req.flash('error', 'No tens permisos per fer això!');
        return res.redirect(`/invoices/${id}`);
    }
    next();
}