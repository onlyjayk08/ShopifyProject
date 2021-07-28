const express = require('express');
const router = express.Router();

const productController = require('../controllers/productController');
const customerController = require('../controllers/customerController');

router.get('/api/export/products', productController.exportProduct);
router.post('/api/export/addproduct', productController.addProduct);
router.post('/api/uploadcsv', productController.uploadcsv);
router.post('/api/import/productcsv', productController.uploadtodatabase);
router.post('/api/datatoproj', productController.importdata);
router.post('/api/export/custom_collection', productController.customCollection);
router.delete('/api/delete/products', productController.deleteallproduct);
router.get('/api/product/progress', productController.setProgress);

router.get('/api/export/customers', customerController.exportCustomers);
router.post('/api/uploadcustomercsv', customerController.uploadcustomercsv);
router.post('/api/import/customercsv', customerController.uploadtodatabase);
router.post('/api/import/customerdata', customerController.importCustomerData);
router.delete('/api/delete/customers', customerController.deleteallcustomers);
router.get('/api/customer/progress', customerController.setProgress);


module.exports = router