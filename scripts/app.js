'use strict';

angular
    .module('icons8', [
        'xml',
        'ngDragDrop'
    ])
    .config([
        '$httpProvider',
        function ($httpProvider) {
            $httpProvider.interceptors.push('xmlHttpInterceptor');
        }
    ]);
