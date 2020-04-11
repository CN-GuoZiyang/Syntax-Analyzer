const fs = require('fs')
const utils = require('./utils.js')
const nfa = require('./nfa.js')

let number_dfa = {} 
let id_dfa = {}
let hex_dfa = {}
let oct_dfa = {}
let symbol_dfa = {}
let symbol_table = {
  '1': 'PLUS', '2': 'INCREMENT', '3': 'MINUS', '4': 'DECREMENT', '5': 'MULTIPLE',
  '6': 'DIVIDE', '7': 'MOD', '8': 'LESS', '9': 'LESS_E', '10': 'GREATER', '11': 'GREATER_E',
  '12': 'ASSIGN', '13': 'EQUAL', '14': 'NOT', '15': 'NOT_E', '16':'ADDRESS', '17': 'AND', '19': 'OR',
  '20': 'L_BRCKET', '21': 'R_BRCKET', '22': 'L_PARENTHESE', '23': 'R_PARENTHESE',
  '24': 'L_BRACE', '25': 'R_BRACE', '26': 'SEMICOLON', '27': 'COLON', '28': 'DOT'
}

function init() {
  id_dfa = nfa.nfa2dfa(utils.resolveStatic('lexer/nfas/id.csv'))
  number_dfa = nfa.nfa2dfa(utils.resolveStatic('lexer/nfas/number.csv'))
  hex_dfa = nfa.nfa2dfa(utils.resolveStatic('lexer/nfas/hex.csv'))
  oct_dfa = nfa.nfa2dfa(utils.resolveStatic('lexer/nfas/oct.csv'))
  // load(number_dfa, resolveStatic('number.csv'))
  // load(id_dfa, resolveStatic('id.csv'))
  // load(hex_dfa, resolveStatic('hex.csv'))
  load(symbol_dfa, utils.resolveStatic('lexer/nfas/symbol.csv'))
}

function load(dfa, path) {
  // 读取数字的dfa
  let data = fs.readFileSync(path)
  data = data.toString()
  let res = []
  let d = data.split('\n')
  let state = []
  let stater = []
  let jump = []
  let jumpr = []
  let d0 = d[0].split(',')
  for (let i = 1; i < d0.length; i++) {
    let temp = d0[i].replace('\n', '').replace('\r', '')
    jumpr.push(temp)
    jump[temp] = i - 1
  }
  dfa.jumpr = jumpr
  dfa.jump = jump
  for (let i = 1; i < d.length; i++) {
    let splits = d[i].split(',')
    let t = []
    state[splits[0]] = i - 1
    stater.push(splits[0])
    for (let j = 1; j < splits.length; j++) {
      t[j - 1] = splits[j].replace('\n', '').replace('\r', '')
    }
    res[i - 1] = t
  }
  dfa.dfa = res
  dfa.state = state
  dfa.stater = stater
}

function judgeNum(str, index, column) {
  let start = index
  let startc = column
  let state = number_dfa.stater[0]
  let last = number_dfa.stater[0]
  while (true) {
    let c = str.charAt(index)
    if (utils.isNum(c) == true) {
      last = state
      state = number_dfa.dfa[number_dfa.state[state]][number_dfa.jump['num']]
      index++
      column++
    } else {
      if (typeof (number_dfa.jump[c]) == "undefined") {
        if (number_dfa.dfa[number_dfa.state[state]][number_dfa.jump['end']] == 'false') {
          return {
            'status': 'error',
            'raw': str.substring(start, index),
            'type': 'DECIMAL',
            'attribute': str.substring(start, index),
            'nextstart': index,
            'nextstartc': column,
            'startc': startc
          }
        } else {
          return {
            'status': 'ok',
            'raw': str.substring(start, index),
            'type': 'DECIMAL',
            'attribute': str.substring(start, index),
            'nextstart': index,
            'nextstartc': column
          }
        }
      } else {
        last = state
        state = number_dfa.dfa[number_dfa.state[state]][number_dfa.jump[c]]
        index++
        column++
      }
    }
    if (state == '-1') {
      index--
      column--
      if (number_dfa.dfa[number_dfa.state[last]][number_dfa.jump['end']] == 'false') {
        return {
          'status': 'error',
          'raw': str.substring(start, index),
          'type': 'DECIMAL',
          'attribute': str.substring(start, index),
          'nextstart': index,
          'nextstartc': column,
          'startc': startc
        }
      } else {
        return {
          'status': 'ok',
          'raw': str.substring(start, index),
          'type': 'DECIMAL',
          'attribute': str.substring(start, index),
          'nextstart': index,
          'nextstartc': column
        }
      }
    }
    if (index == str.length) {
      if (number_dfa.dfa[number_dfa.state[state]][number_dfa.jump['end']] == 'false') {
        return {
          'status': 'error',
          'raw': str.substring(start, index),
          'type': 'DECIMAL',
          'attribute': str.substring(start, index),
          'nextstart': index,
          'nextstartc': column,
          'startc': startc
        }
      } else {
        return {
          'status': 'ok',
          'raw': str.substring(start, index),
          'type': 'DECIMAL',
          'attribute': str.substring(start, index),
          'nextstart': index,
          'nextstartc': column
        }
      }
    }
  }
}

