// JavaScript source code

var express = require('express');
var Buffer = require('buffer').Buffer;
var iconv = require('iconv-lite');//解决乱码问题
var router = express.Router();
var http = require('https');
var cheerio = require('cheerio');
var querystring = require("querystring");

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

server.all('/nowplaying', function (req, res) {
    console.log("nowplaying");
    getHTML("https://movie.douban.com/cinema/nowplaying/xian/", res, filterNow);
})

server.all('/comingAll', function (req, res) {
    console.log("comingAll");
    getHTML("https://movie.douban.com/coming", res, filterComAll);
})

server.all('/comingImp', function (req, res) {
    console.log("comingImp");
    getHTML("https://movie.douban.com/cinema/later/xian/", res, filterComImp);
})

server.all('/index', function (req, res) {
    console.log("index  -->  "+ req.query.url);
    getHTML(req.query.url, res, filterindex);
})


server.listen(798);

function filterindex(html) {
    var $ = cheerio.load(html); //传入文档启动解析
    var obj = {
        base: {},
        star: {},
        person: [],
        moreShortCommentary: {},
        moreMovieCommentary: {},
    };
    obj.base.name = findPosition($,'#content > h1 > span:nth-child(1)')[0].children[0].data;
    obj.base.img = httpComplete(findPosition($,'#mainpic > a > img')[0].attribs.src);
    obj.base.type = attrbite($, 'span[property="v:genre"]');
    obj.base.place = extraction(findPosition($, '.pl:contains("制片国家/地区:")')[0].next.data);
    obj.base.language = extraction(findPosition($, '.pl:contains("语言:")')[0].next.data);
    obj.base.time = attrbite($, 'span[property="v:initialReleaseDate"]');
    obj.base.runtime = parseInt(sub(attrbite($, 'span[property="v:runtime"]'),1,2));
    obj.base.remane = extraction(findPosition($, '.pl:contains("又名:")')[0].next.data);
    obj.base.director = personList($, '.pl:contains("导演")');
    obj.base.scenarist = personList($, '.pl:contains("编剧")');
    obj.base.actors = personList($, '.pl:contains("主演")');
    try {
        obj.star.average = parseFloat(attrbite($, 'strong[property="v:average"]'));
        obj.star.votes = parseInt(attrbite($, 'span[property="v:votes"]'));
        for (var i = 5; i > 0; i--) {
            obj.star["star" + i] = parseFloat(sub(findPosition($, '.rating_per')[5-i].children[0].data, 1, 1));
        }
    } catch(e){
        obj.star = -1;
    }
    
    
    obj.synopsis = extraction(synopsis($, 'span[property="v:summary"]'));

    obj.person = personListMain($, ".celebrities-list");
    obj.personAllLink = httpComplete(findPosition($, '#celebrities > h2 > span > a')[0].attribs.href);

    obj.showMovie = Movie($, ".label-trailer");
    obj.moreShowMovie = httpComplete(findPosition($, '#related-pic > h2  a')[0].attribs.href);

    obj.pic = pic($, "#related-pic .related-pic-bd  img");
    obj.morePic = httpComplete(findPosition($, '#related-pic > h2  a:contains("图片")')[0].attribs.href);

    obj.sameMovie = sameMovie($, "#recommendations .recommendations-bd  dl");

    obj.shortCommentary = short($, "#hot-comments  .comment");
    obj.moreShortCommentary.link = httpComplete(findPosition($, '#comments-section .mod-hd  .pl a')[0].attribs.href);
    obj.moreShortCommentary.num = parseInt(sub(findPosition($, '#comments-section .mod-hd  .pl a')[0].children[0].data, 4, 2));

    obj.movieCommentary = movieCommentary($, "section.movie-content  .review-list [data-cid]");
    obj.moreMovieCommentary.link = httpComplete(arguments[1]+findPosition($, 'section.movie-content .pl a')[0].attribs.href);
    obj.moreMovieCommentary.num = parseInt(sub(findPosition($, 'section.movie-content .pl a')[0].children[0].data, 4, 2));

    return obj;

    function movieCommentary($, link) {
        var arr = new Array();
        var event = findPosition($, link);
        for (var i = 0; i < event.length; i++) {
            var m = {
                name: findPosition($, link + " .name")[i].children[0].data,
                link: httpComplete(findPosition($, link + " .main-bd h2 a")[i].attribs.href),
                title: findPosition($, link + " .main-bd h2 a")[i].children[0].data,
                goodNumber: parseInt(findPosition($, link + " .action-btn.up span")[i].children[0].data),
                badNumber: parseInt(findPosition($, link + " .action-btn.down span")[i].children[0].data),
                time: findPosition($, link + " .main-meta ")[i].attribs.title,
                
                message: extraction(findPosition($, link + " .short-content")[i].children[0].data),
            }
            try {
                m.star = parseInt(findPosition($, link + " .main-title-rating")[i].attribs.class.substr(7, 1));
            } catch (e) {
                m.star = -1;
            }
            
            arr.push(m);
        }
        return arr;
    }

    function short($, link) {
        var arr = new Array();
        var event = findPosition($, link);
        for (var i = 0; i < event.length; i++) {
            var m = {
                goodNumber: parseInt(findPosition($, link + " .votes")[i].children[0].data),
                time: findPosition($, link + " .comment-time ")[i].attribs.title,
                name: findPosition($, link + " .comment-info a")[i].children[0].data,
                type: findPosition($, link + " .comment-info a")[i].next.next.children[0].data,
                message: extraction(findPosition($, link + " .short")[i].children[0].data),
            }
            try {
                m.star= parseInt(findPosition($, link + " .rating")[i].attribs.class.substr(7, 1));
            } catch (e) {
                m.star = -1;
            }    
            arr.push(m);
        }
        return arr;
    }

    function sameMovie($, link) {
        var arr = new Array();
        var event = findPosition($, link);
        for (var i = 0; i < event.length; i++) {
            var movie = {
                link: httpComplete(event[i].children[3].children[1].attribs.href),
                img: httpComplete(event[i].children[1].children[1].children[1].attribs.src),
                name: event[i].children[3].children[1].children[0].data,
            }
            arr.push(movie);
        }
        return arr;
    }

    function pic($, link){
        var arr = new Array();
        var event = findPosition($, link);
        for (var i = 0; i < event.length; i++) {
            var movie = {
                link: httpComplete(httpComplete(event[i].parent.attribs.href)),
                img: httpComplete(event[i].attribs.src),
            }
            arr.push(movie);
        }
        return arr;
    }

    function Movie($, link) {
        var arr = new Array();
        var event = findPosition($, link);
        for (var i = 0; i < event.length; i++) {
            var movie = {
                link: httpComplete(event[i].children[1].attribs.href),
                img: httpComplete(sub("http" + (event[i].children[1].attribs.style.split('http')[1]), 1, 1)),
            }
            arr.push(movie);
        }
        return arr;
    }

    function synopsis($, link) {
       
        var str = "";
        var event = findPosition($, link)[0].children;
        for (var i = 0; i < event.length; i++) {
            if (event[i].data != undefined) {
                str = str + "/" + event[i].data;
            }
        }
        return str.substr(1);
    }

    function personListMain($, link) {
        var arr = new Array();
        var event = findPosition($, link)[0].children;
        for (var i = 1; i < event.length; i += 2) {
            var person = {
                name: event[i].children[3].children[1].children[0].children[0].data,
                link: httpComplete(event[i].children[1].attribs.href),
                img: httpComplete(sub("http" + (event[i].children[1].children[1].attribs.style.split('http')[1]), 1, 1)),
                role: event[i].children[3].children[3].children[0].data,
            }
            arr.push(person);
        }
        return arr;
    }

    function personList($, link) {
        var arr = new Array();
        var event = findPosition($, link)[0].next.next.children;
        for (var i = 0; i < event.length; i += 2) {
            var person = {
                name: event[i].children[0].data,
                link: httpComplete(event[i].attribs.href),
            }
            arr.push(person);
        }
        return arr;
    }
}
//解析电影主页

