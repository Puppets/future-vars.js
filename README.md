# future-vars.js

future-vars is an interface for working with promises with `Wreqr.RequestResponse`.

## Motivation

Loosely coupled applications are prized for their ease of maintenance
and modularity. `future-vars` is a library that expands upon the
principles of `Wreqr.RequestResponse` to further the aim of building
applications like these.

The decision to use `RequestResponse` is a move in the right direction toward building
modular applications. It allows one to share information between the components
of an application without a direct reference to any one of those components.

```js
/* within moduleTwo.js */

// Referencing another module directly is not loosely coupled
moduleTwo.prop = app.moduleOne.someProp;

// Using RequestResponse decouples your components
moduleTwo.prop = app.reqres.request( 'someProp' );
```

But using `RequestResponse` still leaves the issue of dependency order. The above code still
requires that moduleOne be initialized before moduleTwo, otherwise the request will return `undefined`.
This is one problem that `future-vars` solves for – it allows you to load your components
in any order.

More generally, though, it lets one specify actions to be taken once variables become
available in an application.

## Getting started

Get the source by download direct ~~or through Bower~~ (not yet).

`~~bower install future-vars~~`

Include the source after `Backbone.Wreqr`.

`<script src='future-vars.js'></script>`

**Note:** `future-vars` requires ES6-style promises. [Jake Archibald's polyfill](https://github.com/jakearchibald/es6-promise) is recommended for older browsers.

## API

The future-vars API is available on the global object as `futureVars`.

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

##### `isPublished( variableName )`

Determine whether or not a variable has been published. Returns a Boolean.

##### `get( variableName )`

Request a variable by name. Call this when you can be certain that the variable
is already published.

```js
futureVars.get( 'groceryList' );
```

The function will return `undefined` if the variable hasn't been set.

##### `promised( varOne [, varTwo] [, varN]  )`

The promised method returns a `FutureVariable`, which is a promise that resolves
once each of its arguments have been published. FutureVariables are never rejected.

```js
// Get a FutureVariable
var futureList = futureVars.promised( 'todoList' );
```

### Examples

You can work with `FutureVariable`s like any other promise. For an in-depth guide to ES6 Promises I
encourage you to read the [HTML5 article on the matter.](http://www.html5rocks.com/en/tutorials/es6/promises/)

For this library the most useful feature of promises is their `then` method. The first argument of `then`
is called once the `FutureVariable` resolves.

#### A single FutureVariable

When working with a single FutureVariable, the first argument of the callback will be the value
of the FutureVariable

```js
// Get a FutureVariable
var futureList = futureVars.promised( 'todoList' );

// Once the list has been published the callback will execute
futureList.then( function(todoList) {
  console.log( 'I got the list:', todoList );
});

futureVars.publish( 'todoList', ['eat', 'sleep'] );

// More often than not you won't need to keep a reference of the Future
futureVars.promised( 'appState' ).then( someCb );

// Call someCb with the current context
futureVars.promised( 'someProperty' ).then( someCb, this );
```

#### Multiple FutureVariables

When you request multiple FutureVariables the callback is an array of each variable in order.

```js
var futureNames = futureVars.promised( 'his', 'hers', 'dogs' );

futureVars.publish( 'his', 'james' );
futureVars.publish( 'hers', 'mora' );
futureVars.publish( 'dogs', 'wilbur' );

futureNames.then(function(namesArr) {
  // Logs an array: ['james', 'mora', 'wilbur']
  console.log( namesArray );
});
```

#### Quick References

Most of the time you won't need to store a reference to the `FutureVariable`. You can just
set things up all at once.

```js
futureVars.promised( 'myName' ).then( function(myName){
   // Do something
});
```


