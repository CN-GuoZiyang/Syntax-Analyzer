const ipc = require('electron').ipcRenderer
const fs = require('fs')
const lexer = require('./js/lexer/lexer.js')
const parser = require('./js/parser/parser.js')

const app = new Vue({
  el: "#app",
  data() {
    return {
      loading: false,
      codes: '',
      errors: [

      ],
      parser_tree: [],
      tree_props: {
        children: 'children',
        label: 'label'
      }
    }
  },
  methods: {
    load_from_file() {
      ipc.send('select-file-dialog')
      document.getElementById('read-btn').blur()
    },

    show_ll1() {
      ipc.send('show_ll1')
      document.getElementById('show-btn').blur()
    },

    clear_editor() {
      editor.setValue('')
      this.errors = []
      this.parser_tree = []
      document.getElementById('empty-btn').blur()
    },

    show_tree() {
      if(typeof(this.parser_tree[0]) == 'undefined') {
        alert('请首先分析！')
      } else {
        ipc.send('parser-tree', this.parser_tree[0])
      }
    },

    analyze() {
      this.loading = true
      document.getElementById('run-btn').blur()
      let str = editor.getValue()
      let lexer_res = lexer.analyze(str)
      let res = parser.parse(lexer_res.analysis)
      let tmp_errors = lexer_res.errors.concat(res.errors)
      let compare = function (x, y) {//比较函数
        if (x.lineNumber < y.lineNumber) {
          return -1;
        } else if (x.lineNumber > y.lineNumber) {
          return 1;
        } else {
          if (x.startc < y.startc) {
            return -1;
          } else {
            return 1;
          }
        }
      }
      tmp_errors.sort(compare)
      this.errors = tmp_errors
      this.parser_tree = [res.start_ele]
      this.render_errors()
      this.loading = false
    },
    render_errors() {
      let model = editor.getModel()
      let modelerrors = []
      this.errors.forEach((ele) => {
        modelerrors.push({
          startLineNumber: ele.lineNumber,
          startColumn: ele.startc,
          endLineNumber: ele.lineNumber,
          endColumn: ele.endc,
          message: ele.info,
          severity: monaco.MarkerSeverity.Error
        })
      })
      monaco.editor.setModelMarkers(model, "owner", modelerrors)
    }
  },

  mounted: function () {
    document.getElementById('monaco').addEventListener('dragover', function (e) {
      e.preventDefault();
      e.stopPropagation();
    })
    document.getElementById('monaco').addEventListener('drop', function (event) {
      event.preventDefault()
      event.stopPropagation();
      for (let f of event.dataTransfer.files) {
        ipc.send('ondragstart', f.path)
      }
    })
    ipc.on('select-file', (event, path) => {
      fs.readFile(path, 'utf8', (e, data) => {
        if (!e) editor.setValue(data)
      })
    })
    lexer.init()
    parser.init()
  }
})