import { useEffect, useRef } from 'react'
import { f1 } from './algorithms/f1'
import { f2 } from './algorithms/f2'
import { f3 } from './algorithms/f3'
import { f4 } from './algorithms/f4.base'
import { f4PatchOffset } from './algorithms/f4.patch.offset'
import { f4PatchShift } from './algorithms/f4.patch.shift'
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
  const handleF1 = () => {
    // 清除之前的树
    clearTree()
    // 第一个参数数据，第二个参数算法，第三个参数 x 轴还是 y 轴，默认 x 轴
    renderTree(d1, f1)
  }

  const handleF2 = () => {
    clearTree()
    // 可以把 d3 传入 f2 辅助理解 f3 的实现
    renderTree(d2, f2)
  }

  const handleF3 = () => {
    clearTree()
    renderTree(d3, f3)
  }

  const handleF4 = () => {
    clearTree()
    // 可以把 d3 传入 f4 辅助理解 f4 第一阶段的实现
    renderTree(d4, f4, 'Y')
  }

  // 给 f4 打补丁，处理 shift 移位计算，并未考虑 x 的 offset
  const handleF4PatchOffset = () => {
    clearTree()
    renderTree(d4, f4PatchOffset, 'Y')
  }

  // 给 f4 打补丁，处理 shift 后，导致的，未移位的兄弟节点位置与移位后不均分
  const handleF4PatchShift = () => {
    clearTree()
    renderTree(d4, f4PatchShift, 'Y')
  }

  return (
    <div className='App'>
      <fieldset className='button-group'>
        <legend>画一棵漂亮的树 🌲</legend>
        <button onClick={handleF1}>算法1</button>
        <button onClick={handleF2}>算法2</button>
        <button onClick={handleF3}>算法3</button>
        <button onClick={handleF4}>算法4</button>
        <button onClick={handleF4PatchOffset}>算法4补丁1</button>
        <button onClick={handleF4PatchShift}>算法4补丁2</button>
      </fieldset>
      <div className='container' ref={containerRef}></div>
    </div>
  )
}

export default App
