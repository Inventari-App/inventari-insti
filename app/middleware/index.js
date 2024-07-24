const User = require('../models/user.js')
const Invoice = require('../models/invoice.js')
const fetch = require('node-fetch')

module.exports.validateSchema = (schema) => (req, res, next) => {
  const { error } = schema.validate(req.body)
  if (error) {
    console.error(error)
    res.sendStatus(400)
  } else {
    next()
  }
}

module.exports.isLoggedIn = (req, res, next) => {
  if (!req.isAuthenticated()) {
    // res.session.returnTo = req.originalUrl;
    req.flash('error', "Has d'estar connectat/da")
    return res.redirect('/login')
  }
  next()
}

module.exports.isSameUser = async (req, res, next) => {
  const { id } = req.params
  const user = await User.findById(id)
  if (!user._id.equals(req.user._id)) {
    req.flash('error', 'No tens permisos per fer això!')
    return res.redirect('/invoices')
  }
  next()
}

module.exports.isSameUserOrAdmin = async (req, res, next) => {
  try {
    const { id } = req.params
    const { id: userId, isAdmin } = req.user
    const user = await User.findById(id)
    if (user._id != userId && !isAdmin) {
      req.flash('error', 'No tens permisos per fer això!')
      return res.redirect('/invoices')
    }
    next()
  } catch (error) {
    req.flash('error', "Probablement l'usuari no existeix")
    res.redirect('/users')
  }
}

module.exports.isResponsable = (Model) => async (req, res, next) => {
  const { id } = req.params
  const model = await Model.findById(id)
  if (!model.responsable.equals(req.user._id)) {
    req.flash('error', 'No tens permisos per fer això!')
    return res.redirect('/invoices')
  }
  next()
}

module.exports.isResponsableOrAdmin = (Model) => async (req, res, next) => {
  const { id } = req.params
  const { id: userId, isAdmin } = req.user
  const model = await Model.findById(id)
  if (model.responsable._id != userId && !isAdmin) {
    req.flash('error', 'No tens permisos per fer això!')
    return res.redirect('/invoices')
  }
  next()
}

module.exports.isAdmin = async (req, res, next) => {
  try {
    const { id: userId } = req.user
    const user = await User.findById(userId)
    if (!user.isAdmin) {
      req.flash('error', 'No tens permisos per fer això!')
      return res.redirect('/invoices')
    }
    next()
  } catch (error) {
    req.flash('error', 'Hi ha hagut un error.')
    return res.redirect('/invoices')
  }
}

module.exports.isInvoiceAprovada = async (req, res, next) => {
  const { id } = req.params
  const invoice = await Invoice.findById(id)
  const isRebuda = invoice.status === 'rebuda'
  if (isRebuda) {
    req.flash('error', 'Aquesta commanda esta rebuda.')
    return res.redirect('/invoices')
  }
  next()
}

module.exports.isInvoiceRebuda = async (req, res, next) => {
  const { id } = req.params
  const invoice = await Invoice.findById(id)
  const isRebuda = invoice.status === 'rebuda'
  if (!isRebuda) {
    req.flash('error', 'Aquesta commanda no esta rebuda.')
    return res.redirect('/invoices')
  }
  next()
}

module.exports.requireLogin = async (req, res, next) => {
  if (req.user) {
    return next()
  } else {
    req.flash('error', "Has d'estar logat per veure la pagina.")
    res.redirect('/login')
  }
}

module.exports.handleRouteError = async (err, req, res, next) => {
  const { statusCode } = err
  if (statusCode === 404) {
    res.status(statusCode).render('404')
  } else {
    next(err)
  }
}

module.exports.handleError = async (err, req, res, next) => {
  res.render('error', { err })
  console.error(err)
  next(err)
}

module.exports.validateRecaptcha = async (req, res, next) => {
  if (process.env.NODE_ENV === 'test') return next()

  try {
    const gRecaptchaResponse = req.body['g-recaptcha-response']
    const secret = '6LcDV44pAAAAACxZIgn9aMiGmiovr9sWWfcceTFm'

    const params = new URLSearchParams()
    params.append('secret', secret)
    params.append('response', gRecaptchaResponse)

    const googleRes = await fetch('https://www.google.com/recaptcha/api/siteverify', {
      method: 'POST',
      body: params
    })
    const googleResJson = await googleRes.json()

    if (googleResJson.success) {
      next()
    } else {
      throw new Error()
    }
  } catch (err) {
    req.flash('error', 'Alguna cosa ha anat malament...')
    res.redirect(req.body.redirect)
  }
}
