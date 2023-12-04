import mongoose from "mongoose";

const BookSchema = new mongoose.Schema({
    bookName:{
        type:String,
        require:true
    },
    author:{
        type:String,
        require:true
    },
    language:{
        type:String,
        default:""
    },
    image_url:{
        type:String,
        default:"/assets/image/ActiveBooks.png",
        unique: true
    },
    publisher:{
        type:String,
        default:""
    },
    description:{
        type:String,
        default:""
    },
    bookCountAvailable:{
        type:Number,
        require:true
    },
    bookStatus:{
        type:String,
        default:"Sẵn có"
    },
    categories: {
        type:String,
        default:""
    },
    transactions:[{
        type:mongoose.Types.ObjectId,
        ref:"BookTransaction"
    }]
},
{
    timestamps:true
})

export default mongoose.model("Book",BookSchema)