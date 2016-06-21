/**
    @name: aping-plugin-footballdata 
    @version: 0.1.0 (21-06-2016) 
    @author: Jonathan Hornung 
    @url: https://github.com/JohnnyTheTank/apiNG-plugin-footballdata 
    @license: MIT
*/
"use strict";

/**
 @author Jonathan Hornung (https://github.com/JohnnyTheTank)
 @url https://github.com/JohnnyTheTank/apiNG-plugin-footballdata
 @licence MIT
 */

angular.module("jtt_aping_footballdata", ['jtt_footballdata'])
    .directive('apingFootballdata', ['apingFootballDataHelper', 'apingUtilityHelper', 'footballdataFactory', function (apingFootballDataHelper, apingUtilityHelper, footballdataFactory) {
        return {
            require: '?aping',
            restrict: 'A',
            replace: 'false',
            link: function (scope, element, attrs, apingController) {

                var appSettings = apingController.getAppSettings();

                var requests = apingUtilityHelper.parseJsonFromAttributes(attrs.apingFootballdata, apingFootballDataHelper.getThisPlatformString(), appSettings);

                requests.forEach(function (request) {

                    //create helperObject for helper function call
                    var helperObject = {
                        model: appSettings.model,
                    };

                    if(angular.isDefined(appSettings.getNativeData)) {
                        helperObject.getNativeData = appSettings.getNativeData;
                    } else {
                        helperObject.getNativeData = false;
                    }
                    //create requestObject for api request call

                    var requestObject = {
                        apiKey: apingUtilityHelper.getApiCredentials(apingFootballDataHelper.getThisPlatformString(), "api_key"),
                    };

                    if(angular.isDefined(request.items)) {
                        if (request.items === 0 || request.items === '0') {
                            return false;
                        }

                        // -1 is "no explicit limit". same for NaN value
                        if(request.items < 0 || isNaN(request.items)) {
                            request.items = undefined;
                        }
                    }

                    if(helperObject.model === 'fbd-team') {
                        if(angular.isDefined(request.id)) {

                            requestObject.id = request.id;

                            footballdataFactory.getTeam(requestObject)
                                .then(function (_data) {
                                    if (_data) {
                                        apingController.concatToResults(apingFootballDataHelper.getObjectByJsonData(_data, helperObject));
                                    }
                                });
                        }
                    }


                });
            }
        }
    }]);;"use strict";

/**
 @author Jonathan Hornung (https://github.com/JohnnyTheTank)
 @url https://github.com/JohnnyTheTank/apiNG-plugin-footballdata
 @licence MIT
 */

angular.module("jtt_aping_footballdata")
    .service('apingFootballDataHelper', ['apingModels', 'apingTimeHelper', 'apingUtilityHelper', function (apingModels, apingTimeHelper, apingUtilityHelper) {
        this.getThisPlatformString = function () {
            return "footballdata";
        };

        this.getIdByLinksObject = function (_linksObject) {
            var returnValue;
            if (_linksObject && _linksObject.self && _linksObject.self.href) {
                var tempValue = _linksObject.self.href.split('/').pop();
                if(tempValue.length > 0) {
                    returnValue = tempValue;
                }
            }
            return returnValue;
        };

        this.getObjectByJsonData = function (_data, _helperObject) {

            var requestResults = [];
            if (_data && _data.data) {
                var _this = this;

                var scope = [];

                switch (_helperObject.model) {
                    case 'fbd-team':
                        scope.push(_data.data);
                        break;

                    case 'fbd-season':
                        break;

                    case 'fbd-player':
                        break;

                    case 'fbd-table':
                        break;

                    case 'fbd-fixtures':
                        break;
                }

                if (scope.constructor === Array && scope.length > 0) {
                    angular.forEach(scope, function (value, key) {
                        var tempResult;
                        if (_helperObject.getNativeData === true || _helperObject.getNativeData === "true") {
                            tempResult = value;
                        } else {
                            tempResult = _this.getItemByJsonData(value, _helperObject.model);
                        }
                        if (tempResult) {
                            requestResults.push(tempResult);
                        }
                    });
                }
            }
            return requestResults;
        };

        this.getItemByJsonData = function (_item, _model) {
            var returnObject = {};
            if (_item && _model) {
                switch (_model) {
                    case "fbd-team":
                        returnObject = this.getFbdTeamItemByJsonData(_item);
                        break;

                    default:
                        return false;
                }
            }
            return returnObject;
        };

        this.getFbdTeamItemByJsonData = function (_item) {
            var fbdTeamObject = apingModels.getNew("fbd-team", this.getThisPlatformString());

            angular.extend(fbdTeamObject, {
                teamId: _item._links ? this.getIdByLinksObject(_item._links) : undefined,
                code: _item.code || undefined,
                short_name: _item.shortName || undefined,
                name: _item.name || undefined,
                market_value: _item.squadMarketValue || undefined,
                logo_url: _item.crestUrl ? _item.crestUrl.replace('http://', 'https://') : undefined
            });

            //fbdTeamObject.date_time = new Date(fbdTeamObject.timestamp);

            return fbdTeamObject;
        };


    }]);;"use strict";

