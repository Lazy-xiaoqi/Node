/**
 * Created by Administrator on 2017/7/28.
 */
const formidable=require('formidable');
const db=require("../models/db-DAO");
const md5=require('../models/md5').md5;
const session=require('express-session');

exports.showLogin=function(req,res,next){
    res.render('login');
};
exports.doLogin=function(req,res,next){
    var form=new formidable.IncomingForm();
    form.parse(req,function(err,fields,files){
        var username=fields.username;
        var password=fields.password;
        password=md5(md5(password)+'jiaQi');
        db.find("users",{username},function(err,result){
            if(err){
                res.send({"bok":false,"msg":"服务器错误"});
                return;
            }
            if(result.length){//用户存在，比对密码
                //登录密码加密后与数据库中比较
                if(password===result[0].password){
                    req.session.login=true;
                    req.session.username=username;
                    res.send({"bok":true,"msg":"登录成功"})
                }else{
                    res.send({"bok":false,"msg":"登录失败！密码错误"})
                }
            }else{
                res.send({"bok":false,"msg":"登录失败！该用户不存在"})
            }
        })
    })
};
exports.showReg=function(req,res,next){
    res.render('reg');
};
exports.doReg=function(req,res,next){
    var form=new formidable.IncomingForm();
    form.parse(req,function(err,fields,files){
        //console.log(fields);
        //提交过来的用户名密码插入数据库
        //数据库查找
        var username=fields.username;
        var password=fields.password;
        password=md5(md5(password)+'jiaQi');
        db.find('users',{username},function(err,result){
            if(err){
                res.send('服务器错误');
            }
            if(result.length){//不能注册，用户存在
                res.send({"bok":false,"msg":"注册失败！用户名存在"})
            }else{//用户名不存在
                //数据库中注册；数据库中密码要加密
                db.insertOne("users",{username,password},function(err,result){
                    if(err){
                        res.send('数据插入失败');
                        return;
                    }
                    //设置session
                    //console.log(req);
                    req.session.login=true;
                    req.session.username=username;
                    //数据插入成功
                    res.send({"bok":true,"msg":"恭喜你注册成功"});
                })
            }
        })
    })
};