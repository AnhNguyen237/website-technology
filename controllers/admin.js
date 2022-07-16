const Users = require('../models/user');
const Orders = require('../models/order');
const Products = require('../models/product');
const { getProducts } = require('./product');
const User = require('../models/user');

exports.isAdminLoggedin = (req, rex, next) => {
  if (req.isAuthenticated() && req.user.username == 'admin') {
    return next();
  } else {
    res.redirect('/');
  }
};

exports.getAdmin = (req, res, next) => {
  res.render('admin/index', {
    title: 'admin',
    user: req.user,
  });
};

exports.getManageAccounts = (req, res, next) => {
  Users.find({ username: { $ne: 'admin' } }).then((users) => {
    res.render('admin/manage-accounts', {
      title: 'Quản lý tài khoản',
      user: req.user,
      users: users,
    });
  });
};

exports.postBlockAccount = (req, res, next) => {
  let userId = req.params.userId;
  Users.findById(userId).then((user) => {
    if (user.isLock) {
      user.isLock = false;
    } else {
      user.isLock = true;
    }
    user.save();
    res.redirect('back');
  });
};

exports.postDeleteAccount = (req, res, next) => {
  let userId = req.params.userId;
  Users.deleteOne({ _id: userId })
    .then(() => res.redirect('back'))
    .catch((err) => console.log(err));
};

exports.getEditAccount = (req, res, next) => {
  let userId = req.params.userId;

  const messageSucc = req.flash('success')[0];
  const messageError = req.flash('error')[0];
  Users.findById(userId).then((user) => {
    Orders.find({ user: user }).then((order) => {
      res.render('admin/edit-account', {
        title: 'Thông tin tài khoản',
        user: user,
        order: order,
        messageSucc: messageSucc,
        messageError: messageError,
      });
    });
  });
};

exports.postEditAccount = (req, res, next) => {
  let userId = req.params.userId;

  Users.findById(userId).then((user) => {
    user.firstName = req.body.firstName;
    user.lastName = req.body.lastName;
    user.email = req.body.email;
    user.address = req.body.address;
    user.phoneNumber = req.body.phoneNumber;
    user.save();
  });
  res.redirect('back');
};

// Quản lý sản phẩm

exports.getManageProducts = (req, res, next) => {
  Products.find({}).then((products) => {
    res.render('admin/manage-products', {
      title: 'Quản lý sản phẩm',
      user: req.user,
      products: products,
    });
  });
};

exports.getSearchProduct = (req, res, next) => {
  let searchText = req.query.searchText !== undefined ? req.query.searchText : searchText;

  Products.find({
    $text: { $search: searchText },
  })
    .limit(12)
    .then((products) => {
      res.send({
        title: 'Kết quả tìm kiếm cho ' + searchText,
        searchProducts: products,
      });
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.postDeleteProduct = (req, res, next) => {
  let productId = req.params.productId;
  Products.deleteOne({ _id: productId })
    .then(() => res.redirect('back'))
    .catch((err) => console.log(err));
};

exports.getEditProduct = (req, res, next) => {
  let productId = req.params.productId;

  Products.findById(productId).then((product) => {
    res.render('admin/edit-product', {
      title: 'Thông tin sản phẩm',
      product: product,
      user: req.user,
    });
  });
};

exports.postEditProduct = (req, res, next) => {
  let productId = req.params.productId;

  Products.findByIdAndUpdate(productId, req.body)
    .then(() => res.redirect('/admin/manage-products'))
    .catch(next);
};

exports.postDeleteImage = (req, res, next) => {
  const productId = req.params.productId;
  const imageName = req.query.image;

  Products.findByIdAndUpdate(productId, { $pull: { images: { $in: [imageName] } } }).then(() => res.redirect('back'));
};

exports.getAddProduct = (req, res, next) => {
  res.render('admin/add-product', {
    title: 'Thêm sản phẩm',
    user: req.user,
  });
};

exports.postAddProduct = (req, res, next) => {};

//Quản lý đơn hàng
exports.getManageOrders = (req, res, next) => {
  Orders.find({}).then((orders) => {
    res.render('admin/manage-orders', {
      title: 'Quản lý đơn hàng',
      user: req.user,
      orders: orders,
    });
  });
};

exports.getSearchOrder = (req, res, next) => {
  let searchText = req.query.searchText !== undefined ? req.query.searchText : searchText;

  var ObjectId = require("mongodb").ObjectId
 
  if(ObjectId.isValid(searchText)) {
    Orders.findById(searchText)
    .then((order) => {
      res.send(order);
    })
    .catch((err) => {
      console.log(err);
    });
  } else {
    res.send(null);
  }
  // false
  
// true

  
};

exports.getOrderDetail = (req, res, next) => {
  let orderId = req.params.orderId;

  Orders.findById(orderId).then((order) => {
    User.findById(order.user).then((user) => {
      res.render('admin/order-detail', {
        title: 'Thông tin đơn hàng',
        order: order,
        username: user.username,
        user: req.user,
      });
    });
  });
};

exports.postOrderDetail = (req, res, next) => {
  let orderId = req.params.orderId;

  Orders.findByIdAndUpdate(orderId, req.body)
    .then(() => res.redirect('/admin/manage-orders'))
    .catch(next);
};

// Thống kê doanh số
exports.getStatistics = (req, res, next) => {
  res.render('admin/statistics', {
    user: req.user,
  });
};

function statisticsType(danhsach, type) {
  var count = 0;
  var temp = danhsach.filter((x) => x.item.type === type);
  for (var j = 0; j < temp.length; j++) {
    count = temp[j].quantity;
  }
  return count;
}

function statisticsAll(all, callback) {
  var smartphoneCount = 0;
  var laptopCount = 0;
  var iPadCount = 0;

  Orders.find({})
    .then(order =>{
    })
}

function statisticsDay(day, callback) {

}

function statisticsMonth(month, callback) {
  
}

function statisticsYear(year, callback) {
  
}


exports.postStatisticQuery = (req, res, next) => {
  var type = req.body.loai;
  var ngay = req.body.bday;
  var thang = req.body.bmonth;
  var nam = req.body.byear;
  console.log(type + ' ' + ngay + ' ' + thang + ' ' + nam);
  if (type == 'none') {
    thongke.TongDoanhThu(function (result) {
      res.render('manage', {
        tongdoanhthu: result,
        user: req.user,
        body: 'staff/thongke.ejs',
      });
    });
  } else if (type == 'ngay') {
    thongke.thongKeTheoNgay(ngay, function (result) {
      console.log(result);
      res.render('manage', {
        tongdoanhthu: result,
        user: req.user,
        body: 'staff/thongkedoanhso.ejs',
      });
    });
  } else if (type == 'thang') {
    thongke.thongKeTheoThang(thang, function (result) {
      console.log(result);
      res.render('manage', {
        tongdoanhthu: result,
        user: req.user,
        body: 'staff/thongkedoanhso.ejs',
      });
    });
  } else if (type == 'nam') {
    thongke.thongKeTheoNam(nam, function (result) {
      console.log(result);
      res.render('manage', {
        tongdoanhthu: result,
        user: req.user,
        body: 'staff/thongkedoanhso.ejs',
      });
    });
  }
}