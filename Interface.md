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
            time:"2018-11-21 00:11:38",
        	message:"相当于迪士尼的《头号玩家》...",
        	goodNumber:626,
        },
        ...
    ],
	moreShortCommentary:{
    	link:"https://img1.doubanio.com/...",
        num:2999
    },
    movieCommentary:[
        {
            name:
            tittle:
            star:
            link:
            message:
            goodNumber:
            badnumber:
            time:{
                    year:
                    month:	
                    day:
                }

        },
        ...
    ],
    discuss:[
        {
            name:
            tittle:
            time:{
                year:
                month:	
                day:
            }
            link:
            backNumer:        
        },
        ...
    ]
	moreDiscussLink:
  }
```

注意：

- 对于还未上映的电影，star数值为-1，runtime = null
- synopsis中段落用“/”进行了分割

