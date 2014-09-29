# Nest
**Nest** is a [Backbone.js](http://backbonejs.org/) utility that allows for nested data
(a/k/a nested module attributes) that can be accessed by `model.someNestedCollection`. It also provides a smart mechanism for listening to events on nested collections, and will continue to listen to nested data even if the underlying collection changes.

# Installation

Nest has been designed to `require()`'d by [browserify](http://browserify.org/),
and is currently only supported in that environment. To install:

```
npm install backbone-nest --save
```

# Code

## CI
Nest continuous integrations is handled by Wercker:

[![wercker status](https://app.wercker.com/status/8aa67dbf948a32aaac56180aac9798e6/s "wercker status")](https://app.wercker.com/project/bykey/8aa67dbf948a32aaac56180aac9798e6)

## Testing
Nest maintains 100% test coverage. To manually run the tests, install with with --dev (as above) and run:

```
gulp testc
```

You can generate a HTML code coverage report by appending the `--html` switch

## Issues
Issues can be opened in the [usual location](https://github.com/mbrevda/backbone-nest/issues), pull requests welcome!

# Usage
### Intializing
Using Nest requires it to be included anywhere in the application:

```js
require('backbone-nest')
```

Nest uses a simple paradigm to determine which data should be nested. When a model is passed data, it will instinctively remove a key named `nested`. It will them loop through all of `nested`'s properties, and if it finds a matching nested collection, it will `set()` it with that data.


### JSON Objects

To illustrate, here is a sample JSON object:

```js
{
    foo: 'bar',
    id: 2,
    nested: {
        capitals: [
            {usa: 'dc'},
            {uk: 'london'}
        ]
    }
}

```

In this case, the model will have an attribute of `foo`, as well as a nested collection `capitals`, which will, itself, have two models. The `capitals` collection can be accessed simply like:

```js
model.capitals
```

`capitals` can be accessed fluently like any standard Backbone.Collection (which is what it is). So to access the models:

```js
model.capitals.at(0)
```
### Models
Collections should be setup with the model property. Said model should set nested data in the `initialize()` method. The model and nested collection would look like:


```js
var nestedCollection = Backbone.Collection.extend({/* ... */})

var Model = Backbone.Model.extend({
    initialize: function(){
        this.nest('nestedColleciton', new nestedCollection())    
    }
})
```

And the collection:

```js
var someColleciton = Backbone.Collection.extend({
    model: Model
})
```

This leads to a setup of Collection -> Model -> Collection (and so on if desired)

### Nested events
Events will bubble up to the parent collection. Event are listened to on the heights possible element, and hence even if the nested collection is changed/updated/reset the listener stays instant. Here is how to listen. Notice how events are namespaces with the name of the nested collection:

```js
var Model = Backbone.Model.extend({
    initialize: function(){
        this.nest('nestedColleciton', new nestedCollection())    

        // listen for adds
        this.on('nestedColleciton.add', function(){})
        
        // listen for change
        this.on('nestedColleciton.change', function(){})
    }
})
```

```js
var someColleciton = Backbone.Collection.extend({
    model: Model,
    initialize: function(){
        this.on('nestedColleciton.add', function(){})
    }
})
```

