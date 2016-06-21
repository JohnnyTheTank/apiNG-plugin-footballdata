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


    }]);