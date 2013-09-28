backbone-getset [![Build Status](https://travis-ci.org/numbers1311407/backbone-getset.png)](http://travis-ci.org/numbers1311407/backbone-getset)
===

Getters & setters for your Backbone models


Usage
===

Write getters and setters to filter the `get` and `set` methods of Backbone
models.  Such functions can be used for all sorts of things, from providing
virtual attributes:

   var a = new Backbone.Model({firstName: "bob", lastName: "dobbs"})
   a.getters.fullName = function () { 
     return [this.get("firstName"), this.get("lastName")].join(' ')
   }
   a.get("fullName") //=> "bob dobbs"

... to mutating data during set:

   a.setters.value = function (v) { return Math.floor(v) }
   a.set("value", 12.34)
   a.get("value") //=> 12 (a.attributes.value is now 12)
  
... to decorating data in a get:

   a.getters.value = function (v) { 
     return "$" + this.attributes.value.toFixed(2)
   }
   a.get("value") //=> $12.00


The `toJSON` is also extended to make use of getters if given the option,
so given the above `a`:

   a.toJSON({getters: true})
   // { 
   //   firstName: "bob",
   //   lastName: "dobbs",
   //   fullName: "bob dobbs",
   //   value: "$12.00" 
   // }


Getters & setters are stored on the `getters` and `setters` property of the
prototype.  They are inherited, but merged with the parent prototype such
that all child Models have their own copy.  This means that they can be
added directly, as above, but more commonly would be added in the model
definition.  


    var A = Backbone.Model.extend({
      getters: {
        name: function () {
          return "A"
        },
        type: function () {
          return "thing"
        }
      }
    })

    var B = A.extend({
      getters: {
        name: function () {
          return "B"
        }
      }
    })

    var a = new A(), b = new B()
    a.get("name") //=> "A"
    b.get("name") //=> "B"
    b.get("type") //=> "thing"



Installation and setup
===

    bower install backbone-getset

Or

    npm install backbone-getset


Then require the module in your app.  AMD and CommonJS/node are supported,
as is a standard script include.

Note that the module ***will monkeypatch and override*** several methods of
`Backbone.Model`.  As such, care must be taken to not break functionality
of the module by subsequently overriding those methods in your own code.
If, for example, you need to override `get`, be sure to call the prototype
method as well:

    MyModel.prototype.get = function (attr) {
      var retv = Backbone.Model.prototype.get.call(this, attr)

      // do stuff

      return retv
    }
