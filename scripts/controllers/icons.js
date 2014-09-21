'use strict';

angular.module('icons8')
    .controller('icons', [
        '$scope',
        '$http',
        'configService',
        'localStorageService',
        '$q',
        function ($scope, $http, configService, localStorageService, $q) {

            //localStorageService.clearAll(); // Command for clear local storage
            var score = {}; // Object with all results for current user
            var api = {}; // Object with path to API

            // Get API parameters
            configService.get('api')
                .then(function (conf) {
                    api = conf;
                });

            // Method of displaying score
            $scope.getScore = function() {
                var sum = 0;
                angular.forEach(score, function(val) {
                    sum += val;
                });
                return sum;
            };

            // Method of loading slots (rewritten when available API - server must respond array of objects (for example: [{id: 123, title: 'Add'}]))
            configService.get('slots')
                .then(function(conf) {
                    $scope.iconsBox = conf;
                    // the next code is required to drag-and-drop functionality
                    var iconsBoxContainer = [];
                    angular.forEach($scope.iconsBox, function() {
                        iconsBoxContainer.push({});
                    });
                    $scope.iconsBoxContainer = iconsBoxContainer;
                });

            /* Next method must send request to API with two parameters (id slot, id selected icon) (maybe third parameter user_id or session_id)
             * and server must respond array with five object - this frequently used responses for current slot
             * but now write hardcode via config and local storage (rewritten when available API) */
            var getStatistic = function(slot_id, icon_id, icon) {
                var def = $q.defer();
                var statistic = localStorageService.get('statistic') || {};
                if (statistic && statistic[slot_id]) {
                    addPoint(false);
                    def.resolve(statistic[slot_id]);
                } else {
                    configService.get('localStorage')
                        .then(function(conf) {
                            if (conf && conf[slot_id]) {
                                statistic[slot_id] = conf[slot_id];
                                addPoint(true);
                                return def.resolve(conf[slot_id]);
                            }
                            return def.reject('resource not found');
                        });
                }

                // Function set new value into local storage
                function addPoint(write) {
                    var change = false;
                    angular.forEach(statistic[slot_id], function(preference) {
                        if (preference.id === icon_id) {
                            preference.people ++;
                            change = true;
                        }
                    });
                    if (!change) {
                        statistic[slot_id].push(icon);
                        change = true;
                    }
                    if (write || change) {
                        localStorageService.set('statistic', statistic);
                    }
                }

                return def.promise;
            };


            $scope.searchSubmit = function(search) {
                var query = api.host + api.path + '?term=' + (search || '') + '&amount=' + api.amount;
                //var query = 'http://api.icons8.com/api/iconsets/search?term=tes&amount=30';
                $scope.loaded = true;
                $scope.searchResult = null;
                $http.get(query)
                    .then(
                        function(response) {
                            $scope.loaded = false;
                            if (!response.xml) {
                                console.error('Server error: "response.xml" is not defined');
                                alert('Server error');
                                return;
                            }
                            if (response.xml.find('error')[0]) {
                                console.error('Server error: ' + response.xml.find('error')[0].textContent);
                                alert('Server error');
                                return;
                            }
                            var icons = [];
                            var els = response.xml.find('icon');

                            angular.forEach(els, function(icon) {
                                icon = angular.element(icon);
                                var objIcon = {
                                    id: icon.attr('id'),
                                    name: icon.attr('name'),
                                    src: 'data:image/svg+xml;base64,' + icon.find('svg')[0].textContent
                                };
                                icons.push(objIcon);
                            });

                            $scope.searchResult = icons;
                        },
                        function(err) {
                            $scope.loaded = false;
                            console.error('Server error: ', err);
                            alert('Server error');
                        }
                    );
            };

            $scope.startCallback = function(event, ui, title) {
                //console.log('You started draggin: ' + title.name);
            };

            $scope.stopCallback = function(event, ui) {
                //console.log('Why did you stop draggin me?');
            };

            $scope.dragCallback = function(event, ui) {
                //console.log('hey, look I`m flying');
            };

            // Callback when the icon is placed in the box
            $scope.dropCallback = function(event, ui) {
                var slot_id = angular.element(event.target).attr('data-box-id');
                var icon_id = ui.draggable.attr('data-icon-id');
                // Hardcode object for local storage
                var icon = {
                    "id": "" + icon_id,
                    "src": ui.draggable.attr('src').split('data:image/svg+xml;base64,')[1],
                    "people": "1",
                    "percent": "12"

                };
                getStatistic(slot_id, icon_id, icon)
                    .then(function(result) {
                        score[slot_id] = 0;
                        angular.forEach(result, function(preference) {
                            if (preference.id === icon_id) {
                                score[slot_id] = parseInt(preference.people, 10) || 0;
                                preference.choice = true;
                            }
                        });
                        $scope.statistic = result;
                    })
                    .catch(function(err) {
                        alert('Error: ' + err);
                    });
            };

            $scope.overCallback = function(event, ui) {
                //console.log('Look, I`m over you', event.target);
            };

            $scope.outCallback = function(event, ui) {
                //console.log('I`m not, hehe');
            };
        }
    ]);
