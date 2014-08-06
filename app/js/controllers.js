'use strict';

/* Controllers */

angular.module('myApp.controllers', [])
	.controller('HomeController', ['$scope', '$location', function($scope, $location) {
        $scope.search = function() {
            $location.path('/player/'+$scope.accountId);
        };
	}])
	.controller('StatsController', ['$scope', '$routeParams', '$http', '$location', function($scope, $routeParams, $http, $location) {
		var playerId = $routeParams.playerId;
        var heroData;

        $scope.matchData = [];
        $scope.dirMatch = function(matchId) {
            console.log(matchId);
            $location.path('/match/'+matchId);
        };

		$http.get('http://localhost:3000/player-summary/'+playerId).then(function(res) {
            console.log('player summary', res.data);
            $scope.player = res.data.response.players[0];
        }, function(err) {
            console.log(err);
        });

        $http.get('http://localhost:3000/match-history/'+playerId).then(function(res) {
            console.log('matches', res.data);
            $scope.matches = res.data;
        }, function(err) {
            console.log(err);
        });

        $http.get('http://localhost:3000/match-history/test/'+playerId).then(function(res) {
            console.log('test matches', res.data);
        }, function(err) {
            console.log(err);
        });

        $scope.$watch('matches', function() {
            if($scope.matches) {
                $scope.matches.result.matches.forEach(function(match) {
                    for(var i = 0; i < match.players.length; i++) {
                        if(match.players[i].account_id == playerId) {
                            $scope.matchData.push({
                                matchId: match.match_id,
                                heroId: match.players[i].hero_id
                            });
                            break;
                        }
                    }
                });

                $scope.matchData.forEach(function(match) {
                    $http.get('http://localhost:3000/hero/'+match.heroId).then(function(res) {
                        match.heroName = res.data.heroData.name.split('npc_dota_hero_')[1];
                        match.heroPortrait = "http://cdn.dota2.com/apps/dota2/images/heroes/"+match.heroName+"_sb.png";
                        match.fixedName = res.data.heroName;
                    }, function(err) {
                        console.log(err);
                    });
                    $http.get('http://localhost:3000/match-details/'+match.matchId).then(function(res) {
                        for (var i = 0; i < res.data.result.players.length; i++) {
                            if (res.data.result.players[i].account_id == playerId) {
                                match.kills = res.data.result.players[i].kills;
                                match.assists = res.data.result.players[i].assists;
                                match.deaths = res.data.result.players[i].deaths;
                                var date = moment.unix(res.data.result.start_time);
                                match.date = date.format("MMM D, h:mm A");

                                if (res.data.result.players[i].player_slot < 5 && res.data.result.radiant_win === true) { //if radiant
                                    match.result = 'Win';
                                } else if (res.data.result.players[i].player_slot >= 5 && res.data.result.radiant_win === false) {
                                    match.result = 'Win';
                                } else {
                                    match.result = 'Lose';
                                }
                                break;
                            }
                        }
                        console.log(res.data);
                    });
                });
            }
        });

		$scope.test = $routeParams;
	}])
    .controller('MatchController', ['$scope', '$routeParams', '$http', function($scope, $routeParams, $http) {
        var matchId = $routeParams.matchId;
        $scope.teamData = [
            {
                team: 'Radiant',
                data: undefined
            },
            {
                team: 'Dire',
                data: undefined
            }
        ];

        $http.get('http://localhost:3000/match-details/'+matchId).then(function(res) {
            console.log(res.data);
            var radiant = [];
            var dire = [];
            res.data.result.players.forEach(function(player) {
                if (player.player_slot < 5) {
                    radiant.push(player);
                } else {
                    dire.push(player);
                }
            });
            $scope.radiant = radiant;
            $scope.dire = dire;
        });

        $scope.$watch('radiant', function() {
            if ($scope.radiant) {
                console.log('radiant loaded', $scope.radiant);
                $scope.radiant.forEach(function(player) {
                    //grab hero portrait and name
                    $http.get('http://localhost:3000/hero/'+player.hero_id).then(function(res) {
                        player.heroName = res.data.heroData.name.split('npc_dota_hero_')[1];
                        player.heroPortrait = "http://cdn.dota2.com/apps/dota2/images/heroes/"+player.heroName+"_sb.png";
                        player.fixedName = res.data.heroName;
                    }, function(err) {
                        console.log(err);
                    });
                    //grab player info
                    $http.get('http://localhost:3000/player-summary/'+player.account_id).then(function(res) {
                        console.log('player summary', res.data.response.players[0]);
                        player.player = res.data.response.players[0];
                    }, function(err) {
                        console.log(err);
                    });
                });
                $scope.teamData[0].data = $scope.radiant;
            }
        });

        $scope.$watch('dire', function() {
            if ($scope.dire) {
                console.log('dire loaded', $scope.dire);
                $scope.dire.forEach(function(player) {
                    //grab hero portrait and name
                    $http.get('http://localhost:3000/hero/'+player.hero_id).then(function(res) {
                        player.heroName = res.data.heroData.name.split('npc_dota_hero_')[1];
                        player.heroPortrait = "http://cdn.dota2.com/apps/dota2/images/heroes/"+player.heroName+"_sb.png";
                        player.fixedName = res.data.heroName;
                    }, function(err) {
                        console.log(err);
                    });
                    //grab player info
                    $http.get('http://localhost:3000/player-summary/'+player.account_id).then(function(res) {
                        console.log('player summary', res.data.response.players[0]);
                        player.player = res.data.response.players[0];
                    }, function(err) {
                        console.log(err);
                    });
                });
                $scope.teamData[1].data = $scope.dire;
            }
        });
    }])
    .controller('LoginController', ['$scope', function($scope) {

    }]);
