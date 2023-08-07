const jwt= require('jsonwebtoken');
const Member = require('../model/memberSchema');
const Receipt = require('../model/receiptSchema');
const Branch = require('../model/branchSchema');

const Userauth =require("../model/userauth")
;
const User = require('../model/userSchema');
const Authenticate = async (req,res,next) =>{
    try {
        if (!req.cookies || !req.cookies.jwtoken) {
            console.log("No Token Povided")
          }
        const id = req.params.id
        const token = req.cookies.jwtoken;
        const verifyToken = jwt.verify(token, process.env.SECRET_KEY);
        req.user = verifyToken; // Attach the user information to the request
        const rootUser = await Userauth.findOne({_id: verifyToken._id, "tokens.token": token});
        let rootUser1,rootUser2,rootUse1,rootUser3,activeMembers,rootUser8,rootUser9,rootUser4,rootUser7,rootUser6,rootUser5;
        if (rootUser) {
            rootUser1 = await Member.find().populate('receipt');
            rootUser2 = await User.find();
            rootUse1 = await Branch.find();
            rootUser3 = await Receipt.find().populate('user');
            rootUser4 = await Receipt.findById(id).populate('user');
            rootUser8 = await Member.findById(id);
            rootUser9 = await User.findById(id);
            rootUser5 = await Member.countDocuments() ;
            rootUser6 = await User.countDocuments() ;
            activeMembers=await Member.find({ isActive: true }, '_id')
            const activeMemberIds = activeMembers.map((member) => member._id);
            rootUser7= await Receipt.find({ user: { $in: activeMemberIds } }).populate('user');                  
        }
        if (!rootUser || !rootUser2) {
            throw new Error('User not found')
        }
       if (!rootUser1) {
           throw new Error('Member not found')
        }
        req.rootUser=rootUser;// token verifications
        req.rootUser1=rootUser1;//contacts
        req.rootUser2=rootUser2;//teams
        req.rootUser3=rootUser3;//receipt
        req.rootUser4=rootUser4;//preceipt by id
        res.locals.rootUser5=rootUser5;//count  Member
        res.locals.rootUser6=rootUser6;  //count User
        req.rootUser7 = rootUser7; //balance
        req.rootUser8 = rootUser8;  // econtect by id
        req.rootUser9 = rootUser9;  // eteam by id
        req.rootUser12 = rootUse1
        req.userId = rootUser._id;
        next();
    } catch (err) {
        res.status(401).send('Unauthorized: No Token Provided')
        console.log(err);
        
    }

}
module.exports = Authenticate;