import Vue from 'vue'

const prefix = "R$"
const regexMoney = /\B(?=(\d{3})+(?!\d))/g

Vue.filter('currency', function (value) {
  if (!value) return ''
  let val = (value / 1).toFixed(2).replace('.', ',')
  return prefix.concat(" ").concat(val.toString().replace(regexMoney, "."))
})