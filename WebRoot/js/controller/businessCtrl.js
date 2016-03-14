define(['app','cookie','businessService','utilService','wdatePicker','animate' ], function()
{
	angular.module("bss").controller("businessCtrl", businessCtrl);
	function businessCtrl($scope, $rootScope,businessManager,utilManager)
	{
		var stime = new Date();
		stime.setHours(0,0,0,0);
		$scope.stime=utilManager.formatDate(stime);
		var etime = new Date();
		etime.setHours(23,59,59,999);
		$scope.etime=utilManager.formatDate(etime);
		var businessType =  utilManager.getQueryString("businessType");
		if(businessType==null || businessType==''){
			$scope.businessType = "4g";
		}else if(businessType=='3g'){
			$rootScope.$safeApply($scope,function(){
				$scope.businessType="local";
			});
		}else
			{
			$rootScope.$safeApply($scope,function(){
				$scope.businessType="4g";
			});
			}
		$scope.initBusiness=function()
		{
			$scope.areas= utilManager.getLocalAreas();
			$scope.menuSign="analysis";
			$scope.initHistoryOrder();
		};
		$scope.initHistoryOrder=function(areaCode){
			var area = typeof areaCode=="undefined"?"000":areaCode;
			$scope.$bssPost({
				url : "/business/monitorResult.do",
				cover : false,
				data : {type:1, area:area},
				success : function(result) {
					$rootScope.$safeApply($scope,function(){
						$scope.historyOrder = result;
					});
					utilManager.animateFont($(".order-table .order-tr"),12,16);
					window.setTimeout(function(){
						$scope.initHistoryOrder($scope.local_area);
					}, 5000);
				}
			});
		};
		$scope.queryOrdersByDate=function(){
			var start_time = $(".start-time").val();
			var end_time = $(".etart-time").val();
			var area = $(".local-area").val();
			$scope.local_area = area;
			$scope.initHistoryOrder(area);
			$scope.initSamedayOrder(area,start_time,end_time);
			$scope.initTaketimeOrder(area,start_time,end_time);
			$scope.initVerificationOrder(start_time,end_time);
		};
		
		$scope.initSamedayOrder=function(area,start_time,end_time){
			businessManager.getMonitorResult(2,function(result){
				$rootScope.$safeApply($scope,function(){
					$scope.samedayOrder = result;
				 $scope.samedayPercent=new Number(((result.CNT1-result.CNT9)/result.CNT1*100).toFixed(2));
				});
				window.setTimeout(function(){
					$scope.initSamedayOrder($scope.local_area,start_time,end_time);
				}, 5000);
			},area,start_time,end_time);
		};
		$scope.initTaketimeOrder=function(area,start_time,end_time){
			businessManager.getMonitorResult(3,function(result){
				var taketimeOrders=[];
				var data1={CNT0:"省内生单",CNTALL:0};
				var data2={CNT0:"送OSS",CNTALL:0};
				var data3={CNT0:"OSS报骏",CNTALL:0};
				var data4={CNT0:"省内归档",CNTALL:0};
				var data5={CNT0:"SAOP报骏",CNTALL:0};
				angular.forEach(result,function(item,index){
					index = index.substring(3);
					idx = Math.floor(index/10);
					key = index%10;
					switch (key) {
					case 1:data1["CNT"+idx]=parseInt(item);
						break;
					case 2:data2["CNT"+idx]=parseInt(item);
						break;
					case 3:data3["CNT"+idx]=parseInt(item);
						break;
					case 4:data4["CNT"+idx]=parseInt(item);
						break;
					case 5:data5["CNT"+idx]=parseInt(item);
						break;
					default:
						break;
					}
				});
				for(var i = 1;i<7;i++){
					data1.CNTALL+=data1["CNT"+i];
					data2.CNTALL+=data2["CNT"+i];
					data3.CNTALL+=data3["CNT"+i];
					data4.CNTALL+=data4["CNT"+i];
					data5.CNTALL+=data5["CNT"+i];
				}
				taketimeOrders.push(data1);
				taketimeOrders.push(data2);
				taketimeOrders.push(data3);
				taketimeOrders.push(data4);
				taketimeOrders.push(data5);
				$rootScope.$safeApply($scope,function(){
					$scope.taketimeOrders = taketimeOrders;
				});
				window.setTimeout(function(){
					$scope.initTaketimeOrder($scope.local_area,start_time,end_time);	
				},5000);
			},area,start_time,end_time);
		};
		$scope.initVerificationOrder=function(start_time,end_time){
			try {
				var verificationOrders=[];
				var data1 = {type:"校验单"};
				var data2 = {type:"预校验单"};
				var data3 = {type:"查询单"};
				//校验单
				businessManager.getMonitorResult(4,function(result){
					var tempAll = result.CNT1;
					angular.forEach(result,function(item,index){
						data1[index]=item;
						data1["P"+index]=new Number((item/tempAll*100).toFixed(2));
					});
					verificationOrders.push(data1);
				},'000',start_time,end_time);
				//预校验单
				businessManager.getMonitorResult(6,function(result){
					var tempAll = result.CNT1;
					angular.forEach(result,function(item,index){
						data2[index]=item;
						data2["P"+index]=new Number((item/tempAll*100).toFixed(2));
					});
					verificationOrders.push(data2);
				},'000',start_time,end_time);
				//查询单
				businessManager.getMonitorResult(7,function(result){
					var tempAll = result.CNT1;
					angular.forEach(result,function(item,index){
						data3[index]=item;
						data3["P"+index]=new Number((item/tempAll*100).toFixed(2));
					});
					verificationOrders.push(data3);
				},'000',start_time,end_time);
				$rootScope.$safeApply($scope,function(){
					$scope.verificationOrders = verificationOrders;
				});
			} catch (e) {
				
			}
		};
		$scope.showOrderMenu=function(event)
		{
			$(".order-analysis li").removeClass("current");
			var e = event ? event : window.event;
			var target = e.srcElement || e.target;
			$(target).addClass("current");
			$scope.menuSign = $(target).attr("otype");	
		};
		$scope.initLocals=function()
		{
			$scope.businessType='local';
			var localRecords=[];
				$rootScope.$bssPost({
					url : "/business/monitor3GDetail.do",
					cover:true,
					success : function(result) {
						angular.forEach(result,function(item,index){
							var record={content:item};
							key = index;
							switch (key) {
							case "nj":record.area="南京";
								break;
							case "wx":record.area="无锡";
								break;
							case "sz":record.area="苏州";
								break;
							case "nt":record.area="南通";
								break;
							case "yz":record.area="扬州";
								break;
							case "xz":record.area="徐州";
								break;
							case "cz":record.area="常州";
								break;
							case "tz":record.area="泰州";
								break;
							case "yc":record.area="盐城";
								break;
							case "zj":record.area="镇江";
								break;
							case "ha":record.area="淮安";
								break;
							case "lyg":record.area="连云港";
								break;
							case "sq":record.area="宿迁";
								break;
							default:
								break;
							}
							localRecords.push(record);
						});
						$rootScope.$safeApply($scope,function(){
							$scope.localRecords = localRecords;
						});
					}
				});
		};
	};
});
