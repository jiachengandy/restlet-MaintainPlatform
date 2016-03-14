define(['app','cookie'], function()
{
	angular.module("bss").controller("userCtrl", userCtrl);
	function userCtrl($scope, $rootScope)
	{
	 $scope.loginResult="success";
	 $scope.username=$.cookie("username"); 
	 $scope.password=$.cookie("password");
	 $scope.login=function()
     {
          	var username = $(".login-username").val().trim();
          	var password = $(".login-password").val().trim();
          	if(username==''||password==''){
          		alert("用户名或密码不能为空");
          		return ;
          	}
          	$rootScope.$bssPost({
          		url : "restlet/student/add",
          		async : false,
          		data:{name:"jiac"},
          		success : function(result) {
          			
          		}
          	});
          	$rootScope.$bssGet({
          		url : "restlet/student/1/xml",
          		async : false,
          		success : function(result) {
          			
          		}
          	});
      	};

     	document.onkeydown = function(event) {
    		var e = event ? event : (window.event ? window.event : null);
    		if (e.keyCode == 13) {
    			 $scope.login();
    		};
    	};
    	$scope.register=function()
    	{
          	var user =$scope.user;
          	$.ajax({
          		type : "post",
          		url : "user.do?register",
          		data : {
          			user:JSON.stringify(user)
          		},
          		async : false,
          		success : function(result) {
          			window.location.href = "home.html";
          		}
          	});
    	};
    	$scope.queryUsers=function()
    	{
    		var para = "";
    		$.ajax({
          		type : "post",
          		url : "user.do?all",
          		data : {
          			para:para
          		},
          		async : false,
          		success : function(result) {
          			$scope.users=JSON.parse(result);;
          		}
          	});
    		$('#editor').wysiwyg();
    	};
    	$scope.queryUserDetail=function(id)
    	{
    		window.location="jsp/user/userinfo.jsp?id="+id;
    	};
    	$scope.initUserinfo=function()
    	{
    		console.log("id=",getQueryString("id"));
    		var id = getQueryString("id");
    		$.ajax({
          		type : "post",
          		url : "user.do?detail",
          		data : {
          			id:id
          		},
          		async : false,
          		success : function(result) {
          			$scope.user=JSON.parse(result);;
          		}
          	});
    		
    	};
    	$scope.updateUser=function()
    	{
          	var user =$scope.user;
          	$.ajax({
          		type : "post",
          		url : "user/update.do",
          		data : {
          			user:JSON.stringify(user)
          		},
          		async : false,
          		success : function(result) {
          			window.location.href = "jsp/user/userlist.jsp";
          		}
          	});
    	};
    	$scope.deleteUser=function(id)
    	{
          	$.ajax({
          		type : "post",
          		url : "user/delete.do",
          		data : {
          			id:id
          		},
          		async : false,
          		success : function(result) {
          			window.location.href = "jsp/user/userlist.jsp";
          		}
          	});
    	};
    	$scope.gotoBack = function()
		{
             window.history.go(-1);
		};
    	function getQueryString(name) {
    	    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
    	    var r = window.location.search.substr(1).match(reg);
    	    if (r != null) return unescape(r[2]); return null;
    	    }
	}

});
