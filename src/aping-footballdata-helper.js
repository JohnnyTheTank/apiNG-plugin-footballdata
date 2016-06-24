"use strict";

angular.module("jtt_aping_footballdata")
    .service('apingFootballDataHelper', ['apingModels', 'apingTimeHelper', 'apingUtilityHelper', function (apingModels, apingTimeHelper, apingUtilityHelper) {
        this.getThisPlatformString = function () {
            return "footballdata";
        };

        this.getIdByLinksObject = function (_linksObject, _property) {
            if (angular.isUndefined(_property)) {
                _property = 'self';
            }

            var returnValue;
            if (_linksObject && _linksObject[_property] && _linksObject[_property].href) {
                var tempValue = _linksObject[_property].href.split('/').pop();
                if (tempValue.length > 0) {
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
                        if (angular.isDefined(_data.data.teams)) {
                            scope = _data.data.teams;
                        } else {
                            scope.push(_data.data);
                        }
                        break;

                    case 'fbd-table':
                        scope.push(_data.data);
                        break;

                    case 'fbd-league':
                        if (_data.data.constructor === Array) {
                            scope = _data.data;
                        } else {
                            scope.push(_data.data);
                        }

                        break;

                    case 'fbd-player':
                        if (_data.data.players && _data.data.players.length > 0) {
                            scope = _data.data.players;
                        }
                        break;

                    case 'fbd-fixture':
                        if (angular.isDefined(_data.data.fixture)) {
                            scope.push(_data.data.fixture);
                        } else if (angular.isDefined(_data.data.fixtures)) {
                            scope = _data.data.fixtures;
                        }
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

                    case "fbd-table":
                        returnObject = this.getFbdTableItemByJsonData(_item);
                        break;

                    case "fbd-fixture":
                        returnObject = this.getFbdFixtureItemByJsonData(_item);
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
                shortName: _item.shortName || undefined,
                name: _item.name || undefined,
                squadMarketValue: _item.squadMarketValue || undefined,
                crestUrl: _item.crestUrl ? _item.crestUrl.replace('http://', 'https://') : undefined
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

        this.getFbdTableItemByJsonData = function (_item) {
            var fbdTableObject = apingModels.getNew("fbd-table", this.getThisPlatformString());

            var that = this;

            angular.extend(fbdTableObject, {
                leagueId: _item._links ? that.getIdByLinksObject(_item._links, 'soccerseason') : undefined,
                leagueCaption: _item.leagueCaption || undefined,
                matchday: _item.matchday || undefined,
            });

            if (_item.standing && _item.standing.constructor === Array && _item.standing.length > 0) {
                fbdTableObject.standing = [];
                angular.forEach(_item.standing, function (value, key) {
                    fbdTableObject.standing.push({
                        teamId: value._links ? that.getIdByLinksObject(value._links, 'team') : undefined,
                        away: value.away || undefined,
                        crestURI: value.crestURI ? value.crestURI.replace('http://', 'https://') : undefined,
                        draws: value.draws || undefined,
                        goalDifference: value.goalDifference || undefined,
                        goals: value.goals || undefined,
                        goalsAgainst: value.goalsAgainst || undefined,
                        home: value.home || undefined,
                        losses: value.losses || undefined,
                        playedGames: value.playedGames || undefined,
                        points: value.points || undefined,
                        position: value.position || undefined,
                        teamName: value.teamName || undefined,
                        wins: value.wins || undefined,
                    });
                });
            } else if (typeof _item.standings === 'object' && _item.standings !== null) {
                fbdTableObject.groups = [];
                angular.forEach(_item.standings, function (groupValue, groupKey) {
                    var standing = [];

                    angular.forEach(groupValue, function (value, key) {
                        standing.push({
                            teamId: value._links ? that.getIdByLinksObject(value._links, 'team') : undefined,
                            away: value.away || undefined,
                            crestURI: value.crestURI ? value.crestURI.replace('http://', 'https://') : undefined,
                            draws: value.draws || undefined,
                            goalDifference: value.goalDifference || undefined,
                            goals: value.goals || undefined,
                            goalsAgainst: value.goalsAgainst || undefined,
                            home: value.home || undefined,
                            losses: value.losses || undefined,
                            playedGames: value.playedGames || undefined,
                            points: value.points || undefined,
                            position: value.position || undefined,
                            teamName: value.teamName || undefined,
                            wins: value.wins || undefined,
                        });
                    });

                    fbdTableObject.groups.push({
                        name: groupKey,
                        standing: standing
                    })
                });
            }

            return fbdTableObject;
        };

        this.getFbdFixtureItemByJsonData = function (_item) {
            var fbdFixtureObject = apingModels.getNew("fbd-fixture", this.getThisPlatformString());

            angular.extend(fbdFixtureObject, {
                fixtureId: _item._links ? this.getIdByLinksObject(_item._links) : undefined,
                awayTeamName: _item.awayTeamName || undefined,
                date: _item.date || undefined,
                homeTeamName: _item.homeTeamName || undefined,
                matchday: _item.matchday || undefined,
                result: _item.result || undefined,
                status: _item.status || undefined,
            });

            return fbdFixtureObject;
        };

    }]);