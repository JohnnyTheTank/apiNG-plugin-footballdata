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

        this.getObjectByJsonData = function (_data, _helperObject) {
            var requestResults = [];
            if (_data && _data.data) {
                var _this = this;

                //replace '_data.data.items'
                if (_data.data.items) {

                    //replace '_data.data.items'
                    angular.forEach(_data.data.items, function (value, key) {
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
                    case "social":
                        returnObject = this.getSocialItemByJsonData(_item);
                        break;

                    default:
                        return false;
                }
            }
            return returnObject;
        };

        this.getSocialItemByJsonData = function (_item) {
            var socialObject = apingModels.getNew("social", this.getThisPlatformString());

            //fill _item in socialObject
            angular.extend(socialObject, {
                blog_name: undefined,
                blog_id: undefined,
                blog_link: undefined,
                type: undefined,
                timestamp: undefined,
                post_url: undefined,
                intern_id: undefined,
                text: undefined,
                caption: undefined,
                img_url: undefined,
                thumb_url: undefined,
                native_url: undefined,
                source: undefined,
                likes: undefined,
                shares: undefined,
                comments: undefined,
                position: undefined
            });

            socialObject.date_time = new Date(socialObject.timestamp);

            return socialObject;
        };


    }]);