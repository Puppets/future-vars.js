(function() {

  // Local messaging protocols
  var _vent = new Backbone.Wreqr.EventAggregator();
  var _reqres = new Backbone.Wreqr.RequestResponse();

  // The public API
  var futureVars = {

    // Returns a FutureVariable (a promise)
    promised: function() {

      // If it's not an array, then return a single FutureVariable
      if ( !(varNames instanceof Array) ) {
        return futureGenerator.apply(undefined, args);
      }

      // Otherwise, return a Promise.all for all of the FutureVariables
      else {
        var promises = [];
        var newArgs;
        forEach( varNames, function(arg) {
          newArgs = args.slice(0);
          newArgs[ 0 ] = arg;
          promises.push( futureGenerator.apply(undefined, newArgs) );
        });
        return Promise.all( promises );
      }

    },

    // Get the variable
    get: function() {
      return _reqres.request.apply( _reqres, arguments );
    },

    isPublished: function( varName ) {
      return _reqres.hasHandler( varName );
    },

    // Publishes a variable, sharing it on the vent
    publish: function( varName, definition, context ) {

      // Publish a dynamic variable
      if ( typeof definition === 'function' ) {
        _reqres.setHandler( varName, definition, context );
      }
      // Or a static one
      else {
        _reqres.setHandler( varName, function() {
          return definition;
        });
      }

      // Share it on the vent; FutureVariables are resolved by this
      _vent.trigger( 'published:'+varName );

    },

    // Resets the futureVars object
    reset: function() {
      _vent.off();
      _reqres.removeAllHandlers();
    }

  };

  // Generates our promise to return to the user
  function futureGenerator() {

    var args = Array.prototype.slice.call( arguments, 0 );
    var varName = args[ 0 ];

    // If the variable has already been set, return an already-resolved promise
    if ( _reqres.hasHandler(varName) ) {
      return Promise.resolve(  )
    }

    // Otherwise return an unresolved promise
    else {
      return new futureVariable.apply( undefined, args )
    }

    

  }

  // Returns a promise for a single variable
  function futureVariable( varName ) {
    var args = Array.prototype.slice.call( arguments, 0 );
    console.log( 'Received some args', args );
    return new Promise(function(resolve) {
      _vent.on( 'published:'+varName, function() {
        console.log( 'These are the args down here', args );
        resolve( _reqres.request.apply(_reqres, args) );
      });
    });
  }

  // Executes a function for each item in the array
  function forEach( arr, fn, context ) {
    var i = 0;
    for (i; i<arr.length; i++) {
      fn.call( context, arr[i], i );
    }
  }

  window.futureVars = futureVars;

})();