import { useEffect, useRef } from 'react'
import './App.css'
import { canvasLayer, clearCanvasLayer, render } from './render'
import { treeData } from './render/data'
import { layoutF1 } from './render/drawBinaryTree'
import { layoutF2 } from './render/drawTree'

function App() {
  const containerRef = useRef<HTMLDivElement>(null!)

  useEffect(() => {
    render(containerRef.current)
  }, [])

  const handlerLayoutF1 = () => {
    canvasLayer && clearCanvasLayer()
    // 渲染数据
    layoutF1({
      val: '0',
      left: {
        val: '0-0',
        left: {
          val: '0-0-0'
        },
        right: {
          val: '0-0-1'
        }
      },
      right: {
        val: '0-1',
        right: {
          val: '0-1-1',
          right: {
            val: '0-1-1-1',
            right: {
              val: '0-1-1-1-1'
            }
          }
        }
      }
    })
  }

  const handlerLayoutF2 = () => {
    canvasLayer && clearCanvasLayer()
    // 渲染数据
    layoutF2(treeData)
  }

  return (
    <div className='App'>
      <div className='button-group'>
        <button onClick={handlerLayoutF1}>算法1</button>
        <button onClick={handlerLayoutF2}>算法2</button>
      </div>
      <div className='container' ref={containerRef}></div>
    </div>
  )
}

export default App
