var app = angular.module( 'moviematch', [
  'ngRoute',
  'moviematch.auth',
  'moviematch.selected',
  'moviematch.selectingOption',
  'moviematch.sessions',
  'moviematch.services',
  'moviematch.lobby',
  'btford.socket-io',
  'moviematch.directive',
  'moviematch.dstValidateUser'
])

.config( function ( $routeProvider, $httpProvider ) {
  $routeProvider
    .when( '/signin', {
      templateUrl: 'app/auth/signin.html',
      controller: 'AuthController'
    })
    .when( '/signup', {
      templateUrl: 'app/auth/signup.html',
      controller: 'AuthController'
    })
    .when( '/signout', {
      templateUrl: 'app/auth/signin.html',
      controller: 'AuthController'
    })
    .when( '/selectingOption/genre', {
      templateUrl: 'app/selectingOption/selectingGenre.html',
      controller: 'SelectingOptionController',
      authenticate: true
    })
    .when( '/selectingOption/movie', {
      templateUrl: 'app/selectingOption/selectingMovie.html',
      controller: 'SelectingOptionController',
      authenticate: true
    })
    .when( '/sessions', {
      templateUrl: 'app/sessions/joinsessions.html',
      controller: 'SessionsController',
      authenticate: true
    })
    .when( '/lobby', {
      templateUrl: 'app/lobby/lobby.html',
      controller: 'LobbyController',
      authenticate: true
    })

    .when( '/selected/:category', {
      templateUrl: 'app/selected/selected.html',
      controller: 'SelectedController',
      authenticate: true
    })
    .otherwise({
      redirectTo: '/lobby'
    })

    $httpProvider.interceptors.push('AttachTokens');

})

.factory('AttachTokens', function ($window) {
  var attach = {
    request: function (object) {
      var jwt = $window.localStorage.getItem('com.moviematch');
      if (jwt) {
        object.headers['x-access-token'] = jwt;
      }
      object.headers['Allow-Control-Allow-Origin'] = '*';
      return object;
    }
  };
  return attach;
})

.run(function ($rootScope, $location, Auth, Socket, Session) {
  $rootScope.$on('$routeChangeStart', function (evt, next, current) {
    Socket.removeAllListeners("voteAdded");
    if(next.$$route.originalPath === '/sessions'){
      Session.destroySession();
    }
    if (next.$$route && next.$$route.authenticate && !Auth.isAuth()) {
      $location.path('/signin');
    }
  });
});

