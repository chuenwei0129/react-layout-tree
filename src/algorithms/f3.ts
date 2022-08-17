import { LayoutTree } from '../renderer/model'

// 后序遍历绘制树
const postOrder = (
  tree: LayoutTree,
  depth = 0,
  sameDepthNextPosXGroup: number[] = [],
  offset: number[] = []
) => {
  tree.children.forEach(child => {
    postOrder(child, depth + 1, sameDepthNextPosXGroup, offset)
  })

  let posX: number

  if (sameDepthNextPosXGroup[depth] === undefined) {
    sameDepthNextPosXGroup[depth] = 0
  }

  if (offset[depth] === undefined) {
    offset[depth] = 0
  }

  if (tree.children.length === 0) {
    // 没有子节点
    posX = sameDepthNextPosXGroup[depth]
    tree.x = posX
  } else if (tree.children.length === 1) {
    // 只有一个子节点
    posX = tree.children[0].x - 1
  } else {
    // 有两个子节点
    posX = (tree.children[0].x + tree.children[1].x) / 2
  }

  // 计算偏移量
  offset[depth] = Math.max(offset[depth], sameDepthNextPosXGroup[depth] - posX)

  // 遍历顺序，就是子节点生成顺序
  if (tree.children.length > 0) {
    tree.x = posX + offset[depth]
  }

  // 让父节点居中，所以加 2
  sameDepthNextPosXGroup[depth] += 2

  // 偏移量
  tree.offset = offset[depth]
}

const moveOffset = (tree: LayoutTree, offset = 0) => {
  // 同层 offset 相等
  tree.x = tree.x + offset
  offset = tree.offset + offset
  tree.children.forEach(child => {
    moveOffset(child, offset)
  })
}

export const f3 = (tree: LayoutTree) => {
  postOrder(tree)
  moveOffset(tree)
}
