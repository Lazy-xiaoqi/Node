/**
 * Created by Administrator on 2017/7/29.
 */
const express=require('express');
const gm=require('gm');
const fs=require('fs');
const app=express();
app.listen(7890);
app.set('view engine','ejs');
app.use(express.static('./public'));
app.use('/avatar',express.static('./avatar'));
//添加请求
app.get('/',function(req,res,next){
    res.render('index')
});
//实现切图功能
app.get('/cut',function(req,res,next){
    var {w,h,l,t}=req.query;
    gm('./avatar/ala.jpg')
        .crop(w,h,l,t)
        .resize(100,100,'!')
        .write('./avatar/ala1.jpg',function(err){
            if(err){
                res.send({"bok":false,"msg":"切图失败"})
            }else{
                res.send({"bok":true,"msg":"切图成功"})
            }
        })
});


