define([ 'app','highcharts' ], function() {
	// 用户操作
	angular.module("bss").factory('utilManager', function($rootScope) {
		var utilManager = {
			// 空间下添加用户
			getQueryString : function(name) {
				var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
				var r = window.location.search.substr(1).match(reg);
				if (r != null) {
					return decodeURI(unescape(r[2]));
				} else {
					return null;
				}

			},
			getLocalTime:function(){
				var now = new Date(); //获取系统日期，即Sat Jul 29 08:24:48 UTC+0800 2006 
				var yy = now.getFullYear(); //截取年，即2006 
				var mm = now.getMonth()+1; //截取月，即07 
				var dd = now.getDate(); //截取日，即29 
				//取时间 
				var hh = now.getHours(); //截取小时，即8 
				var mi = now.getMinutes(); //截取分钟，即34 
				var ss = now.getTime() % 60000; //获取时间，因为系统中时间是以毫秒计算的，
				ss = (ss - (ss % 1000)) / 1000;
				mm=mm<10?"0"+mm:mm;
				dd=dd<10?"0"+dd:dd;
				hh=hh<10?"0"+hh:hh;
				mi=mi<10?"0"+mi:mi;
				ss=ss<10?"0"+ss:ss;
				var dateTime=yy+"-"+mm+"-"+dd+" "+hh+":"+mi+":"+ss;
				return dateTime;
			},
			getLocalDate:function(){
				var now = new Date(); //获取系统日期，即Sat Jul 29 08:24:48 UTC+0800 2006 
				var yy = now.getFullYear(); //截取年，即2006 
				var mm = now.getMonth()+1; //截取月，即07 
				var dd = now.getDate(); //截取日，即29 
				mm=mm<10?"0"+mm:mm;
				dd=dd<10?"0"+dd:dd;
				var date=yy+"-"+mm+"-"+dd;
				return date;
			},
			calculatePage : function(cpage) {
				if(typeof(cpage)!='undefined'&&cpage>page)
        		{
        			cpage=page;
        		}
        		if(typeof(cpage)!='undefined'&&cpage<1)
        		{
        			cpage=1;
        		}
        		return cpage;
			},
			showPage:function(size){
				var pages=[];
				page=size;
				for(var i=1;i<=size;i++)
				{
					pages.push(i);
				}
				return pages;
			},
			getAreaName:function(name_us)
			{
				var area_zh="";
				key = name_us.toLowerCase();
				switch (key) {
				case "nj":area_zh="南京";
					break;
				case "wx":area_zh="无锡";
					break;
				case "sz":area_zh="苏州";
					break;
				case "nt":area_zh="南通";
					break;
				case "yz":area_zh="扬州";
					break;
				case "xz":area_zh="徐州";
					break;
				case "cz":area_zh="常州";
					break;
				case "tz":area_zh="泰州";
					break;
				case "yc":area_zh="盐城";
					break;
				case "zj":area_zh="镇江";
					break;
				case "ha":area_zh="淮安";
					break;
				case "lyg":area_zh="连云港";
					break;
				case "sq":area_zh="宿迁";
					break;
				default:
					break;
				}
				return area_zh;
			},
			getLocalAreas:function(){
				var areas= [{"area_us":"nj","area_zh":"南京","code":"025"},{"area_us":"wx","area_zh":"无锡","code":"0510"},
				            {"area_us":"zj","area_zh":"镇江","code":"0511"},{"area_us":"sz","area_zh":"苏州","code":"0512"},
				            {"area_us":"nt","area_zh":"南通","code":"0513"},{"area_us":"yz","area_zh":"扬州","code":"0514"},
				            {"area_us":"yc","area_zh":"盐城","code":"0515"},{"area_us":"xz","area_zh":"徐州","code":"0516"},
				            {"area_us":"ha","area_zh":"淮安","code":"0517"},{"area_us":"lyg","area_zh":"连云港","code":"0518"},
				            {"area_us":"cz","area_zh":"常州","code":"0519"},{"area_us":"tz","area_zh":"泰州","code":"0523"},
				            {"area_us":"sq","area_zh":"宿迁","code":"0527"}];
				return areas;
			},
			drawchart:function(data){
				$(".chart-win").css("display","block");
				$("body").append("<div class='masklayer'></div>");
				var series = [];
				$.each(data.series, function(i, e){
					series.push({name : e.stitle,data : e.sdata,lineWidth : 1,marker: {radius: 2}});
				});
				chart = new Highcharts.Chart({
					chart : {
						renderTo : "chartdetail",
						type : 'line',
						zoomType:'x',
						marginRight : 130,
						marginBottom : 25
					},
					title : {
						text : data.hostmsg,
						x : -20
					},
					xAxis : {
						categories : data.labels,
						labels: {y:50}
					},
					yAxis : {
						min:0,
						max:data.ymax,
						title : {
							text : data.ytitle
						},
						plotLines : [ 
						              {
						            	  value : 2,
						            	  width : 1,
						            	  color : '#808000'
						              } ],
						labels: {
							formatter:function(){
								return this.value+data.f.a;
								}
						}
					},
					tooltip : {
						crosshairs: true,
						formatter : function() {
							return '<b>'+ this.series.name +'</b><br/>'+data.f.b+this.x+'<br/>'+data.f.c+ this.y+data.f.a;
						}
					},
					legend : {
						layout : 'vertical',
						align : 'right',
						verticalAlign : 'top',
						x : -10,
						y : 100,
						borderWidth : 0
					},
					series : series
				});
			},
			formatDate:function(time, offset){
				if(offset == null)
					offset = 0;
				if(offset == -1){
					offset = 0;
					time.setHours(0,0,0,0);
				}
				if(offset == -2){
					offset = 0;
					time.setHours(23,59,59,999);
				}
				var tm = time.getTime() + offset * 1000 * 60 * 60 * 24;
				time = new Date(tm);
				var y = time.getYear();
				if(y < 1000)
					y += 1900;
				var m = time.getMonth() + 1;
				if(m < 10) m = "0" + m;
				var d = time.getDate();
				if(d < 10) d = "0" + d;
				var h = time.getHours();
				if(h < 10) h = "0" + h;
				var mi = time.getMinutes();
				if(mi < 10) mi = "0" + mi;
				return y + "-" + m + "-" + d + " " + h + ":" + mi;
			},
			animateFont:function(obj,size0,size1){
				obj.animate({"font-size":size0+"px"},300);
				obj.animate({"font-size":size0+"px"},300);
			},
			trim:function(str){  
			    return str.replace(/(^\s*)|(\s*$)/g, "");  
			} ,
			drawMap:function(options){
				var resultOption = {mapTitle:''};
				var id = options.id;
				$.extend(resultOption,options);
			    Highcharts.getOptions().colors = Highcharts.map(Highcharts.getOptions().colors, function (color) {
			        return {
			            radialGradient: { cx: 0.5, cy: 0.3, r: 0.7 },
			            stops: [
			                [0, color],
			                [1, Highcharts.Color(color).brighten(-0.3).get('rgb')] // darken
			            ]
			        };
			    });

			    $('#'+id).highcharts({
			        chart: {
			            plotBackgroundColor: null,
			            plotBorderWidth: null,
			            plotShadow: false,
			            height:300
			        },
			        title: {
			            text: resultOption.mapTitle
			        },
			        tooltip: {
			           pointFormat: '{series.name}:<b>{point.percentage:.1f}%</b>',
			         /*  formatter : function() {
							return '<b>' + this.series.name + '</b><br/>'
									+ this.y;
						}*/
			        },
			        plotOptions: {
			            pie: {
			                allowPointSelect: true,
			                cursor: 'pointer',
			                dataLabels: {
			                    enabled: true,
//			                    format: '<b>{point.name}</b>: {point.percentage:.1f} %',
			                    format: '<b>{point.name}</b>',
			                    style: {
			                        color: (Highcharts.theme && Highcharts.theme.contrastTextColor) || 'black'
			                    },
			                    connectorColor: 'silver'
			                }
			            }
			        },
			        series: [options.series]
			    });
			}
		};
		return utilManager;
	});

});
