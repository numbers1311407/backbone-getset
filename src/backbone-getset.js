
/**
 * Monkeypatch into Model.extend to extend accessors down the chain
 * if they are defined on the proto (which, after the first time they
 * are defined, they will be for future extensions)
 */
var Model_extend = Backbone.Model.extend

Backbone.Model.extend = function () {
  var child = Model_extend.apply(this, arguments)
  extendProto('getters', this, child)
  extendProto('setters', this, child)
  return child
}


var Model_set = Backbone.Model.prototype.set


_.extend(Backbone.Model.prototype, {

  /**
   * initial getters object
   */
  getters: {},

  /**
   * initial setters object
   */
  setters: {},

  /*
   * Monkeypatch `set` to provide mutator support
   */
  set: function (key, val, options) {
    // Copy the attrs construction from the standard `set`.  A cleaner
    // but even more brittle alternative would be to hook into `_validate`
    // which is always given the constructed attributes object.
    var attrs
    if (key == null) return this
    if (typeof key === 'object') {
      attrs = key
      options = val
    } else {
      ;(attrs = {})[key] = val
    }

    // then apply appropriate setters and call the original function
    _.each(this.setters, function (fn, attr) {
      if (_.has(attrs, attr)) attrs[attr] = fn.call(this, attrs[attr])
    }, this)

    return Model_set.call(this, attrs, options)
  },


  /*
   * Override `get` for accessor support
   */
  get: function (attr) {
    if (this.getters && this.getters[attr]) {
      return this.getters[attr].call(this)
    }
    return this.attributes[attr]
  },


  /**
   * Override `toJSON`, with the option to apply accessors (`getters: true`)
   *
   * Options
   * =======
   *   getters: whether to include getters in object (default false)
   */
  toJSON: function(options) {
    options || (options = {})

    var attrs = _.clone(this.attributes)

    if (options.getters) {
      _.each(this.getters, function (fn, attr) {
        attrs[attr] = fn.call(this)
      }, this)
    }

    return attrs
  }
})


/**
 * Extends a property of the parent prototype to the child prototype
 *
 * @api private
 */
function extendProto(prop, parent, child) {
  if (parent.prototype[prop]) {
    child.prototype[prop] = _.extend(
        {}, parent.prototype[prop], child.prototype[prop])
  }
}
