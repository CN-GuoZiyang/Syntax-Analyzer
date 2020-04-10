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
    },

    show_ll1() {
      ipc.send('show_ll1')
    },

    clear_editor() {
      editor.setValue('')
      this.errors = []
      this.parser_tree = []
    },

    analyze() {
      this.loading = true
      let str = editor.getValue()
      let lexer_res = lexer.analyze(str)
      this.parser_tree = [parser.parse(lexer_res.analysis)]
      this.loading = false
    }
  },

  mounted: function() {
    document.getElementById('monaco').addEventListener('dragover', function(e) {
      e.preventDefault();
      e.stopPropagation();
    })
    document.getElementById('monaco').addEventListener('drop', function(event) {
      event.preventDefault()
      event.stopPropagation();
      for (let f of event.dataTransfer.files) {
        ipc.send('ondragstart', f.path)
      }
    })
    ipc.on('select-file', (event, path) => {
      fs.readFile(path, 'utf8', (e, data) => {
        if(!e) editor.setValue(data)
      })
    })
    lexer.init()
    parser.init()
  }
})