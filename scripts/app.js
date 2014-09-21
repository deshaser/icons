'use strict';

angular
    .module('icons8', [
        'xml',
        'oniyi.configurator',
        'ngDragDrop',
        'LocalStorageModule'
    ])
    .config([
        '$httpProvider',
        'configServiceProvider',
        function ($httpProvider, configServiceProvider) {
            $httpProvider.interceptors.push('xmlHttpInterceptor');
            configServiceProvider.disableEnvironmentConfig();
        }
    ]);
