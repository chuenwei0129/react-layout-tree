import Konva from 'konva'
import type { Layer } from 'konva/lib/Layer'
import type { Stage } from 'konva/lib/Stage'
import { LayoutTree, SourceTree } from './model'

// 默认配置 30 * 20 网格
export const CONTAINER_WIDTH = 900
export const CONTAINER_HEIGHT = 600
export const HELPER_GRID_SIZE = 30

export const createRenderer = (container: HTMLDivElement) => {
  // first we need to create a stage
  const stage = new Konva.Stage({
    container,
    width: CONTAINER_WIDTH,
    height: CONTAINER_HEIGHT
  })

  // 顺序决定图层显示
  renderHelperGrid(stage)
  renderTreeLayer(stage)
}

const renderHelperGrid = (stage: Stage) => {
  // then create layer
  const helperGridLayer = new Konva.Layer()
  // add the layer to the stage
  stage.add(helperGridLayer)

  // create our shape
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

let treeLayer: Layer | undefined = undefined

const renderTreeLayer = (stage: Stage) => {
  treeLayer = new Konva.Layer()
  stage.add(treeLayer)
}

export const clearTree = () => treeLayer?.removeChildren()

// 后序遍历
const renderTreeShape = (tree: LayoutTree) => {
  tree.children.forEach(child => {
    renderTreeNodeConnectedLine(tree, child)
    renderTreeShape(child)
  })
  renderTreeNode(tree)
}

const renderTreeNodeConnectedLine = (treeNode1: LayoutTree, treeNode2: LayoutTree) => {
  const connectedLine = new Konva.Line({
    points: [treeNode1.x, treeNode1.y, treeNode2.x, treeNode2.y],
    stroke: 'black',
    strokeWidth: 2,
    lineCap: 'round',
    lineJoin: 'round'
  })
  treeLayer?.add(connectedLine)
  treeLayer?.draw()
}

const renderTreeNode = (tree: LayoutTree) => {
  const treeNode = new Konva.Circle({
    // 圆心坐标
    x: tree.x,
    y: tree.y,
    radius: HELPER_GRID_SIZE / 3,
    fill: '#fff',
    stroke: 'black',
    strokeWidth: 2
  })
  treeLayer?.add(treeNode)
  treeLayer?.draw()

  const text = new Konva.Text({
    x: tree.x,
    y: tree.y,
    text: tree.val,
    fontSize: 14
  })
  text.offsetX(text.width() / 2)
  text.offsetY(text.height() / 2)
  treeLayer?.add(text)
}

const setRealPosition = (tree: LayoutTree) => {
  // 长度映射
  tree.x *= HELPER_GRID_SIZE
  tree.y *= HELPER_GRID_SIZE

  // padding-left / top
  tree.x += HELPER_GRID_SIZE
  tree.y += HELPER_GRID_SIZE

  tree.children.forEach(setRealPosition)
}

export const renderTree = (tree: SourceTree, setAbstractPosition: (tree: LayoutTree) => void) => {
  const layoutTree: LayoutTree = new LayoutTree(tree)
  setAbstractPosition(layoutTree)
  setRealPosition(layoutTree)
  renderTreeShape(layoutTree)
}
