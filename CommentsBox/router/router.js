/**
 * Created by Administrator on 2017/7/28.
 */
const formidable=require('formidable');
const objectId=require('mongodb').ObjectId;
const db=require('../models/db-DAO');
const sd = require('silly-datetime');

//显示首页
exports.showIndex=function(req,res,next){
    res.render('comment')
};
//进行留言
exports.addData=function(req,res,next){
    var form=new formidable.IncomingForm();
    form.parse(req,function(err,fields){
        fields.time=sd.format(new Date(), 'YYYY-MM-DD HH:mm');
        //提交数据
        db.insertOne('comments',fields,function(err,result){
            if(err){
                res.send({"bok":false,"msg":"提交失败，请联系管理员重新进行提价"});
                return;
            }
            res.send({"bok":true,"msg":"留言提交成功！！！"})
        })
    })
};
//查找数据
exports.findData=function(req,res,next){
    var page=req.query.page;
    var pageamount=req.query.pageamount;
    //带分页排序
    db.find('comments',{},{sort:{"time":-1},page,pageamount},function(err,result){
        if(err){
            res.send({"bok":false,"msg":"数据查询失败"});
            return;
        }
        res.send(result)
    })
};
//删除留言
exports.deleteData=function(req,res,next){
    var id=req.params.id;
    db.remove('comments',{"_id":objectId(id.toString())},function(err,result){
        if(!err){
            res.redirect('/');
        }
    })
};
//总数据
exports.allCount=function (req,res,next) {
    db.count('comments',function(count){
        console.log(count);
        res.send(count.toString())
    })
}