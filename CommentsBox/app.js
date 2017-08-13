/**
 * Created by Administrator on 2017/7/28.
 */
const express=require('express');
const router=require('./router/router');
const app=express();
app.listen(1010);
//ejs模板引擎
app.set('view engine','ejs');
app.use(express.static('./public'));
//发送请求
app.get('/',router.showIndex);//渲染页面
app.post('/',router.addData);//提交留言功能
app.get('/find',router.findData);//查询数据
app.get('/delete/:id',router.deleteData);//删除数据
app.get('/allCount',router.allCount);