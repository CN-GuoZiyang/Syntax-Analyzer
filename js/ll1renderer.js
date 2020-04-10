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
      let id = 0
      for(let production of this.table.grammar_production) {
        res.push({
          id: id,
          left: production.left,
          to: '==>',
          right: production.right
        })
        id ++
      }
      return res
    },
    first_follow() {
      if(typeof(this.table.first) == 'undefined') {
        return []
      }
      let res = []
      for(let index in this.table.first) {
        if(index == 'uniq') continue
        res.push({
          left: index,
          first: JSON.stringify(this.table.first[index]),
          follow: JSON.stringify(this.table.follow[index])
        })
      }
      return res
    },
    selects() {
      if(typeof(this.table.select) == 'undefined') {
        return []
      }
      let res = []
      let id = 0
      for(let index in this.table.grammar_production) {
        if(index == 'uniq') continue
        res.push({
          id: id,
          production: this.table.grammar_production[index].left + ' ==> ' + this.table.grammar_production[index].right,
          select: JSON.stringify(this.table.select[index])
        })
        id ++
      }
      return res
    },
    predict_table_header() {
      if(typeof(this.table.symbolsr) == 'undefined') {
        return []
      }
      let res = []
      res.push('非终结符')
      for(let i of this.table.symbolsr) {
        res.push(i)
      }
      return res
    },
    predict_table() {
      if(typeof(this.table.predict_table) == 'undefined') {
        return []
      }
      let res = []
      let length = this.predict_table_header.length
      for(let i in this.table.predict_table) {
        if(i == 'uniq') continue
        let obj = {}
        obj.非终结符 = this.table.nonterminalsr[i]
        for(let j = 1; j < length; j ++) {
          if(typeof(this.table.predict_table[i][j-1]) == 'undefined') {
            obj[this.predict_table_header[j]] = '-'
          } else if(this.table.predict_table[i][j-1] == 'synch'){
            obj[this.predict_table_header[j]] = 'synch'
          } else {
            obj[this.predict_table_header[j]] = this.table.grammar_production.indexOf(this.table.predict_table[i][j-1])
          }
        }
        res.push(obj)
      }
      return res
    }
  },
  mounted: function() {
    ipc.send('get_table'),
    ipc.on('table', (event, arg) => {
      this.table = arg
    })
  }
})