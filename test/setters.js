var Backbone = require("backbone")
  , _ = require("underscore")
  , getset = require("../lib/backbone-getset")
  , should = require("should")


suite("setters", function () {
  test("model should have `setters`", function () {
    should.exist((new Backbone.Model).getters)
  })

  suite("adding getters", function () {
    setup(function () {
      this.A = Backbone.Model.extend({
        setters: { foo: function () { return 'foo' } }
      })
    })

    test("at construction", function () {
      var a = new this.A
      a.set("foo", null)
      a.get("foo").should.eql("foo")
    })

    test("to prototype", function() {
      this.A.prototype.setters.bar = function () { return "bar" }
      var a = new this.A
      a.set("bar", null)
      a.get("bar").should.eql("bar")
    })

    test("directly", function () {
      var a = new this.A
      a.setters.baz = function () { return "baz" }
      a.set("baz", null)
      a.get("baz").should.eql("baz")
    })
  })

  suite("inheritance", function () {
    setup(function () {
      this.A = Backbone.Model.extend({
        setters: {
          foo: function () { return 'foo' },
          bar: function () { return 'bar' }
        }
      })
      this.B = this.A.extend({
        setters: {
          foo: function () { return 'notfoo' },
          baz: function () { return 'baz' }
        }
      })
    })

    test("should inherit and merge setters", function () {
      Object.keys(this.B.prototype.setters).length.should.eql(3)
    })

    test("extension should not affect parent proto", function () {
      Object.keys(this.A.prototype.setters).length.should.eql(2)
    })

    test("extending should override setters of parent, but not affect parent", function () {
      var b = new this.B
      b.set("foo", null)
      b.get("foo").should.eql("notfoo")
      var a = new this.A
      a.set("foo", null)
      a.get("foo").should.eql("foo")
    })
  })
})
