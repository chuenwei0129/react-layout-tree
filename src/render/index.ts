import Konva from 'konva'
import { Layer } from 'konva/lib/Layer'
import { Stage } from 'konva/lib/Stage'
import { Tree } from './data'

// 容器尺寸
const CONTAINER_WIDTH = 900
const CONTAINER_HEIGHT = 600
// 画布图层
export let canvasLayer: Layer | undefined = undefined
// 30 * 20 网格
export const HELPER_GRID_SIZE = 30

export const render = (container: HTMLDivElement) => {
  // first we need to create a stage
  const stage = new Konva.Stage({
    container,
    width: CONTAINER_WIDTH,
    height: CONTAINER_HEIGHT
  })

  // then create layer
  canvasLayer = new Konva.Layer()

  // add the layer to the stage
  stage.add(canvasLayer)

  // 绘制辅助网格图层
  drawHelperGridLayer(stage)
}

const drawHelperGridLayer = (stage: Stage) => {
  const helperGridLayer = new Konva.Layer()
  // add the layer to the stage
  stage.add(helperGridLayer)

  // create our shape
  // 绘制辅助网格列
  for (let x = 0; x <= CONTAINER_WIDTH; x += HELPER_GRID_SIZE) {
    const column = new Konva.Line({
      // x 轴
      points: [x, 0, x, CONTAINER_WIDTH],
      stroke: 'rgba(0,0,0,0.1)',
      strokeWidth: 1
    })
    // add the shape to the layer
    helperGridLayer.add(column)
  }

  // 绘制辅助网格行
  for (let y = 0; y <= CONTAINER_HEIGHT; y += HELPER_GRID_SIZE) {
    const row = new Konva.Line({
      // points[2] === 宽度
      points: [0, y, CONTAINER_WIDTH, y],
      stroke: 'rgba(0,0,0,0.1)',
      strokeWidth: 1
    })
    helperGridLayer.add(row)
  }

  // draw the image
  helperGridLayer.draw()
}

// 清除画布图层
export const clearCanvasLayer = () => canvasLayer?.removeChildren()

// 绘制布局树节点
export const drawTreeNode = (x: number, y: number) => {
  const treeNode = new Konva.Circle({
    // 圆心坐标
    x,
    y,
    radius: HELPER_GRID_SIZE / 3,
    fill: '#fff',
    stroke: 'black',
    strokeWidth: 2
  })
  canvasLayer?.add(treeNode)
  canvasLayer?.draw()
}

// 绘制布局树节点连接线
export const drawConnectedLine = (treeNode1: Tree, treeNode2: Tree) => {
  const connectedLine = new Konva.Line({
    points: [treeNode1.x!, treeNode1.y!, treeNode2.x!, treeNode2.y!],
    stroke: 'black',
    strokeWidth: 2,
    lineCap: 'round',
    lineJoin: 'round'
  })
  canvasLayer?.add(connectedLine)
  canvasLayer?.draw()
}
