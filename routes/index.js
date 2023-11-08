var express = require('express');
var router = express.Router();
const nodemailer = require("nodemailer");

const USER = require("../models/userModels")
const passport = require("passport");
const LocalStrategy = require("passport-local");
passport.use(new LocalStrategy(USER.authenticate()));



/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index', { admin: req.user });
});

router.get('/signup', function (req, res, next) {
  res.render('signup', { admin: req.user });
});

router.get('/about', function (req, res, next) {
  res.render('about', { admin: req.user });
});

router.get('/forget', function (req, res, next) {
  res.render('forget', { admin: req.user });
});


router.post('/signup', async function (req, res, next) {

  try {
    await USER.register(
      { username: req.body.username, email: req.body.email },
      req.body.password
    );
    res.redirect("/signin");
  } catch (error) {
    console.log(error);
    res.send(error);
  }

});

function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) {
    next();
  } else {
    res.redirect("/signin");
  }
}

router.get('/signin', function (req, res, next) {
  res.render('login', { admin: req.user });
});

router.post(
  "/signin",
  passport.authenticate("local", {
    successRedirect: "/profile",
    failureRedirect: "/signin",
  }),
  function (req, res, next) { }
)

router.get("/signout", isLoggedIn, function (req, res, next) {
  req.logout(() => {
    res.redirect("/signin");
  });
});


router.post('/send-mail', async function (req, res, next) {
  try {
    const user = await USER.findOne({ email: req.body.email })
    if (!user) return res.send("USer Not Found")
    const otp = Math.floor(1000 + Math.random() * 9000);
    user.resetPasswordOtp = otp;
    await user.save();
    sendmailhandler(user.email,otp,res)
  } catch (error) {

  }

});

function sendmailhandler(email, otp, res) {
  const transport = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
      // TODO: replace `user` and `pass` values from <https://forwardemail.net>
      user: "rohitbanna101@gmail.com",
      pass: "luav lryv poxu bcht",
    },
  });
  // receiver mailing info
  const mailOptions = {
    from: "Devloper_pvt.limited<rohitbanna101@gmail.com>",
    to: email,
    subject: "Testing Mail Service",
    // text: req.body.message,
    html: `<h1>Your OTP iS ${otp} </h1>`,
  };

  transport.sendMail(mailOptions, (err, info) => {
    if (err) return res.send(err);
    // console.log(info);
    return res.send(
      "<h1 style='text-align:center;color: tomato; margin-top:10%'><span style='font-size:60px;'>✔️</span> <br />Email Sent! Check your inbox , <br/>check spam in case not found in inbox.</h1>"
    );
  });
}





// Read the database
router.get('/profile', async function (req, res, next) {
  try {
    const Users = await USER.find();
    res.render('profile', { Users: Users, admin: req.user });

  } catch (error) {
    res.send(error)
  }
});

router.get('/delete/:id', async function (req, res, next) {
  try {
    await USER.findByIdAndDelete(req.params.id)
    res.redirect("/profile")
  } catch (error) {
    res.send(error)
  }
});

router.get('/update/:id', async function (req, res, next) {
  try {
    const user = await USER.findById(req.params.id)
    res.render("update", { user: user, admin: req.user });
  } catch (error) {
    res.send(error)
  }
});

router.post('/update/:id', async function (req, res, next) {
  try {
    await USER.findByIdAndUpdate(req.params.id, req.body);
    res.redirect("/profile");
  } catch (error) {
    res.send(error)
  }
});



function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) {
    next();
  } else {
    res.redirect("/signin");
  }
}



module.exports = router;
