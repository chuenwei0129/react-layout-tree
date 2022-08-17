import Konva from 'konva'
import type { Stage } from 'konva/lib/Stage'
import type { SourceTree } from './model'

// 配置
export const CONTAINER_WIDTH = 900
export const CONTAINER_HEIGHT = 600
export const HELPER_GRID_SIZE = 30

export const init = (container: HTMLDivElement, data: SourceTree) => {
  // first we need to create a stage
  const stage = new Konva.Stage({
    container,
    width: CONTAINER_WIDTH,
    height: CONTAINER_HEIGHT
  })

  drawHelperGridLayer(stage)
  drawLayoutTreeLayer(stage)
}

const drawHelperGridLayer = (stage: Stage) => {
  // then create layer
  const helperGridLayer = new Konva.Layer()
  // add the layer to the stage
  stage.add(helperGridLayer)

  // create our shape
  for (let x = 0; x <= CONTAINER_WIDTH; x += HELPER_GRID_SIZE) {
    // 绘制辅助网格列
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
    // add the shape to the layer
    helperGridLayer.add(row)
  }

  // draw the image
  helperGridLayer.draw()
}

const drawLayoutTreeLayer = (stage: Stage) => {
  const treeLayer = new Konva.Layer()
  stage.add(treeLayer)
}

// 清除树图层
export const clearTreeLayer = () => treeLayer.removeChildren()

// 30 * 20 网格

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
