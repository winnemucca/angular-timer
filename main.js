// angular.module('Demo', [])
// 	.factory(
//             "timer",
//             function( $timeout ) {
//                 // I provide a simple wrapper around the core $timeout that allows for
//                 // the timer to be easily reset.
//                 function Timer( callback, duration, invokeApply ) {
//                     // Store properties.
//                     this._callback = callback;
//                     this._duration = ( duration || 0 );
//                     this._invokeApply = ( invokeApply !== false );
//                     // I hold the $timeout promise. This will only be non-null when the
//                     // timer is actively counting down to callback invocation.
//                     this._timer = null;
//                 }
//                 // Define the instance methods.
//                 Timer.prototype = {
//                     // Set constructor to help with instanceof operations.
//                     constructor: Timer,
//                     // I determine if the timer is currently counting down.
//                     isActive: function() {
//                         return( !! this._timer );
//                     },
//                     // I stop (if it is running) and then start the timer again.
//                     restart: function() {
//                         this.stop();
//                         this.start();
//                     },
//                     // I start the timer, which will invoke the callback upon timeout.
//                     start: function() {
//                         var self = this;
//                         // NOTE: Instead of passing the callback directly to the timeout,
//                         // we're going to wrap it in an anonymous function so we can set
//                         // the enable flag. We need to do this approach, rather than
//                         // binding to the .then() event since the .then() will initiate a
//                         // digest, which the user may not want.
//                         this._timer = $timeout(
//                             function handleTimeoutResolve() {
//                                 try {
//                                     self._callback.call( null );
//                                 } finally {
//                                     self = self._timer = null;
//                                 }
//                             },
//                             this._duration,
//                             this._invokeApply
//                         );
//                     },
//                     // I stop the current timer, if it is running, which will prevent the
//                     // callback from being invoked.
//                     stop: function() {
//                     	console.log('stopped')
//                         $timeout.cancel( this._timer );
//                         this._timer = false;
//                     },
//                     // I clean up the internal object references to help garbage
//                     // collection (hopefully).
//                     teardown: function() {
//                     	console.log('stoped')
//                         this.stop();
//                         this._callback = null;
//                         this._duration = null;
//                         this._invokeApply = null;
//                         this._timer = null;
//                     }
//                 };
//                 // Create a factory that will call the constructor. This will simplify
//                 // the calling context.
//                 function timerFactory( callback, duration, invokeApply ) {
//                     return( new Timer( callback, duration, invokeApply ) );
//                 }
//                 // Store the actual constructor as a factory property so that it is still
//                 // accessible if anyone wants to use it directly.
//                 timerFactory.Timer = Timer;
//                 // Set up some time-based constants to help readability of code.
//                 timerFactory.ONE_SECOND = ( 1 * 1000 );
//                 timerFactory.TWO_SECONDS = ( 2 * 1000 );
//                 timerFactory.THREE_SECONDS = ( 3 * 1000 );
//                 timerFactory.FOUR_SECONDS = ( 4 * 1000 );
//                 timerFactory.FIVE_SECONDS = ( 5 * 1000 );
//                 // Return the factory.
//                 return( timerFactory );
//             }
//         )

//   	.controller(
//             "AppController",
//             function( $scope, timer ) {
//                 // I am a timer that will invoke the given callback once the timer has
//                 // finished. The timer can be reset at any time.
//                 // --
//                 // NOTE: Is a thin wrapper around $timeout() which will trigger a $digest
//                 // when the callback is invoked.
//                 var logClickTimer = timer( logClick, timer.TWO_SECONDS );
//                 $scope.logExecutedAt = null;
//                 // When the current scope is destroyed, we want to make sure to stop
//                 // the current timer (if it's still running). And, give it a chance to
//                 // clean up its own internal memory structures.
//                 $scope.$on(
//                     "$destroy",
//                     function() {
//                         logClickTimer.teardown();
//                     }
//                 );
//                 // ---
//                 // PUBLIC METHODS.
//                 // ---
//                 // I handle the click event. Instead of logging the click right away,
//                 // we're going to throttle the click through a timer.
//                 $scope.handleClick = function() {
//                 	console.log('time')
//                     $scope.logExecutedAt = null;
//                     logClickTimer.restart();
//                 };
//                 // ---
//                 // PRIVATE METHODS.
//                 // ---
//                 // I log the fact that the click happened at this point in time.
//                 function logClick() {
//                     $scope.logExecutedAt = new Date();
//                 }
//             }
//         );

angular.module('Demo', [])
	.controller('AppController', function($scope, $timeout) {
	    $scope.counter = 10;
	    var mytimeout = null; // the current timeoutID
	    // actual timer method, counts down every second, stops on zero
	    $scope.onTimeout = function() {
	        if($scope.counter ===  0) {
	            $scope.$broadcast('timer-stopped', 0);
	            $timeout.cancel(mytimeout);
	            return;
	        }
	        $scope.counter--;
	        mytimeout = $timeout($scope.onTimeout, 1000);
	    };

	    $scope.startTimer = function() {
	        mytimeout = $timeout($scope.onTimeout, 1000);
	    };

	    // stops and resets the current timer
	    $scope.stopTimer = function() {
	        $scope.$broadcast('timer-stopped', $scope.counter);
	        $scope.counter = 10;
	        // timeout.cancel comes with $timeout
	        $timeout.cancel(mytimeout);
	    };

	    // triggered, when the timer stops, you can do something here, maybe show a visual indicator or vibrate the device
	    $scope.$on('timer-stopped', function(event, remaining) {
	        if(remaining === 0) {
	            console.log('your time ran out!');
	        }
	    });
	});