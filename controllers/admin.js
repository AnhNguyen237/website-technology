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

  var updateProduct = req.body;

  Products.findById(productId)
    .then(product => {
      updateProduct.images = product.images;
      productColor = updateProduct.color.replace(/\s+/g, '');
      updateProduct.colors = productColor.split(',');
      return updateProduct
    })
    .then((updateProduct) => {
      if(req.body.image != '') {
        updateProduct.images.push(req.body.image);
      }
      Products.findByIdAndUpdate(productId, updateProduct)
        .then(() => res.redirect('/admin/manage-products'))
        .catch(next);
    })
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

exports.postAddProduct = (req, res, next) => {
  var productItem = req.body;
  productItem.images = [req.body.images];
  productColor = productItem.color.replace(/\s+/g, '');
  productItem.colors = productColor.split(',');
  console.log(productItem);
  new Products(productItem).save();
  res.redirect('/admin/manage-products');
};

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
  Orders.find({})
    .then(orders => {
      orders.forEach(order => {
        console.log(order)
      })
    })
  res.render('admin/statistics', {
    user: req.user,
  });
};

var cache;

exports.postStatisticsQuery = (req, res, next) => {
  cache = req.body;
  res.redirect('/admin/statistics/chart')
}

exports.getStatisticsChart = (req, res, next) => {
  let year ='';
  let all = false;
  if(cache.date == 'null') {
    all = true;
  } else {
    year = cache.date;
  }

  var chartData = {
    T1: {
      qty: 0,
      price: 0
    },
    T2: {
      qty: 0,
      price: 0
    },
    T3: {
      qty: 0,
      price: 0
    },
    T4: {
      qty: 0,
      price: 0
    },
    T5: {
      qty: 0,
      price: 0
    },
    T6: {
      qty: 0,
      price: 0
    },
    T7: {
      qty: 0,
      price: 0
    },
    T8: {
      qty: 0,
      price: 0
    },
    T9: {
      qty: 0,
      price: 0
    },
    T10: {
      qty: 0,
      price: 0
    },
    T11: {
      qty: 0,
      price: 0
    },
    T12: {
      qty: 0,
      price: 0
    }
  };

  Orders.find({})
    .then(orders => {
      orders.forEach(order => {
        let totalQty = order.cart.totalQty;
        let totalPrice = order.cart.totalPrice;


        let bookDay = (order.date.getDate()).toString();
        let bookMonth = (order.date.getMonth() + 1).toString();
        let bookYear = (order.date.getFullYear()).toString();

        if(bookYear == year) {
          switch(bookMonth) {
            case '1':
              chartData.T1.qty += totalQty;
              chartData.T1.price += totalPrice;
              break;
            case '2':
              chartData.T2.qty += totalQty;
              chartData.T2.price += totalPrice;
              break;
            case '3':
              chartData.T3.qty += totalQty;
              chartData.T3.price += totalPrice;
              break;
            case '4':
              chartData.T4.qty += totalQty;
              chartData.T4.price += totalPrice;
              break;
            case '5':
              chartData.T5.qty += totalQty;
              chartData.T5.price += totalPrice;
              break;
            case '6':
              chartData.T6.qty += totalQty;
              chartData.T6.price += totalPrice;
              break;
            case '7':
              chartData.T7.qty += totalQty;
              chartData.T7.price += totalPrice;
              break;
            case '8':
              chartData.T8.qty += totalQty;
              chartData.T8.price += totalPrice;
              break;
            case '9':
              chartData.T9.qty += totalQty;
              chartData.T9.price += totalPrice;
              break;
            case '10':
              chartData.T10.qty += totalQty;
              chartData.T10.price += totalPrice;
              break;
            case '11':
              chartData.T11.qty += totalQty;
              chartData.T11.price += totalPrice;
              break;
            case '12':
              chartData.T12.qty += totalQty;
              chartData.T12.price += totalPrice;
              break;
          }
        }
      })

      res.send(chartData);
    })
}