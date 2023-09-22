const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminUserUpdate');

router.get('/admin/user', adminController.getBrotoUsers);
router.get('/admin/fumigationuser', adminController.getFumigationUsers);
router.post('/admin/userupdate', adminController.updateUserWeek);
router.post('/admin/useridupdate', adminController.updateUserId);

module.exports = router;
