angular.module( 'moviematch.selectingOption', [] )


.controller( 'SelectingOptionController', function( $scope, Votes, Session, Socket, $location, Auth, $routeParams, FetchMovies, $timeout, FetchGenres ) {

  var category = $routeParams.category;
  var seconds = 5;

  Session.getSession()
  .then( function( session ) {
    $scope.session = session;
  });


  $scope.vote = function(option){
    Votes.addVote($scope.session.sessionName, option.id);
  };

  var tallyVotes = function(){
   var winnerArr = Votes.tallyVotes($scope.options);
    if( winnerArr.length === 1 ) { //when there's a winner
      Session.setSelectedOption(winnerArr[0]);
     $location.path('/selected/'+category);
    } else { //when there's a tie
      $scope.options = winnerArr;
      //if tie twice in a row, we want to remove an option
      setTimer(seconds);
    }
  }

  var setTimer = function(seconds){
    $scope.counter = seconds;
    $scope.timer = function(seconds){
      var countdown = $timeout($scope.timer,1000);
      $scope.counter -= 1;
      if( $scope.counter === 0 ){
        //when the timer reaches zero, make it stop
        $timeout.cancel(countdown);
        tallyVotes();
      }
    }
    $scope.timer();
  };
  
  setTimer(seconds);

  if(category === 'genre'){//fetching genres 
    FetchGenres.getAllGenres()
      .then(function(data){
        data.forEach(function(option){
          option.votes = 0; 
        });
        $scope.options = data;

      });

  } else {//fetching movies is synchronous because we already made the api call 
    var data = FetchMovies.getMoviesArr();
    data.forEach(function(option){
        option.votes = 0; 
    });
    $scope.options = data;
  }

  //this will update our d3 animations eventually 
  Socket.on( 'voteAdded', function(vote) {
    console.log('added da vote!', vote);
    //update our array of options to reflect the new vote
    $scope.options = Votes.receiveVote(vote.id, $scope.options);
  });


})