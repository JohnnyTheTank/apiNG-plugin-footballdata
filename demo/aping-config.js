"use strict";
angular.module('jtt_aping').config(['$provide', function ($provide) {
    $provide.value("apingDefaultSettings", {
        apingApiKeys : {
            'footballdata': [
                {'api_key':'<YOUR_API_KEY>'},
            ],
            //...
        }
    });
}]);