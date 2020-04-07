const fs = require('fs')
const utils = require('./utils.js')

let first = []
let follow = []

function init() {
  let grammar_str = fs.readFileSync(utils.resolveStatic('../testgrammar'), 'utf-8').replace('\r', '')
  let raw = split_grammar_str(grammar_str)
  compute_first(raw)
  compute_follow(raw)
}

function split_grammar_str(str) {
  let strs = str.split('\n')
  let res = []
  strs.forEach(element => {
    let splits = element.split(' -> ')
    if(typeof(res[splits[0]]) == 'undefined') {
      res[splits[0]] = []
    }
    res[splits[0]].push(splits[1]
      .replace('&&', 'AND')
      .replace('||', 'OR')
      .replace('>=', 'GREATER_E').replace('<=', 'LESS_E').replace('==', 'EQUAL').replace('!=', "NOT_E")
      .replace('(', 'L_PARENTHESE').replace(')', 'R_PARENTHESE')
      .replace('[', 'L_BRCKET').replace(']', 'R_BRCKET')
      .replace('{', 'L_BRACE').replace('}', 'R_BRACE')
      .replace(',', 'COMMA')
      .replace(';', 'SEMICOLON')
      .replace('!', 'NOT')
      .replace('>', 'GREATER').replace('<', 'LESS').replace('=', 'ASSIGN')
      .replace('+', 'PLUS').replace('-', 'MINUS')
      .replace('*', 'MULTIPLE').replace('/', 'DIVIDE').replace('%', 'MOD')
    )
  })
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
  console.log(first)
}

function compute_follow(raw) {
  
}

function parse() {

}

exports.init = init
exports.parse = parse