const passport = require("passport");
const Cart = require("../models/cart");
const nodemailer = require("nodemailer");
const {OAuth2Client} = require("google-auth-library");
const Users = require("../models/user");
const key = require("../key");
var bcrypt = require("bcryptjs");
var randomstring = require("randomstring");
const GOOGLE_MAILER_CLIENT_ID = key.ClientID;
const GOOGLE_MAILER_CLIENT_SECRET = key.ClientSecret;
const GOOGLE_MAILER_REFRESH_TOKEN = key.RefreshToken;
const ADMIN_EMAIL_ADDRESS = key.EmailAddress;
const myOAuth2Client = new OAuth2Client(GOOGLE_MAILER_CLIENT_ID, GOOGLE_MAILER_CLIENT_SECRET)

myOAuth2Client.setCredentials({refresh_token: GOOGLE_MAILER_REFRESH_TOKEN})

exports.getLogin = (req, res, next) => {
  var cartProduct;
  if (!req.session.cart) {
    cartProduct = null;
  } else {
    var cart = new Cart(req.session.cart);
    cartProduct = cart.generateArray();
  }
  const message = req.flash("error")[0];
  if (!req.isAuthenticated()) {
    res.render("login", {
      title: "Đăng nhập",
      message: `${message}`,
      user: req.user,
      cartProduct: cartProduct
    });
  } else {
    res.redirect("/");
  }
};

exports.postLogin = (req, res, next) => {
  passport.authenticate("local-signin", {
    successReturnToOrRedirect: "/merge-cart",
    failureRedirect: "/login",
    failureFlash: true
  })(req, res, next);
};

exports.getLogout = (req, res, next) => {
  if (req.session.cart) {
    req.session.cart = null;
  }
  req.logout();
  res.redirect("/");
};

exports.getSignUp = (req, res, next) => {
  const message = req.flash("error")[0];
  var cartProduct;
  if (!req.session.cart) {
    cartProduct = null;
  } else {
    var cart = new Cart(req.session.cart);
    cartProduct = cart.generateArray();
  }
  if (!req.isAuthenticated()) {
    res.render("create-account", {
      title: "Đăng ký",
      message: `${message}`,
      user: req.user,
      cartProduct: cartProduct
    });
  } else {
    res.redirect("/");
  }
};

exports.postSignUp = (req, res, next) => {
  passport.authenticate("local-signup", {
    successReturnToOrRedirect: "/verify-email",
    failureRedirect: "/create-account",
    failureFlash: true
  })(req, res, next);
};

exports.getVerifyEmail = async (req, res, next) => {
  try {
      const myAccessTokenObject = myOAuth2Client.getAccessToken()

      const myAccesstToken = myAccessTokenObject ?. token

      var transporter = nodemailer.createTransport({
          service: 'gmail',
          auth: {
              type: 'OAuth2',
              user: ADMIN_EMAIL_ADDRESS,
              clientId: GOOGLE_MAILER_CLIENT_ID,
              clientSecret: GOOGLE_MAILER_CLIENT_SECRET,
              refreshToken: GOOGLE_MAILER_REFRESH_TOKEN,
              accessToken: myAccesstToken
          }
      });
      var verification_token = randomstring.generate({length: 10});

      Users.findOne({username: req.user.username}).then(user => {
          let mainOptions = {
              from: "Trùm Công Nghệ",
              to: req.user.email,
              subject: "Gửi mã xác thực",
              html: "<p>Mã xác thực của bạn là: </p>" + verification_token
          };
          transporter.sendMail(mainOptions);

          user.verify_token = verification_token;
          user.save();
      });
  } catch (error) {
      console.log(error)
      res.status(500).json({errors: error.message})
  }


  const message = req.flash("error")[0];
  res.render("verify-email", {
      title: "Xác thực email",
      message: `${message}`,
      user: req.user
  });
};

exports.postVerifyEmail = (req, res, next) => {
  const token = req.body.token;
  Users.findOne({
      username: req.user.username
  }, (err, user) => {
      if (token == user.verify_token) {
          user.isAuthenticated = true;
          user.save();
          return res.redirect("/login");
      } else if (token != user.verify_token) {
          req.flash("error", "Mã xác thực không hợp lệ!");
          return res.redirect("/verify-email");
      }
  });
};

exports.getForgotPass = (req, res, next) => {
  const message = req.flash("error")[0];
  var cartProduct;
  if (!req.session.cart) {
    cartProduct = null;
  } else {
    var cart = new Cart(req.session.cart);
    cartProduct = cart.generateArray();
  }
  res.render("forgot-password", {
    title: "Quên mật khẩu",
    message: `${message}`,
    user: req.user,
    cartProduct: cartProduct
  });
};

exports.postForgotPass = async (req, res, next) => {
  try {
    const email = req.body.email;
    Users.findOne({ email: email }, (err, user) => {
      if (!user) {
        req.flash("error", "Email không hợp lệ");
        return res.redirect("/forgot-password");
      } else {
        const myAccessTokenObject = myOAuth2Client.getAccessToken()

        const myAccesstToken = myAccessTokenObject ?. token

        var transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                type: 'OAuth2',
                user: ADMIN_EMAIL_ADDRESS,
                clientId: GOOGLE_MAILER_CLIENT_ID,
                clientSecret: GOOGLE_MAILER_CLIENT_SECRET,
                refreshToken: GOOGLE_MAILER_REFRESH_TOKEN,
                accessToken: myAccesstToken
            }
        });
        var tpass = randomstring.generate({
          length: 6
        });
        let mainOptions = {
          from: "Trùm Công Nghệ",
          to: email,
          subject: "Quên mật khẩu",
          html: "<p>Mật khẩu mới của bạn là: </p>" + tpass
        };
        transporter.sendMail(mainOptions)
        bcrypt.hash(tpass, 12).then(hashPassword => {
          user.password = hashPassword;
          user.save();
        });

        res.redirect("/login");
      }
    });
  }catch (error) {
    res.redirect("/forgot-password");
}
};

exports.getChangePassword = (req, res, next) => {
  const message = req.flash("error")[0];
  var cartProduct;
  if (!req.session.cart) {
    cartProduct = null;
  } else {
    var cart = new Cart(req.session.cart);
    cartProduct = cart.generateArray();
  }
  res.render("change-password", {
    title: "Đổi mật khẩu",
    message: `${message}`,
    user: req.user,
    cartProduct: cartProduct
  });
};

exports.postChangePassword = (req, res, next) => {
  bcrypt.compare(req.body.oldpass, req.user.password, function(err, result) {
    console.log("alo?");
    if (!result) {
      req.flash("error", "Mật khẩu cũ không đúng!");
      return res.redirect("back");
    } else if (req.body.newpass != req.body.newpass2) {
      console.log(req.body.newpass);
      console.log(req.body.newpass2);
      req.flash("error", "Nhập lại mật khẩu không khớp!");
      return res.redirect("back");
    } else {
      bcrypt.hash(req.body.newpass, 12).then(hashPassword => {
        req.user.password = hashPassword;
        req.user.save();
      });
      req.flash("success", "Đổi mật khẩu thành công!");
      res.redirect("/account");
    }
  });
};