function judgeId(str, index, column) {
  let start = index
  let startc = column
  let state = id_dfa.stater[0]
  let last = id_dfa.stater[0]
  while (true) {
    let c = str.charAt(index)
    if (utils.isNum(c) == true) {
      last = state
      state = id_dfa.dfa[id_dfa.state[state]][id_dfa.jump['num']]
      index++
      column++
    } else if (utils.isLetter_(c) == true) {
      last = state
      state = id_dfa.dfa[id_dfa.state[state]][id_dfa.jump['letter_']]
      index++
      column++
    } else {
      if (id_dfa.dfa[id_dfa.state[state]][id_dfa.jump['end']] == 'false') {
        return {
          'status': 'error',
          'raw': str.substring(start, index),
          'type': 'ID',
          'attribute': str.substring(start, index),
          'nextstart': index,
          'nextstartc': column,
          'startc': startc
        }
      } else {
        return {
          'status': 'ok',
          'raw': str.substring(start, index),
          'type': 'ID',
          'attribute': str.substring(start, index),
          'nextstart': index,
          'nextstartc': column
        };
      }
    }
    if (state == '-1') {
      index--
      column--
      if (id_dfa.dfa[id_dfa.state[last]][id_dfa.jump['end']] == 'false') {
        return {
          'status': 'error',
          'raw': str.substring(start, index),
          'type': 'ID',
          'attribute': str.substring(start, index),
          'nextstart': index,
          'nextstartc': column,
          'startc': startc
        }
      } else {
        return {
          'status': 'ok',
          'raw': str.substring(start, index),
          'type': 'ID',
          'attribute': str.substring(start, index),
          'nextstart': index,
          'nextstartc': column
        }
      }
    }
    if (index == str.length) {
      if (id_dfa.dfa[id_dfa.state[state]][id_dfa.jump['end']] == 'false') {
        return {
          'status': 'error',
          'raw': str.substring(start, index),
          'type': 'ID',
          'attribute': str.substring(start, index),
          'nextstart': index,
          'nextstartc': column,
          'startc': startc
        }
      } else {
        return {
          'status': 'ok',
          'raw': str.substring(start, index),
          'type': 'ID',
          'attribute': str.substring(start, index),
          'nextstart': index,
          'nextstartc': column
        }
      }
    }
  }
}

function judgeHex(str, index, column) {
  let start = index
  let startc = column
  let state = hex_dfa.stater[0]
  let last = hex_dfa.stater[0]
  while (true) {
    let c = str.charAt(index)
    if (c == '0') {
      last = state
      state = hex_dfa.dfa[hex_dfa.state[state]][hex_dfa.jump['0']]
      index++
      column++
    } else if (utils.isHexNum(c) == true) {
      last = state
      state = hex_dfa.dfa[hex_dfa.state[state]][hex_dfa.jump['hexnum']]
      index++
      column++
    } else if (c == 'x' || c == 'X') {
      last = state
      state = hex_dfa.dfa[hex_dfa.state[state]][hex_dfa.jump['x']]
      index++
      column++
    } else {
      if (hex_dfa.dfa[hex_dfa.state[state]][hex_dfa.jump['end']] == 'false') {
        return {
          'status': 'error',
          'raw': str.substring(start, index),
          'type': 'HEX',
          'attribute': str.substring(start, index),
          'nextstart': index,
          'nextstartc': column,
          'startc': startc
        }
      } else {
        return {
          'status': 'ok',
          'raw': str.substring(start, index),
          'type': 'HEX',
          'attribute': str.substring(start, index),
          'nextstart': index,
          'nextstartc': column
        };
      }
    }
    if (state == '-1') {
      index--
      column--
      if (hex_dfa.dfa[hex_dfa.state[last]][hex_dfa.jump['end']] == 'false') {
        return {
          'status': 'error',
          'raw': str.substring(start, index),
          'type': 'HEX',
          'attribute': str.substring(start, index),
          'nextstart': index,
          'nextstartc': column,
          'startc': startc
        }
      } else {
        return {
          'status': 'error',
          'raw': str.substring(start, index),
          'type': 'HEX',
          'attribute': str.substring(start, index),
          'nextstart': index,
          'nextstartc': column,
          'startc': startc
        }
      }
    }
    if (index == str.length) {
      if (hex_dfa.dfa[hex_dfa.state[state]][hex_dfa.jump['end']] == 'false') {
        return {
          'status': 'error',
          'raw': str.substring(start, index),
          'type': 'HEX',
          'attribute': str.substring(start, index),
          'nextstart': index,
          'nextstartc': column,
          'startc': startc
        }
      } else {
        return {
          'status': 'ok',
          'raw': str.substring(start, index),
          'type': 'HEX',
          'attribute': str.substring(start, index),
          'nextstart': index,
          'nextstartc': column
        }
      }
    }
  }
}

