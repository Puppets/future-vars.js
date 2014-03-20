(function() {

  // Local messaging protocols
  var vent = new Backbone.Wreqr.EventAggregator();
  var reqres = new Backbone.Wreqr.RequestResponse();

  // The public API
  var futureVars = {

    // Returns a FutureVariable (a promise)
    promised: function() {
      return futureGenerator.apply(undefined, arguments);
    },

    // Get the variable
    get: function( varName ) {
      return reqres.request( varName );
    },

    isPublished: function( varName ) {
      return reqres.hasHandler( varName );
    },

    // Publishes a variable, sharing it on the vent
    publish: function( varName, definition, context ) {

      // Publish a dynamic variable
      if ( typeof definition === 'function' ) {
        reqres.setHandler( varName, definition, context );
      }

      // Or a static one
      else {
        reqres.setHandler( varName, function() {
          return definition;
        });
      }
      vent.on( 'published:'+varName, function() {
        console.log('resolved');
      });

      // Share it on the vent; FutureVariables are resolved by this
      vent.trigger( 'published:'+varName, reqres.request(varName) );

    },

    // Resets the futureVars object
    reset: function() {
      vent.off();
      reqres.removeAllHandlers();
    }

  };

  // Generates our promise to return to the user
  function futureGenerator() {

    var args = Array.prototype.slice.call( arguments, 0 );

    // If there's only a single argument, return a single FutureVariable
    if (args.length === 1) {
      return futureVariable( args[0] );
    }

    // Otherwise return a grouped promise
    else {
      var promises = [];
      forEach( arguments, function(arg) {
        promises.push( futureVariable(arg) );
      });
      return Promise.all( promises );
    }
  }

  // Returns a promise for a single variable
  function futureVariable( varName ) {
    return new Promise(function(resolve) {
      console.log('lalala');
      vent.on( 'published:'+varName, resolve );
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