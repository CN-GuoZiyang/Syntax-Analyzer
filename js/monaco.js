var nodeRequire = global.require;
var editor
(function () {
  const path = require('path');
  const amdLoader = require('./node_modules/monaco-editor/min/vs/loader.js');
  const amdRequire = amdLoader.require;
  const amdDefine = amdLoader.require.define;

  function uriFromPath(_path) {
    var pathName = path.resolve(_path).replace(/\\/g, '/');
    if (pathName.length > 0 && pathName.charAt(0) !== '/') {
      pathName = '/' + pathName;
    }
    return encodeURI('file://' + pathName);
  }

  amdRequire.config({
    baseUrl: uriFromPath(path.join(__dirname, './node_modules/monaco-editor/min'))
  });

  // workaround monaco-css not understanding the environment
  self.module = undefined;

  amdRequire(['vs/editor/editor.main'], function () {
    editor = monaco.editor.create(document.getElementById('monaco'), {
      value: [
        'int i = 0;',
        'int sum = 0;',
        'for(i = 1; i <= 100; i ++)',
        '{',
        '\tsum = sum + i',
        '}',
        'printf("Sum is %d", sum);',
        'return 0;'
      ].join('\n'),
      minimap: {
        enabled: false
      },
      theme: 'vs-light',
      fontSize: 16,
      lineNumbersMinChars: 2,
      lineHeight: 25,
      scrollBeyondLastLine: false,
      language: 'c',
      scrollbar: {
        vertical: "hidden",
        verticalScrollbarSize: 0
      }
    });
  });
})();
global.require = nodeRequire