function judgeOct(str, index, column) {
  let start = index
  let startc = column
  let state = oct_dfa.stater[0]
  let last = oct_dfa.stater[0]
  while (true) {
    let c = str.charAt(index)
    if (c == '0') {
      last = state
      state = oct_dfa.dfa[oct_dfa.state[state]][oct_dfa.jump['0']]
      index++
      column++
    } else if (utils.isOctNum(c) == true) {
      last = state
      state = oct_dfa.dfa[oct_dfa.state[state]][oct_dfa.jump['octnum']]
      index++
      column++
    } else {
      if (oct_dfa.dfa[oct_dfa.state[state]][oct_dfa.jump['end']] == 'false') {
        return {
          'status': 'error',
          'raw': str.substring(start, index),
          'type': 'OCT',
          'attribute': str.substring(start, index),
          'nextstart': index,
          'nextstartc': column,
          'startc': startc
        }
      } else {
        return {
          'status': 'ok',
          'raw': str.substring(start, index),
          'type': 'OCT',
          'attribute': str.substring(start, index),
          'nextstart': index,
          'nextstartc': column
        };
      }
    }
    if (state == '-1') {
      index--
      column--
      if (oct_dfa.dfa[oct_dfa.state[last]][oct_dfa.jump['end']] == 'false') {
        return {
          'status': 'error',
          'raw': str.substring(start, index),
          'type': 'OCT',
          'attribute': str.substring(start, index),
          'nextstart': index,
          'nextstartc': column,
          'startc': startc
        }
      } else {
        return {
          'status': 'error',
          'raw': str.substring(start, index),
          'type': 'OCT',
          'attribute': str.substring(start, index),
          'nextstart': index,
          'nextstartc': column,
          'startc': startc
        }
      }
    }
    if (index == str.length) {
      if (oct_dfa.dfa[oct_dfa.state[state]][oct_dfa.jump['end']] == 'false') {
        return {
          'status': 'error',
          'raw': str.substring(start, index),
          'type': 'OCT',
          'attribute': str.substring(start, index),
          'nextstart': index,
          'nextstartc': column,
          'startc': startc
        }
      } else {
        return {
          'status': 'ok',
          'raw': str.substring(start, index),
          'type': 'OCT',
          'attribute': str.substring(start, index),
          'nextstart': index,
          'nextstartc': column
        }
      }
    }
  }
}

function judgeSymbol(str, index, column) {
  if (str.charAt(index) == ',') {
    index++
    column++
    return {
      'status': 'ok',
      'raw': ',',
      'type': 'COMMA',
      'attribute': '-',
      'nextstart': index,
      'nextstartc': column
    }
  }
  let start = index
  let startc = column
  let state = symbol_dfa.stater[0]
  let last = symbol_dfa.stater[0]
  while (true) {
    let c = str.charAt(index)
    if (typeof (symbol_dfa.jump[c]) == "undefined") {
      if (symbol_dfa.dfa[symbol_dfa.state[state]][symbol_dfa.jump['end']] == 'false') {
        return {
          'status': 'error',
          'raw': str.substring(start, index),
          'type': 'SYMBOL',
          'attribute': str.substring(start, index),
          'nextstart': index,
          'nextstartc': column,
          'startc': startc
        }
      } else {
        return {
          'status': 'ok',
          'raw': str.substring(start, index),
          'type': symbol_table[state],
          'attribute': '-',
          'nextstart': index,
          'nextstartc': column
        }
      }
    } else {
      last = state
      state = symbol_dfa.dfa[symbol_dfa.state[state]][symbol_dfa.jump[c]]
      index++
      column++
    }
    if (state == '-1') {
      index--
      column--
      if (symbol_dfa.dfa[symbol_dfa.state[last]][symbol_dfa.jump['end']] == 'false') {
        return {
          'status': 'error',
          'raw': str.substring(start, index),
          'type': 'SYMBOL',
          'attribute': str.substring(start, index),
          'nextstart': index,
          'nextstartc': column,
          'startc': startc
        }
      } else {
        return {
          'status': 'ok',
          'raw': str.substring(start, index),
          'type': symbol_table[last],
          'attribute': '-',
          'nextstart': index,
          'nextstartc': column
        }
      }
    }
    if (index == str.length) {
      if (symbol_dfa.dfa[symbol_dfa.state[state]][symbol_dfa.jump['end']] == 'false') {
        return {
          'status': 'error',
          'raw': str.substring(start, index),
          'type': 'SYMBOL',
          'attribute': str.substring(start, index),
          'nextstart': index,
          'nextstartc': column,
          'startc': startc
        }
      } else {
        return {
          'status': 'ok',
          'raw': str.substring(start, index),
          'type': symbol_table[state],
          'attribute': '-',
          'nextstart': index,
          'nextstartc': column
        }
      }
    }
  }
}

exports.init = init
exports.judgeNum = judgeNum
exports.judgeId = judgeId
exports.judgeHex = judgeHex
exports.judgeOct = judgeOct
exports.judgeSymbol = judgeSymbol