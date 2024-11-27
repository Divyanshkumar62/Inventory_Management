const billModel=require('../models/billSchema')
const productModel=require('../models/ProductSchema')
const saveBillModel=require('../models/saveBillSchema')
const Razorpay=require('razorpay')
const nodemailer=require('nodemailer')
const fs = require('fs');
const PDFDocument = require('pdfkit');
const path=require('path')
const twilio = require('twilio');

// Twilio credentials from your account
const accountSid = 'AC5c7b62a11f517f76721c6cb919716c17';
const authToken = '8b0e81d241a1283c4ac5ad4840e2dc89';
const client = twilio(accountSid, authToken);


const getBill=async(req,res)=>{
    let items=await productModel.find({});

   res.render('bill2',{
      items,
      name:"kanhaiya",
      mob:8879674523
   })

}
const createBill=async(req,res)=>{
    let{ProductId,ProductName,ProductPrice}=req.body;
    let createdProduct=await billModel.create({
       ProductId,
       ProductName,
       ProductPrice,
    
    })
    console.log(createdProduct);
    res.send("bill inserted")
}
const deleteBill=async(req,res)=>{
    let data=await billModel.deleteMany({});
    console.log(data)
    return res.json({deletedData:data})

}
const saveBillImage=async(req,res)=>{
   //  console.log(req.body.image)
   let {screenshot,mobo,customer}=req.body
   let bill=await saveBillModel.find({}).sort({_id:-1}).limit(1);
   let resbill=await saveBillModel.findByIdAndUpdate(bill[0]._id,{BillImage:screenshot,
      CustomerName:customer,
      MobileNumber:mobo
      
   },{
      new:true,
      runValidators:true
   }) 
   let bill2=await saveBillModel.find({}).sort({_id:-1}).limit(1);
   // console.log("bill is",bill2)
   if (!resbill) {
      return res.status(404).json({ error: 'Bill not found' });
    }
   
   
   res.json({bill:resbill})

}

const customBill = (req, res) => {
   res.render('customBill')
}
 
const showBillImage=(req,res)=>{
    res.render('showImage')
} 

const getInvoices = async (req, res) => {
   const showBill = await saveBillModel.find().sort({ createdAt: -1 }).limit(10)
   res.render('invoices', {showBill})
} 

const getBillImage=async(req,res)=>{
   //  console.log(req.query.q)
   let data=await saveBillModel.find({BillId:req.query.q});
   
   res.json({ans:data})
}
const printBill=async(req,res)=>{
    let userDetail=req.body;
  
    
   let data=await billModel.find();
   console.log(data);
   
   let save=await saveBillModel.find({})
   
   
     let billAmount=0;
     data.map((item)=>{
      billAmount+=item.ProductPrice; 

     })
     if(data.length>0){
     let  billId="B0"
 
   
           
         
            billId=billId.slice(0,1)+save.length;
            console.log(billId);
            
      
      let ans=await saveBillModel.create({
         BillId:billId,
         Products: data.map(item => (
            
            {
            ProductId: item.ProductId,
            ProductName: item.ProductName,
            ProductPrice: item.ProductPrice,
          }
          
         )),
         BillAmount:billAmount
        
         
      })
      console.log(ans)

       
      res.render('finalbill',{
         data,
         billId,
         billAmount,
      // userDetail
       })
      }else{
         req.flash('warning1',"First Add the Products")
         res.redirect('/bill/')
      }

}
const payBill=async (req,res)=>{
   const {amount}=req.body;
   
   try{
   var instance = new Razorpay({ key_id: 'rzp_test_tfx9olkFQFIWqI', key_secret: '9uIetaIgaNVMMtuypkqPZ52y' })

   let order=await instance.orders.create({
      amount: amount*100,
      currency: "INR",
      receipt: `receipt#${Date.now()}`,
    
    })
    res.status(201).json({
      success:true,
      orderId:order.id,
      amount
    })
   
   }catch(err){
      console.error(err)
      res.status(500).json({error:"Internal Server Error"})
   }




}

const sendEmail=async (req,res)=>{
   let {billimg,cmail,cname}=req.body
   let date=new Date()
   

   const doc = new PDFDocument();
   const outputPdfPath = path.join(__dirname, '..', 'public', 'pdfs', `${Date.now()}.pdf`);

   const writeStream = fs.createWriteStream(outputPdfPath);
   doc.pipe(writeStream);
   doc.image(billimg, {
      fit: [500, 700], // Adjust size as needed
      align: 'center',
      valign: 'top'
    });
    doc.end();
    writeStream.on('finish', () => {
      console.log('PDF created successfully:', outputPdfPath);
    });

   

   let transporter = nodemailer.createTransport({
      service: 'gmail', // Use 'gmail', 'outlook', or specify an SMTP server
      auth: {
        user: 'gkanha1500@gmail.com', // Your email address
        pass: 'xrya qogi ajxg ilth'   // Your email password or app password
      }
    });
    let mailOptions = {
        from: 'gkanha1500@gmail.com',       // Sender's email address
        to: cmail,  // Recipient's email address 
        subject: 'Your Bill Recipt Of Purchase', // Subject line
        // text: 'Hello, this is a test email sent from Node.js using Nodemailer.' // Plain text body
        // Optionally, you can use 'html' for HTML content:
        html:`
             <h1>Hello, ${cname}!</h1>
<h3>This is the bill reciept of the products you have purchased on ${date.toDateString()}</h3>
        `,
        attachments: [
         {
            path:outputPdfPath
         }
     ]
      };
      transporter.sendMail(mailOptions, (err, info) => {
        if (err) {
          console.error('Error occurred:', err);
          res.status(500).json({error:err})
        } else {
          console.log('Email sent successfully:', info.response);
          res.status(200).json({success:info.response})
        }
      });
      
}

const sendMessage=async (req,res)=>{
   try{
      
      const{name,phone}=req.body
      const message=await client.messages.create({
          body: `Hello ${name}!<br>Thank you for shopping with kanha Ltd.`,
          from: '+1 412 357 2287', // Twilio number
          to:`+91${phone}`  // Receiver's number (must be verified in trial mode)
        })
        console.log(`Message sent with SID: ${message.sid}`);
        return res.json({sid:message.sid})
      }catch(err){
         console.error(`Failed to send message: ${err.message}`);
         res.status(500).json({error:"message not sent"})
      }
      
      
      
}
module.exports={
    getBill,
    createBill,
    deleteBill,
    saveBillImage,
    showBillImage,
    getBillImage,
    printBill,
    payBill,
    sendEmail,
    sendMessage,
    customBill,
    getInvoices
}