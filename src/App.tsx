import { useEffect, useRef } from 'react'
import './App.css'
import { treeData } from './renderer/data'
import { canvasLayer, clearCanvasLayer, render } from './renderer/demo'
import { layoutF1 } from './renderer/drawKnuthTree'
import { layoutF2 } from './renderer/drawOutLineTree'
import { layoutF3 } from './renderer/drawTree'

function App() {
  const containerRef = useRef<HTMLDivElement>(null!)

  useEffect(() => {
    render(containerRef.current)
  }, [])

  const handlerLayoutF1 = () => {
    canvasLayer && clearCanvasLayer()
    // 渲染数据
    layoutF1({
      val: '5',
      left: {
        val: '3',
        left: {
          val: '0'
        },
        right: {
          val: '4'
        }
      },
      right: {
        val: '6',
        right: {
          val: '8'
        }
      }
    })
  }

  const handlerLayoutF2 = () => {
    canvasLayer && clearCanvasLayer()
    layoutF2(treeData)
  }

  const handlerLayoutF3 = () => {
    canvasLayer && clearCanvasLayer()
    layoutF3(treeData)
  }

  return (
    <div className='App'>
      <div className='button-group'>
        <button onClick={handlerLayoutF1}>算法1</button>
        <button onClick={handlerLayoutF2}>算法2</button>
        <button onClick={handlerLayoutF3}>算法3</button>
      </div>
      <div className='container' ref={containerRef}></div>
    </div>
  )
}

export default App
