define(function() {
  // Match the single word for capitalizing
  rewords = /\w\S*/g;

  /**
   * Capitalize each word from string.
   *
   * @param {String} s The string to capitalize
   * @return {String} Capitalized string
   */
  return function(s) {
    return s.replace(rewords, function(s) {
      return s.charAt(0).toUpperCase() + s.slice(1);
    });
  }
})
