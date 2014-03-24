# future-vars.js

future-vars is an interface for working with promises on top of `Wreqr.RequestResponse`.

## Motivation

Loosely coupled applications are prized for their modularity and ease of maintenance.
`future-vars` is a library that builds on the
principles of `Wreqr.RequestResponse` to further the aim of building
applications like these.

`RequestResponse` is a good start to building modular applications.
It allows one to share information between the components
of an application without a direct reference to any one of those components.

```js
/* within moduleTwo.js */

// Referencing another module directly is not loosely coupled
moduleTwo.prop = app.moduleOne.someProp;

// Using RequestResponse decouples your components
moduleTwo.prop = app.reqres.request( 'someProp' );
```

But using `RequestResponse` still leaves you with the issue of dependencies. The above code
requires that moduleOne be initialized before moduleTwo, otherwise the request will return `undefined`.
This is one problem that `future-vars` solves for – it allows you to load your components
in any order.

More generally, though, it lets one specify actions to be taken once variables become
available in an application.

## Getting started

Get the source by download direct or through Bower.

`bower install future-vars`

Include the source after `Backbone.Wreqr`.

`<script src='future-vars.js'></script>`

_**Note:** It is recommended that you use ES6 promises with `future-vars`.
[Jake Archibald's polyfill](https://github.com/jakearchibald/es6-promise) is my polyfill of choice
when legacy browsers are a consideration._

## API

The future-vars API is available on the global object as `futureVars`.

##### `publish( variableName, definition )`

Call this method to define a variable. The first argument is the name of the variable, the second
is its definition. A fulfilled FutureVariable for this variable is returned from this method.

```js
// The definition can be a static value
futureVars.publish( 'myName', 'james' );

// Or a dynamic one
futureVars.publish( 'yourName', function() {
  return this.yourName;
});
```

If a function is defined, any arguments passed to the request to get the variable will be passed along
to that function. Refer to the `get` and `promised` sections below for examples.

##### `isPublished( variableName )`

Determine whether or not a variable has been published. Returns a Boolean.

##### `get( variableName [, options] )`

Request a variable by name. Call this when you can be certain that the variable
is already published.

```js
futureVars.get( 'groceryList' );
```

This method will return `undefined` if the variable hasn't been published.

If you pass a second argument it will be passed to the variable definition, if it
happens to be a function.

```js
futureVars.publish( 'fullName', function(options) {
  return options.firstName + ' ' + options.lastName;
});

// Returns 'Ada Lovelace'
futureVars.get('userName', { firstName:'Ada', lastName:'Lovelace');
```

##### `promised( vars [, options] )`

The promised method returns a `FutureVariable`, which is a promise that resolves
once each of its arguments have been published. FutureVariables are never rejected.

This can either be a single variable or an array of variables.

```js
// Get a FutureVariable
var futureList = futureVars.promised( 'todoList' );

// Get a FutureVariable that fulfills once the array of variables are fulfilled
var futureNames = futureVars.promised( ['myName', 'yourName', 'hisName'] );
```

As with the `get` method, if you pass a second argument it will be passed to the variable
definition if it's a function.

### Examples

You can work with `FutureVariable`s like any other promise. For an in-depth guide to ES6 Promises I
encourage you to read the [HTML5 article on them.](http://www.html5rocks.com/en/tutorials/es6/promises/)

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
```

#### Multiple FutureVariables

When you request multiple FutureVariables the callback is an array of each variable in order.

```js
var futureNames = futureVars.promised( 'his', 'hers', 'dogs' );

futureVars.publish( 'his', 'james' );
futureVars.publish( 'hers', 'mora' );
futureVars.publish( 'dogs', 'wilbur' );

futureNames.then(function(namesArray) {
  // Logs an array: ['james', 'mora', 'wilbur']
  console.log( namesArray );
});
```

#### Quick References

Most of the time you won't need to store a reference to the `FutureVariable`. You can instead choose to
set things up all at once.

```js
futureVars.promised( 'myName' ).then( function(myName){
   // Do something
});
```


