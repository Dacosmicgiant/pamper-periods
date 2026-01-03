const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const { protect, authorize } = require('../middlewares/auth');
const { addReview } = require('../controllers/productController');


// public
router.get('/', productController.list);
router.get("/featured",productController.getFeaturedProducts);
router.get('/:id', productController.get);
router.post("/:id/review", protect, productController.addReview);




// vendor routes (create/update/delete)
router.post('/', protect, authorize('vendor','admin'), productController.create);
router.put("/:id/featured",protect,authorize('vendor','admin'), productController.updateFeaturedStatus);
router.put('/:id', protect, authorize('vendor','admin'), productController.update);
router.delete('/:id', protect, authorize('vendor','admin'), productController.remove);

module.exports = router;
