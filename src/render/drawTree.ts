import { drawConnectedLine, drawTreeNode, HELPER_GRID_SIZE } from '.'
import { Tree } from './data'

// 计算树节点位置
const createPosition2Tree = (tree: Tree) => {
  tree.x! *= HELPER_GRID_SIZE
  tree.x! += HELPER_GRID_SIZE

  tree.y! *= HELPER_GRID_SIZE
  tree.y! += HELPER_GRID_SIZE

  tree.children.forEach(createPosition2Tree)
}

// 核心算法，同树的轮廓
const createLayoutTree = (sourceTree: Tree) => {
  const layoutTree: Tree = structuredClone(sourceTree)

  const outLine: number[] = []
  const minimum_ws = (tree: Tree, depth = 0) => {
    // 维持树每一层第一个节点的 x 为 0
    if (outLine[depth] === undefined) {
      outLine[depth] = 0
    }
    tree.x = outLine[depth]
    tree.y = depth
    // 同层下个节点的 x
    outLine[depth]++
    tree.children.forEach(child => {
      minimum_ws(child, depth + 1)
    })
  }

  minimum_ws(layoutTree)

  createPosition2Tree(layoutTree)

  return layoutTree
}

// 绘制多叉树
const drawLayoutTree = (tree: Tree) => {
  tree.children.forEach(child => {
    drawConnectedLine(tree, child)
    drawLayoutTree(child)
  })
  drawTreeNode(tree.x!, tree.y!)
}

export const layoutF2 = (sourceTree: Tree) => {
  const layoutTree = createLayoutTree(sourceTree)
  drawLayoutTree(layoutTree)
}