function filterComImp(html) {

    var courseData = new Array(); //返回数据
    var $ = cheerio.load(html); //传入文档启动解析

    var chapters = $('#showing-soon'); //选定正在上映列表
    for (var i = 1; i < chapters[0].children.length-2; i += 2) {
        var obj = {
            link: httpComplete(chapters[0].children[i].children[1].attribs.href),
            img: httpComplete(chapters[0].children[i].children[1].children[1].attribs.src),
            name: chapters[0].children[i].children[3].children[1].children[1].children[0].data,
            type: chapters[0].children[i].children[3].children[3].children[3].children[0].data,
            place: chapters[0].children[i].children[3].children[3].children[5].children[0].data,
            likeNum: parseInt(chapters[0].children[i].children[3].children[3].children[7].children[0].children[0].data.match(/\d+/)),
            time: timeExtraction(chapters[0].children[i].children[3].children[3].children[1].children[0].data)
        };
        try {
            obj.trailer = httpComplete(chapters[0].children[i].children[3].children[3].children[9].attribs.href);
        } catch(e) {
            obj.trailer = "";
        }
        courseData.push(obj);
    }
    var result = {
        ComingImp: courseData
    }
    return result;
}
//解析即将上映数据(重要)

function filterComAll(html) {

    var courseData = new Array(); //返回数据
    var $ = cheerio.load(html); //传入文档启动解析

    var chapters = $('.article tbody'); //选定正在上映列表

    for (var i = 1; i < chapters[0].children.length; i += 2) {
        var obj = {
            time: timeExtraction(chapters[0].children[i].children[1].children[0].data),
            type: extraction(chapters[0].children[i].children[5].children[0].data),
            place: extraction(chapters[0].children[i].children[7].children[0].data),
            likeNum: parseInt(sub(extraction(chapters[0].children[i].children[9].children[0].data),1,1)),
            name: chapters[0].children[i].children[3].children[1].children[0].data,
            link: httpComplete(chapters[0].children[i].children[3].children[1].attribs.href),
        };
        courseData.push(obj);
    }
    var result = {
        ComingAll: courseData
    }
    return result;
}
//解析即将上映数据(全部)

