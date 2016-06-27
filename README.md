[logo]: http://aping.io/logo/320/aping-plugin.png "apiNG Plugin"
![apiNG][logo]

[![Join the chat at https://gitter.im/JohnnyTheTank/apiNG](https://img.shields.io/badge/GITTER-join%20chat-green.svg)](https://gitter.im/JohnnyTheTank/apiNG?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge)
[![npm version](https://badge.fury.io/js/aping-plugin-footballdata.png)](https://badge.fury.io/js/aping-plugin-footballdata)
[![Bower version](https://badge.fury.io/bo/apiNG-plugin-footballdata.png)](https://badge.fury.io/bo/apiNG-plugin-footballdata)

**_apiNG-plugin-footballdata_** is a [football-data.org API](http://api.football-data.org/index) plugin for [**apiNG**](https://github.com/JohnnyTheTank/apiNG).

# Information
* **Supported apiNG models: `fbd-team`, `fbd-league`, `fbd-player`, `fbd-fixture`, `fbd-table`**
* This plugin supports the [`get-native-data` parameter](https://aping.readme.io/docs/advanced#parameters)
* This plugin needs an [access token](#2-access-token) :warning:
* Used promise library: [angular-footballdata-api-factory](https://github.com/JohnnyTheTank/angular-footballdata-api-factory) _(included in distribution files)_
* **[Demo on plnkr](http://plnkr.co/edit/a8Uj8V)**

# Documentation

1. [INSTALLATION](#1-installation)
    1. Get file
    2. Include file
    3. Add dependency
    4. Add plugin
2. [ACCESS TOKEN](#2-access-token)
    1. Generate your `access_token`
    2. Insert your `access_token` into `aping-config.js`
3. [USAGE](#3-usage)
    1. Models
    2. Request


## 1. INSTALLATION

### I. Get file
Install via either [bower](http://bower.io/), [npm](https://www.npmjs.com/), CDN (jsDelivr) or downloaded files:

* `bower install apiNG-plugin-footballdata --save`
* `npm install aping-plugin-footballdata --save`
* use [CDN file](https://www.jsdelivr.com/projects/aping.plugin-footballdata)
* download [apiNG-plugin-footballdata.zip](https://github.com/JohnnyTheTank/apiNG-plugin-footballdata/zipball/master)

### II. Include file
Include `aping-plugin-footballdata.min.js` in your apiNG application

```html
<!-- when using bower -->
<script src="bower_components/apiNG-plugin-footballdata/dist/aping-plugin-footballdata.min.js"></script>

<!-- when using npm -->
<script src="node_modules/aping-plugin-footballdata/dist/aping-plugin-footballdata.min.js"></script>

<!-- when using cdn file -->
<script src="//cdn.jsdelivr.net/aping.plugin-footballdata/latest/aping-plugin-footballdata.min.js"></script>

<!-- when using downloaded files -->
<script src="aping-plugin-footballdata.min.js"></script>
```

### III. Add dependency
Add the module `jtt_aping_footballdata` as a dependency to your app module:
```js
angular.module('app', ['jtt_aping', 'jtt_aping_footballdata']);
```

### IV. Add the plugin
Add the plugin's directive `aping-footballdata="[]"` to your apiNG directive and [configure your requests](#ii-requests)
```html
<aping
    template-url="templates/fixture.html"
    model="fbd-fixture"
    aping-footballdata="[{'leagueId':394, 'matchday':5}]">
</aping>
```

## 2. ACCESS TOKEN

### I. Generate your `api_key`
- Open [api.football-data.org/register](http://api.football-data.org/register)
- Type in your name, email address and the usage-question
- Receive your `api_key` via email

### II. Insert your `api_key` into `aping-config.js`
Create and open `js/apiNG/aping-config.js` in your application folder. It should be look like this snippet:
```js
angular.module('jtt_aping').config(['$provide', function ($provide) {
    $provide.value("apingDefaultSettings", {
        apingApiKeys : {
            footballdata: [
                {'api_key':'<YOUR_FOOTBALLDATA_API_KEY>'}
            ],
            //...
        }
    });
}]);
```

:warning: Replace `<YOUR_FOOTBALLDATA_API_KEY>` with your footballdata `api_key`

## 3. USAGE

### I. Models
Supported apiNG models

|  model   | content | support |
|----------|---------|---------|
| `fbd-team` | **teams** from football-data.org | full    |
| `fbd-league`  | **leagues** from football-data.org | full    |
| `fbd-player`  | **players** from football-data.org  | full    |
| `fbd-fixture`  | **fixtures** from football-data.org  | full    |
| `fbd-table`  | **tables** from football-data.org  | full    |

**support:**
* full: _the source platform provides a full list with usable results_ <br>
* partly: _the source platfrom provides just partly usable results_


### II. Requests
Every **apiNG plugin** expects an array of **requests** as html attribute.

#### Request Team by teamId
|  parameter  | sample | description | optional |
|----------|---------|---------|---------|---------|
| **`teamId`** | `5` | footballdata-org id of the team | no |

Samples:
* `[{'teamId':'5'}]`
* `[{'teamId':'18'}, {'teamId':'7'}]`

#### Request Teams by leagueId
|  parameter  | sample | description | optional |
|----------|---------|---------|---------|
| **`leagueId`** | `394` | footballdata-org id of the league | no |

Samples:
* `[{'leagueId':'394'}]`
* `[{'leagueId':'398'}, {'leagueId':'400'}]`

#### Request Players by teamId
|  parameter  | sample | description | optional |
|----------|---------|---------|---------|
| **`teamId`** | `5` | footballdata-org id of the team | no |

Samples:
* `[{'teamId':'5'}]`
* `[{'teamId':'18'}, {'teamId':'7'}]`

#### Request League by id
|  parameter  | sample | description | optional |
|----------|---------|---------|---------|
| **`leagueId`** | `394` | footballdata-org id of the league | no |

Samples:
* `[{'leagueId':'394'}]`
* `[{'leagueId':'398'}, {'leagueId':'400'}]`

#### Request Leagues by year
|  parameter  | sample | description | optional |
|----------|---------|---------|---------|
| **`year`** | `2015` | year of the league. use `$CURRENT` for the current year | no |

Samples:
* `[{'year':'2015'}]`
* `[{'year':'$CURRENT'}, {'year':'2013'}]`

#### Request Table by leagueId
|  parameter  | sample | description | optional |
|----------|---------|---------|---------|
| **`leagueId`** | `394` | footballdata-org id of the league | no |
| **`matchday`** | `3` | The current/last matchday is taken per default | yes |

Samples:
* `[{'leagueId':'394', 'matchday':4}]`
* `[{'leagueId':'398'}, {'leagueId':'400'}]`

#### Request Fixture by fixtureId
|  parameter  | sample | description | optional |
|----------|---------|---------|---------|
| **`fixtureId`** | `131257` | footballdata-org id of the fixture | no |

Samples:
* `[{'fixtureId':'131257'}]`
* `[{'fixtureId':'131096'}, {'fixtureId':'131089'}]`

#### Request Fixtures by leagueId
|  parameter  | sample | description | optional |
|----------|---------|---------|---------|
| **`leagueId`** | `394` | footballdata-org id of the league | no |
| **`matchday`** | `3` | The current/last matchday is taken per default | yes |
| **`timeFrame`** | `p7` | The value of the timeFrame argument must start with either 'p' for past or 'n' for next. It is followed by a number in the range 1-99.  | yes |

Samples:
* `[{'leagueId':'394', 'matchday':4}]`
* `[{'leagueId':'398'}, {'leagueId':'400'}]`

#### Request Fixtures by timeFrame
|  parameter  | sample | description | optional |
|----------|---------|---------|---------|
| **`timeFrame`** | `p7` | The value of the timeFrame argument must start with either 'p' for past or 'n' for next. It is followed by a number in the range 1-99.  | no |

Sample:
* `[{'timeFrame':'p7'}]`

#### Request Fixtures by teamId
|  parameter  | sample | description | optional |
|----------|---------|---------|---------|
| **`teamId`** | `394` | footballdata-org id of the team | no |
| **`timeFrame`** | `p7` | The value of the timeFrame argument must start with either 'p' for past or 'n' for next. It is followed by a number in the range 1-99.  | yes |
| **`venue`** | `home` | Valid values: `home` and `away`. Default is unset. | yes |

Samples:
* `[{'teamId':'5', 'timeFrame':'p8', 'venue':'home'}]`
* `[{'teamId':'18'}, {'teamId':'7'}]`

# Licence
MIT

