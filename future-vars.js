(function() {

  // Local messaging protocols
  var _vent = new Backbone.Wreqr.EventAggregator();
  var _reqres = new Backbone.Wreqr.RequestResponse();

  // The public API
  var futureVars = {

    // Returns a FutureVariable (a promise)
    promised: function( varNames, options ) {

      // If it's not an array, then return a single FutureVariable
      if ( !(varNames instanceof Array) ) {
        return futureGenerator( varNames, options );
      }

      // Otherwise, return a Promise.all for all of the FutureVariables
      else {
        var promises = [];
        forEach( varNames, function(varName) {
          promises.push( futureGenerator( varName, options) );
        });
        return Promise.all( promises );
      }

    },

    // Get the variable
    get: function( varName, options ) {
      return _reqres.request( varName, options );
    },

    isPublished: function( varName ) {
      return _reqres.hasHandler( varName );
    },

    // Publishes a variable, then shares it on the local vent
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
  function futureGenerator( varName, options ) {

    // If the variable has already been set, return an already-resolved promise
    if ( _reqres.hasHandler( varName) ) {
      return Promise.resolve( _reqres.request(varName, options) );
    }

    // Otherwise return an unresolved promise
    else {
      return new FutureVariable( varName, options );
    }

  }

  // Returns a Promise for a single variable
  function FutureVariable( varName, options ) {
    return new Promise(function(resolve) {
      _vent.on( 'published:'+varName, function() {
        resolve( _reqres.request(varName, options) );
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