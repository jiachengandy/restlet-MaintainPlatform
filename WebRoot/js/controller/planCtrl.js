define(
		[ 'app', 'cookie' ,'wdatePicker','utilService','bootstrap-datetime-zh'],
		function() {
			angular.module("bss").controller("planCtrl", planCtrl);
			function planCtrl($scope, $rootScope,utilManager) {
				$scope.initPlaninfo = function(){
					$scope.maintainType = 'record';
					$scope.queryDutyRecordsByPage();
					$scope.getEventTypes();
				};
				$scope.initDutyRecord = function(event) {
					var e = event ? event : window.event;
					var cntr = e.srcElement || e.target;
					$(".option-item").removeClass("current");
					$(cntr).parent().addClass("current");
					$scope.maintainType="record";
					$scope.queryDutyRecordsByPage();
				
				};
				$scope.queryDutyRecordsByPage = function(cpage){
					$scope.dutyState = "view";	
					cpage = utilManager.calculatePage(cpage);
					var dutyDate="";
					$scope.$bssPost({
						url : "/maintain/queryDutyRecords.do",
						cover : false,
						data:{cpage:cpage,dutyDate:dutyDate},
						success : function(result) {
							$rootScope.$safeApply($scope, function() {
								$scope.records = result.object;
								$scope.pages = utilManager
										.showPage(result.page.totalPage);
								$scope.page = result.page;
							});
						}
					});
				};
				$scope.queryDutyRecords=function(){
					$scope.dutyState = "view";	
					$scope.$bssPost({
						url:"/maintain/queryDutyRecords.do",
						success:function(result){
							$rootScope.$safeApply($scope,function(){
								$scope.records = result;
							});
						}
					});
				};
				$scope.initMemberInfo=function(){
					$scope.dutyState = "add";
				};
				$scope.addDutyRecord=function(){
					var dutyDate = $(".duty-date").val();
					$scope.$bssPost({
						url:"/maintain/addDutyRecord.do",
						data:{dutyPerson:$scope.dutyPerson,dutyPhone:$scope.dutyPhone,dutyDate:dutyDate,dutyContent:$scope.dutyContent},
						success:function(result){
							$scope.queryDutyRecords();
						}
					});
				};
				$scope.currentDate = null;
				$scope.initEventInfo=function(type,event){
					$scope.showstyle = "list";
					var now = new Date();
					var yy = now.getFullYear(); 
					var mm = now.getMonth()+1;
					mm = mm<10?("0"+mm):mm;
					var cdate = yy + "-"+mm;
					$scope.currentDate=cdate;
					$(".maintain-date").val(cdate);
					$(".maintain-date").blur();
					$scope.dateMonth = cdate;
					//$scope.getEvents();
					$scope.queryEventsByType(type,event);
					//$scope.getEventTypes();
					$(".ul-item").find("li").removeClass("current");
					$scope.eventType=type;
					$('.form_date').datetimepicker({
						format: 'yyyy-mm',
						language:  'zh-CN',
						autoclose: true,
						startView:3,
						minView:3,
						todayHighlight:true
				    });
				};
			
				$scope.getEvents = function(date,type){
					$scope.showstyle = "list";
					$scope.popState="no";
					$scope.$bssPost({
						url:"/maintain/getEvents.do",
						data:{date:date,type:type},
						cover:false,
						success:function(rst){
							var records = [];
							for ( var i = 1; i <= rst.days; i++) {
								var record = {
									day : i,
									record : null,
									items:[],
									startTime:""
								};
								for ( var j = 0; j < rst.events.length; j++) {
									var item = rst.events[j];
									if (typeof item.day != 'undefined'
											&& i == item.day) {
										//record.item = rst.events[j];
										record.items.push(rst.events[j]);
										record.startTime = rst.events[j].start_time;
									}
								}
								records.push(record);
							}
							$rootScope.$safeApply($scope,function(){
								$scope.records = records;
							});
						}
					});
				};
				$scope.queryEventsByType=function(type,event){
					$scope.maintainType="event";
					var e = event ? event : window.event;
					var cntr = e.srcElement || e.target;
					var eventType = null;
					var date = $(".maintain-date").val();
					if(typeof type =='undefined'){
						eventType = $scope.eventType;
					}else{
						eventType = type;
						$(".option-item").removeClass("current");
						$(cntr).parent().addClass("current");
					}
					$scope.getEvents(date,eventType);
				};
				/*$("#maintain-date").bind("change", function() {
					
				});*/
	            $('.maintain-date').on('hide', function(ev){
	            	var date = $(".maintain-date").val();
					var eventType = $scope.eventType;
					$scope.getEvents(date,eventType);
				});
				$scope.getEventTypes=function(){
					$scope.$bssPost({
						url:"/maintain/queryEventTypes.do",
						cover:false,
						success:function(result){
							$rootScope.$safeApply($scope,function(){
								$scope.eventTypes = result;
							});
						}
					});
				};
				$scope.queryEventsByDay=function(day){
					$scope.currentDay = day;
					var eventType = $scope.eventType;
					if (typeof day == 'undefined') {
						return;
					}
					$scope.$bssPost({
						url:"/maintain/queryEventsByDay.do",
						cover:false,
						data:{day:day,eventType:eventType},
						success:function(result){
							$rootScope.$safeApply($scope,function(){
								$scope.dayRecords = result;
								$scope.popState="yes";
								$scope.operationstyle = "dateAll";
							});
						}
					});
				};
				$scope.queryEventById = function(id, type) {
					$scope.$bssPost({
						url : "/maintain/queryEventById.do",
						data : {
							id : id
						},
						success : function(rst) {
							if (type == 'view') {
								$scope.operationstyle = 'view';
							} else {
								$scope.operationstyle = 'modify';
								$scope.getEventTypes();
							}

							angular.forEach(rst, function(item, index) {
								rst.flag = rst.bss_prolem == '1' ? '是' : '否';
							});
							$rootScope.$safeApply($scope,function(){
								$scope.record = rst;
							});
						}
					});
				};
				$scope.updateEvent =function(id){
					var username = $.cookie("username");
					var name = $("#maintain-name").val();
					if (name.trim() == '') {
						alert("标题不可以为空！");
					}
					var wperson = $(".warning-person").val();
					if (wperson.trim() == '') {
						alert("地区不可以为空！");
					}
					var bpromlem = $("input[type='radio']:checked").val();
					var scope = $(".influence-scope").val();
					if (scope.trim() == '') {
						alert("影响范围不可以为空！");
					}
					var detail = $(".maintain-detail").val();
					if (detail.trim() == '') {
						alert("备注不可以为空！");
					}
					var stime = $(".maintain-stime").val();
					if (stime.trim() == '') {
						alert("起始时间不可以为空");
					}
					var etime = $(".maintain-etime").val();
					if (etime.trim() == '') {
						alert("截止时间不可以为空");
					}
					var exts = {
						keys : [],
						values : []
					};
					var ekeys = [];
					var evalues = [];
					$(".form-event-update .extend-key").each(function() {
						ekeys.push($(this).val());
					});
					$(".form-event-update .extend-value").each(function() {
						evalues.push($(this).val());
					});
					var datas = {
						id : id,
						username : username,
						name : name,
						type : type,
						wperson : wperson,
						bpromlem : bpromlem,
						scope : scope,
						detail : detail,
						stime : stime,
						etime : etime,
						"ekeys" : ekeys.join("@"),
						"evalues" : evalues.join("@"),
					};
					$scope.$bssPost({
						url : "/maintain/updateEvent.do",
						data : datas,
						success : function(rst) {
							alert("修改成功！");
							//window.location.reload();
							//$scope.queryEventsByDay($scope.currentDay);
							$scope.getEvents($scope.currentDate,$scope.eventType);
						}	
					});
				};
				$scope.deleteEventById =function(id){
					if (!confirm("确认要删除？")) {
						return;
					}
					$scope.$bssPost({
						url : "/maintain/deleteEventById.do",
						data : {
							id : id
						},
						success : function(rst) {
							alert("删除成功！");
							//$scope.queryEventsByDay($scope.currentDay);
							$scope.getEvents($scope.currentDate,$scope.eventType);
						}
					});
				};
				$scope.beforeAddEvent= function(){
					$scope.showstyle = "add";
					$scope.record = null;
					$scope.bss_prolem=0;
					$scope.extendFlags=0;
					//$scope.popState="yes";
				};
				$scope.addEvent=function(){
					var username = $.cookie("username");
					var name = $("#maintain-name").val();
					if (name.trim() == '') {
						alert("标题不可以为空！");
						return;
					}
					var type = $scope.eventType;
					/*if (type.trim() == '') {
						alert("类型不可以为空！");
						return;
					}*/
					var wperson = $(".warning-person").val();
					if (wperson.trim() == '') {
						alert("地区不可以为空！");
						return;
					}
					var bpromlem = $("input[type='radio']:checked").val();
					var scope = $(".influence-scope").val();
					if (scope.trim() == '') {
						alert("影响范围不可以为空！");
						return;
					}
					var detail = $(".maintain-detail").val();
					if (detail.trim() == '') {
						alert("备注不可以为空！");
						return;
					}
					var stime = $(".maintain-stime").val();
					if (stime.trim() == '') {
						alert("起始时间不可以为空");
						return;
					}
					var etime = $(".maintain-etime").val();
					if (etime.trim() == '') {
						alert("截止时间不可以为空");
						return;
					}
					var packInfo = $scope.packInfo;
					var exts = {
						keys : [],
						values : []
					};
					var ekeys = [];
					var evalues = [];
					$(".form-event-add .extend-key").each(function() {
						ekeys.push($(this).val());
					});
					$(".form-event-add .extend-value").each(function() {
						evalues.push($(this).val());
					});
					var datas = {
						username : username,
						name : name,
						type : type,
						wperson : wperson,
						bpromlem : bpromlem,
						scope : scope,
						detail : detail,
						stime : stime,
						etime : etime,
						packInfo:packInfo,
						"ekeys" : ekeys.join("@"),
						"evalues" : evalues.join("@"),
					};
					$scope.$bssPost({
						url : "/maintain/addEvent.do",
						data : datas,
						dataType : 'json',
						traditional : true,
						success : function(rst) {
							$scope.getEvents($scope.currentDate,$scope.eventType);
						}
					});
				};
				$scope.extendFlags=0;
				$scope.addOption=function(){
					$scope.extendFlags+=1;
				};
				$scope.reduceOption=function(){
					if($scope.extendFlags>0){
						$scope.extendFlags-=1;
					}
				};
				$scope.$watch("extendFlags",function(newv){
					var extendOptions = [];
					for(var i=0;i<newv;i++){
						extendOptions.push("");
					}
					$rootScope.$safeApply($scope,function(){
						$scope.extendOptions = extendOptions;
					});
				});
			};
		});
