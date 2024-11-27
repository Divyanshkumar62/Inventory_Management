require('dotenv').config()

const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const path = require('path');
const productRoute = require('./routes/productRoutes');
const billRoute = require('./routes/billRoutes');
var flash = require('connect-flash');
const session = require('express-session');

const productModel=require('./models/ProductSchema')
const cors=require('cors')

// Middleware Setup
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cors())
app.use(session({
   secret:'abcd',
   resave:false,
   saveUninitialized:true
})) 
app.use(flash())

app.use((req,res,next)=>{
   res.locals.successMessage = req.flash('success');
   res.locals.successMessage1 = req.flash('success1');
   res.locals.errorMessage = req.flash('error');
   res.locals.warningMessage = req.flash('warning');
   res.locals.warningMessage1=req.flash('warning1');
   
   
   
   next();
})


// View Engine Setup
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));


// Static File Serving
app.use(express.static(path.resolve('./public')));
app.use('/images', express.static(path.join(__dirname, 'images')));


// Routes 
app.use('/product', productRoute);
app.use('/bill', billRoute);

app.get('/', async (req, res) => { 
    
   // let ans=await productModel.find({}).sort({_id:-1}).limit(1);
   let ans2=await productModel.find({});
   record=ans2.length+1;
   // fid="p00";

   
   fid='p0'+record
   

   
    
   res.render('form',{
      fid,
      record
   })
   // res.send("hello")
});
app.get('/dashboard',(req,res)=>{
   res.render('dashboard')
})
// Start Server
const PORT = process.env.PORT || 5500;
app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
