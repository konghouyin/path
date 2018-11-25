# 豆瓣电影代理后台数据接口

ps：基础url: http://www.konghouy.cn:798(请求时，将对应的url添加在后部即可)

## 1.正在上映

- url：/nowplaying

- 方法：GET

- 参数：无

- 返回

```json
  {
  	NowPlaying:
        [{
            name:"毒液：致命守护者",
            score:7.4,
            show:"True",
            director:"鲁本·弗雷斯彻",
            actors:"汤姆·哈迪 / 米歇尔·威廉姆斯 ...",
            link:"https://movie.douban.com/...",
            img:"https://img3.doubanio.com/...",
 		},
		......
        ]
  }
```

## 2.即将上映（全部）

- url：/comingAll
- 方法：GET
- 参数：无
- 返回

```json
{
  	ComingAll:
        [{
            likeNum: 85863,
			link: "https://movie.douban.com/...",
			name: "无敌破坏王2：大闹互联网",
			place: "美国",
			time: {
				year: 2018, 
				month: 11, 
				day: 23,
				}
			type: "喜剧 / 动画 / 奇幻",
 		},
		......
        ]
  }
```

​	注意：

- “time.day”的值可能为-1，表示日期待定

## 3.即将上映（重要）

- url：/comingImp
- 方法：GET
- 参数：无
- 返回

```json
{
  	ComingImp:
        [{
            img: "https://img3.doubanio.com/...",
			likeNum: 85931,
			link: "https://movie.douban.com/...",
			name: "无敌破坏王2：大闹互联网",
			place: "美国",
			time: {
				year: 2018, 
				month: 11, 
				day: 23
				}
			trailer: "https://movie.douban.com/...",
			type: "喜剧 / 动画 / 奇幻",
 		},
		......
        ]
  }
```

​	注意：

- “trailer”表示预告片，值可能为空字符串，表示没有预告片

## 4.页面详情

- url：/index
- 方法：GET
- 参数：url eg：http://www.konghouy.cn:798/index?url=https://movie.douban.com/subject/27620911/
- 返回

```json
{
    base:{
        actors:[{
            name:"约翰·C·赖利",
            link:"https://movie.douban.com/...",
        },...],
        director:[{
            name:"菲尔·约翰斯顿",
            link:"https://movie.douban.com/...",
        },...],
        img: "https://img3.doubanio.com/...",
        language:"英语",
		name: "无敌破坏王2",
		place: "美国",
		remane: "无敌破坏王2...",
		runtime: 112,
        scenarist:[{
            name:"菲尔·约翰斯顿",
            link:"https://movie.douban.com/...",
        },...],
		time: "2018-11-23(中国大陆)/2018-11-21(美国)",
		type: "喜剧/动画/奇幻/冒险",
 	},
	star:{
        average: 8.7,
        star1: 0.1,
        star2: 1.2,
        star3: 11.8,
        star4: 35.4,
        star5: 51.5,
        votes: 4423
    },
	synopsis:"《无敌破坏王2：大闹互联网》从电玩世界来到...",
    person:[
        {
            img:"https://img1.doubanio.com/...",
            name:"瑞奇·摩尔",
            role:"导演",
            link:"https://img1.doubanio.com/...",
        },
        ....
    ],
	personAllLink:"https://img1.doubanio.com/...",
    showMovie:[
        {
            img:"https://img1.doubanio.com/...",
            link:"https://img1.doubanio.com/...",
        },
        ...
    ],
    moreShowMovie:"https://img1.doubanio.com/...",
    pic:[
        {
        	img:"https://img1.doubanio.com/...",
        	link:"https://img1.doubanio.com/...",
        },
        ...
    ],
    morePic:"https://img1.doubanio.com/...",    
    sameMovie:[
        {
            img:"https://img1.doubanio.com/...",
            name:"驯龙高手3"
            link:"https://img1.doubanio.com/...",
        },
        ...
    ],
    shortCommentary:[
        {
        	name:"凌睿",
        	type:"看过",
        	star:5,
            time:["2018-11-21","00:11:38"],
        	message:"相当于迪士尼的《头号玩家》...",
        	goodNumber:626,
        },
        ...
    ],
	moreShortCommentary:{
    	link:"https://img1.doubanio.com/...",
        num:2999,
    },
    movieCommentary:[
        {
            name:"凌睿",
            tittle:"第67名：美国影片《超人总动员》",
            star:4,
            time: ["2011-08-16", "10:00:35"],
            link:"https://movie.douban.com/...",
            message:"超人不会飞？《超人总动员》The...",
            goodNumber:81,
            badnumber:9,
        },
        ...
    ],
    moreMovieCommentary:{
    	link:"https://img1.doubanio.com/...",
        num:209
    },
    discuss:[
        {
            name:"中学生天地郭宁"
            tittle:"伤心！买票买成国语版了！"
            time:"2018-11-24"
            link:"https://img1.doubanio.com/...",
            backNumer:10，        
        },
        ...
    ]
	moreDiscuss:{
    	link:"https://img1.doubanio.com/...",
        num:209
    },
  }
```

