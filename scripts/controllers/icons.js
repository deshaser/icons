'use strict';

angular.module('icons8')
    .controller('icons', [
        '$scope',
        '$http',
        function ($scope, $http) {

            $scope.iconsBox = ['Add', 'Extract to', 'Test', 'View', 'Delete', 'Find', 'Wizards', 'Info', 'Scan viruses'];
            var iconsBoxContainer = [];
            angular.forEach($scope.iconsBox, function() {
                iconsBoxContainer.push({});
            });
            $scope.iconsBoxContainer = iconsBoxContainer;

            $http.get('http://api.icons8.com/api/iconsets/search?term=tes&amount=10')
                .then(function (response) {
                    var icons = [];
                    var els = response.xml.find('icon');

                    angular.forEach(els, function(icon) {
                        icon = angular.element(icon);
                        var objIcon = {
                            name: icon.find('category')[0].textContent,
                            src: 'data:image/svg+xml;base64,' + icon.find('svg')[0].textContent
                        };
                        icons.push(objIcon);
                    });

                    $scope.searchResult = icons;
                });


            $scope.startCallback = function(event, ui, title) {
                //console.log('You started draggin: ' + title.name);
            };

            $scope.stopCallback = function(event, ui) {
                //console.log('Why did you stop draggin me?');
            };

            $scope.dragCallback = function(event, ui) {
                //console.log('hey, look I`m flying');
            };

            $scope.dropCallback = function(event, ui) {
                //console.log('hey, you dumped me :-(' , $scope.draggedTitle);
            };

            $scope.dropCallback = function(event, ui) {
                //console.log('hey, you dumped me :-(' , $scope.draggedTitleTest.name);
            };

            $scope.overCallback = function(event, ui) {
                //console.log('Look, I`m over you', event.target);
            };

            $scope.outCallback = function(event, ui) {
                //console.log('I`m not, hehe');
            };
        }
    ]);
