define(
		[ 'app', 'cookie', 'utilService',
				'bootstrap', 'businessService', 'animate','wdatePicker','jquery-datetime','scrollbar','mousewheel'],
		function() {
			angular.module("bss").controller("fourGCtrl", fourGCtrl);
			function fourGCtrl($scope, $rootScope, utilManager, businessManager,$timeout) {
				
				var localDate = utilManager.getLocalDate();
				$scope.startTime = localDate+" 00:00";
				$scope.endTime = localDate+" 23:59";
				$(".order-startTime").val($scope.startTime);
				$(".order-endTime").val($scope.endTime);
				$('.order-startTime').datetimepicker({
					lang:'ch',
					timepicker:true,
					format:'Y-m-d H:i',
					//maxDate:new Date(),
					value:$scope.startTime,
					todayButton:true,
					onSelectTime:function(dateText, inst){
						var startTime = $(inst).val();
						var endTime = $('.order-endTime').val();
						$scope.initAllOrderInfo(startTime,endTime);
					},
					onSelectDate:function(dateText, inst){
						var startTime = $(inst).val();
						var endTime = $('.order-endTime').val();
						$scope.initAllOrderInfo(startTime,endTime);	
					}
				});
			
				$('.order-endTime').datetimepicker({
					lang:'ch',
					timepicker:true,
					format:'Y-m-d H:i',
					value:$scope.endTime,
					onSelectTime:function(dateText, inst){
						var startTime = $(inst).val();
						var endTime = $('.order-endTime').val();
						$scope.initAllOrderInfo(startTime,endTime);
					},
					onSelectDate:function(dateText, inst){
						var startTime = $(inst).val();
						var endTime = $('.order-endTime').val();
						$scope.initAllOrderInfo(startTime,endTime);	
					},
					/*onChangeDateTime:function(dateText, inst){
					}*/
				});
				$scope.initAllOrderInfo=function(startTime,endTime){
					$scope.startTime = startTime;
					$scope.endTime = endTime;
					$scope.initSamedayOrder($scope.currentOrderAreaCode,startTime,endTime);
					$scope.initTaketimeOrder($scope.currentOrderAreaCode,startTime,endTime);
					$scope.initVerificationOrder(startTime,endTime);
				};
				$scope.initOrderArea = function() {
					$scope.orderAreas = utilManager.getLocalAreas();
					$scope.currentOrderArea = "all";
					$scope.currentOrderAreaCode = "000";
					$scope.initLocalAreaOrder($scope.currentOrderAreaCode,$scope.startTime,$scope.endTime );
				};
				$scope.selectOrderArea = function(area, code) {
					$scope.currentOrderArea = area;
					$scope.currentOrderAreaCode = code;
					var start_time = $(".order-startTime").val();
					var end_time = $(".order-endTime").val();
					$scope.startTime = start_time;
					$scope.endTime = end_time;
					var area = $scope.currentOrderAreaCode;
					$scope.initHistoryOrder(area);
					$scope.initSamedayOrder(area,start_time,end_time);
					$scope.initTaketimeOrder(area,start_time,end_time);
					$scope.initVerificationOrder(start_time,end_time);
				};
				$scope.initAllOrder =function(){
					$scope.$bssPost({
						url : "/business/monitorResult.do",
						cover : false,
						data : {
							type : "allOrder",
							time : businessManager.getFormatDate(new Date(),-1) +","+businessManager.getFormatDate(new Date(),-2)
						},
						success:function(result){
							$rootScope.$safeApply($scope, function() {
								$scope.allOrder = result["CNT"];
							});
						}
					});
				};
				//本地网数据统计
				$scope.initLocalAreaOrder=function(areaCode,start_time,end_time){
					businessManager.getMonitorResult("5", function(result) {
						$rootScope.$safeApply($scope, function() {
							$scope.localAreaOrder = result;
						});
						$timeout(function(){
							$scope.initLocalAreaOrder($scope.currentOrderAreaCode,$scope.startTime,$scope.endTime);	
						},5000);
					}, areaCode,start_time,end_time);
				};
				// 历史未报竣工单分析
				$scope.initHistoryOrder = function(areaCode) {
					var area = typeof areaCode == "undefined" ? "000"
							: areaCode;
					$scope.$bssPost({
						url : "/business/monitorResult.do",
						cover : false,
						data : {
							type : 1,
							area : area
						},
						success : function(result) {
							var tempvar = result;
							$rootScope.$safeApply($scope, function() {
								$scope.historyOrder = result;
							});
							utilManager.animateFont(
									$(".order-table .order-tr"), 12, 16);
							window.setTimeout(function() {
								$scope.initHistoryOrder($scope.currentOrderAreaCode);
							}, 5000);
							var datas = [];
							angular.forEach(tempvar, function(item, index) {
								var idx = item.indexOf("(");
								if (idx > 0) {
									item = item.substring(0, idx);
								}
								var key = index;
								var firstvalue = "";
								switch (key) {
								case "CNT1":
									firstvalue = '未报竣数量：' + item;
									break;
								case "CNT2":
									firstvalue = '报文解析中：' + item;
									break;
								case "CNT3":
									firstvalue = '未到SAOP：' + item;
									break;
								case "CNT4":
									firstvalue = 'SAOP处理中：' + item;
									break;
								case "CNT5":
									firstvalue = '未送OSS：' + item;
									break;
								case "CNT6":
									firstvalue = 'OSS处理中：' + item;
									break;
								case "CNT7":
									firstvalue = 'OSS处理中但未竣工：' + item;
									break;
								case "CNT8":
									firstvalue = '未向集团报竣：' + item;
									break;
								default:
									firstvalue = '';
									break;
								}
								var arraItem = [ firstvalue, parseInt(item) ];
								datas.push(arraItem);
							});
							// drawMap("order-history-map",datas);
						}
					});
				};

				// 当天报竣工单分析
				$scope.initSamedayOrder = function(area, start_time, end_time) {
					businessManager.getMonitorResult(2, function(result) {
						$rootScope.$safeApply($scope,
								function() {
									$scope.samedayOrder = result;
									$scope.samedayPercent = new Number(
											((result.CNT1 - result.CNT9)
													/ result.CNT1 * 100)
													.toFixed(2));
								});
						var datas = [];
						angular.forEach(result, function(item, index) {
							var key = index;
							var firstvalue = "";
							switch (key) {
							case "CNT1":
								firstvalue = '工单总量：' + item;
								break;
							case "CNT2":
								firstvalue = '已报骏总量：' + item;
								break;
							case "CNT3":
								firstvalue = '1分钟以内：' + item, datas.push([
										firstvalue, parseInt(item) ]);
								break;
							case "CNT4":
								firstvalue = '1-2分钟：' + item, datas.push([
										firstvalue, parseInt(item) ]);
								break;
							case "CNT5":
								firstvalue = '2-3分钟：' + item, datas.push([
										firstvalue, parseInt(item) ]);
								break;
							case "CNT6":
								firstvalue = '3-4分钟：' + item, datas.push([
										firstvalue, parseInt(item) ]);
								break;
							case "CNT7":
								firstvalue = '4-5分钟：' + item, datas.push([
										firstvalue, parseInt(item) ]);
								break;
							case "CNT8":
								firstvalue = '5分钟以上：' + item, datas.push([
										firstvalue, parseInt(item) ]);
								break;
							default:
								firstvalue = '工单超5分钟数量：' + item;
								break;
							}
							/*
							 * var arraItem = [firstvalue,parseInt(item)];
							 * datas.push(arraItem);
							 */
						});
						// drawMap('order-done-map',datas);
						window.setTimeout(
								function() {
									$scope.initSamedayOrder($scope.currentOrderAreaCode, $scope.startTime,
											$scope.endTime);
								}, 5000);
					}, area, start_time, end_time);
				};
				// 当天工单耗时分析
				$scope.initTaketimeOrder = function(area, start_time, end_time) {
					businessManager.getMonitorResult(3, function(result) {
						var taketimeOrders = [];
						var data1 = {
							CNT0 : "省内生单",
							CNTALL : 0
						};
						var data2 = {
							CNT0 : "送OSS",
							CNTALL : 0
						};
						var data3 = {
							CNT0 : "OSS报骏",
							CNTALL : 0
						};
						var data4 = {
							CNT0 : "省内归档",
							CNTALL : 0
						};
						var data5 = {
							CNT0 : "SAOP报骏",
							CNTALL : 0
						};
						angular.forEach(result, function(item, index) {
							index = index.substring(3);
							idx = Math.floor(index / 10);
							key = index % 10;
							switch (key) {
							case 1:
								data1["CNT" + idx] = parseInt(item);
								break;
							case 2:
								data2["CNT" + idx] = parseInt(item);
								break;
							case 3:
								data3["CNT" + idx] = parseInt(item);
								break;
							case 4:
								data4["CNT" + idx] = parseInt(item);
								break;
							case 5:
								data5["CNT" + idx] = parseInt(item);
								break;
							default:
								break;
							}
						});
						for (var i = 1; i < 7; i++) {
							data1.CNTALL += data1["CNT" + i];
							data2.CNTALL += data2["CNT" + i];
							data3.CNTALL += data3["CNT" + i];
							data4.CNTALL += data4["CNT" + i];
							data5.CNTALL += data5["CNT" + i];
						}
						taketimeOrders.push(data1);
						taketimeOrders.push(data2);
						taketimeOrders.push(data3);
						taketimeOrders.push(data4);
						taketimeOrders.push(data5);
						$rootScope.$safeApply($scope, function() {
							$scope.taketimeOrders = taketimeOrders;
						});
						window.setTimeout(function() {
							$scope.initTaketimeOrder($scope.currentOrderAreaCode,$scope.startTime,
									$scope.endTime);
						}, 5000);
					}, area, start_time, end_time);
				};
				// 当天校验单耗时分析
				$scope.menuSign = 'verification';
				$scope.initVerificationOrder = function(start_time, end_time) {
					try {
						var verificationOrders = [];
						var data1 = {
							type : "校验单"
						};
						var data2 = {
							type : "预校验单"
						};
						var data3 = {
							type : "查询单"
						};
						// 校验单
						businessManager.getMonitorResult(4, function(result) {
							var tempAll = result.CNT1;
							angular.forEach(result, function(item, index) {
								data1[index] = item;
								data1["P" + index] = new Number(
										(item / tempAll * 100).toFixed(2));
							});
							verificationOrders.push(data1);
							$rootScope.$safeApply($scope, function() {
								$scope.verificationOrders = verificationOrders;
							});
						}, '000', start_time, end_time);
						// 预校验单
						businessManager.getMonitorResult(6, function(result) {
							var tempAll = result.CNT1;
							angular.forEach(result, function(item, index) {
								data2[index] = item;
								data2["P" + index] = new Number(
										(item / tempAll * 100).toFixed(2));
							});
							verificationOrders.push(data2);
							$rootScope.$safeApply($scope, function() {
								$scope.verificationOrders = verificationOrders;
							});
						}, '000', start_time, end_time);
						// 查询单
						businessManager.getMonitorResult(7, function(result) {
							var tempAll = result.CNT1;
							angular.forEach(result, function(item, index) {
								data3[index] = item;
								data3["P" + index] = new Number(
										(item / tempAll * 100).toFixed(2));
							});
							verificationOrders.push(data3);
							$rootScope.$safeApply($scope, function() {
								$scope.verificationOrders = verificationOrders;
							});
						}, '000', start_time, end_time);
					} catch (e) {

					}
				};

				// 查询历史工单详情
				$scope.getHistoryOrderDetail = function(id, type) {
					var time = $(".order-startTime").val() + ","
							+ $(".order-endTime").val();
					var area = $scope.currentOrderAreaCode;
					window.location = "4GDetail.html?type=" + type + "&area="
							+ area + "&time=" + time;
				};
				
				function getProcessName(type){
					var key = type;
					var name = "";
					switch (key) {
					case "data1cnt2": name ="报文解析中" ;
						break;
					case "data1cnt3": name ="报文解析完成未到SAOP" ;
					break;
					case "data1cnt4": name ="SAOP处理中" ;
					break;
					case "data1cnt5": name ="本地购物车生成未送OSS" ;
					break;
					case "data1cnt6": name ="OSS处理中" ;
					break;
					case "data1cnt7": name ="OSS报竣但购物车未竣工" ;
					break;
					case "data1cnt8": name ="购物车竣工未向集团报竣" ;
					break;
					default:
						break;
					}
					return name;
				}
				$scope.initOrderDetail = function() {
					var type = utilManager.getQueryString("type");
					var area = utilManager.getQueryString("area");
					var time = utilManager.getQueryString("time");
					var processName = getProcessName(type);
					$scope.processName = processName;
					$scope.$bssPost({
						url : "/business/getMonitorDetail.do",
						data : {
							type : type,
							area : area,
							time : time
						},
						success : function(result) {
							var dataFlows = [];
							angular.forEach(result, function(item, index) {
								var items = {
									keys : [],
									values : []
								};
								angular.forEach(item, function(value, key) {
									items.keys.push(key);
									items.values.push(value);
									if (0 == index && key == 'TRANSACTION_ID') {
										$scope.loadDataProcess(value);
									}
								});
								dataFlows.push(items);
							});
							$rootScope.$safeApply($scope, function() {
								$scope.dataFlows = dataFlows;
							});
						}
					});
					$('.issued-flow-slider').perfectScrollbar();
				};
				$scope.loadDataProcess = function(id) {
					$scope.transactionId = id;
					$scope.$bssPost({
						url : "/business/searchPrvncProcessInfo1.do",
						data : {
							id : id,
							server : "132.228.236.238"
						},
						success : function(result) {
							if (result == null) {
								return;
							}
							$scope.dataXml = $($.parseXML(result));
							handleXmlData($scope.dataXml);
						}
					});
				};
				
				$scope.queryOrderProcess=function(){
					var id = $scope.transactionId;
					$scope.$bssPost({
						url : "/business/searchPrvncProcessInfo1.do",
						data : {
							id : id,
							server : "132.228.236.238"
						},
						success : function(result) {
							if (result == null) {
								return;
							}
							$scope.dataXml = $($.parseXML(result));
							handleXmlData($scope.dataXml);
						}
					});
				};

				function handleXmlData(domObject) {
					var tables = domObject.find("TABLE");
					var process = {};
					angular.forEach(tables, function(table, idx) {
						var tag = $(table).attr("pkId");
						var sourceFlag = $(table).attr("sourceFlag");
						var rows = $(table).find("ROW");
						var atoms = [];
						angular.forEach(rows,function(row,ridx){
							var tds = $(row).children();
							var atom = {};
							angular.forEach(tds, function(item, index) {
								var key = $(item)[0].tagName;
								atom[key] = $(item).text();
							});
							// atom.rowId = row[0].attr("");
							atom.sourceFlag = sourceFlag;
							atom.rowPKId = $(row).attr("pkId");
							atom.rowFKId = $(row).attr("fkId");
							atoms.push(atom);
						});
						process[tag] = atoms;
					});
					$rootScope.$safeApply($scope, function() {
						$scope.process = process;
					});
				}

				$scope.orderMarkOver = function(tid) {
					$scope.$bssPost({
						url : "/business/markOver.do",
						data : {
							tid : tid
						},
						success : function(result) {
							if (result == "false") {
								alert("还没有向集团报竣的记录，请先报竣。");
							} else {
								$scope.loadDataProcess($scope.transactionId);
							}
						}
					});
				};

				$scope.searchPrvncProcessXmlDetail = function(id, tableFlag) {
					$scope.$bssGet({
						url : "/business/searchPrvncProcessXmlDetail.do",
						data : {
							id : id,
							"tableFlag" : tableFlag,
							dateTime : new Date().getTime(),
							server : "132.228.236.238"
						},
						success : function(result) {
							$rootScope.$safeApply($scope,function(){
								$scope.xmlRequest = result[0];
								$scope.xmlResponse = result[1];
							});
							$('.xml-request-slider').perfectScrollbar();
							//$('.xml-response-slider').perfectScrollbar();
						}
					});
				};

				// 将当前记录状态进行复原操作
				$scope.recoverMyState = function(tableId, rowId, tid) {
					var tableName = getStateNameFromStateObjData(tableId, "",
							g_flowpathSegmentStateObjArray);
					if (!window.confirm("你确定要对“" + tableName + "”中流水为“" + tid
							+ "”的记录重发吗？")) {
						return;
					}
					// 将调度操作结果更新到后台，并返回最终结果
					$scope.$bssPost({
						url : "/business/dispatchUpdateRecordState.do",
						data : {
							id : rowId,
							tid : tid,
							tableFlag : tableId
						},
						success : function(data) {
							processUpdateResult(data, tableId, tableName,
									rowId, null, null, 1, tableId, null);
						}
					});
				};

				// 重新向集团报竣
				$scope.resendToJT = function(tableId, rowId) {
					if (!window.confirm("你确定要对流水“" + rowId + "”重新报竣吗？")) {
						return;
					}
					// 将调度操作结果更新到后台，并返回最终结果
					$scope.$bssPost({
						url : "/business/resendToJT.do",
						data : {
							id : rowId
						},
						success : function(data) {
							processUpdateResult(data, tableId, null, rowId,
									null, null, 0, tableId, null);
						}
					});
				};

				$scope.deleteProcess = function(tableId, rowId) {
					// 将调度操作结果更新到后台，并返回最终结果
					$scope.$bssPost({
								url : "dispatchDeleteRecord.do",
								data : {
									id : rowId,
									tableFlag : tableId,
									dateTime : new Date().getTime(),
									server : "132.228.236.238"
								},
								success : function(data) {
									processUpdateResult(data, tableId,
											tableName, rowId, rowStateName,
											null, 3, tableId, null);
								}
							}); // 加时间入参是为了每次都能确保实际执行
				};

				// 根据流程环节表格ID和状态标识，查找状态名称，或者表格名称
				// 入参说明：
				// tableId：流程环节表格，不能为空
				// stateFlag：状态标识，可以为空，为空时返回的是表格的名称
				// stateObjData：状态对象数据，是一个数组
				function getStateNameFromStateObjData(tableId, stateFlag,
						stateObjData) {
					var tableNum = stateObjData.length;
					for (var i = 0; i < tableNum; i++) {
						var tableObj = stateObjData[i];
						if (tableId == tableObj.tableId) {
							if (null == stateFlag || "" == stateFlag) {
								return tableObj.tableName;
							}
							var stateObjArray = tableObj.states;
							var stateNum = stateObjArray.length;
							for (var j = 0; j < stateNum; j++) {
								var stateObj = stateObjArray[j];
								if (stateFlag == stateObj.code) {
									return stateObj.text;
								}
							}
						}
					}
					return "未知[" + stateFlag + "]";
				}

				// 处理更新结果
				// 入参说明：
				// dom：后端处理结果，是一个XML
				// tableID：流程环节表格标识
				// tableName：流程环节表格名称
				// rowId：当前记录主键ID
				// fromStateName：当前记录的原始状态
				// toStateName：当前记录的改后状态
				// operationFlag：调度操作标识，取值范围：1－复原，2－作废，3－删除，4－异常报竣
				// refreshTableIdList：要刷新展现的表格ID列表，中间是用英文逗号“,”分隔
				// extCustOrderId：外系统客户订单ID
				function processUpdateResult(dom, tableId, tableName, rowId,
						fromStateName, toStateName, operationFlag,
						refreshTableIdList, extCustOrderId) {
					var result = "false";
					if (null != dom && undefined != dom) {
						result = dom;
					}
					if ("true" == result) {
						if (1 == operationFlag) {
							alert("“" + tableName + "”中记录【ID=" + rowId
									+ "】已经被重发。\n\n若侦听开启，将会很快被重新处理，敬请再次关注。");
						} else if (2 == operationFlag) {
							alert("“" + tableName + "”中记录【ID=" + rowId
									+ "】的状态已经由“" + fromStateName + "”被作废为“"
									+ toStateName + "”，不会再被处理。");
						} else if (3 == operationFlag) {
							alert("“" + tableName + "”中记录【ID=" + rowId
									+ "】已经被彻底删除掉。");
						} else if (4 == operationFlag) {
							alert("当前“"
									+ tableName
									+ "”中记录【ID="
									+ rowId
									+ "】以及与之相关的其他两个环节的记录状态被置为“被人工干预[V]”，同时生成异常报竣或者正常报竣信息，写入异常报竣信息表（DEP_TRANS_EXCEPTION_MSG和DEP_TRANS_EXCEPTION_MSG_INFO）。\n\n若侦听开启，将会很快被反馈给集团，敬请再次关注。");
						} else if (5 == operationFlag) {
							alert("当前“"
									+ tableName
									+ "”中记录【一站式流水号："
									+ extCustOrderId
									+ "】已经被设置为重发状态（即：DEP_TRANS_MSG表状态置为W，DEP_TRANS_MSG_SPLIT表和DEP_ORDER_2_PRVNC_OL表记录删除）。\n\n若侦听开启，将会很快被重新下发给省分CRM，敬请再次关注。");
						} else if (0 == operationFlag) {
							alert("流水“" + rowId
									+ "”已经重新向集团报竣。\n\n若侦听开启，将会很快被重新处理，敬请再次关注。");
						}
						// 更新调度操作后的界面展现
						loadData($("#transactionIdSpan").val().trim());
					} else {
						if (1 == operationFlag) {
							alert("“" + tableName + "”中记录【ID=" + rowId
									+ "】重发失败，具体原因:" + result);
						} else if (2 == operationFlag) {
							alert("“" + tableName + "”中记录【ID=" + rowId
									+ "】的状态没能由“" + fromStateName + "”作废为“"
									+ toStateName + "”，请检查具体原因。");
						} else if (3 == operationFlag) {
							alert("“" + tableName + "”中记录【ID=" + rowId
									+ "】没能被删除掉，请检查具体原因。");
						} else if (4 == operationFlag) {
							alert("“"
									+ tableName
									+ "”中记录【ID="
									+ rowId
									+ "】以及与之相关的其他两个环节的记录状态没能被置为“被人工干预[V]”等，请检查具体原因。");
						} else if (5 == operationFlag) {
							alert("“" + tableName + "”中记录【一站式流水号："
									+ extCustOrderId + "】没能被重发，请检查具体原因。");
						}
					}
				}
				// 工单分布图
				function drawMap(id, datas) {
					var options = {
						id : id
					};
					options.series = {
						data : datas,
						type : 'pie',
						name : "百分比"
					};
					utilManager.drawMap(options);
				}
			}
		});
