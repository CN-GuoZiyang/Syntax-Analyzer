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
      parser_tree: [{
        label: '一级 1',
        children: [{
          label: '二级 1-1',
          children: [{
            label: '三级 1-1-1'
          }]
        }]
      }, {
        label: '一级 2',
        children: [{
          label: '二级 2-1',
          children: [{
            label: '三级 2-1-1'
          }]
        }, {
          label: '二级 2-2',
          children: [{
            label: '三级 2-2-1'
          }]
        }]
      }, {
        label: '一级 3',
        children: [{
          label: '二级 3-1',
          children: [{
            label: '三级 3-1-1'
          }]
        }, {
          label: '二级 3-2',
          children: [{
            label: '三级 3-2-1'
          }]
        }]
      }],
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
      console.log('show 个 hammer!')
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