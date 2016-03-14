define(['app','cookie','hostService','utilService','scrollbar','mousewheel'], function()
{
	angular.module("bss").controller("hostCtrl", hostCtrl);
	function hostCtrl($scope, $rootScope,hostManager,utilManager)
	{
		$scope.hostmsg = null;
		$scope.chartType = null;
		$scope.chartTime = 144;
		$scope.initHost=function()
		{
			var paramURI = utilManager.getQueryString("usetype");
			hostManager.getHostStatistics(function(result) {
				var hostTypes = result.alltypes;
				$rootScope.$safeApply($scope, function() {
					$scope.hostTypes = hostTypes;
				});
				if(paramURI==null || paramURI==''){
					$scope.getHostLists();
					$scope.hosttype='all';
				}else{
					$scope.hosttype=paramURI;
					$scope.getHostsByUsetype(paramURI);
				}
			});
			 //$('#host-nav').tinyscrollbar_update();perfectScrollbar
			$scope.getHostLevels();
			$('.aside-slider').perfectScrollbar();
		};
		$scope.getHostLevels = function(){
			$scope.$bssPost({
				url:"/host.do?hostLevels",
				cover:false,
				success:function(result){
					var hostinfo={};
					angular.forEach(result,function(item,inidex){
						var arra=[];
						if(item.flag ==1){
							arra.push("正常");
							arra.push(item.cnt);
							hostinfo.normal = item.cnt;
						}else if(item.flag ==2){
							arra.push("一般");
							arra.push(item.cnt);
							hostinfo.general = item.cnt;
						}else{
							arra.push("异常");
							arra.push(item.cnt);
							hostinfo.exception = item.cnt;
						}
					});
					$rootScope.$safeApply($scope,function(){
						$scope.hostinfo = hostinfo;
					});
					window.setTimeout(function(){
						$scope.getHostLevels();
					}, 5000);
				}
			});
		};
		$scope.getHostLists=function(){
			$scope.$bssPost({
				url : "/host.do?lists",
				cover : false,
				success : function(result) {
					var hostLists = result;
					var timeFlags3 = 0;
					angular.forEach(hostLists,function(item,index){
						if(item.cpu.indexOf(".")==0){
							item.cpu= "0"+item.cpu;
						}
						if(item.io.indexOf(".")==0){
							item.io= "0"+item.io;
						}
						if(item.ping.indexOf(".")==0){
							item.ping= "0"+item.ping;
						}
						var flag=getTimeFlag(item.gettime);
						if(flag ==3){
							timeFlags3++;
						}
						item.gettimeflag=flag;
						item.hostMsg =  item.hosturl + ";" + item.usetype;
					});
					$rootScope.$safeApply($scope, function() {
					$scope.hostLists=hostLists;
					$scope.timeFlags3 =timeFlags3;
					});
					window.clearTimeout($scope.usetypeTimeout);
					 $scope.allTimeout=window.setTimeout(function(){
						$scope.getHostLists();
					}, 5000);
				}
			});
			$('.host-grid-slider').perfectScrollbar();
		};
		$scope.getHostListsByUsetype=function(usetype,event){
			var e = event ? event : window.event;
			var cntr = e.srcElement || e.target;
			$(".option-item").removeClass("current");
			$(cntr).parent(".option-item").addClass("current");
			if(usetype=='%'){
				$scope.getHostLists();
			}else{
				$scope.getHostsByUsetype(usetype);
			}
		};
		$scope.getHostsByUsetype =function(usetype){
			hostManager.getHostListsByUsetype(usetype,function(result){
				var hostLists = result;
				var timeFlags3 = 0;
				angular.forEach(hostLists,function(item,index){
					if(item.cpu.indexOf(".")==0){
						item.cpu= "0"+item.cpu;
					}
					if(item.io.indexOf(".")==0){
						item.io= "0"+item.io;
					}
					if(item.ping.indexOf(".")==0){
						item.ping= "0"+item.ping;
					}
					var flag=getTimeFlag(item.gettime);
					if(flag ==3){
						timeFlags3++;
					}
					item.gettimeflag=flag;
					item.hostMsg =  item.hosturl + ";" + item.usetype;
				});
				$rootScope.$safeApply($scope, function() {
					$scope.hostLists=hostLists;
					$scope.timeFlags3 =timeFlags3;
					});
				window.clearTimeout($scope.allTimeout);
			 $scope.usetypeTimeout = window.setTimeout(function(){
					$scope.getHostsByUsetype(usetype);
				}, 5000);
			});
			$('.host-grid-slider').perfectScrollbar();
		};
		
		$scope.chartRate = function(){
			var type = $scope.chartType;
			if(type == "CPU"){
				$scope.chartCPURate($scope.hostmsg);
			} else if (type == "内存") {
				$scope.chartMemeryRate($scope.hostmsg);
			} else if (type == "端口") {
				$scope.chartPortRate($scope.hostmsg);
			} else if (type == "网络延迟") {
				$scope.chartPingRate($scope.hostmsg);
			} else if (type == "IO") {
				$scope.chartIORate($scope.hostmsg);
			}
		};
		//绘制cpu图表
		$scope.chartCPURate=function(hostmsg){
			$scope.hostmsg = hostmsg;
			$scope.chartType = "CPU";
			var  userdata = [], sysdata = [], iodata = [], totaldata = [], labels = [];
			$scope.$bssPost({
				type:"post",
				url:"/host/getCPUDetail.do",
				data:{ip:hostmsg.split(";")[0], nums:$scope.chartTime},
				success:function(result){
					angular.forEach(result, function(e,i){
						labels.push(formatTime(e.gettime));
						userdata.push(parseFloat(e.cpuuserage));
						sysdata.push(parseFloat(e.cpusysusage));
						iodata.push(parseFloat(e.cpuiousage));
						totaldata.push(Math.round((100 - parseFloat(e.cpufreerate))*100)/100);
					});
					utilManager.drawchart({
						hostmsg: hostmsg,
						labels:	labels,
						ytitle: "CPU占用率",
						ymax: 100,
						f: {a:"%", b:"time:", c:"used:"},
						series: [{stitle:"用户使用率", sdata:userdata}, {stitle:"系统使用率", sdata:sysdata}, {stitle:"IO使用率", sdata:iodata}, {stitle:"总使用率", sdata:totaldata}]
					});
				}
				});	
		};
		//绘制内存图表
		$scope.chartMemeryRate = function(hostmsg) {
			$scope.hostmsg = hostmsg;
			$scope.chartType = "内存";
			var  sdata = [], labels = [];
			$scope.$bssPost({
				type:"post",
				url:"/host/getMemeryDetail.do",
				data: {ip : hostmsg.split(";")[0],nums : $scope.chartTime},
				success:function(result){
					angular.forEach(result,function(item,index){
						labels.push(formatTime(item.gettime));
						sdata.push(parseFloat(item.memusedrate));
					});
					utilManager.drawchart({
						hostmsg: hostmsg,
						labels:	labels,
						ytitle: "内存占用率",
						ymax: 100,
						f: {a:"%", b:"time:", c:"used:"},
						series: [{stitle:"内存占用率", sdata:sdata}]
					});
				}
			});
		};

		//绘制端口图表
		$scope.chartPortRate = function(hostmsg) {
			$scope.hostmsg = hostmsg;
			$scope.chartType = "端口";
			var  j=0, labels = [], serval = [];
			$scope.$bssPost({
				type:"post",
				url:"/host/getPortDetail.do",
				data: {ip : hostmsg.split(";")[0],nums : $scope.chartTime},
				success:function(result){
					angular.forEach(result,function(item,index){
						var tmp = [];
						angular.forEach(result[index],function(e,i){
							labels.push(formatTime(e.gettime));
							tmp.push(parseFloat(e.val));
						});
						serval[j]={stitle : index, sdata : tmp};
						j++;
					});
					utilManager.drawchart({
						hostmsg: hostmsg,
						labels:	labels,
						ytitle: "端口连接数",
						f: {a:"", b:"time:", c:"linked:"},
						series: serval
					});
				}
			});
		};

		//绘制网络延迟图表
		$scope.chartPingRate = function(hostmsg) {
			$scope.hostmsg = hostmsg;
			$scope.chartType = "网络延迟";
			var  datamax = [], datamin = [], dataavg = [], labels = [];
			$scope.$bssPost({
				type:"post",
				url:"/host/getPingDetail.do",
				data: {ip : hostmsg.split(";")[0],nums : $scope.chartTime},
				success:function(result){
					angular.forEach(result,function(item,index){
						labels.push(formatTime(item.gettime));
						datamax.push(parseFloat(item.maxwait));
						datamin.push(parseFloat(item.minwait));
						dataavg.push(parseFloat(item.avgwait));
					});
					utilManager.drawchart({
						hostmsg: hostmsg,
						labels:	labels,
						ytitle: "网络延迟",
						f: {a:"ms", b:"time:", c:"delay:"},
						series: [{stitle:"最高延迟", sdata:datamax}, {stitle:"最低延迟", sdata:datamin}, {stitle:"平均延迟", sdata:dataavg}]
					});
				}
			});
		};

		//绘制IO图表
		$scope.chartIORate = function(hostmsg) {
			$scope.hostmsg = hostmsg;
			$scope.chartType = "IO";
			var sdata = [], labels = [];
			$scope.$bssPost({
				type:"post",
				url:"/host/getIODetail.do",
				data: {ip : hostmsg.split(";")[0],nums : $scope.chartTime},
				success:function(result){
					angular.forEach(result,function(item,index){
						labels.push(formatTime(item.gettime));
						sdata.push(parseFloat(item.waitio));
					});
					utilManager.drawchart({
						hostmsg: hostmsg,
						labels:	labels,
						ytitle: "CPU等待IO使用率",
						ymax: 100,
						f: {a:"%", b:"time:", c:"used:"},
						series: [{stitle:"IO延迟", sdata:sdata}]
					});
				}
			});
		};
		$(".win-close").bind("click",function(){
			$("#chartdetail").empty();
			$(".chart-win").css("display","none");
			$(".masklayer").remove();
			$scope.chartTime = 144;
		});
		//格式化采集时间，并判断是否超时
		getTimeFlag = function(time){
			var gettime = new Date(time.substr(0, 4)+"/"+time.substr(4, 2)+"/"+time.substr(6, 2)+time.substr(8, 10));
			var nowtime = new Date();
			var times = nowtime - gettime;
			if (times > 10 * 60 * 1000 && times <= 30 * 60 * 1000) {
				return 2;
			} else if (times > 30 * 60 * 1000) {
				return 3;
			}else{
				return 1;
			}
		};
		formatTime = function(time){
			var d = time.substr(0, 8);
			var h = time.substr(8, 2);
			var m = time.substr(10, 2);
			var s = time.substr(12, 2);
			return d+" "+h+":"+m+":"+s;
		};
	};
});
