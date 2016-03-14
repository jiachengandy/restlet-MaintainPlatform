/**
 * Requirejs配置文件，
 *
 * 功能：配置模块path，以及引入的shim
 *
 *
 */
var paths = {
    //lib
	'jquery': 'js/lib/jquery/jquery',
	'cookie': 'js/lib/jquery/jquery.cookie',
	'angular':'js/lib/angular/angular',
	'angularRoute':'js/lib/angular/angular-route',
	'angularCookie':'js/lib/angular/angular-cookie',
	'angularSanitize':'js/lib/angular/angular-sanitize.min',
	'jscharts':'js/lib/tool/jscharts',
	'bootstrap':'js/lib/bootstrap/bootstrap.min',
	'bootstrap-datetime':'js/lib/bootstrap/bootstrap-datetimepicker',
	'bootstrap-datetime-zh':'js/lib/bootstrap/locales/bootstrap-datetimepicker.zh-CN',
	'jquery-datetime':'js/lib/tool/datepicker/jquery.datetimepicker',
	'ueditorAll':'ueditor/ueditor.all',
	'ueditorConfig':'ueditor/ueditor.config',
	'wdatePicker':'js/lib/tool/datepicker/WdatePicker',
	'highcharts':'js/lib/tool/highcharts',
	'highcharts_more':'js/lib/tool/highcharts-more',
	'exporting':'js/lib/tool/exporting',
	'scrollbar':'js/lib/tool/perfect-scrollbar',
	'mousewheel':'js/lib/tool/jquery.mousewheel.min',
	'angularAnimate':'js/lib/angular/angular-animate',
	'artDialog':'js/lib/tool/artDialog',
	/*'jqueryUI':'js/lib/jquery/jquery-ui',
	'jqueryUItimePicker':'js/lib/jquery/jquery-ui-timepicker-addon',
	'jqueryUItimePickerZH':'js/lib/jquery/jquery-ui-timepicker-zh-CN',
	'jqueryUIslider':'js/lib/jquery/jquery-ui-sliderAccess',*/
	
    //core
    'app': 'js/core/app',
    'core_directive': 'js/core/directive',
    'core_service': 'js/core/service',
    'baseModule': 'js/core/module',
    //'requireCss': 'js/core/require-css',
	
    'userCtrl': 'js/controller/userCtrl',
    'homeCtrl': 'js/controller/homeCtrl',
    'hostCtrl': 'js/controller/hostCtrl',
    'applicationCtrl': 'js/controller/applicationCtrl',
    'businessCtrl': 'js/controller/businessCtrl',
    'planCtrl': 'js/controller/planCtrl',
    'toolCtrl': 'js/controller/toolCtrl',
    'systemCtrl': 'js/controller/systemCtrl',
    'knowledgeCtrl': 'js/controller/knowledgeCtrl',
    'singleFunctionCtrl': 'js/controller/singleFunctionCtrl',
    'warningCheckCtrl': 'js/controller/warningCheckCtrl',
    'fourGCtrl': 'js/controller/4GCtrl',
    
    //service
    'userService': 'js/service/userService',
    'hostService': 'js/service/hostService',
    'applicationService': 'js/service/applicationService',
    'businessService': 'js/service/businessService',
    'knowledgeService': 'js/service/knowledgeService',
    'utilService': 'js/service/utilService',
    /*'activeService': 'js/service/active',
    'appService': 'js/service/app',
    'resetPasswordService': 'js/service/resetPassword',
    'serviceService': 'js/service/service',
    'userInfoService': 'js/service/userInfo',*/
    //directive
    'headerDirective': 'js/directive/header',
    'coverDirective': 'js/directive/cover',
    
     //filter
     'htmlFilter': 'js/filter/htmlFilter',
     //animtate
     'animate': 'js/animation/animate',
};

var shim = {
    'angular': {
        exports: 'angular',
        deps: ['jquery']
    },
    'angularRoute': {
    	exports: 'angularRoute',
        deps: ['angular']
    },
    'angularAnimate': {
    	exports: 'angularAnimate',
        deps: ['angular']
    },
    'bootstrap': {
    	exports: 'bootstrap',
        deps: ['jquery']
    },
    'bootstrap-datetime': {
    	exports: 'bootstrap-datetime',
        deps: ['bootstrap']
    },
    'bootstrap-datetime-zh': {
    	exports: 'bootstrap-datetime-zh',
        deps: ['bootstrap-datetime']
    },
    'jquery-datetime': {
    	exports: 'jquery-datetime',
        deps: ['jquery']
    },
    'ueditorAll': {
    	exports: 'ueditorAll',
        deps: ['jquery']
    },
    'wdatePicker': {
    	exports: 'wdatePicker',
        deps: ['jquery']
    },
    'highcharts': {
    	exports: 'highcharts',
        deps: ['jquery']
    },
    'highcharts_more': {
    	exports: 'highcharts_more',
        deps: ['jquery','highcharts']
    },
    'exporting': {
    	exports: 'exporting',
        deps: ['jquery','highcharts']
    },
    'scrollbar': {
    	exports: 'scrollbar',
        deps: ['jquery']
    },
    'mousewheel': {
    	exports: 'mousewheel',
        deps: ['jquery']
    },
    'artDialog': {
    	exports: 'artDialog',
        deps: ['jquery']
    },
    'cookie': {
        deps: ['jquery']
    },
};