
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

module.exports.isResponsable = async (req, res, next) => {
    const { id } = req.params;
    const invoice = await Invoice.findById(id);
    if (!invoice.responsable.equals(req.user._id)) {
        req.flash('error', 'No tens permisos per fer això!');
        return res.redirect(`/invoices/${id}`);
    }
    next();
}


