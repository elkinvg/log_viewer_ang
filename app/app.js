/*global angular:true */
'use strict';

var app = angular.module('logViewerApp', ['ui.grid', 'ui.grid.pagination', 'ui.grid.emptyBaseLayer','ngMaterial']);

app.controller('CommonController', function ($scope, $http) {
    var me = this;
    var variables = {
        tangodev_log : {
            get_params: { 
                all_posts : {params: {destination: "tangodev_log", type_req: "all_posts"}}
            },
            keys_for_data: {
                history: "history",
                timestamp: "timestamp"
            }
        },
        command_history: {
            get_params: { 
                all_posts : {params: {destination: "command_history", type_req: "all_posts"}}
            },
            keys_for_data: {
                history: "command_history",
                timestamp: "comm_timestamp"
            }
        }

    }


    $scope.getLog_allPosts = function (sender, this_from_sender) {
        var functArgs = arguments;
        $http.get("/cr_conf/log_viewer/log_from_tango_web_auth.php",
        // variables определяется ранее, для подбора параметров по ключам
        // sender - отправитель. В данный момент две таблицы
            variables[sender].get_params.all_posts)
            .then(function (response) {
                generateOut(response.data);
                $scope.logData.data = response.data[variables[sender].keys_for_data.history];
                $scope.logData.firstData = $scope.logData.data;
            },
            function (response) {
                var as = "";
            });

        function generateOut(inpData) {
            var history = inpData[variables[sender].keys_for_data.history];
            var device_list = inpData.device_list;

            if (history.length) {
                var key_for_timestamp = variables[sender].keys_for_data.timestamp
                var maxtime = history[0][key_for_timestamp];
                var mintime = history[history.length -1][key_for_timestamp];
                this_from_sender.myDateBgn = new Date(mintime);
                this_from_sender.myDateEnd = new Date(maxtime);
                this_from_sender.myDateBgnLast = this_from_sender.myDateBgn;
                this_from_sender.myDateEndLast = this_from_sender.myDateEnd;
            }

            angular.forEach(history, function(array_out) {
                // Должны содержаться ключи alias description
                if (device_list[array_out.device_name] !== undefined ) {
                    Object.assign(array_out, device_list[array_out.device_name]);
                }
                else {
                    array_out.alias =  "unknown";
                    array_out.description = array_out.device_name;
                }
                // В таблице `tango_web_auth`.`tangodev_log`  timestamp
                // В таблице `tango_web_auth`.`command_history`  comm_timestamp
                // Значения для sender определены в var variables
                if (sender == "tangodev_log"){
                    array_out.timestamp = new Date(array_out.timestamp);
                }
                else if (sender == "command_history") {
                    array_out.timestamp = new Date(array_out.comm_timestamp);
                    delete array_out.comm_timestamp;
                }
            });
        }
    }

    $scope.selectDate = function() {
        // myDateBgn myDateEnd записвыются в $scope.ctrl
        var bgnDt = $scope.ctrl.myDateBgn; 
        var endDt = $scope.ctrl.myDateEnd; 
        var logData = $scope.logData;
        bgnDt.setHours(0,0,0);
        endDt.setHours(23,59,59);

        logData.myDateBgnLast = bgnDt;
        logData.myDateEndLast = endDt;

        if (logData.myDateBgn === undefined || logData.myDateEnd === undefined) {
            logData.myDateBgn = logData.myDateBgnLast;
            logData.myDateEnd = logData.myDateBgnLast;
        }
        
        // Запуск фильтров
        $scope.runFilters();
    }

    $scope.runFilters = function() {
        // Сначала запускаются фильтры определённые в app.js
        $scope.filterDate();
        
        // Затем фильтры определённые в дочерних модулях
        if ($scope.otherFilters !== undefined/*  && notFromSelDate === undefined */) {
            $scope.otherFilters();
        }
    }

    $scope.filterDate = function() {
        // myDateBgn myDateEnd записвыются в $scope.ctrl
        var bgnDt = $scope.ctrl.myDateBgn; 
        var endDt = $scope.ctrl.myDateEnd; 
        var logData = $scope.logData;
        
        var newdt = [];
        angular.forEach($scope.logData.firstData, function (fromLogData) {
            var date = new Date(fromLogData.timestamp);
            if (date > bgnDt && date < endDt) {
                newdt.push(fromLogData);
            }
        });
        logData.data = newdt;
    }

    $scope.resetFilters = function() {
        // Сброс всех фильтров
        $scope.ctrl.myDateBgn = $scope.ctrl.myDateBgnLast;        
        $scope.ctrl.myDateEnd = $scope.ctrl.myDateEndLast;
        $scope.ctrl.type_mess = $scope.ctrl.type_mess_last;
        $scope.setFirstData();
    }

    $scope.setFirstData = function() {
        $scope.logData.data = $scope.logData.firstData;
    }
});

app.config(function($mdDateLocaleProvider) {
    
        $mdDateLocaleProvider.months = ['Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь',
            'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'];
        $mdDateLocaleProvider.shortMonths = ['Янв', 'Фев', 'Мар', 'Апр', 'Май', 'Июн', 'Июл',
            'Авг', 'Сен', 'Окт', 'Ноя', 'Дек'];
        $mdDateLocaleProvider.days = ['Воскресение', 'Понедельник', 'Вторник', 'Среда', 'Четверг', 'Пятница', 'Суббота'];
        $mdDateLocaleProvider.shortDays = ['Вс', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб'];
        // Can change week display to start on Monday.
        $mdDateLocaleProvider.firstDayOfWeek = 1;
        // Optional.
    
        $mdDateLocaleProvider.weekNumberFormatter = function(weekNumber) {
            return 'Неделя ' + weekNumber;
        };
        $mdDateLocaleProvider.msgCalendar = 'Календарь';
        $mdDateLocaleProvider.msgOpenCalendar = 'Календарь';
    
        $mdDateLocaleProvider.formatDate = function(date) {
            return moment(date).format('DD-MM-YYYY');
        };
    });