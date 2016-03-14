/*define(['angular', 'angularRoute', 'angular-file-upload', 'angularAnimate', 'json3', 'TinyScrollbar', 'i18n'], function () {
    angular.module("bss.core", ['ngRoute', 'angularFileUpload', 'ngAnimate']);
    angular.module("bss.constant", ['bss.core']).constant('cfg', bssCfg);
    angular.module("bss", ['bss.constant']);
    angular.module("business-app", ["bss"]).config(function ($sceProvider) {
        // Completely disable SCE to support IE7.
        $sceProvider.enabled(false);
    });
});
*/

define(['angular', 'angularRoute','angularAnimate'], function () {
    angular.module("bss.core", ['ngRoute','ngAnimate']);
    angular.module("bss.constant", ['bss.core']).constant('cfg', bssCfg);
    angular.module("bss", ['bss.constant']);
    angular.module("business-app", ["bss"]).config(function ($sceProvider) {
        // Completely disable SCE to support IE7.
        $sceProvider.enabled(false);
    });
});
