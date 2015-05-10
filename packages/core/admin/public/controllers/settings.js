'use strict';
angular.module('mean.admin').controller('SettingsController', ['$scope', 'Global', 'Settings',
    function($scope, Global, Settings) {

        $scope.newItem = {
            key: '',
            value: {
                value: ''
            }
        };

        $scope.init = function() {
            Settings.get(function(data) {
                if (data.success) {
                    $scope.settings = data.settings;
                }
            });
        };

        $scope.update = function(settings) {
            settings = JSON.clean(JSON.unflatten(settings));
            Settings.update(settings, function(data) {});
        };

        $scope.getTextToCopy = function() {
            var settings = JSON.clean(JSON.unflatten($scope.settings));
            return JSON.stringify(settings);
        };


        JSON.unflatten = function(data) {
            if (Object(data) !== data || Array.isArray(data))
                return data;
            var regex = /\.?([^.\[\]]+)|\[(\d+)\]/g,
                resultholder = {};
            for (var p in data) {
                var cur = resultholder,
                    prop = '',
                    m;
                while (m = regex.exec(p)) {
                    cur = cur[prop] || (cur[prop] = (m[2] ? [] : {}));
                    prop = m[2] || m[1];
                }
                cur[prop] = data[p];
            }
            return resultholder[''] || resultholder;
        };

        JSON.clean = function(data, options) {
            var result = {};
            clean(data, '');

            function clean(config, root) {
                for (var index in config) {
                    if (config[index] && config[index].value === undefined && typeof(config[index]) === 'object') {
                        clean(config[index], index);
                    } else {
                        if (root && !result[root]) {
                            result[root] = {};
                            result[root][index] = config[index] ? config[index].value : null;
                        } else if (root && result[root])
                            result[root][index] = config[index] ? config[index].value : null;

                        else {
                            result[index] = config[index] ? config[index].value : null;
                        }
                    }
                }
            }
            return result;
        };

        $scope.add = function(newItem) {
            $scope.settings[newItem.key] = newItem.value;
            $scope.update($scope.settings);
            $scope.newItem = {
                key: '',
                value: {
                    value: ''
                }
            };
        };

        $scope.remove = function(key) {
            delete $scope.settings[key];
            $scope.update($scope.settings);
        };

        $scope.setDefault = function(key) {
            $scope.settings[key].value = $scope.settings[key]['default'];
            $scope.update($scope.settings);
        };
    }
]);
