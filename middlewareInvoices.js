
const { invoiceSchema } = require('./schemas.js');
const ExpressError = require('./utils/ExpressError');

const Invoice = require('./models/invoice');
 
module.exports.isLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
        //res.session.returnTo = req.originalUrl;
        req.flash('error', "Has d'estar connectat/da");
        return res.redirect('/login');
    }
    next();
}


module.exports.validateInvoice = (req, res, next) => {
    const { error } = invoiceSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(',');
        throw new ExpressError(msg, 400)
    } else {
        next();
    }

}

module.exports.isResponsableOrAdmin = async (req, res, next) => {
    const { id,  } = req.params;
    const { id: userId, isAdmin } = req.user
    const invoice = await Invoice.findById(id);
    if (invoice.responsable.id !== userId && !isAdmin) {
        req.flash('error', 'No tens permisos per fer això!');
        return res.redirect(`/invoices/${id}`);
    }
    next();
}


