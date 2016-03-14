define(
		[ 'app', 'cookie', 'htmlFilter', 'bootstrap' ,'jquery-datetime', 'scrollbar', 'mousewheel'],
		function() {
			angular.module("bss").controller("warningCheckCtrl",
					warningCheckCtrl);
			function warningCheckCtrl($scope, $rootScope) {
				$scope.warningCheck = {
					sql : "",
					msg : ""
				};
				$scope.checkApp={grpId:''};
				$scope.initWarningCheckList = function() {
					$scope.$bssPost({
								url : "/warningCheck/getCheckList.do",
								data : {},
								success : function(result) {
									$rootScope.$safeApply($scope, function() {
										$scope.warningChecks = result;
									});
									$scope.initWarningCheckApp($scope.warningChecks[0].checkId);
									$scope.currentCheckId = $scope.warningChecks[0].checkId;
								}
							});
					$('.table-check-slider').perfectScrollbar();
				};
				$scope.initWarningCheckApp = function(id) {
					$scope.currentCheckId = id;
					$scope.$bssPost({
						url : "/warningCheck/getCheckAppList.do",
						cover:false,
						data : {
							checkId : id
						},
						success : function(result) {
							$rootScope.$safeApply($scope, function() {
								$scope.warningCheckApps = result;
							});
						}
					});
					$('.table-checkApp-slider').perfectScrollbar();
				};
				$scope.beforeAddWarningCheck = function() {
					$scope.warningCheck = null;
					$scope.warningCheckOperation = "add";
				};
				$scope.addWarningCheck = function() {
					var checkSql = $scope.warningCheck.sql;
					var checkMsg = $scope.warningCheck.msg;
					$scope.$bssPost({
						url : "/warningCheck/addWarningCheck.do",
						data : {
							checkSql : checkSql,
							checkMsg : checkMsg
						},
						success : function(result) {
							$scope.initWarningCheckList();
						}
					});
				};
				$scope.beforeModifyWarningCheck = function(checkId,item, event) {
					$(".warningcheck-modify").trigger("click");
					$scope.warningCheckOperation = "modify";
					$scope.checkModifyItem = item;
					var e = event ? event : window.event;
					var target = e.srcElement || e.target;
					$scope.warningCheck[item] = target.textContent;
					$scope.checkId = checkId;
					 e.stopPropagation();
					 e.preventDefault();
				};
				$scope.modifyWarningCheck = function() {
					var checkId = $scope.checkId;
					var checkSql = $scope.warningCheck.sql;
					var checkMsg = $scope.warningCheck.msg;
					$scope.$bssPost({
						url : "/warningCheck/updateWarningCheck.do",
						data : {
							checkId : checkId,
							checkSql : checkSql,
							checkMsg : checkMsg
						},
						success : function(result) {
							$scope.initWarningCheckList();
						}
					});
				};
				$scope.modifyWarningCheckState = function(checkId,checkState) {
					if(confirm("确定切换？")){
						$scope.$bssPost({
							url : "/warningCheck/updateWarningCheck.do",
							data : {
								checkId : checkId,
								checkState : checkState,
							},
							success : function(result) {
								$scope.initWarningCheckList();
							}
						});
					}
				};
				$('#checkApp-beginDt,#checkApp-endDt').datetimepicker({
					lang:'ch',
					timepicker:true,
					format:'H:i',
					todayButton:true,
				});
				$scope.beforeAddWarningCheckApp =function(){
					$scope.checkAppOperation ='add';
					$scope.checkApp=null;
					$scope.initDataBases();
					$scope.initMembers();
				};
				$scope.selectGroups = function(){
					var grp = "";
					$(".td-group-first input[type='checkbox']").each(function(){
						  if($(this).is(':checked')){
					        	grp += $(this).val() + ",";  
					        }
					});
					 grp=grp.substring(0, grp.length-1);
					$scope.checkApp.grpId = grp;
				};
				$scope.initDataBases=function(){
					$scope.$bssPost({
						url:"/warningCheck/queryDataBases.do",
						cover:false,
						success:function(result){
							$rootScope.$safeApply($scope,function(){
								$scope.dataBases = result;
							});
						}
					});
				};
				$scope.initMembers= function(){
					var members = null;
					$scope.$bssPost({
						url:"/warningCheck/queryMembers.do",
						cover:false,
						success:function(result){
							$rootScope.$safeApply($scope,function(){
								$scope.members = result;
								members =result;
							});
						}
					});
					return members;
				};
				$scope.initGroups = function(){
					$scope.$bssPost({
						url:"/warningCheck/queryGroups.do",
						cover:false,
						success:function(result){
							$rootScope.$safeApply($scope,function(){
								$scope.groups = result;
							});
						}
					});
					$('.checkApp-grp-slider').perfectScrollbar();
				};
				
				$scope.addWarningCheckApp=function(){
					var checkId = $scope.currentCheckId;
					var checkDs =$scope.checkApp.checkDs;
					var beginDt=$("#checkApp-beginDt").val();
					var endDt = $("#checkApp-endDt").val();
					var freq= $scope.checkApp.freq;
					var rule= $scope.checkApp.rule;
					var grp = $scope.checkApp.grpId;
					var arole="";
					if($("#checkApp-arole").is(':checked'))
					{
						arole=$scope.checkApp.arole;
					}
					var brole= "";
					if($("#checkApp-brole").is(':checked'))
					{
						brole=$scope.checkApp.brole;
					}
					$scope.$bssPost({
						url:"/warningCheck/addWarningCheckApp.do",
						data:
						{
							checkId:checkId,
							checkDs:checkDs,
							beginDt:beginDt,
							endDt:endDt,
							freq:freq,
							rule:rule,
							grpId:grp,
							arole:arole,
							brole:brole
						},
						success:function(result){
							$scope.initWarningCheckApp(checkId);
						}
					});
				};
				$scope.beforeModifyWarningCheckApp =function(item,event,checkAppId){
					$(".checkApp-modify").trigger("click");
					$scope.checkAppOperation = "modify";
					$scope.checkAppModifyItem = item;
					var e = event ? event : window.event;
					var target = e.srcElement || e.target;
					if(item=='checkDt'){
						var checkDt = target.textContent;
						$scope.checkApp.beginDt = checkDt.split("-")[0];
						$scope.checkApp.endDt = checkDt.split("-")[1];
						$('#checkApp-beginDt').datetimepicker({
							value:$scope.checkApp.beginDt
						});
						$('#checkApp-endDt').datetimepicker({
							value:$scope.checkApp.endDt
						});
					}else if(item=='duty'){
						var members = $scope.initMembers();
						var checkDt = target.textContent;
						$scope.checkApp.arole = checkDt.split("B")[0].split(":")[1];
						$scope.checkApp.brole = checkDt.split("B")[1].split(":")[1];
						angular.forEach(members,function(item,index){
							if($scope.checkApp.arole==item.username){
								item.selected = true;
							}
						});
					}else{
						$scope.checkApp[item] = target.textContent;
					}
					$scope.checkAppId = checkAppId;
				};
				$scope.modifyWarningCheckApp=function(){
					var appId = $scope.checkAppId;
					var checkDs =$scope.checkApp.checkDs;
					var beginDt=$("#checkApp-beginDt").val();
					var endDt = $("#checkApp-endDt").val();
					var freq= $scope.checkApp.freq;
					var rule= $scope.checkApp.rule;
					var grp = $scope.checkApp.grpId;
					var arole="";
					if($("#checkApp-arole").is(':checked'))
					{
						arole=$scope.checkApp.arole;
					}
					var brole= "";
					if($("#checkApp-brole").is(':checked'))
					{
						brole=$scope.checkApp.brole;
					}
					$scope.$bssPost({
						url:"/warningCheck/updateWarningCheckApp.do",
						data:
						{
							appId:appId,
							checkDs:checkDs,
							beginDt:beginDt,
							endDt:endDt,
							freq:freq,
							rule:rule,
							grpId:grp,
							arole:arole,
							brole:brole
						},
						success:function(rst){
							$scope.initWarningCheckApp($scope.currentCheckId);
						}
					});
				};
				$scope.modifyWarningCheckAppState =function(checkAppId,state){
					if(confirm("确定切换？")){
					$scope.$bssPost({
						url:"/warningCheck/updateWarningCheckApp.do",
						data:{
							appId:checkAppId,
							state :state
							},
						success:function(result){
							$scope.initWarningCheckApp($scope.currentCheckId);
						}
					});
				}
				};
			};
		});
