define(['app','cookie','jscharts','utilService','highcharts_more','bootstrap','artDialog','scrollbar','mousewheel','htmlFilter'], function()
{
	angular.module("bss").controller("toolCtrl", toolCtrl);
	function toolCtrl($scope, $rootScope,utilManager)
	{
		$scope.initTool=function()
		{
			$scope.area="nj";
			$scope.chacheArea = 'nj';
			$scope.changeTips="暂无执行结果！";
			$scope.clearResult="暂无执行结果！";
			$scope.toolType= "commonTools";
			$scope.areas = utilManager.getLocalAreas();
		};
		
		$(".ul-area li").bind("click",function(){
			$(this).prevAll().removeClass("current");
			$(this).nextAll().removeClass("current");
			$(this).addClass("current");
		});
		$scope.showCacheArea = function(event){
			var e = event ? event : window.event;
			var cntr = e.srcElement || e.target;
			$rootScope.$safeApply($scope,function(){
				$scope.chacheArea = $(cntr).attr("aus");
			});
		};
		
		$scope.changeToolsTab=function(toolType){
			$scope.currentTool = toolType;
			if(toolType=='netSwitch'){
				$scope.initVersionInfo();
			}else if(toolType=='switchManage'){
				$scope.initSwitchCnt();
			}
		};
		/**清理缓存*/
		$scope.clearCache=function(type,area,areaName,event){
			var username = $.cookie("username");
			var e = event ? event : window.event;
			var cntr = e.srcElement || e.target;
			$(cntr).parent().next().text("缓存清理中，请耐心等待...");
			$scope.$bssPost({
				url:"/maintain/clearCache.do",
				cover:true,
				beforeSend:function(){
				},
				data:{username:username,area:area,type:type},
				success:function(result){
					var key = type;
					var tip = "";
					switch (key) {
					case "4G":tip=" 集团4G ";
						break;
					case "DQ":tip=" 电渠 ";
					break;
					case "SO":tip=" 营业ABCD ";
					break;
					default:
						break;
					}
					if(result == "success"){
						$rootScope.$safeApply($scope,function(){
							var clearResult=areaName+tip+" 缓存清理成功!";
							$(cntr).parent().next().text(clearResult);
						});
					}else{
						$(cntr).parent().next().text(result);
					}
				}
			});
		};
		$scope.initVersionInfo = function(){
			angular.forEach($scope.areas,function(item,index){
				var area_us = item.area_us;
				$scope.getBSSVersionSingle(area_us);
			});
		};
		$scope.queryVersionByArea=function(event){
			var e = event ? event : window.event;
			var cntr = e.srcElement || e.target;
			var area = $(cntr).attr("aid");
			$scope.getBSSVersionSingle(area);
		
		};
		/**查询工号分布*/
		$scope.getBSSVersionSingle=function(area){
			$scope.$bssPost({
				url:"/maintain/getBSSVersionSingle.do",
				cover:true,
				data:{area:area},
				success:function(result){
					var mainVersion = getMainVersion(result);
					var dataArra = [];
					var i = 0;
					angular.forEach(result, function(item, idx){
						var n = new Number((item/mainVersion.cnt*100).toFixed(4));
						var k = idx+"环境";
						if(idx == "Z")
							k = "老环境";
						dataArra[i] = [k, n];
						i++;
					});
					angular.forEach($scope.areas ,function(item,index){
						if(area==item.area_us){
							if(mainVersion.cnt!=mainVersion.max){
								item.mainVersion=mainVersion.maxVer;
							}else{
								item.allVersion=mainVersion.maxVer;
							}
							item.spreadVersion = dataArra;
							item.curVersion = mainVersion.maxVer;
						}
					});
				}
			});
		};
		$scope.getSpreadVersion=function(area,dataArras){
			var text = area+"工号分布详情";
			drawPie($("#spread-version"),text,dataArras);
		};
		function drawPie(obj,pieText,dataArras){
			obj.highcharts({
		        chart: {
		            plotBackgroundColor: null,
		            plotBorderWidth: null,
		            plotShadow: false
		        },
		        title: {
		            text: pieText
		        },
		        tooltip: {
		    	    pointFormat: '{series.name}: <b>{point.percentage:.4f}%</b>'
		        },
		        plotOptions: {
		            pie: {
		                allowPointSelect: true,
		                cursor: 'pointer',
		                dataLabels: {
		                    enabled: true,
		                    format: '<b>{point.name}</b>: {point.percentage:.4f} %',
		                    style: {
		                        color: (Highcharts.theme && Highcharts.theme.contrastTextColor) || 'black'
		                    }
		                }
		            }
		        },
		        series: [{
		            type: 'pie',
		            name: 'BSS staff share',
		            data: dataArras
		        }]
		    });
		}		/**查看工号主要分布情况*/
		function getMainVersion(all){
			var rst = {
			max : 0,
			maxVer : "A",
			cnt : 0};
			$.each(all, function(i, e){
				rst.cnt += e;
				if(e > rst.max){
					rst.max = e;
					rst.maxVer = i;
				}
			});
			return rst;
		}
		
		/**切换版本*/
		$scope.changeVersion=function(event,areaname,curVersion){
			var e = event ? event : window.event;
			var cntr = e.srcElement || e.target;
			var tarVerion =$(cntr).prevAll(".switch-node").val() ;
			var changeTips = "切换版本中，请耐心等待。。。";
			$(cntr).parent().next().text(changeTips);
			var username = $.cookie("username");
			$scope.$bssPost({
				url:"/maintain/changeVersion.do",
				cover:false,
				data:{area:areaname,cur:curVersion,tar:tarVerion,username:username},
				success:function(result){
					var changeTips = null;
					if(result=='success'){
						changeTips = areaname+"由"+curVersion+"切换到"+tarVerion+"成功。。。";
						
					}
					else{
						changeTips = areaname+"由"+curVersion+"切换到"+tarVerion+"时出现异常。。。";
					}
					$(cntr).parent().next().text(changeTips);
				}
			});
		};
		
		/*购物车曲线*/
		$scope.initChartInfo=function(){
			$scope.toolType='shoppingChart';
			$scope.chartAreas = utilManager.getLocalAreas();
			$scope.name_zh="南京";
			$scope.currentArea="nj";
			$scope.offset = 0;
			$scope.getOrderListCnt($scope.currentArea);
		};
		
		$scope.getOrderListCnt=function(areavalue,setvalue){
			var area = "";
			var offset = 0;
			if(typeof setvalue=='undefined'){
				offset=$scope.offset;
			}else{
				offset = setvalue;
				$scope.offset=offset;
			}
			if(typeof areavalue=='undefined'||areavalue==''){
				area = $scope.currentArea;
			}else{
				area = areavalue;
				$scope.currentArea = area;
			}
			var areaName = utilManager.getAreaName(area);
			$scope.$bssPost({
				url:"/maintain/getOrderListCnt.do",
				data:{area:area, offset:offset},
				success:function(data){
					var labels = [], userdata = [];
					var cnt = data[0].length;
					for(var j=0;j<cnt-1;j++){
						userdata[j] = [];
					}
					$.each(data, function(i, e){
						if(i > 0){
							labels[i-1] = e[0];
							for(var j=0;j<cnt-1;j++){
								userdata[j][i-1] = e[j+1];
							}
						}
					});
					var ser = [];
					for(var j=0;j<cnt-1;j++){
						ser[j] = {stitle:data[0][j+1], sdata:userdata[j]};
					}
					var wix = data.length * 30;
					if(wix < 1000){	
						wix  = 1000;
					}
					drowchart({
						area:area,
						offset:offset,
						hostmsg: areaName+" "+getTime()+" 购物车量对比",
						labels:	labels,
						ytitle: "数量",
						ymax: null,
						w:wix,
						type:"spline",
						f: {
							a:"",
							b : "时间点:",
							c : "购物车量:"},
						series: ser
					});
				}
			});
		};
		var showchartcycle = function(){
			var ctime = $("#cycletime").val().trim();
			var ct = 10;
			if(!isNaN(ctime))
				ct = parseInt(ctime);
			if($("#iscycle").attr("checked") == "checked"){
				$scope.getOrderListCnt($scope.currentArea,0);
			}
			setTimeout(showchartcycle, ct * 1000);
		};
		var getTime = function(){
			var ct = new Date().getTime();
			var nt = ct + 24 * 60 * 60 * 1000 * $scope.offset;
			var nd = new Date();
			nd.setTime(nt);
			return nd.getFullYear()+"/"+(nd.getMonth()+1)+"/"+nd.getDate();
		};
		var drowchart = function(data){
			var series = [];
			var ret;
			if (data.series) {
				$.each(data.series, function(i, e) {
					series.push({
						name : e.stitle,
						data : e.sdata,
						lineWidth : 1,
						marker : {
							radius : 2
						}
					});
				});
				series[1].color = "red";
				for(var cnt = 0; cnt < series[1].data.length; cnt ++){
					if(!series[1].data[cnt])
						continue;
					if(series[1].data[cnt] < series[0].data[cnt] / 2 || series[1].data[cnt] > series[0].data[cnt] * 2){
						var tmp = series[1].data[cnt];
						series[1].data[cnt] = {
							y : tmp,
							marker: {fillColor: 'red', radius : 4, symbol : "circle"}
						};
					}
				}
			};
			Highcharts.theme = {
					   colors: ["#2b908f", "#90ee7e", "#f45b5b", "#7798BF", "#aaeeee", "#ff0066", "#eeaaee",
					      "#55BF3B", "#DF5353", "#7798BF", "#aaeeee"],
					   chart: {
					      backgroundColor: {
					         linearGradient: { x1: 0, y1: 0, x2: 1, y2: 1 },
					         stops: [
					            [0, '#2a2a2b'],
					            [1, '#3e3e40']
					         ]
					      },
					      style: {
					         fontFamily: "'Unica One', sans-serif"
					      },
					      plotBorderColor: '#606063'
					   },
					   title: {
					      style: {
					         color: '#E0E0E3',
					         textTransform: 'uppercase',
					         fontSize: '20px'
					      }
					   },
					   subtitle: {
					      style: {
					         color: '#E0E0E3',
					         textTransform: 'uppercase'
					      }
					   },
					   xAxis: {
					      gridLineColor: '#707073',
					      labels: {
					         style: {
					            color: '#E0E0E3'
					         }
					      },
					      lineColor: '#707073',
					      minorGridLineColor: '#505053',
					      tickColor: '#707073',
					      title: {
					         style: {
					            color: '#A0A0A3'

					         }
					      }
					   },
					   yAxis: {
					      gridLineColor: '#707073',
					      labels: {
					         style: {
					            color: '#E0E0E3'
					         }
					      },
					      lineColor: '#707073',
					      minorGridLineColor: '#505053',
					      tickColor: '#707073',
					      tickWidth: 1,
					      title: {
					         style: {
					            color: '#A0A0A3'
					         }
					      }
					   },
					   tooltip: {
					      backgroundColor: 'rgba(0, 0, 0, 0.85)',
					      style: {
					         color: '#F0F0F0'
					      }
					   },
					   plotOptions: {
					      series: {
					         dataLabels: {
					            color: '#B0B0B3'
					         },
					         marker: {
					            lineColor: '#333'
					         }
					      },
					      boxplot: {
					         fillColor: '#505053'
					      },
					      candlestick: {
					         lineColor: 'white'
					      },
					      errorbar: {
					         color: 'white'
					      }
					   },
					   legend: {
					      itemStyle: {
					         color: '#E0E0E3'
					      },
					      itemHoverStyle: {
					         color: '#FFF'
					      },
					      itemHiddenStyle: {
					         color: '#606063'
					      }
					   },
					   credits: {
					      style: {
					         color: '#666'
					      }
					   },
					   labels: {
					      style: {
					         color: '#707073'
					      }
					   },

					   drilldown: {
					      activeAxisLabelStyle: {
					         color: '#F0F0F3'
					      },
					      activeDataLabelStyle: {
					         color: '#F0F0F3'
					      }
					   },

					   navigation: {
					      buttonOptions: {
					         symbolStroke: '#DDDDDD',
					         theme: {
					            fill: '#505053'
					         }
					      }
					   },

					   // scroll charts
					   rangeSelector: {
					      buttonTheme: {
					         fill: '#505053',
					         stroke: '#000000',
					         style: {
					            color: '#CCC'
					         },
					         states: {
					            hover: {
					               fill: '#707073',
					               stroke: '#000000',
					               style: {
					                  color: 'white'
					               }
					            },
					            select: {
					               fill: '#000003',
					               stroke: '#000000',
					               style: {
					                  color: 'white'
					               }
					            }
					         }
					      },
					      inputBoxBorderColor: '#505053',
					      inputStyle: {
					         backgroundColor: '#333',
					         color: 'silver'
					      },
					      labelStyle: {
					         color: 'silver'
					      }
					   },

					   navigator: {
					      handles: {
					         backgroundColor: '#666',
					         borderColor: '#AAA'
					      },
					      outlineColor: '#CCC',
					      maskFill: 'rgba(255,255,255,0.1)',
					      series: {
					         color: '#7798BF',
					         lineColor: '#A6C7ED'
					      },
					      xAxis: {
					         gridLineColor: '#505053'
					      }
					   },

					   scrollbar: {
					      barBackgroundColor: '#808083',
					      barBorderColor: '#808083',
					      buttonArrowColor: '#CCC',
					      buttonBackgroundColor: '#606063',
					      buttonBorderColor: '#606063',
					      rifleColor: '#FFF',
					      trackBackgroundColor: '#404043',
					      trackBorderColor: '#404043'
					   },

					   // special colors for some of the
					   legendBackgroundColor: 'rgba(0, 0, 0, 0.5)',
					   background2: '#505053',
					   dataLabelsColor: '#B0B0B3',
					   textColor: '#C0C0C0',
					   contrastTextColor: '#F0F0F3',
					   maskColor: 'rgba(255,255,255,0.3)'
					};

					// Apply the theme
					//Highcharts.setOptions(Highcharts.theme);
			new Highcharts.Chart({
				chart : {
					renderTo : "drawdiv",
					type : data.type,
					marginRight : 1,
					width: 1040,
					height:440,
					events: {
		                load: function () {
							ret = this.series;
		                }
					}
				},
				title : {
					text : data.hostmsg
				},
		        subtitle: {
		            text: "只人工受理渠道，不含批量受理和省客服人工渠道"
		        },
				xAxis : {
					categories : data.labels,
					labels: {rotation: -45}
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
				plotOptions : {
					series : {
						dataLabels : {
							color : '#B0B0B3'
						},
						marker : {
							lineColor : '#333'
						},
						point:{ events: {
			                    click: function (e) {
									var thisx = data.labels[this.x];
									$scope.$bssPost({
										url:"/maintain/getOrderListDetail.do",
										data:{area:data.area, offset:data.offset, time:thisx},
										success:function(rst){
											var tmp = JSON.parse(rst);
											var v_content = getTime()+"	"+thisx+"<hr>";
											$.each(tmp, function(i, e){
												for(obj in e){
													v_content += obj+":"+e[obj]+"<br>";
												}
											});
											showOrderListDetail(v_content, e.pageX || e.clientX, e.pageY || e.clientY);
										}
									});
			                    }
			                }
						}
					},
				},
				series : series
			});
			return ret;
		};
		var showOrderListDetail = function(content, x, y){
			for(var i in art.dialog.list){
				art.dialog.list[i].close();
			}
			var w = x;
			if(document.width < document.height){
				x = document.width/4,
				y = document.height/5;
			}
			art.dialog({
				id:"order_list_detail",
				content:content,
				title:"购物车数量详情",
				drag:false,
				resize:false
			}).position(x, y);
		};
		$scope.initServerF5=function(){
			$scope.toolType='f5';
			$scope.queryServerF5sByPage();
		};
		$scope.queryServerF5sByPage = function(cpage){
			cpage = utilManager.calculatePage(cpage);
			$scope.$bssPost({
				url : "/maintain/getServerF5.do",
				data:{cpage:cpage,pageSize:10},
				success : function(result) {
					$rootScope.$safeApply($scope, function() {
						$scope.serverF5s = result.object;
						$scope.pages = utilManager
								.showPage(result.page.totalPage);
						$scope.page = result.page;
					});
				}
			});
		};
		$scope.executef5Function=function(serverIp,serverPort,configId,state){
			var mes ="";
			if(state=='1'){
				mes = "确定更改f5状态为失效";
			}else{
				mes = "确定更改f5状态为生效";
			}
			var flag=confirm(mes);
			if(flag==true){
				var serverinfo = serverIp +":"+serverPort;
				$scope.$bssPost({
					url:"/application/executef5.do",
					data:{configId:configId,username:$.cookie("username"),serverinfo:serverinfo},
					success:function(result){
						alert("执行f5切换成功！");
						getServerTestInfo($scope.flag,$scope.serverType);
					}
				});
			}
		};
		$scope.getServerF5ById = function(data,event){
			var configId = data.configId;
			var state = data.state;
			var testState = data.testState;
			var e = event ? event : window.event;
			var cntr = e.srcElement || e.target;
			$scope.$bssPost({
				url:"/maintain/getServerF5ById.do",
				data:{configId:configId},
				success:function(rst){
					if(rst.state!=state){
						if(rst.state=='enabled'){
							$(cntr).parent().prevAll(".state-enabled").removeClass("ng-hide").addClass("ng-show");	
							$(cntr).parent().prevAll("..state-disabled").removeClass("ng-show").addClass("ng-hide");
						}else{
							$(cntr).parent().prevAll(".state-disabled").removeClass("ng-hide").addClass("ng-show");
							$(cntr).parent().prevAll(".state-enabled").removeClass("ng-show").addClass("ng-hide");
						}
					};
					if(rst.testState!=testState){
						if(rst.testState==null){
							$(cntr).parent().prevAll(".test-normal").removeClass("ng-hide").addClass("ng-show");
							$(cntr).parent().prevAll(".test-exception").removeClass("ng-show").addClass("ng-hide");
						}else{
							$(cntr).parent().prevAll(".test-normal").removeClass("ng-show").addClass("ng-hide");
							$(cntr).parent().prevAll(".test-exception").removeClass("ng-hide").addClass("ng-show");
						}
					};
				}
			});
			data.testState = null;
		};
		/**BSS开关管理*/
		$scope.initSwitchCnt=function(){
				$scope.$bssPost({
					url:"/maintain/getSwitchCnt.do",
					data:{},
					success:function(result){
						var areas=[];
						angular.forEach(result,function(item,index){
							var area = {};
							var area_zh = utilManager.getAreaName(index);
							area.area_zh=area_zh;
							area.area_us = index;
							area.area_cnt=item;
							areas.push(area);
						});
						$rootScope.$safeApply($scope,function(){
							$scope.switchAreas = areas;
						});
						$scope.initSwitchManage($scope.switchAreas[0].area_us);
					}
				});
		};
		$scope.initSwitchManage=function(area){
			$scope.currentItem=area;
			area = area.toUpperCase();
			var area_zh = utilManager.getAreaName(area);
			$scope.$bssPost({
				url:"/maintain/getBssSwitch.do",
				data:{area:area},
				success:function(result){
					angular.forEach(result,function(item,index){
						item.area_zh = area_zh;
					});
					$rootScope.$safeApply($scope,function(){
						$scope.bssSwitchs = result;
					});
				}
			});
			$('.switch-manage-slider').perfectScrollbar();
		};
		$scope.updateSwitch=function(typeClass,tarval){
			var area = $scope.currentItem;
			var username = $.cookie("username");
			$scope.$bssPost({
				url:"/maintain/updateBssSwitch.do",
				data:{area:area, typeClass:typeClass, value:tarval, username:username},
				success:function(result){
					alert(result);
					$scope.initSwitchManage(area);
				}
			});
		};
		/**BSS控制台管理*/
		$scope.initBSSConsole=function(){
			$scope.toolType='bssConsole';
			$scope.$bssPost({
				url:"/maintain/getConsoleList.do",
				success:function(result){
					$rootScope.$safeApply($scope,function(){
						$scope.bssConsoles = result;
					});
				}
			});
			$('.bss-console-slider').perfectScrollbar();
		};
		$scope.deleteBSSConsole=function(consoleId){
			if(confirm("确定删除？")){
				$scope.$bssPost({
					url:"/maintain/deleteConsole.do",
					data:{consoleId:consoleId},
					success:function(){
						$scope.initBSSConsole();
					}
				});
			}
		};
		$scope.beforeAddConsole = function(){
			$scope.console = null;
			$scope.consoleOpration = 'add';
		};
		$scope.addBSSConsole=function(isValid){
			$scope.$bssPost({
				url:"/maintain/addConsole.do",
				contentType:'application/json;charset=UTF-8',
				data:JSON.stringify($scope.console),
				success:function(result){
					$scope.initBSSConsole();
				}
			});
		};
		$scope.queryBSSConsoleById= function(id){
			$scope.consoleId = id;
			$scope.$bssPost({
				url:"/maintain/queryConsoleById.do",
				data:{id:id},
				success:function(result){
					$rootScope.$safeApply($scope,function(){
						$scope.console = result;
						$scope.consoleOpration = 'modify';
					});
				}
			});
		};
		$scope.updateBSSConsole=function(){
			$scope.console.consoleId = $scope.consoleId;
			$scope.$bssPost({
				url:"/maintain/updateConsole.do",
				contentType:'application/json;charset=UTF-8',
				data:JSON.stringify($scope.console),
				success:function(result){
					$scope.initBSSConsole();
				}
			});
		};
		/**配置文件管理*/
		$scope.initBSSConfig=function(){
			$scope.toolType = "bssConfig";
		};
		$(".tool-menu-slider").perfectScrollbar();
	};
});
