var express = require("express");
var router = express.Router();
const adminController = require("../controllers/admin");

router.get('/admin', adminController.getAdmin);
router.get('/admin/manage-accounts', adminController.getManageAccounts)
router.post('/admin/block-account/:userId', adminController.postBlockAccount)
router.post('/admin/delete-account/:userId', adminController.postDeleteAccount)
router.get('/admin/edit-account/:userId', adminController.getEditAccount)
router.post('/admin/edit-account/:userId', adminController.postEditAccount)

module.exports = router;