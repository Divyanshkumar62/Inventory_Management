const express=require('express');
const router=express.Router();
let{
    getBill,sendEmail,createBill,sendMessage,deleteBill,payBill,saveBillImage,showBillImage,getBillImage,printBill, customBill, getInvoices
    }=require('../controllers/billControllers')




router.get('/',getBill)
router.post('/create-bill',createBill)
router.get('/billdelete',deleteBill)
router.post('/payment',payBill)
router.put('/savebillimage',saveBillImage)
router.get('/showpage',showBillImage)
router.get('/showimage',getBillImage)
router.post('/printbill',printBill)
router.post('/send-email',sendEmail)
router.post('/send-message',sendMessage)
router.get('/customize', customBill)
router.get('/invoices', getInvoices)



module.exports=router 