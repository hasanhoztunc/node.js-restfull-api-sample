const express = require('express')
const router = express.Router()
const multer = require('multer')
const checkAuth = require('../middleware/check-auth')

const ProductController = require('../controllers/products')

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './uploads/')
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname)
    }
})

const fileFilter = (req, file, cb) => {
    if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/jpg' || file.mimetype === 'image/png') {
        cb(null, true)
    } else {
        cb(null, false)
    }
}

const upload = multer(
    {
        storage: storage, 
        limits: {
            fileSize: 1024 * 1024 *4
        },
        fileFilter: fileFilter
    }
)

const Product = require('../../modals/product')

router.get('/', ProductController.products_get_all)

router.post('/', checkAuth, upload.single('productImage'), ProductController.products_create_product)

router.get('/:productId', ProductController.products_get_product)

router.patch('/:productId', checkAuth, ProductController.products_update_product)

router.delete('/:productId', checkAuth, ProductController.product_delete_product)

module.exports = router