angular.module("jtt_footballdata", [])
    .factory('footballdataFactory', ['$http', 'footballdataSearchDataService', function ($http, footballdataSearchDataService) {

        var footballdataFactory = {};

        footballdataFactory.getSeasons = function (_params) {

            var searchData = footballdataSearchDataService.getNew("getSeasons", _params);

            return $http({
                method: 'GET',
                url: searchData.url,
                params: searchData.object,
                headers: {
                    'X-Auth-Token': _params.apiKey,
                }
            });
        };

        footballdataFactory.getTeam = function (_params) {

            var searchData = footballdataSearchDataService.getNew("getTeam", _params);

            return $http({
                method: 'GET',
                url: searchData.url,
                params: searchData.object,
                headers: {
                    'X-Auth-Token': _params.apiKey ? _params.apiKey : apiKey,
                }
            });
        };

        footballdataFactory.getPlayersByTeam = function (_params) {

            var searchData = footballdataSearchDataService.getNew("getPlayersByTeam", _params);

            return $http({
                method: 'GET',
                url: searchData.url,
                params: searchData.object,
                headers: {
                    'X-Auth-Token': _params.apiKey ? _params.apiKey : apiKey,
                }
            });
        };

        footballdataFactory.getFixtures = function (_params) {

            var searchData = footballdataSearchDataService.getNew("getFixtures", _params);

            return $http({
                method: 'GET',
                url: searchData.url,
                params: searchData.object,
                headers: {
                    'X-Auth-Token': _params.apiKey ? _params.apiKey : apiKey,
                }
            });
        };

        footballdataFactory.getFixture = function (_params) {

            var searchData = footballdataSearchDataService.getNew("getFixture", _params);

            return $http({
                method: 'GET',
                url: searchData.url,
                params: searchData.object,
                headers: {
                    'X-Auth-Token': _params.apiKey ? _params.apiKey : apiKey,
                }
            });
        };

        footballdataFactory.getFixturesByTeam = function (_params) {

            var searchData = footballdataSearchDataService.getNew("getFixturesByTeam", _params);

            return $http({
                method: 'GET',
                url: searchData.url,
                params: searchData.object,
                headers: {
                    'X-Auth-Token': _params.apiKey ? _params.apiKey : apiKey,
                }
            });
        };

        footballdataFactory.getTeamsBySeason = function (_params) {

            var searchData = footballdataSearchDataService.getNew("getTeamsBySeason", _params);

            return $http({
                method: 'GET',
                url: searchData.url,
                params: searchData.object,
                headers: {
                    'X-Auth-Token': _params.apiKey ? _params.apiKey : apiKey,
                }
            });
        };

        footballdataFactory.getLeagueTableBySeason = function (_params) {

            var searchData = footballdataSearchDataService.getNew("getLeagueTableBySeason", _params);

            return $http({
                method: 'GET',
                url: searchData.url,
                params: searchData.object,
                headers: {
                    'X-Auth-Token': _params.apiKey ? _params.apiKey : apiKey,
                }
            });
        };

        footballdataFactory.getFixturesBySeason = function (_params) {

            var searchData = footballdataSearchDataService.getNew("getFixturesBySeason", _params);

            return $http({
                method: 'GET',
                url: searchData.url,
                params: searchData.object,
                headers: {
                    'X-Auth-Token': _params.apiKey ? _params.apiKey : apiKey,
                }
            });
        };

        return footballdataFactory;
    }])
    .service('footballdataSearchDataService', function () {
        this.getApiBaseUrl = function () {
            return 'http://api.football-data.org/v1/';
        };

        this.fillDataInObjectByList = function (_object, _params, _list) {

            angular.forEach(_list, function (value, key) {
                if (angular.isDefined(_params[value])) {
                    _object.object[value] = _params[value];
                }
            });

            return _object;
        };

        this.getNew = function (_type, _params) {

            var footballdataSearchData = {
                object: {},
                url: '',
            };

            switch (_type) {
                case "getSeasons":
                    footballdataSearchData = this.fillDataInObjectByList(footballdataSearchData, _params, [
                        'apiKey', 'season',
                    ]);
                    footballdataSearchData.url = this.getApiBaseUrl() + 'soccerseasons/';
                    break;

                case "getTeam":
                    footballdataSearchData = this.fillDataInObjectByList(footballdataSearchData, _params, [
                        'apiKey'
                    ]);
                    footballdataSearchData.url = this.getApiBaseUrl() + 'teams/' + _params.id;
                    break;

                case "getPlayersByTeam":
                    footballdataSearchData = this.fillDataInObjectByList(footballdataSearchData, _params, [
                        'apiKey'
                    ]);
                    footballdataSearchData.url = this.getApiBaseUrl() + 'teams/' + _params.id + '/players';
                    break;

                case "getFixtures":
                    footballdataSearchData = this.fillDataInObjectByList(footballdataSearchData, _params, [
                        'apiKey', 'league', 'timeFrame'
                    ]);
                    footballdataSearchData.url = this.getApiBaseUrl() + '/fixtures';
                    break;

                case "getFixture":
                    footballdataSearchData = this.fillDataInObjectByList(footballdataSearchData, _params, [
                        'apiKey', 'head2head'
                    ]);
                    footballdataSearchData.url = this.getApiBaseUrl() + '/fixtures/' + _params.id;
                    break;

                case "getTeamsBySeason":
                    footballdataSearchData = this.fillDataInObjectByList(footballdataSearchData, _params, [

                    ]);
                    footballdataSearchData.url = this.getApiBaseUrl() + 'soccerseasons/' + _params.id + '/teams';
                    break;

                case "getLeagueTableBySeason":
                    footballdataSearchData = this.fillDataInObjectByList(footballdataSearchData, _params, [
                        'apiKey', 'matchday'
                    ]);
                    footballdataSearchData.url = this.getApiBaseUrl() + 'soccerseasons/' + _params.id + '/leagueTable';
                    break;

                case "getFixturesBySeason":
                    footballdataSearchData = this.fillDataInObjectByList(footballdataSearchData, _params, [
                        'apiKey', 'matchday', 'timeFrame'
                    ]);
                    footballdataSearchData.url = this.getApiBaseUrl() + 'soccerseasons/' + _params.id + '/fixtures';
                    break;

                case "getFixturesByTeam":
                    footballdataSearchData = this.fillDataInObjectByList(footballdataSearchData, _params, [
                        'apiKey', 'season', 'timeFrame', 'venue'
                    ]);
                    footballdataSearchData.url = this.getApiBaseUrl() + '/teams/' + _params.id + '/fixtures';
                    break;

            }
            return footballdataSearchData;
        };
    });