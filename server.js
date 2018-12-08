//今日头条数据获取


var http = require('http');
var express = require('express');
var Buffer = require('buffer').Buffer;

var server = express();
server.all("*", function (req, res, next) {
    //设置允许跨域的域名，*代表允许任意域名跨域
    res.header("Access-Control-Allow-Origin", "*");
    //允许的header类型
    res.header("Access-Control-Allow-Headers", "content-type");
    //跨域允许的请求方式 
    res.header("Access-Control-Allow-Methods", "DELETE,PUT,POST,GET,OPTIONS");
    next();
})

server.use('/message',function(req,rep){
	http.get("http://is.snssdk.com/api/news/feed/v51/?category=news_hot",function(res){
		var chunks = [];
		var size = 0;
		
		res.on('data', function (chunk) {   //监听事件 传输
			chunks.push(chunk);
			size += chunk.length;
		});
		res.on('end', function () {  //数据传输完
			var data = Buffer.concat(chunks, size); //返回一个合并了 list 中所有 Buffer 的新 Buffer
			var html = data.toString();
			
			var ma = [];
			var obj = JSON.parse(html).data;
			for(each in obj){
				ma.push(JSON.parse(obj[each].content));
			}
			var back = {
				message:ma
			}
			rep.setHeader('Content-type','text/plain;charset=utf-8')
			rep.write(JSON.stringify(back));
			console.log(JSON.stringify(back));
			rep.end();
		})
	})
})



server.listen(999);