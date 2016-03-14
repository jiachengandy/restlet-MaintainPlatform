define([ 'app', 'cookie', 'hostService', 'applicationService',
		'businessService', 'knowledgeService', 'htmlFilter','utilService','highcharts_more','animate','scrollbar','mousewheel','jscharts','bootstrap' ], function() {
	angular.module("bss").controller("homeCtrl", homeCtrl);
	function homeCtrl($scope, $rootScope, hostManager, applicationManager,
			businessManager, knowledgeManager,utilManager) {
		function getLocalTime()
		{
			var now = new Date(); //获取系统日期，即Sat Jul 29 08:24:48 UTC+0800 2006 
			var yy = now.getFullYear(); //截取年，即2006 
			var mm = now.getMonth()+1; //截取月，即07 
			var dd = now.getDate(); //截取日，即29 
			//取时间 
			var hh = now.getHours(); //截取小时，即8 
			var mi = now.getMinutes(); //截取分钟，即34 
			var ss = now.getTime() % 60000; //获取时间，因为系统中时间是以毫秒计算的，
			ss = (ss - (ss % 1000)) / 1000;
			$scope.date = yy+"年"+mm+"月"+dd+"日";
			hh=hh<10?"0"+hh:hh;
			mi=mi<10?"0"+mi:mi;
			ss=ss<10?"0"+ss:ss;
			$rootScope.$safeApply($scope, function() {
			$scope.time = hh+"时"+mi+"分"+ss+"秒";
			});
		}
		window.setInterval(function(){
			getLocalTime();
		}, 1000);
		$scope.viewStyle = "dispersedView";
		$scope.winsize = "normal";
		/*$scope.viewStyle = "wholeView";
		$scope.winsize = "min";*/
		$scope.initHomeInfo = function() {
			$scope.getHostStatistics();
			$scope.getHostLevels();
			$scope.getKnowledges();
			$scope.getOperationLogs();
			$scope.initBusinessInfo();
			$scope.name_zh=$.cookie("name_zh");
			getLocalTime();
		};
		$scope.getHostStatistics=function(){
			hostManager.getHostStatistics(function(result){
				var hostWarnings = [];
				angular.forEach(result.alltypes,function(item,index){
					if(item.flag>1){
						var cntw=0;
						var cntg=0;
						var cntn=0;
						hostManager.getHostListsByUsetype(item.usetype,function(result2){
							angular.forEach(result2,function(item2,index2){
								if(item2.allfalg==3){
									cntw++;
								}else if(item2.allfalg==2){
									cntg++;
								}else{
									cntn++;	
								}
							});
							item.cntw=cntw;
							item.cntg=cntg;
							item.cntn=cntn;
						});
						hostWarnings.push(item);
					}
				});
				$rootScope.$safeApply($scope, function() {
					$scope.hostWarnings = hostWarnings;
				});
				$(".warning-level>li span").animate({"font-size":"1px"},"normal");
				$(".warning-level>li span").animate({"font-size":"14px"},"normal");
				$(".warning-level>li.warning-error span").css({"-webkit-animation":"twinkling .75s infinite 0.75s ease-in-out alternate","animation":"twinkling .75s infinite 0.75s ease-in-out alternate"});
				/*
				上面的参数稍微说明一下：
				twinkling 2s：闪烁的间隔时间
				0.9s：延迟时间
				alternate：是否应该轮流反向播放动画
				ease-in-out：闪烁的方式
				opacity：透明度
				*/	
				window.setTimeout(function(){
					$scope.getHostStatistics();
				}, 5000);
			});
		};
		$scope.getHostLevels = function(){
			hostManager.getHostLevels(function(result){
				var temResult = [];
				angular.forEach(result,function(item,index){
					if(item.flag==1){
						temResult[0]=item;
					}else if(item.flag==2){
						temResult[1]=item;
					}else{
						temResult[2]=item;
					}
				});
				$rootScope.$safeApply($scope, function() {
					$scope.hostLevels = temResult;
				});
				window.setTimeout(function(){
					$scope.getHostLevels();
				}, 5000);
			});
		};
		$scope.queryHostsByUsetype=function(event,usetype){
			window.location="host.html?usetype="+encodeURI(encodeURI(usetype));
			//event.preventDefault();
			event.stopPropagation();
		};
		$scope.initAppInfo=function(){
			applicationManager.getServerTestType(function(result){
				var servers = [];
				angular.forEach(result, function(item, index) {
					var itemre = item.testResult;
					var tempall = 0;
					var tempwarn = 0;
					if (null != itemre) {
						var index = itemre.lastIndexOf("_");
						var arra = itemre.substring(index + 1).split("/");
						tempall = arra[1];
						tempwarn = arra[0];
					}
					servers.push({
						testName : item.testName,
						tempall : tempall,
						tempwarn : tempwarn
					});
				});
				$rootScope.$safeApply($scope, function() {
					$scope.servers = servers;
				});
				window.setTimeout(function(){
					$scope.initAppInfo();
				}, 5000);
			});
		};
		//当天报竣工单分析
		$scope.initSamedayOrder=function(area,start_time,end_time){
			businessManager.getMonitorResult(2,function(result){
				$rootScope.$safeApply($scope,function(){
					$scope.samedayOrder = result;
				 $scope.samedayPercent=new Number(((result.CNT1-result.CNT9)/result.CNT1*100).toFixed(2));
				});
				var datas = [];
				angular.forEach(result,function(item,index){
					var key = index;
					var firstvalue = "";
					switch (key) {
					case "CNT1":firstvalue = '工单总量：'+item;
						break;
					case "CNT2":firstvalue = '已报骏总量：'+item;
						break;
					case "CNT3":firstvalue = '1min内：',datas.push([firstvalue,parseInt(item)]);
						break;
					case "CNT4":firstvalue = '1-2min：',datas.push([firstvalue,parseInt(item)]);
						break;
					case "CNT5":firstvalue = '2-3min：',datas.push([firstvalue,parseInt(item)]);
						break;
					case "CNT6":firstvalue = '3-4min：',datas.push([firstvalue,parseInt(item)]);
						break;
					case "CNT7":firstvalue = '4-5min：',datas.push([firstvalue,parseInt(item)]);
						break;
					case "CNT8":firstvalue = '5min以上：'+item,datas.push([firstvalue,parseInt(item)]);
						break;
					default:firstvalue='工单超5分钟数量：'+item;
						break;
					}
					/*var arraItem = [firstvalue,parseInt(item)];
					datas.push(arraItem);*/
				});
				drawMap('business-pie',datas);
				/*window.setTimeout(function(){
					$scope.initSamedayOrder(area,start_time,end_time);
				}, 5000);*/
			},area,start_time,end_time);
		};
		
		//工单分布图
		function drawMap(id,datas){
			var options = {id:id};
			options.series = {data:datas,type:'pie'};
			utilManager.drawMap(options);
		}
		$scope.initBusinessInfo=function(){
			businessManager.getMonitorResult(2,function(result){
				var cntall = result.CNT1;
				var cntdone = result.CNT2;
				var cntover5 = result.CNT9;
				var percent5 = new Number(((cntall - cntover5) / cntall * 100)
						.toFixed(2));
				var counts = {
					cntall : cntall,
					cntdone : cntdone,
					percent5 : percent5,
					cntover5 : cntover5
				};
				$rootScope.$safeApply($scope, function() {
					$scope.counts = counts;
					$scope.busiResult = result;
				});
				window.setTimeout(function(){
					$scope.initBusinessInfo();
				}, 5000);
			});
		};
		$scope.getMonitor3GDetail=function(){
			businessManager.getMonitor3GDetail(function(result){
				var allorder = 0;
				var toorder = 0;
				angular.forEach(result, function(item, index) {
					allorder += item.cnt0;
					toorder += item.cnt1;
				});
				$rootScope.$safeApply($scope, function() {
					$scope.orders = {
						allorder : allorder,
						toorder : toorder
					};
				});
				window.setTimeout(function(){
					$scope.getMonitor3GDetail();
				}, 5000);	
			});
		};
		/**维护记录展示*/
		$scope.initMaintainPlan = function(){
			$scope.$bssPost({
				url:"/maintain/getRecentlyEvents.do",
				data:{recordSize:5},
				cover:false,
				success:function(result){
					$rootScope.$safeApply($scope,function(){
						$scope.plans = result;
					});
				}
			});
		};
		$scope.getBSSVersionAll=function(){
			$scope.$bssPost({
				url : "/maintain/getBSSVersionAll.do",
				cover : false,
				success : function(result) {
					var areaA = 0;
					var areaB = 0;
					var areaC = 0;
					var areaD = 0;
					var areaE = 0;
					angular.forEach(result, function(item, index) {
						if (typeof item.A != 'undefined') {
							areaA += item.A;
						}
						if (typeof item.B != 'undefined') {
							areaB += item.B;
						}
						if (typeof item.C != 'undefined') {
							areaC += item.C;
						}
						if (typeof item.D != 'undefined') {
							areaD += item.D;
						}
						if (typeof item.E != 'undefined') {
							areaE += item.E;
						}
					});
					$rootScope.$safeApply($scope, function() {
						$scope.areas = {
							areaA : areaA,
							areaB : areaB,
							areaC : areaC,
							areaD : areaD,
							areaE : areaE
						};
					});
				}
			});
		};
		$scope.getKnowledges=function(){
			knowledgeManager.getKnowledges(function(result) {
				$rootScope.$safeApply($scope, function() {
					$scope.knowledges = result.knowledges;
				});
			window.setTimeout(function(){
				$scope.getKnowledges();
			}, 5000);
			});
		};
		
		$scope.getOperationLogs=function(){
			$scope.$bssPost({
				url : "/maintain/logs.do",
				cover : false,
				success : function(result) {
					$rootScope.$safeApply($scope, function() {
						$scope.logs = result;
					});
				}
			});
		};
		$scope.initWholeView=function(){
		    $('#container').highcharts({
		        chart: {
		            type: 'bubble',
		            zoomType: 'xy',
		            events: {
		                click: function () {
		                       console.log("路过");
		                }}
		        },

		        title: {
		            text: '监控点全局视图'
		        },

		        series: [{
		            data: [[97, 36, 79], [94, 74, 60], [68, 76, 58], [64, 87, 56], [68, 27, 73], [74, 99, 42], [7, 93, 87], [51, 69, 40], [38, 23, 33], [57, 86, 31]]
		        }, {
		            data: [[25, 10, 87], [2, 75, 59], [11, 54, 8], [86, 55, 93], [5, 3, 58], [90, 63, 44], [91, 33, 17], [97, 3, 56], [15, 67, 48], [54, 25, 81]]
		        }, {
		            data: [[47, 47, 21], [20, 12, 4], [6, 76, 91], [38, 30, 60], [57, 98, 64], [61, 17, 80], [83, 60, 13], [67, 78, 75], [64, 12, 10], [30, 77, 82]]
		        }
		        ]
		    });
		};
		$scope.initMonitorLogs=function(){
			var number = 5;
			$scope.$bssPost({
				url:"/system.do?monitorLogs",
				cover:false,
				data:{number:number},
				success:function(result){
					$rootScope.$safeApply($scope,function(){
						$scope.mlogs= result;
					});
					window.setTimeout(function(){
						$scope.initMonitorLogs();
					}, 60000);
				}
			});
			$('.log-slider').perfectScrollbar();
		};
		$scope.initMoniorLine=function(){
			var zoneSize = 30;
			var labels = getTimeSplitZone(zoneSize);
			var data = {};
			$scope.$bssPost({
				url:"/host/collectData.do",
				cover:false,
				data:{zoneSize:zoneSize},
				success:function(result){
					data.hosts = result;
					drawMonitorLine(data,labels);
					/*window.setTimeout(function(){
						$scope.initMoniorLine();
					}, 5000);*/
				}
			});
		};
		
		function drawMonitorLine(data,labels){
			var series =[];
			var hostinfo = {};
			hostinfo.name="主机监控";
			hostinfo.data = data.hosts;
			var businssinfo = {};
			businssinfo.name = "业务监控";
			businssinfo.data = [
				                ["08:30", 1.6 ],
				                ["09:00", 1.7 ],
				                ["09:30", 3.8 ],
				                ["10:00",5.6 ],
				                ["10:30", 4.6 ],
				                ["11:00", 7.67],
				                ["11:30", 3.81],
				                ["12:00", 3.78],
				                ["13:00", 1.84],
				                ["13:30", 1.80],
				                ["14:00", 1.80],
				                ["14:30", 1.92],
				                ["15:00", 2.49],
				                ["15:30", 2.79]
			                    ["16:30", 2.79]
			            ];
			series.push(hostinfo);
			series.push(businssinfo);
			var businessData = data.hosts;
			 $('#monitor-line').highcharts({
			        chart: {
			            type: 'spline',
			            height:300,
			            width:1010
			        },
			        title: {
			            text: '主机、应用、业务监控曲线图'
			        },
			        subtitle: {
			            text: ''
			        },
			        xAxis: {
			        	categories:labels,
			            title: {
			                text: '时间'
			            },
			        type: 'time',
			        },
			        yAxis: {
			            title: {
			                text: '百分比（%）'
			            },
			            min: 0
			        },
			        tooltip: {
			        	headerFormat: '<b>{series.name}</b><br>',
			            pointFormat: '告警数量: {point.y}',
			          /*  formatter: function() {
			            	return this.series.name+data.y;
					    	},*/
			        },

			        plotOptions: {
			            spline: {
			                marker: {
			                    enabled: true
			                }
			            }
			        },

			        series:series
			    });
		}
		function getTimeSplitZone(zoneSize){
			var zones = [];
			for(var i=8;i<20;i++){
				var size = 60/zoneSize;
				for(var j=0;j<size;j++){
				 var minutes = j*zoneSize;
				 minutes = minutes==0?"00":minutes;
				 var hours = i<10?"0"+i:i;
				 var zone = hours+":"+minutes;
				 zones.push(zone);
				}
			}
			zones.push("20:00");
			return zones;
		};
		$scope.changeWindowLocation=function(href){
			window.location=href+".html";
		};
		/**设置快捷跳转*/
		$scope.linkQuickPage=function(href){
			window.open(href+".html");
		};
		/**旧系统入口*/
		$scope.goToOldBSS=function(){
			window.open("http://132.228.175.70:9200/BSSMonitor/");
		};
	};
});
