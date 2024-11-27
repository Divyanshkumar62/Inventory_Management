const express=require('express');

const app=express()

const router=express.Router();
const { createProduct,searchProductById,renderUpdate,updateProduct,showProducts,searchProduct,qrSearchProduct,deleteProduct,renderDelete,customWork } = require('../controllers/productControllers');

const upload=require('../multer')

 







router.post('/create',upload.single('image'),createProduct)
router.get('/entry',showProducts)
router.get('/search',searchProduct)
router.get('/search/:id',searchProductById)
router.get('/qrsearch',qrSearchProduct)
router.get('/del',renderDelete)
router.get('/delete',deleteProduct) 
router.post('/update',upload.single('image'),updateProduct)
router.get('/update',renderUpdate)


 

 
module.exports=router