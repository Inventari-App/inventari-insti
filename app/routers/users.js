const express = require('express')
const router = express.Router()
const passport = require('passport')
const catchAsync = require('../utils/catchAsync')
const User = require('../models/user')
const Department = require('../models/department')
const {
  getAllUsers,
  getUser,
  updateUser,
  deleteUser,
  createUser,
  verifyUser,
  createCenter,
  sendPasswordReset
} = require('../controllers/users')
const { isAdmin, isSameUserOrAdmin, validateRecaptcha } = require('../middleware')
const Center = require('../models/center')
const { localizeBoolean, sortByKey } = require('../utils/helpers')

router.get('/register', (req, res) => {
  res.render('users/register')
})

router.get('/verify', catchAsync(verifyUser))

router.post('/register-center', catchAsync(validateRecaptcha), catchAsync(createCenter))

router.post('/register', catchAsync(createUser))

router.get('/users',
  isAdmin,
  catchAsync(async (req, res) => {
    const users = await getAllUsers(req)
    res.render('users/index', { users: sortByKey(users, 'name') })
  })
)

router.get(
  '/users/new',
  isAdmin,
  catchAsync(async (req, res, next) => {
    const center = await Center.findById(req.user.center)
    if (!center) return next()

    res.render('users/new', { center })
  })
)

router.get(
  '/users/:id',
  isSameUserOrAdmin,
  catchAsync(async (req, res) => {
    const { user, center } = await getUser(req)
    res.render('users/show', {
      user,
      center,
      isAdmin: req.user.isAdmin,
      isOwner: user.id == req.user.id,
      localizeBoolean
    })
  })
)

router.get(
  '/users/:id/edit',
  isSameUserOrAdmin,
  catchAsync(async (req, res) => {
    const user = await getUser(req)
    const departments = await Department.find()
    res.render('users/edit', { ...user, departments, localizeBoolean })
  })
)

router.put(
  '/users/:id',
  isSameUserOrAdmin,
  catchAsync(async (req, res) => {
    const user = await updateUser(req)
    res.redirect(301, `/users/${user._id}`)
  })
)

router.delete('/users/:id', isAdmin, catchAsync(deleteUser))

router.get('/users')

router.get('/login',
  (req, res, next) => {
    if (res.locals?.currentUser) {
      return res.redirect('/')
    }
    next()
  },
  (req, res) => {
    res.render('users/login')
  })

router.get('/account-recovery', (req, res) => {
  res.render('users/account-recovery')
})

router.get('/reset-sent', (req, res) => {
  res.render('users/reset-sent')
})

router.get('/reset-error', (req, res) => {
  res.render('users/reset-error')
})

router.post(
  '/login',
  async (req, res, next) => {
    try {
      const { isVerified } = await User.findByUsername(req.body.username)
      if (!isVerified) {
        req.flash('error', 'Has de verificar el teu correu electronic')
        res.redirect(301, '/login')
      } else {
        next()
      }
    } catch (error) {
      req.flash('error', "L'usuari o el password son incorrectes")
      res.redirect(301, '/login')
    }
  },
  passport.authenticate('local', {
    failureFlash: true,
    failureRedirect: '/login',
    failureMessage: true,
    keepSessionInfo: true
  }),
  (req, res) => {
    req.flash('success', 'Benvingut/da de nou!')
    const redirectUrl = req.session.returnTo || '/invoices'
    // delete req.session.returnTo;
    res.redirect(301, redirectUrl)
  }
)

router.post('/account-recovery', catchAsync(sendPasswordReset))

router.get('/reset', async (req, res) => {
  const { token, userId } = req.query
  const user = await User.findById(userId)
  if (
    !user ||
    user.resetPasswordHash !== token ||
    user.resetPasswordTs < Date.now()
  ) {
    return res.redirect('/reset-error')
  }
  res.render('users/reset', { token, userId })
})

router.post('/reset', async (req, res) => {
  const { userId, token, password: newPassword } = req.body
  const user = await User.findById(userId)

  if (
    !user ||
    user.resetPasswordHash !== token ||
    user.resetPasswordTs < Date.now()
  ) {
    return res.redirect('/reset-error')
  }

  // Update the user's password and clear the reset token
  await user.setPassword(newPassword)
  user.resetPasswordHash = undefined
  user.resetPasswordTs = undefined
  await user.save()

  req.flash('success', "La contrasenya s'ha restablert amb exit.")
  res.redirect('/login')
})

router.post('/logout', (req, res, next) => {
  req.logout(function (err) {
    if (err) return next(err)
    res.redirect(301, '/login')
  })
})

module.exports = router
