const mongoose = require("mongoose");


const postSchema = mongoose.Schema({
    author:{
        type:String,
        require:true,
    },
    title:{
        type:String,
        require:true,
    },
    description:{
        type:String,
        require:true,
        unique:true,
    },
    userId:{
        type:String,
        require:true
    },
},
{versionKey: false}
);

const PostModel = mongoose.model("post",postSchema);

module.exports={
    PostModel
}