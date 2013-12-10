define(function() {
  /**
   * Check contains array element or not
   *
   * @param {Array} array The array to check
   * @param {Object} value The value to check
   * @return {Boolean} Contains or not
   */
  return function(array, value) {
    return array.indexOf(value) != -1;
  }
})
