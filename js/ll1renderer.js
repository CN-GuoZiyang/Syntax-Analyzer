const ipc = require('electron').ipcRenderer

const app = new Vue({
  el: '#app',
  data: function() {
    return {
      table: {},
      
    }
  },
  methods: {
    close_win() {
      ipc.send('close_ll1')
    }
  },
  computed: {
    grammar_production() {
      if(typeof(this.table.grammar_production) == 'undefined') {
        return []
      }
      let res = []
      for(let production of this.table.grammar_production) {
        res.push({
          left: production.left,
          to: '==>',
          right: production.right
        })
      }
      return res
    }
  },
  mounted: function() {
    ipc.send('get_table'),
    ipc.on('table', (event, arg) => {
      this.table = arg
      console.log(this.table)
    })
  }
})