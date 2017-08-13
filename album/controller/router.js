//router 控制器中，restful路由设计
const files=require('../models/files');
const formidable=require('formidable');
const fs=require('fs');
//显示首页
exports.showIndex=function(req,res,next){
    files.showAllAlbums(function(err,albums){
        //console.log(albums)
        if(err){
            next();
            return;
        }
        res.render('index',{albums});
    });

};
//显示点击的文件夹下所有相册内容；
exports.showImg=function(req,res,next){
    //拿到当前相册名称：
    var albumName=req.params.albumName;
    //console.log(req.params)
    files.showImgs(albumName,function(err,albums){
        if(err){
            next();
            return;
        }
        if(albums instanceof Array){
            res.render('albumsImg',{
                albums,albumName
            })
        }
    })
};
//渲染表单上传页
exports.showForm=function(req,res,next){
    files.showAllAlbums(function(err,albums){
        //console.log(albums)
        if(err){
            next();
            return;
        }
        res.render('upload',{albums});
    });
};
//处理图片上传
exports.doUpload=function(req,res){
    var form = new formidable.IncomingForm();
    form.uploadDir="./uploads";
    form.parse(req, function(err, fields, files) {
        //console.log(fields);
        //console.log(files);
        if(err){
            next();
            return;
        }
        var oldPath=files.tupian.path;
        var newPath=form.uploadDir+'/'+fields.wenjianjia+"/"+files.tupian.name;
        fs.rename(oldPath,newPath,function(err){
            if(err){
                res.end("改名失败")
            }else{
                fs.unlink(oldPath,function(err){
                     if(!err){
                         console.log("删除成功")
                     }
                     res.send('上传并且删除成功')
                })
            }
        });
        //res.send("上传成功")
    });
};