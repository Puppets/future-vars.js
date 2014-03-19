(function() {

  // Our local messaging protocols
  var vent = new Backbone.Wreqr.EventAggregator();
  var reqres = new Backbone.Wreqr.RequestResponse();

  // The public API
  var futureVars = {

    // Returns a new Future
    promised: function( varName ) {
      return new FutureVariable( varName );
    },

    // Get the variable
    get: function( varName ) {
      return reqres.request( varName );
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

      // Share it on the vent; FutureVariables listen for this
      vent.trigger( 'published:'+varName, reqres.request(varName) );

    },

    // Resets the futureVars object
    reset: function() {
      vent.off();
      reqres.removeAllHandlers();
    }

  };

  // The promise-like object
  var FutureVariable = function( varName ) {
    this.varName = varName;
  };

  // Register a callback
  FutureVariable.prototype.then = function( cb, context ) {

    var self = this;
    context = context || window;

    // Immediately invoke it if the handler is set
    if ( reqres.hasHandler(this.varName) ) {
      // Move the cb to the back of the queue
      window.setTimeout(
        cb.call( context, reqres.request(self.varName) )
      , 0);
    }

    // Otherwise, trigger it once it's been added
    else {
      vent.once( 'published:'+this.varName, cb );
    }

  };

  window.futureVars = futureVars;

})();