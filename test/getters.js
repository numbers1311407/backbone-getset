var Backbone = require("backbone")
  , _ = require("underscore")
  , getset = require("../lib/backbone-getset")
  , should = require("should")


suite("getters", function () {
  test("model should have `getters`", function () {
    should.exist((new Backbone.Model).getters)
  })

  suite("adding getters", function () {
    setup(function () {
      this.A = Backbone.Model.extend({
        getters: { foo: function () { return "foo" } }
      })
    })

    test("at construction", function () {
      ;(new this.A).get("foo").should.eql("foo")
    })

    test("to prototype", function() {
      this.A.prototype.getters.bar = function () { return "bar" }
      ;(new this.A).get("bar").should.eql("bar")
    })

    test("directly", function () {
      var a = new this.A
      a.getters.baz = function () { return "baz" }
      a.get("baz").should.eql("baz")
    })
  })

  suite("inheritance", function () {
    setup(function () {
      this.A = Backbone.Model.extend({
        getters: {
          foo: function () { return 'foo' },
          bar: function () { return 'bar' }
        }
      })
      this.B = this.A.extend({
        getters: {
          foo: function () { return 'notfoo' },
          baz: function () { return 'baz' }
        }
      })
    })

    test("should inherit and merge getters", function () {
      Object.keys(this.B.prototype.getters).length.should.eql(3)
    })

    test("extension should not affect parent proto", function () {
      Object.keys(this.A.prototype.getters).length.should.eql(2)
    })

    test("extending should override getters of parent, but not affect parent", function () {
      ;(new this.B).get("foo").should.eql("notfoo")
      ;(new this.A).get("foo").should.eql("foo")
    })
  })

  suite("toJSON", function () {
    setup(function () {
      this.A = Backbone.Model.extend({
        defaults: {
          foo: "foo",
          bar: "bar"
        },
        getters: {
          bar: function () {
            return this.attributes.bar.split('').reverse().join('');
          },
          baz: function () {
            return "baz"
          }
        }
      })
    })

    test("is normal attributes, without getters option", function () {
      var json = (new this.A).toJSON();
      Object.keys(json).length.should.eql(2);
      json.foo.should.eql("foo");
      json.bar.should.eql("bar");
    })

    test("is getter-extended attributes, with getters option", function () {
      var json = (new this.A).toJSON({getters: true});
      Object.keys(json).length.should.eql(3);
      json.foo.should.eql("foo");
      json.bar.should.eql("rab");
    })
  })
});
