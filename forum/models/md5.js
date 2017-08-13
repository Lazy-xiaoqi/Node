/**
 * Created by Administrator on 2017/7/28.
 */

exports.md5=function(str){
    const cryPto=require('crypto');
    const hash=cryPto.createHash("md5");
    return hash.update(str).digest('base64')
}