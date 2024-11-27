
const { Schema,model, default: mongoose } = require("mongoose");

mongoose.connect(process.env.MONGO_URI).then(() => console.log('MongoDB Atlas connected'))
.catch(err => console.error('MongoDB connection error:', err));
// mongoose.connect('mongodb://localhost:27017/formsubmit').then(() => console.log('MongoDB connected'))
// .catch(err => console.error('MongoDB connection error:', err));




const productSchema=new Schema({
   
    ProductId:{
        type:String,
        required:true,
    },
    ProductName:{
        type:String,
        required:true,

    },
    ProductPrice:{
        type:Number,
        required:true,
    },
    ProductImage:{
        type:String,
        default:""
    },
    ProductQr:{ 
        type:String,
        default:""
    },
    ProductQuantity:{
        type:Number,
        default:8
   },
   ProductCategory:{
    type:String,
    default:"abc"
   }
   
})
productSchema.pre('findOneAndUpdate',function(next){
    const product=this.getUpdate()
    if(product.$set.ProductQuantity<=0)
        product.$set.ProductQuantity=0
    else if (product.ProductQuantity !== undefined && product.ProductQuantity <= 0) {
        product.ProductQuantity = 0;
    }
    next()

})
module.exports=mongoose.model("product",productSchema);