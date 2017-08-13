/**
 * Created by Administrator on 2017/7/30.
 */
const formidable=require('formidable');
const db=require('../models/db-DAO');
const md5=require('../models/md5').md5;
const fs=require('fs');
const gm=require('gm');
const path=require('path');
const sd=require('silly-datetime');
const objectId=require('mongodb').ObjectID;

//
//显示首页
exports.showIndex=function(req,res,next){
    res.render('index',{
        login:req.session.login?true:false,
        avatar:req.session.avatar?req.session.avatar:"moren.jpg",
        username:req.session.username,
        current:'首页'
    })
};
//显示注册页
exports.showReg=function(req,res,next){
    res.render('reg',{
        login:req.session.login?true:false,
        username:req.session.login?req.session.username:"",
        current:'注册'
    })
};
//执行注册功能
exports.doReg=function(req,res,next){
    var form=new formidable.IncomingForm();
    form.parse(req,function(err,fileds){
        var {username,password}=fileds;
        var avatar='moren.jpg';
        password=md5(md5(password).substr(7,11)+'haha');
        //写入数据库，查看用户名是否存在
        db.find('users',{username},function(err,result){
            if(err){
                res.send({"bok":false,"msg":"服务器错误"});
                return;
            }
            if(result.length==0){//可以注册
                //数据进数据库
                db.insert('users',{username,password,avatar},function(err,result){
                    if(err){
                        res.send({"bok":false,"msg":"数据插入失败"});
                        return;
                    }
                    //设置session
                    req.session.login=true;
                    req.session.username=username;
                    req.session.avatar=avatar;
                    res.send({"bok":true,"msg":"注册成功"})
                })
            }else{//用户存在，不能注册
                res.send({"bok":false,"msg":"改用户名存在"});
            }
        })
    })
};
//显示登录页
exports.showLogin=function(req,res,next){
    res.render('login',{
        login:req.session.login?true:false,
        username:req.session.username?req.session.username:"",
        current:'登录'
    })
};
//实现登录功能
exports.doLogin=function(req,res,next){
    var form=new formidable.IncomingForm();
    form.parse(req,function(err,fileds){
        var {username,password}=fileds;
        //var avatar='moren.jpg';
        password=md5(md5(password).substr(7,11)+'haha');
        //写入数据库，查看用户名是否存在
        db.find('users',{username},function(err,result){
            if(err){
                res.send({"bok":false,"msg":"服务器错误"});
                return;
            }
            if(result.length==0){//该用户名不存在
                res.send({"bok":false,"msg":"用户名不存在"})
            }else{//用户名存在
                if(result[0].password==password){
                    req.session.login=true;
                    req.session.username=username;
                    req.session.avatar=result[0].avatar;
                    res.send({"bok":true,"msg":"登录成功"})
                }else{
                    res.send({"bok":false,"msg":"登录失败"})
                }
            }
        })
    })
};
//退出账户
exports.logout=function (req,res,next) {
    req.session.login=false;
    req.session.username='';
    //推出后默认回到首页
    res.redirect('/');
};
//显示上传头像
exports.upAvatar=function(req,res,next){
    if(!req.session.login){
        res.send('先登录');
        return;
    }
    res.render('upFile',{
        login:req.session.login?true:false,
        username:req.session.login?req.session.username:"",
        current:'设置'
    })
};
//执行上传功能
exports.doVatar=function(req,res,next){
    var form=new formidable.IncomingForm();
    form.uploadDir='./avatar/';
    form.parse(req, function(err, fields, files) {
        var oldPath=files.touxiang.path;
        var newName=req.session.username+path.extname(files.touxiang.name);
        var newPath=form.uploadDir+newName;
        fs.rename(oldPath,newPath,function(){
            //更改数据
            db.update('users',{username:req.session.username},{$set:{"avatar":newName}},function(err,result){
                if(err){
                    console.log('图像更新失败');
                    return;
                }
                req.session.avatar=newName;
                //渲染页面并传avatar参数
                res.render('cut',{
                    avatar:newName
                })
            });

        })
    })
};
//实现切图功能
exports.doCut=function(req,res,next){
    var {w,h,l,t}=req.query;
    var PATH='./avatar/'+req.session.avatar;
    gm(PATH)
        .crop(w,h,l,t)
        .resize(200,200,'!')
        .write(PATH,function(err){
            if(err){
                res.send({"bok":false,"msg":"切图失败"})
            }else{
                res.send({"bok":false,"msg":"切图成功"})
            }
        })
};
//执行提交留言功能
exports.postliuyan=function(req,res,next){
    var form=new formidable.IncomingForm();
    form.parse(req,function(err,fields){
        fields.username=req.session.username;
        fields.avatar=req.session.avatar;
        fields.time=sd.format(new Date(), 'YYYY-MM-DD HH:mm');
        db.insert('liuyan',fields,function(err,result){
          if(err){
              res.send({"bok":false,"msg":"留言失败"});
          }else{
              res.send({"bok":true,"msg":"留言成功"});
          }
        })
    })
};
//获取所有留言
exports.getAlldata=function(req,res,next){
    var {page,pageamount}=req.query;
    //数据库查找所有留言
    db.find('liuyan',{},{sort:{"time":-1},page,pageamount},function(err,result){
        if(err){
            res.send({"bok":false,"msg":"留言获取失败"});
        }else{
            res.send({"bok":true,"msg":result})
        }
    })
};
//获取所有分页
exports.fenye=function(req,res,next){
    db.allCount('liuyan',function(count){
        res.send(count.toString())
    })
};
//删除当前留言
exports.delete=function(req,res,next){
    var _id=objectId(req.params.id);
    db.remove('liuyan',{_id},function(err,result){
        if(err){
            console.log('删除失败');
            return;
        }
        //res.send('删除成功');
        res.redirect('/');
    })
};
//查看当前评论内容
exports.detail=function (req,res,next) {
    var _id=objectId(req.params.id);
    db.find('liuyan',{_id},function(err,result){
        res.render('detail',{
            title:result[0].title,
            content:result[0].content,
            avatar:result[0].avatar,
            time:result[0].time,
            login:req.session.login?true:false,
            username:req.session.login?req.session.username:"",
            current:''
        })
    })
};
//获取用户全部说说
exports.myshuo=function(req,res,next){
    db.find('liuyan',{"username":req.session.username},function(err,result){
        res.render('myshuo',{
            shuoshuos:result,
            current:'说说',
            login:req.session.login?true:false,
            username:req.session.login?req.session.username:""
        })
    })
};
//获取所有用户列表
exports.userList=function(req,res,next){
    db.find("users",{},function(err,result){
        if(!err){
            res.render('userlist',{
                current:'列表',
                login:req.session.login?true:false,
                username:req.session.login?req.session.username:"",
                shuoshuos:result
            })
        }
    })
};






