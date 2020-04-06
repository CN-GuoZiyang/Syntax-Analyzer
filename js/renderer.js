const ipc = require('electron').ipcRenderer
const fs = require('fs')

const app = new Vue({
  el: "#app",
  data() {
    return {
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

    clear_editor() {
      editor.setValue('')
      this.errors = []
      this.parser_tree = []
    }
  },

  mounted: function() {
    ipc.on('select-file', (event, path) => {
      fs.readFile(path, 'utf8', (e, data) => {
        editor.setValue(data)
      })
    })
  }
})