function filterNow(html) {

    var courseData = new Array(); //返回数据
    var $ = cheerio.load(html); //传入文档启动解析

    var chapters = $('.mod-bd>.lists'); //选定正在上映列表
    var type = chapters[0].children; //提取数组

    for (var i = 1; i < type.length; i += 2) {
        var obj = {
            name: type[i]["attribs"]['data-title'],
            score: parseFloat(type[i]["attribs"]['data-score']),
            show: type[i]["attribs"]['data-showed'],
            director: type[i]["attribs"]['data-director'],
            director: type[i]["attribs"]['data-director'],
            actors: type[i]["attribs"]['data-actors'],
            link: httpComplete($('#' + type[i]["attribs"]['id'] + " a")[0].attribs.href),
            img: httpComplete($('#' + type[i]["attribs"]['id'] + " img")[0].attribs.src),
        }
        courseData.push(obj);
    }
    var result = {
        NowPlaying: courseData
    }
    return result;
}
//解析正在上映的电影


function getHTML(url, caller, fn) {
    http.get(url, function (res) {

        var chunks = [];
        var size = 0;

        res.on('data', function (chunk) {   //监听事件 传输
            chunks.push(chunk);
            size += chunk.length;
        });
        res.on('end', function () {  //数据传输完
            var data = Buffer.concat(chunks, size); //返回一个合并了 list 中所有 Buffer 的新 Buffer
            var html = data.toString();
            send(caller, JSON.stringify(fn(html,url)));
        })
    })
}
//获取HTML页面
function send(caller,message) {
    caller.setHeader("Content-type", "text/plain;charset=utf-8")
    caller.write(message);
    caller.end();
}
//返回爬取数据
function extraction(letter) {
    var arr = letter.split(/\s/g);
    var str = "";
    for (each in arr) {
        if (arr[each] != "") {
            str = str + arr[each];
        }
    }
    return str;

}
//字符串解析
function timeExtraction(letter) {
    letter = extraction(letter);
    var arr = letter.split(/[年月日]/g);
    if (arr.length == 4) {
        var time = {
            year: parseInt(arr[0]),
            month: parseInt(arr[1]),
            day: parseInt(arr[2]),
        }
        return time;
    }
    else if (arr.length == 2) {
            var time = {
                year: parseInt(new Date().getFullYear()),
                month: parseInt(arr[0]),
                day: -1,
            }
        return time;
    } else{
        if (arr[0].length == 2) {
            var time = {
                year: parseInt(new Date().getFullYear()),
                month: parseInt(arr[0]),
                day: parseInt(arr[1]),
            }
            return time;
        } else {
            var time = {
                year: parseInt(arr[0]),
                month: parseInt(arr[1]),
                day: -1,
            }
            return time;
        }
    }
}
//电影时期解析
function findPosition($,link) {
    return $(link);
}
//定位电影元素
function attrbite($, link) {
    var str = "";
    var event = findPosition($, link);
    for (var i = 0; i < event.length; i++) {
        str = str + "/" + event[i].children[0].data;
    }
    return str.substr(1);

}
//根据元素属性选择，将标签内容进行“/”拼接
function sub(letter,first, end) {
    long = letter.length;
    return letter.substring(first-1, long - end);
}
//字符串切割
function httpComplete(letter) {
    var reg = /http/g
    if (reg.test(letter)) {
        return letter;
    } else {
        return "https://movie.douban.com" + letter;
    }
}




