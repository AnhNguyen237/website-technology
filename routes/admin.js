var express = require('express');
var router = express.Router();
const adminController = require('../controllers/admin');

router.get('/admin', adminController.isAdminLoggedin, adminController.isAdminLoggedin, adminController.getAdmin);
router.get('/admin/manage-accounts', adminController.isAdminLoggedin, adminController.getManageAccounts);
router.post('/admin/block-account/:userId', adminController.isAdminLoggedin, adminController.postBlockAccount);
router.post('/admin/delete-account/:userId', adminController.isAdminLoggedin, adminController.postDeleteAccount);
router.get('/admin/edit-account/:userId', adminController.isAdminLoggedin, adminController.getEditAccount);
router.post('/admin/edit-account/:userId', adminController.isAdminLoggedin, adminController.postEditAccount);

router.get('/admin/manage-products', adminController.isAdminLoggedin, adminController.getManageProducts);
router.get('/admin/search-product', adminController.isAdminLoggedin, adminController.getSearchProduct);
router.post('/admin/delete-product/:productId', adminController.isAdminLoggedin, adminController.postDeleteProduct);
router.get('/admin/edit-product/:productId', adminController.isAdminLoggedin, adminController.getEditProduct);
router.post('/admin/edit-product/:productId', adminController.isAdminLoggedin, adminController.postEditProduct);
router.post('/admin/edit-product/delete-image/:productId', adminController.isAdminLoggedin, adminController.postDeleteImage);
router.get('/admin/add-product', adminController.isAdminLoggedin, adminController.getAddProduct);
router.post('/admin/add-product', adminController.isAdminLoggedin, adminController.postAddProduct);

router.get('/admin/manage-orders', adminController.isAdminLoggedin, adminController.getManageOrders);
router.get('/admin/search-order', adminController.isAdminLoggedin, adminController.getSearchOrder);
router.get('/admin/order-detail/:orderId', adminController.isAdminLoggedin, adminController.getOrderDetail);
router.post('/admin/order-detail/:orderId', adminController.isAdminLoggedin, adminController.postOrderDetail);

router.get('/admin/statistics', adminController.isAdminLoggedin, adminController.getStatistics);

module.exports = router;
