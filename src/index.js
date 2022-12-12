import _ from 'lodash'
import printMe from './js/print'
import './css/style.scss'
import Icon from './img/icon.jpg'
import { numToWord, wordToNum } from 'fjf-one'
console.log(numToWord(3))
console.log(wordToNum('One'))
//import axios from 'axios'
function component() {
  let element = document.createElement('div')
  let btn = document.createElement('button')

  // Lodash,现在由这个脚本导入
  element.innerHTML = _.join(['fanjianfeng', 'webpack'], ' ')

  btn.innerHTML = '点我'
  btn.onclick = printMe
  element.appendChild(btn)

  // 将图像添加到我们已经存在的 div 中。
  const myIcon = new Image()
  myIcon.src = Icon
  element.appendChild(myIcon)

  return element
}
let element = component() // 存储 element，以在 print.js 修改时重新渲染
document.body.appendChild(element)

//模块热替换HMR
if (module.hot) {
  module.hot.accept('./js/print.js', function () {
    console.log('Accepting the updated printMe module!')
    document.body.removeChild(element)
    element = component() // 重新渲染 "component"，以便更新 click 事件处理函数
    document.body.appendChild(element)
  })
}

fetch('/api/data.json')
  .then((response) => {
    console.log(response)
    return response.json()
  })
  .then((data) => console.log(data))
