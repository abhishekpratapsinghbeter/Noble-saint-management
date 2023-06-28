const mongoose= require('mongoose');

const receiptSchema= new mongoose.Schema({
    id:{
        type:Object,
        required:true,
        unique:true
    },
    sno:{
        type:Object,
        required:true,
        unique:true
    },
    membershipno:{
        type:String,
        required:true
    },
    pkg:{
        type:String,
        required:true
    },
    dop:{
        type:String,
        required:true
    },
    pd:{
        type:String,
        required:true
    },
    dorp:{
        type:String,
        required:true
    },
    fees:{
        type:String,
        required:true
    },
    
    user:{type:mongoose.Types.ObjectId,ref:"MEMBER",required:true},
});
const Receipt= mongoose.model("RECEIPT",receiptSchema);
module.exports=Receipt;