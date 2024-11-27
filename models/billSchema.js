
const { Schema,model, default: mongoose } = require("mongoose");
mongoose.connect(process.env.MONGO_URI).then(() => console.log('MongoDB Atlas connected'))
.catch(err => console.error('MongoDB connection error:', err));


const billSchema=new Schema({
   
    ProductId:{
        type:String, 
        // required:true,
         
    },
    ProductName:{
        type:String,
        // required:true
    },
    ProductPrice:{
        type:Number,
        // required:true
    },
   
})
module.exports=mongoose.model("bill",billSchema);