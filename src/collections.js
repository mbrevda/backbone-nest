var Backbone = require('backbone'),
    _ = require('underscore')
    
_.extend(Backbone.Collection.prototype, {
    // fetch data for _nested object synchronously
    fetchAll: function(data) {
        return Backbone.$.when(this.fetch()).then(function(){
            var defereds = []

            this.each(function(model){
                _.each(model._nested, function(nestedCollection) {
                    defereds.push(nestedCollection.fetch())
                })
            })

            return defereds
        }.bind(this))
    },
    setAll: function(data) {
        if (!data) {
            return true
        }

        // set current collection; nested data will be filltered out
        // by .parse()
        this.set(data)

        // pass nested data to collecitons
        this.each(function(model) {
            var id = model.get('id')
            var item = _.find(data, function(item){
                return item.id == id
            })
            var nested = item.nested

            if (nested) {
                model.setAll(nested)
            }
        })
    }
})