注意：

- 对于还未上映的电影：
  - star数值为-1
  - runtime = null
  - 部分影评已经公布，但是没有打分（goodNum，badNum = null）
- synopsis中段落用“/”进行了分割
- 当电影没有影评的时候，返回空数组

## 5.请求大图片

- url：/bigPic
- 方法：GET
- 参数：url eg：http://www.konghouy.cn:798/bigPic?url=https://movie.douban.com/photos/photo/2540375726/
- 返回 

```json
{
    from: "YthguaN-"
	link: "https://img3.doubanio.com/..."
	time: "2018-11-20"
}
```

注意：请求大图片资源，只限电影详情页的图片，和更多照片选单中的图片。

## 6.请求预告片

- url：/showMovie
- 方法：GET
- 参数：url eg：http://www.konghouy.cn:798/showMovie?url=https://movie.douban.com/trailer/238212/#content
- 返回 "

```json
{
    list:[
        {
            tittle:"预告片2",
            long:"00:30",
            link:"https://img1.doubanio.com/...",
            img:"https://img1.doubanio.com/...",        
        },
        ...
    ],
	movie: "http://vt1.doubanio.com/...",
}
```

注意：请求预告片资源，只限电影详情页的预告，和更多预告列表中的视频。

## 7.请求图片列表

- url：/picAll
- 方法：GET
- 参数：url eg：http://www.konghouy.cn:798/picAll?url=https://movie.douban.com/subject/20438964/all_photos
- 返回 

```json
{
    list:[
        {
            img: "https://img3.doubanio.com/...",
			link: "https://movie.douban.com/...",
        },
        ...
    ]
}
```

注意：返回的图片都是正方形小图。

## 8.请求预告片列表

- url：/showMovieAll

- 方法：GET

- 参数：url eg：http://www.konghouy.cn:798/showMovieAll?url=https://movie.douban.com/subject/20438964/trailer#trailer

- 返回 

```json
  {
    list:[
        {
            tittle:"预告片2",
            long:"00:30",
            link:"https://img1.doubanio.com/...",
            img:"https://img1.doubanio.com/...",
            time:"2018-11-22",
        },
        ...
    ]
}
```

## 9.请求演员列表

- url：/personAll
- 方法：GET
- 参数：url eg：http://www.konghouy.cn:798/personAll?url=https://movie.douban.com/subject/27605698/celebrities
- 返回 
```
{	
	制片人:[
        {
            img:"https://img1.doubanio.com/...",
            link:"https://img1.doubanio.com/...",
            name:"宋芸桦 Vivian Sung",
            work:[
                {
                    movie:"我的少女时代",
                    link:"https://img1.doubanio.com/...",
                },
                ...
            ]
        },
        ...
	]
```

注意：这组数据对象中属性的个数不确定，属性名为职位，根据不同影片进行调整

## 10.演员信息

- url：/person
- 方法：GET
- 参数：url eg：http://www.konghouy.cn:798/person?url=https://movie.douban.com/celebrity/1341903/
- 返回 

```json
{
    base:{
        birthday: ":1992-10-21",
        constellation: ":天秤座",
        job: ":演员",
        name: "宋芸桦 Vivian Sung",
        pic: "https://img1.doubanio.com/...",
        place: ":中国,台湾",
        sex: ":女",
    },
    goodMovie:[
        {
            img: "https://img3.doubanio.com/...",
            link: "https://movie.douban.com/...",
            name: "我的少女時代",
            star: 7,
        },
        ...
    ],
    recentMovie: [
        {
            img: "https://img1.doubanio.com/...",
            link: "https://movie.douban.com/...",
            name: "西虹市首富",
            star: 6,
        },
        ...
    ],
    pic:[
        {
            img: "https://img3.doubanio.com/...",
			link: "https://movie.douban.com/...",
        },
        ...
    ],
    partner:[
        {
            img: "https://img3.doubanio.com/...",
            link: "https://movie.douban.com/...",
            name: "侯彦西",
            num: 4,
        },
        ...
    ],
    synopsis: "宋芸桦，台湾女演员。..."
}
```

注意：

- synopsis，分段用‘/’分割开 
- 演员出演电影中暂无评分使用-1表示

## 11.短评

## 12.top250

## 13.热门





## 后台异常信息：

- 当node后台因错误崩溃后，会自动重启，不影响相应访问
- 当基础url输入错误，相关数据无法发送后台，可能会没有相应，导致超时错误
- 当url参数输入有误，会导致错误后台拿不到需要解析的页面，会返回"网络错误！ --->无法访问指定的url"
- 当指定解析模式与url不匹配时，会返回"解析错误！ --->url与解析模式不匹配"。(当后台无法判断解析模式是否与url匹配时，会返回空对象)