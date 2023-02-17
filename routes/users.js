const express = require('express');
const router = express.Router();
const passport = require('passport');
const catchAsync = require('../utils/catchAsync');
const User = require('../models/user');

router.get('/register', (req, res) => {
    res.render('users/register');
});

router.post('/register', catchAsync(async (req, res, next) => {
    try {
        const { email, username, password } = req.body;
        const user = new User({ email, username });
        const registeredUser = await User.register(user, password);
        req.login(registeredUser, err => {
            if (err) return next(err);
            req.flash('success', "Benvingut/da a Gestió d'Inventari!");
            res.redirect('/articles');
        })
    } catch (e) {
        req.flash('error', e.message);
        res.redirect('register');
    }
}));


router.get('/users', catchAsync(async (req,res) => {
  

    const users = await User.find({});
    res.render('users/index', { users })
  
}));



router.get('/users/:id', catchAsync(async (req, res,) => {
  const user = await User.findById(req.params.id)
  res.render('users/show', { user });
}));

router.get('/users/:id/edit', catchAsync( async (req, res) => {
  const user = await User.findById(req.params.id)
  res.render('users/edit', { user });
}));

router.put('/users/:id', catchAsync(async (req, res) => {
  const { id } = req.params;
  const user = await User.findByIdAndUpdate(id, { ...req.body.user });
  res.redirect(`/users/${user._id}`)
}));

router.delete('/users/:id', catchAsync(async (req, res) => {
  const { id } = req.params;
  await User.findByIdAndDelete(id);
  res.redirect('/users');
}));


router.get('/users')

router.get('/login', (req, res) => {


    res.render('users/login');
})

router.post('/login', passport.authenticate('local', { failureFlash: true, failureRedirect: '/login', failureMessage:true, keepSessionInfo: true }), (req, res) => {
    req.flash('success', 'Benvingut/da de nou!');
    const redirectUrl = req.session.returnTo || '/';
    //delete req.session.returnTo;
    res.redirect(redirectUrl);
})



  router.get('/logout', (req, res, next) => {
    req.logout(function (err) {
      if (err) {
        return next(err);
      }
      req.flash('success', 'Adéu!');
      res.redirect('/');
    });
  });


  // forgot route
  
router.get

  

module.exports = router;
