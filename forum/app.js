const express=require('express');
const router=require('./controller');
const app=express();
const session=require('express-session');
app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true,
}));
app.listen(1016);

//设置模板引擎
app.set('view engine','ejs');
//静态资源
app.use(express.static('./public'));
app.use('/avatar',express.static('./avatar'));
//路由设计
app.get('/',router.showIndex);
//渲染注册页面
app.get('/reg',router.showReg);
//实现注册功能
app.post('/doReg',router.doReg);
//渲染登录页面
app.get('/login',router.showLogin);
//实现登录功能
app.post('/doLogin',router.doLogin);
//退出功能
app.get('/logout',router.logout);
//显示上传头像页面
app.get('/upAvatar',router.upAvatar);
//执行上传功能请求
app.post('/doVatar',router.doVatar);
//执行切图功能
app.get('/doCut',router.doCut);
//执行提交留言功能
app.post('/postliuyan',router.postliuyan);
//获取所有留言
app.get('/getAlldata',router.getAlldata);
//获取分页
app.get('/fenye',router.fenye);
//删除当前留言
app.get('/delete/:id',router.delete);
//查看当前评论内容
app.get('/detail/:id',router.detail);
//获取当前用户说说
app.get('/myshuo',router.myshuo);
//获取所有用户列表
app.get('/userList',router.userList);