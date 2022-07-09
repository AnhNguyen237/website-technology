const Users = require('../models/user');
const Order = require('../models/order');

exports.isAdminLoggedin = (req, rex, next) => {
  if (req.isAuthenticated() && req.user.username == 'admin') {
    return next();
  } else {
    res.redirect('/');
  }
}

exports.getAdmin = (req, res, next) => {
  res.render('admin/index', {
    title: 'admin',
    user: req.user
  })
}

exports.getManageAccounts = (req, res, next) => {
  Users.find({username: {$ne: 'admin'}})
    .then(users => {
      res.render('admin/manage-accounts', {
        title: "Quản lý tài khoản",
        user: req.user,
        users: users
      })
    })
}

exports.postBlockAccount = (req, res, next) => {
  let userId = req.params.userId;
  Users.findById(userId)
    .then(user => {
      if(user.isLock) {
        user.isLock = false;
      } else {
        user.isLock = true;
      }
      user.save();
      res.redirect('back');
    })
}

exports.postDeleteAccount = (req, res, next) => {
  let userId = req.params.userId;
  Users.deleteOne({_id: userId})
   .then(() => res.redirect("back"))
   .catch(err => console.log(err))
}

exports.getEditAccount = (req, res, next) => {
  let userId = req.params.userId;

  const messageSucc = req.flash("success")[0];
  const messageError = req.flash("error")[0];
  Users.findById(userId)
    .then(user => {
      console.log(user)
      Order.find({ user: user }).then(order => {
        console.log(user)
        res.render("admin/edit-account", {
          title: "Thông tin tài khoản",
          user: user,
          order: order,
          messageSucc: messageSucc,
          messageError:messageError
        });
      });
    })
}

exports.postEditAccount = (req, res, next) => {
  let userId = req.params.userId;

  Users.findById(userId)
    .then(user => {
      user.firstName = req.body.firstName;
      user.lastName = req.body.lastName;
      user.email = req.body.email;
      user.address = req.body.address;
      user.phoneNumber = req.body.phoneNumber;
      user.save();
    })
  res.redirect("back");
}