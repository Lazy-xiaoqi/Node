const express=require('express');
const router=require("./router");
const session=require('express-session');
const app=express();

app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true,
}));

app.listen(1016);
app.set('view engine','ejs');
app.use(express.static('./public'));


//restful 路由请求
//1.1渲染登录页面：
app.get('/login',router.showLogin);
//1.2:执行登录功能
app.post('/doLogin',router.doLogin);
//2.1显示注册页面
app.get('/reg',router.showReg);
//2.2：执行注册功能
app.post('/doReg',router.doReg);