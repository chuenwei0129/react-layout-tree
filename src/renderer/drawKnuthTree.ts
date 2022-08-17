import Konva from 'konva'
import { canvasLayer, HELPER_GRID_SIZE } from './demo'

// 二叉树
export type BinaryTree = {
  val: string
  pos?: {
    x: number
    y: number
  }
  left?: BinaryTree
  right?: BinaryTree
}

// 绘制布局树节点
const drawTreeNode = (x: number, y: number) => {
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
const drawConnectedLine = (treeNode1: BinaryTree, treeNode2: BinaryTree) => {
  const connectedLine = new Konva.Line({
    points: [treeNode1.pos!.x, treeNode1.pos!.y, treeNode2.pos!.x, treeNode2.pos!.y],
    stroke: 'black',
    strokeWidth: 2,
    lineCap: 'round',
    lineJoin: 'round'
  })
  canvasLayer?.add(connectedLine)
  canvasLayer?.draw()
}

// 核心算法：数据加工，计算 pos
// layoutTree 比 sourceTree 多 position
const createLayoutTree = (sourceTree: BinaryTree) => {
  const layoutTree: BinaryTree = structuredClone(sourceTree)
  let posX = HELPER_GRID_SIZE
  // 中序遍历
  // 计算规则
  // 位置由遍历顺序决定，每往下遍历一次，x 往右移一位，y === 深度
  // 缺点：树不够紧凑，浪费空间
  const knuth_layout = (tree: BinaryTree, depth: number) => {
    tree.left && knuth_layout(tree.left, depth + 1)
    tree.pos = { x: posX, y: depth * HELPER_GRID_SIZE + HELPER_GRID_SIZE }
    posX += HELPER_GRID_SIZE
    tree.right && knuth_layout(tree.right, depth + 1)
  }

  knuth_layout(layoutTree, 0)

  return layoutTree
}

// 后序遍历，连线绘制二叉树
const drawTree = (tree: BinaryTree) => {
  if (tree.left) {
    drawConnectedLine(tree, tree.left)
    drawTree(tree.left)
  }
  if (tree.right) {
    drawConnectedLine(tree, tree.right)
    drawTree(tree.right)
  }
  drawTreeNode(tree.pos?.x!, tree.pos?.y!)
}

export const layoutF1 = (sourceTree: BinaryTree) => {
  const layoutTree = createLayoutTree(sourceTree)
  drawTree(layoutTree)
}
