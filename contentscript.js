var s = document.createElement('script');

s.setAttribute('data-main', chrome.extension.getURL('main.js'));
s.src = chrome.extension.getURL('vendor/requirejs/require.js');
s.onload = function() {
  this.parentNode.removeChild(this);
}
document.head.appendChild(s);
