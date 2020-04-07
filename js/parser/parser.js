const fs = require('fs')
const utils = require('./utils.js')

let first = []
let follow = []
let select = []
let grammar_production = []

function init() {
  let grammar_str = fs.readFileSync(utils.resolveStatic('../grammar'), 'utf-8').replace('\r', '')
  let raw = split_grammar_str(grammar_str)
  compute_first(raw)
  compute_follow(raw)
  compute_select(raw)
}

function split_grammar_str(str) {
  let strs = str.split('\n')
  let res = []
  for(let element of strs) {
    if(element.trim() == '') continue
    let splits = element.split(' -> ')
    if(typeof(res[splits[0]]) == 'undefined') {
      res[splits[0]] = []
    }
    res[splits[0]].push(splits[1]
      .replace(/&&/g, 'AND')
      .replace(/\|\|/g, 'OR')
      .replace(/>=/g, 'GREATER_E').replace(/<=/g, 'LESS_E').replace(/==/g, 'EQUAL').replace(/!=/g, "NOT_E")
      .replace(/\(/g, 'L_PARENTHESE').replace(/\)/g, 'R_PARENTHESE')
      .replace(/\[/g, 'L_BRCKET').replace(/]/g, 'R_BRCKET')
      .replace(/{/g, 'L_BRACE').replace(/}/g, 'R_BRACE')
      .replace(/,/g, 'COMMA')
      .replace(/;/g, 'SEMICOLON')
      .replace(/!/g, 'NOT')
      .replace(/>/g, 'GREATER').replace(/</g, 'LESS').replace(/=/g, 'ASSIGN')
      .replace(/\+/g, 'PLUS').replace(/-/g, 'MINUS')
      .replace(/\*/g, 'MULTIPLE').replace(/\//g, 'DIVIDE').replace(/%/g, 'MOD')
      .replace(/:/g, 'COLON')
    )
  }
  return res
}

function compute_first(raw) {
  while(true) {
    let end = true

    for(let index in raw) {
      if(index == 'uniq') continue
      if(typeof(first[index]) == 'undefined') {
        first[index] = []
      }
      let current = raw[index]
      current.forEach(element => {
        let els = element.split(' ')
        for(let el of els) {
          // el不在raw中说明是个终结符
          if(typeof(raw[el]) == 'undefined') {
            if(first[index].indexOf(el) == -1) {
              first[index].push(el)
              end = false
            }
            break
          }
          // 非终结符情况
          let el_first = first[el]
          if(typeof(el_first) == 'undefined') {
            break
          }
          for(let f of el_first) {
            if(first[index].indexOf(f) == -1) {
              first[index].push(f)
              end = false
            }
          }
          if(el_first.indexOf('ε') != -1) {
            continue
          } else {
            break
          }
        }
      })
    }
    if(end) break
  }
  console.log('first')
  console.log(first)
}

function compute_follow(raw) {
  let start = true
  while(true) {
    let end = true

    for(let index in raw) {
      if(index == 'uniq') continue
      if(typeof(follow[index]) == 'undefined') {
        follow[index] = []
      }
      if(start) {
        follow[index].push('$')
        start = false
      }
      let current = raw[index]
      current.forEach(element => {
        let els = element.split(' ')
        for(let i = 0; i < els.length - 1; i ++) {
          // 在raw中，为非终结符
          if(typeof(raw[els[i]]) != 'undefined') {
            if(typeof(follow[els[i]]) == 'undefined') {
              follow[els[i]] = []
            }
            // 后一个字符为终结符，直接加入
            if(typeof(raw[els[i+1]]) == 'undefined') {
              if(follow[els[i]].indexOf(els[i+1]) == -1) {
                follow[els[i]].push(els[i+1])
                end = false
              }
            } else {
              // 后一个字符为非终结符
              let firstb = first[els[i+1]]
              for(let f of firstb) {
                if(f != 'ε' && follow[els[i]].indexOf(f) == -1) {
                  follow[els[i]].push(f)
                  end = false
                }
              }
            }
          }
        }

        for(let i = els.length-1; i >= 0; i --) {
          let el = els[i];
          // 最后面是非终结符
          if(typeof(raw[el]) != 'undefined') {
            if(typeof(follow[el]) == 'undefined') {
              follow[el] = []
            }
            for(let f of follow[index]) {
              if(follow[el].indexOf(f) == -1) {
                follow[el].push(f)
                end = false
              }
            }
            if(first[el].indexOf('ε') != -1) {
              continue
            } else {
              break
            }
          } else {
            break
          }
        }
      })
    }
    if(end) break
  }
  console.log('follow')
  console.log(follow)
}

function compute_select(raw) {
  for(let index in raw) {
    if(index == 'uniq') continue
    let b = index
    let a = raw[b]
    for(let i of a) {
      grammar_production.push({
        'left': b,
        'right': i
      })
    }
  }
  console.log(grammar_production)
  for(let item of grammar_production) {
    if(item.right == 'ε') {
      select.push(follow[item.left])
    } else {
      let first_ele = item.right.split(' ')[0]
      if(typeof(raw[first_ele]) == 'undefined') {
        let t = []
        t.push(first_ele)
        select.push(t)
      } else {
        select.push(first[first_ele])
      }
    }
  }
  console.log(select)
}

function parse() {

}

exports.init = init
exports.parse = parse