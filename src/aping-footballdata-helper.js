"use strict";

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
                        if(angular.isDefined(_data.data.teams)) {
                            scope =_data.data.teams;
                        } else {
                            scope.push(_data.data);
                        }
                        break;

                    case 'fbd-league':
                        scope =_data.data;
                        break;

                    case 'fbd-player':
                        if(_data.data.players && _data.data.players.length > 0) {
                            scope = _data.data.players;
                        }
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

                    case "fbd-league":
                        returnObject = this.getFbdLeagueItemByJsonData(_item);
                        break;

                    case "fbd-player":
                        returnObject = this.getFbdPlayerItemByJsonData(_item);
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

            return fbdTeamObject;
        };

        this.getFbdLeagueItemByJsonData = function (_item) {
            var fbdLeagueObject = apingModels.getNew("fbd-league", this.getThisPlatformString());

            angular.extend(fbdLeagueObject, {
                leagueId: _item.id || undefined,
                league: _item.league || undefined,
                caption: _item.caption || undefined,
                currentMatchday: _item.currentMatchday || undefined,
                lastUpdated: _item.lastUpdated || undefined,
                numberOfGames: _item.numberOfGames || undefined,
                numberOfMatchdays: _item.numberOfMatchdays || undefined,
                numberOfTeams: _item.numberOfTeams || undefined,
                year: _item.year || undefined,
            });

            return fbdLeagueObject;
        };

        this.getFbdPlayerItemByJsonData = function (_item) {
            var fbdPlayerObject = apingModels.getNew("fbd-player", this.getThisPlatformString());

            angular.extend(fbdPlayerObject, {
                contractUntil: _item.contractUntil || undefined,
                dateOfBirth: _item.dateOfBirth || undefined,
                jerseyNumber: _item.jerseyNumber || undefined,
                marketValue: _item.marketValue || undefined,
                name: _item.name || undefined,
                nationality: _item.nationality || undefined,
                position: _item.position || undefined,
            });

            return fbdPlayerObject;
        };


    }]);