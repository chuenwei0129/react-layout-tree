import Konva from 'konva'
import { canvasLayer, HELPER_GRID_SIZE } from './demo'

type SourceTree = {
  val: string
  children: SourceTree[]
}

class LayoutTree {
  public x: number
  public y: number
  public children: LayoutTree[]
  public offset: number
  constructor(public tree: SourceTree, depth = 0) {
    this.x = -1
    this.y = depth
    this.children = tree.children.map(child => {
      return new LayoutTree(child, depth + 1)
    })
    this.offset = 0
  }
}

// 计算树节点位置
const setTreeNodePosition = (tree: LayoutTree) => {
  tree.x! *= HELPER_GRID_SIZE
  tree.x! += HELPER_GRID_SIZE

  tree.y! *= HELPER_GRID_SIZE
  tree.y! += HELPER_GRID_SIZE

  tree.children.forEach(setTreeNodePosition)
  return tree
}

// const move_right = (branch: LayoutTree, n: number) => {
//   branch.x += n
//   branch.children.forEach(child => {
//     move_right(child, n)
//   })
// }

// 后序遍历，自下而上
//
const setPosition = (
  tree: LayoutTree,
  depth = 0,
  outLine: number[] = [],
  offset: number[] = []
) => {
  tree.children.forEach(child => {
    setPosition(child, depth + 1, outLine, offset)
  })
  let posX: number

  if (outLine[depth] === undefined) {
    outLine[depth] = 0
  }

  if (offset[depth] === undefined) {
    offset[depth] = 0
  }

  // 0 2 2 4 6
  if (tree.children.length === 0) {
    // 没有子节点
    posX = outLine[depth]
    tree.x = posX
  } else if (tree.children.length === 1) {
    // 只有一个子节点
    posX = tree.children[0].x - 1
  } else {
    // 有两个子节点
    posX = (tree.children[0].x + tree.children[1].x) / 2
  }

  // 计算偏移量
  offset[depth] = Math.max(offset[depth], outLine[depth] - posX)

  // 遍历顺序，就是子节点生成顺序
  if (tree.children.length > 0) {
    tree.x = posX + offset[depth]
  }

  // 让父节点居中，所以加 2
  outLine[depth] += 2

  // 偏移量
  tree.offset = offset[depth]
}

const move = (tree: LayoutTree, offset = 0) => {
  // 同层 offset 相等
  tree.x = tree.x + offset
  offset = tree.offset + offset
  tree.children.forEach(child => {
    move(child, offset)
  })
}

// 核心算法
const createLayoutTree = (sourceTree: SourceTree) => {
  const layoutTree: LayoutTree = new LayoutTree(structuredClone(sourceTree))
  setPosition(layoutTree)
  move(layoutTree)
  setTreeNodePosition(layoutTree)
  return layoutTree
}

// 绘制布局树节点
const drawTreeNode = (x: number, y: number) => {
  const treeNode = new Konva.Circle({
    // 圆心坐标
    x,
    y,
    radius: HELPER_GRID_SIZE / 6,
    fill: '#fff',
    stroke: 'black',
    strokeWidth: 2
  })
  canvasLayer?.add(treeNode)
  canvasLayer?.draw()
}

// 绘制布局树节点连接线
const drawConnectedLine = (treeNode1: LayoutTree, treeNode2: LayoutTree) => {
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

// // 绘制多叉树
const drawLayoutTree = (tree: LayoutTree) => {
  tree.children.forEach(child => {
    drawConnectedLine(tree, child)
    drawLayoutTree(child)
  })
  drawTreeNode(tree.x!, tree.y!)
}

export const layoutF3 = (sourceTree: SourceTree) => {
  const layoutTree = createLayoutTree(sourceTree)
  console.log(layoutTree)
  drawLayoutTree(layoutTree)
}
