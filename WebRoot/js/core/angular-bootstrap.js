/**
 * RequireJS启动的入口
 *
 * 主要实现一下功能：
 * 1、加载requirejs各个模块的配置
 * 2、获取当前页面的controller
 * 3、加载controller模块，并启动angularjs app
 *
 */
// 配置requirejs的模块
var requireConfig = {
    urlArgs: "bust=v3",
    waitSeconds: 7,
    baseUrl: '',
    paths: paths,
    shim: shim
};

requirejs.config(requireConfig);

// 获取当前页面的Controller
var required = [];
(function () {
    function scripts() {
        return document.getElementsByTagName('script');
    }

    for (var i = 0; i < scripts().length; i++) {
        var controller = scripts()[i].getAttribute('controller');
        if (controller) {
            required.push(controller);
        }
    }
    ;
})();

// 加载Controller模块，启动AngularJS应用
require(required, function () {
//    // ???
//    angular.module("bss").config(function ($provide, $routeProvider, $locationProvider) {
////        $provide.decorator('$sniffer', function ($delegate) {
////            $delegate.history = false;
////            return $delegate;
////        });
////        $locationProvider
////            .html5Mode(true);
//
////        $locationProvider
////            .html5Mode(false);
//
////        $locationProvider.html5Mode(true);
//
////        $locationProvider.baseHref = "/abcd/"
//    });
    angular.bootstrap(document, ["business-app"]);
});