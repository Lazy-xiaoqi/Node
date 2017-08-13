/**
 * Created by Administrator on 2017/7/22.
 */

const fs=require('fs');
//读取 uploads 文件
exports.showAllAlbums=function(callback){
    fs.readdir('./uploads',function(err,files){
        //console.log(files)
        if(err){
            callback(err,null);
            return;
        }
        var aryAlbums=[];
        (function iterator(i){
            if(i>=files.length){
                callback(null,aryAlbums);
                return;
            }
            fs.stat('./uploads/'+files[i],function(err,stats){
                if(err){
                    callback(err,null);
                    return;
                }
                if(stats.isDirectory()){
                    aryAlbums.push(files[i])
                }
                iterator(++i);
            })
        })(0)
    })
};
//获取当前文件夹下有多少张图片：图片属于文件；
exports.showImgs=function(albumName,callback){
    fs.readdir('./uploads/'+albumName,function(err,files){
        if(err){
            callback(err,null);
            return;
        }
        var aryAlbums=[];
        (function iterator(i){
            if(i>=files.length){
                callback(null,aryAlbums);
            }
            fs.stat('./uploads/'+albumName+'/'+files[i],function(err,stats){
                if(err){
                    callback(err,null);
                    return;
                }
                if(stats.isFile()){
                    aryAlbums.push(files[i])
                }
                iterator(++i);
            })
        })(0)
    })
};




