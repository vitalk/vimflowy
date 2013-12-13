define(function() {
  /**
   * Returns has object the own property.
   *
   * @param {Object} o The object to check
   * @param {String} prop The property name
   */
  return function(o, p) {
    return Object.hasOwnProperty.call(o, p);
  }
})
