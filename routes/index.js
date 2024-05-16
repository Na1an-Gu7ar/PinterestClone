var express = require('express');
var router = express.Router();
const userModel = require("./users")
const postModel = require("./posts");
const passport = require('passport');
const localStrategy = require('passport-local')
const upload = require("./multer")

passport.use(new localStrategy(userModel.authenticate()))

/* GET home page. */
router.get('/', function (req, res) {
  res.render('index')
});

router.get('/show/posts', isLoggedIn, async function (req, res) {
  const user = await userModel.findOne({username: req.session.passport.user})
  .populate("posts")
  res.render('allPosts', {user})
});

router.get('/addPost', isLoggedIn, async function (req, res) {
  const user = await userModel.findOne({username: req.session.passport.user})
  res.render('addPost', {user})
});

router.get('/login', function (req, res, next) {
  res.render("login", { error: req.flash('error') })
})

router.post('/uploadDp', isLoggedIn, upload.single('dp'), async function (req, res, next) {
  const user = await userModel.findOne({ username: req.session.passport.user })
  user.dp = req.file.filename
  await user.save()
  res.redirect("/profile")
})

router.post('/upload', isLoggedIn, upload.single('file'), async function (req, res, next) {
  if (!req.file) {
    return res.status(404).send("No files were uploaded")
  }
  const user = await userModel.findOne({ username: req.session.passport.user })
  const postdata = await postModel.create({
    image: req.file.filename,
    postText: req.body.filecaption,
    user: user._id
  })

  user.posts.push(postdata._id)
  await user.save()
  res.redirect("/profile")
})

router.get('/profile', isLoggedIn, async function (req, res) {
  let user = await userModel.findOne({
    username: req.session.passport.user
  })
    .populate("posts")
  res.render('profile', { user })
});

router.get('/feed', isLoggedIn, async function (req, res) {
  const user = userModel.findOne({username: req.session.passport.user})
  const posts = await postModel.find()
  .populate("user")
  res.render('feed', {user, posts})
});

router.post('/register', function (req, res) {
  var userDate = new userModel({
    username: req.body.username,
    email: req.body.email,
    fullName: req.body.fullName
  })

  userModel.register(userDate, req.body.password)
    .then(function (registereduser) {
      passport.authenticate("local")(req, res, function () {
        res.redirect('/profile')
      })
    })
})

router.post('/login', passport.authenticate('local', {
  successRedirect: '/profile',
  failureRedirect: '/login',
  failureFlash: true
}), function (req, res) {

})


router.get('/logout', function (req, res, next) {
  req.logout(function (err) {
    if (err) return next(err)
    res.redirect("/")
  }), function (req, res) {

  }
})

function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect("/login");
}

// router.get('/allposts', async function (req, res, next) {
//   let user = await userModel
//     .findOne({ _id: "65a51c9fc6882cf019a886de" })
//     .populate('posts')
//   res.send(user)
// })

// router.get('/create', async function (req, res) {
//   let userData = await userModel.create({
//     username: "Nayan",
//     password: "nuan",
//     posts: [],
//     email: "nayan@gmail.com",
//     fullName: "syllabus",
//   });
//   res.send(userData)
// });

// router.get('/createpost', async function (req, res) {
//   let postData = await postModel.create({
//     postText: "Hey there! I am using pinterest",
//     user: "65a51c9fc6882cf019a886de"
//   })
//   let user = await userModel.findOne({ _id: "65a51c9fc6882cf019a886de" })
//   user.posts.push(postData._id)
//   await user.save()
//   res.send("done")

// });

module.exports = router;
