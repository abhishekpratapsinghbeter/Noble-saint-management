const mongoose = require('mongoose');

const branchSchema= new mongoose.Schema({
    ba:{
        type:String,
        required:true
    },
    bcode:{
        type:String,
        required:true
    },
});
const Branch= mongoose.model("Branch",branchSchema);
module.exports=Branch;