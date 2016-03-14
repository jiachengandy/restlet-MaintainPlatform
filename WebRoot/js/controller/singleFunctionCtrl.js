define([ 'app', 'cookie', 'jscharts', 'utilService', 'highcharts_more',
		'bootstrap' ,'businessService','animate','artDialog'], function() {
	angular.module("bss").controller("singleFunctionCtrl", singleFunctionCtrl);
	function singleFunctionCtrl($scope, $rootScope, utilManager,businessManager) {

		/* 购物车曲线 */
		$scope.initChartInfo = function() {
			$scope.chartAreas = utilManager.getLocalAreas();
			$scope.name_zh = "南京";
			$scope.currentArea = "nj";
			$scope.offset = 0;
			$scope.getOrderListCnt($scope.currentArea);
		};

		$scope.getOrderListCnt = function(areavalue, setvalue) {
			var area = "";
			var offset = 0;
			if (typeof setvalue == 'undefined') {
				offset = $scope.offset;
			} else {
				offset = setvalue;
				$scope.offset = offset;
			}
			if (typeof areavalue == 'undefined' || areavalue == '') {
				area = $scope.currentArea;
			} else {
				area = areavalue;
				$scope.currentArea = area;
			}
			var areaName = utilManager.getAreaName(area);
			$scope.$bssPost({
				url : "/maintain/getOrderListCnt.do",
				data : {
					area : area,
					offset : offset
				},
				success : function(data) {
					var labels = [], userdata = [];
					var cnt = data[0].length;
					for (var j = 0; j < cnt - 1; j++) {
						userdata[j] = [];
					}
					$.each(data, function(i, e) {
						if (i > 0) {
							labels[i - 1] = e[0];
							for (var j = 0; j < cnt - 1; j++) {
								userdata[j][i - 1] = e[j + 1];
							}
						}
					});
					var ser = [];
					for (var j = 0; j < cnt - 1; j++) {
						ser[j] = {
							stitle : data[0][j + 1],
							sdata : userdata[j]
						};
					}
					var wix = data.length * 30;
					if (wix < 1000) {
						wix = 1000;
					}
					drowchart({
						area:area,
						offset:offset,
						hostmsg : areaName + " " + getTime() + " 购物车量对比",
						labels : labels,
						ytitle : "数量",
						ymax : null,
						w : wix,
						type : "spline",
						f : {
							a : "",
							b : "时间点:",
							c : "购物车量:"
						},
						series : ser
					});
				}
			});
		};
		var showchartcycle = function() {
			var ctime = $("#cycletime").val().trim();
			var ct = 10;
			if (!isNaN(ctime))
				ct = parseInt(ctime);
			if ($("#iscycle").attr("checked") == "checked") {
				$scope.getOrderListCnt($scope.currentArea, 0);
			}
			setTimeout(showchartcycle, ct * 1000);
		};
		var getTime = function() {
			var ct = new Date().getTime();
			var nt = ct + 24 * 60 * 60 * 1000 * $scope.offset;
			var nd = new Date();
			nd.setTime(nt);
			return nd.getFullYear() + "/" + (nd.getMonth() + 1) + "/"
					+ nd.getDate();
		};
		var drowchart = function(data) {
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
						console.log(data.labels[cnt]+": "+series[0].data[cnt] + " , " + series[1].data[cnt]);
						var tmp = series[1].data[cnt];
						series[1].data[cnt] = {
							y : tmp,
							marker: {fillColor: 'red', radius : 4, symbol : "circle"}
						};
					}
				}
			};
		
			new Highcharts.Chart({
				chart : {
					renderTo : "drawdiv",
					type : data.type,
					marginRight : 1,
					events : {
						load : function() {
							ret = this.series;
						}
					}
				},
				title : {
					text : data.hostmsg
				},
				subtitle : {
					text : "只人工受理渠道，不含批量受理和省客服人工渠道"
				},
				xAxis : {
					tickInterval : document.width < document.height ? 5 : 1,
					categories : data.labels,
					labels : {
						rotation : -45
					}
				},
				yAxis : {
					min : 0,
					max : data.ymax,
					title : {
						text : data.ytitle
					},
					plotLines : [ {
						value : 2,
						width : 1,
						color : '#808000'
					} ],
					labels : {
						formatter : function() {
							return this.value + data.f.a;
						}
					}
				},
				tooltip : {
					crosshairs : true,
					formatter : function() {
						return '<b>' + this.series.name + '</b><br/>'
								+ data.f.b + this.x + '<br/>' + data.f.c
								+ this.y + data.f.a;
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
		$(".ul-area li").bind("click", function() {
			$(this).prevAll().removeClass("current");
			$(this).nextAll().removeClass("current");
			$(this).addClass("current");
		});
	}
	;
});
