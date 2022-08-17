import { useEffect, useRef } from 'react'
import { f1 } from './algorithms/f1'
import { f2 } from './algorithms/f2'
import { f3 } from './algorithms/f3'
import './App.css'
import { sourceTree } from './renderer/data'

import { clearTree, createRenderer, renderTree } from './renderer/renderer'

function App() {
  const containerRef = useRef<HTMLDivElement>(null!)

  useEffect(() => {
    createRenderer(containerRef.current)
  }, [])

  const handlerF1 = () => {
    // 清除之前的树
    clearTree()
    renderTree(sourceTree, f1)
  }

  const handlerF2 = () => {
    clearTree()
    renderTree(sourceTree, f2)
  }

  const handlerF3 = () => {
    clearTree()
    renderTree(sourceTree, f3)
  }

  return (
    <div className='App'>
      <div className='button-group'>
        <button onClick={handlerF1}>算法1</button>
        <button onClick={handlerF2}>算法2</button>
        <button onClick={handlerF3}>算法3</button>
      </div>
      <div className='container' ref={containerRef}></div>
    </div>
  )
}

export default App
