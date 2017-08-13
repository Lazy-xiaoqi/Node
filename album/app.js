const express=require('express');
const router=require('./controller');
const app=express();

//设置模板引擎
app.set('view engine','ejs');
app.listen(1111);
//静态资源
app.use(express.static('./public'));
app.use(express.static('./uploads'));
//发送请求：
//get请求"/",显示首页
app.get('/',router.showIndex);
//get请求"/upload";
app.get('/upload',router.showForm);
//post 处理上传图片
app.post('/doUpload',router.doUpload);
//get请求"/",卡通动漫
app.get('/:albumName',router.showImg);

//404页面
app.use(function(req,res){
    res.render('404')
});
