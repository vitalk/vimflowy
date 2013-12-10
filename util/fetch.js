define(function() {
  /**
   * Fetch content of the extension resource file
   *
   * @param {String} filename The file name to fetch
   * @return {String} Response text
   */
  return function(filename) {
    var rv,
        xhr = new XMLHttpRequest();

    xhr.onreadystatechange = function() {
      if (xhr.readyState == 4) {
        rv = xhr.responseText;
      }
    };
    var url = chrome.extension.getURL(filename);
    xhr.open('GET', url, false);

    try {
      xhr.send(null);
    } catch(e) {
      console.log('couldn\'t load', filename);
    }

    return rv;
  }
});
