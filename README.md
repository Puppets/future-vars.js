# future-vars

future-vars is a promise-like layer on top of `Wreqr.RequestResponse`.

## Motivation

Loosely coupled applications are prized for their ease of maintenance
and modularity. `future-vars` is a library that expands upon the
principles of `Wreqr.RequestResponse` to further the aim of building
applications like these.

The decision to use `RequestResponse` is a move in the right direction toward building
modular applications. It allows one to share information between the components
of your application without a direct reference to any of those components.

```js
/* within moduleTwo.js */

// Referencing another module directly is not loosely coupled
moduleTwo.prop = app.moduleOne.someProp;

// Using RequestResponse decouples your components
moduleTwo.prop = app.reqres.request( 'someProp' );
```

But `RequestResponse` doesn't solve all of the issues. The above code still requires that
moduleOne be initialized before moduleTwo, otherwise the request will return `undefined`.
This is the problem that `future-vars` solves for – it allows you to load your components
in any order.

## Getting started

Get the source by download direct ~~or through Bower~~ (not yet).

~~`bower install future-vars`~~

Include the source after `Backbone.Wreqr`.

`<script src='future-vars.js'></script>`

## API

`future-vars` is available on the global object as `futureVars`.

##### `publish( variableName, definition )`

Call this method to define a variable. The first argument is the name of the variable, the second
is its definition.

```js
// The definition can be a static value
futureVars.publish( 'myName', 'james' );

// Or a dynamic one
futureVars.publish( 'yourName', function() {
  return this.yourName;
});
```

##### `get( variableName )`

Request a variable by name. Call this when you can be certain that the variable
is already published.

```js
futureVars.get( 'groceryList' );
```

The function will return `undefined` if the variable hasn't been set.

##### `promised( variableName )`

The promised method returns a FutureVariable, which is the promise-like
interface for working with variables. They enable you to
take action only once a variable has been published.

```js
// Get a Future Variable
var futureList = futureVars.promised( 'todoList' );

// Once the list has been published the callback will execute
futureList.then( function(todoList) {
  console.log( 'I got the list:', todoList );
});

// More often than not you won't need to keep a reference of the Future
futureVars.promised( 'appState' ).then( someCb );
```

##### `FutureVariable.prototype.then( callback [, context] )`

This method allows you to register callbacks to be executed once the variable has been set. You
can optionally pass a context for the callback function.

```js
// Call someCb with the current context
futureVars.promised( 'someProperty' ).then( someCb, this );
```

If the Future Variable has already been published then the callback will be executed immediately.

