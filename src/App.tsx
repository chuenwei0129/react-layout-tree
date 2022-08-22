import { useEffect, useRef } from 'react'
import { f1 } from './algorithms/f1'
import { f2 } from './algorithms/f2'
import { f3 } from './algorithms/f3'
import { f4 } from './algorithms/f4'
import './App.css'
import { d1 } from './data/f1.data'
import { d2 } from './data/f2.data'
import { d3 } from './data/f3.data'
import { d4 } from './data/f4.data'

import { clearTree, createRenderer, renderTree } from './renderer/renderer'

function App() {
  const containerRef = useRef<HTMLDivElement>(null!)

  useEffect(() => {
    createRenderer(containerRef.current)
  }, [])

  // 数字即遍历顺序
  const handlerF1 = () => {
    // 清除之前的树
    clearTree()
    renderTree(d1, f1)
  }

  const handlerF2 = () => {
    clearTree()
    // 可以把 d3 传入 f2 辅助理解 f3 的实现
    renderTree(d2, f2)
  }

  const handlerF3 = () => {
    clearTree()
    renderTree(d3, f3)
  }

  const handlerF4 = () => {
    clearTree()
    // 可以把 d3 传入 f4 辅助理解 f4 第一阶段的实现
    renderTree(d4, f4)
  }

  return (
    <div className='App'>
      <fieldset className='button-group'>
        <legend>画一棵漂亮的树 🌲</legend>
        <button onClick={handlerF1}>算法1</button>
        <button onClick={handlerF2}>算法2</button>
        <button onClick={handlerF3}>算法3</button>
        <button onClick={handlerF4}>算法4</button>
        <button onClick={handlerF4}>算法5</button>
        <button onClick={handlerF4}>算法6</button>
        <button onClick={handlerF4}>思维导图</button>
      </fieldset>
      <div className='container' ref={containerRef}></div>
    </div>
  )
}

export default App
