
const { Schema,model, default: mongoose } = require("mongoose");
mongoose.connect(process.env.MONGO_URI).then(() => console.log('MongoDB Atlas connected'))
.catch(err => console.error('MongoDB connection error:', err));





const saveBillSchema=new Schema({
    
    BillId:{
        type:String,  
        required:true,
        unique:true
    },
    CustomerName:{
        type:String,
        default:""
    },
MobileNumber:{
            type:Number,
            default:0
    },

    BillImage:{
        type:String,
        default:""
        
    }, 
    createdAt: {
        type: Date,
        default: Date.now() 
    }, 
    BillAmount:{
        type:String,
        default:0,
        required:true
    },
    Products:[{
        ProductId:{
            type:String,
            required:true
        },
        ProductName:{
            type:String,
            required:true,
        },
        ProductPrice:{
            type:Number,
            required:true
        }

    }]
    
   
})
saveBillSchema.pre('save',async function(next){
    const bill=this;
    bill.BillAmount=bill.BillAmount+'Rs'
    next();

})
module.exports=mongoose.model("saveBill",saveBillSchema);