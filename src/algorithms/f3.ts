import { LayoutTree } from '../renderer/model'

// 后序遍历
// 测试数据值就是遍历数据顺序
// 注释掉 moveOffset，按遍历顺序确定树的坐标，叶子节点按算法 2 确定坐标，非叶子节点动态计算，并与算法 2 计算的位置比较是否需要偏移，如需偏移立即偏移，如此递归
// 按遍历树的顺序来看，叶子节点一定在非叶子节点之前确定坐标，所以偏移不会影响叶子节点
// 但叶子节点位置已经确定，所以需要移动来保持树的美观，此时把节点偏移值保存起来，等到遍历结束，在重新遍历一次树来移动节点
// 从测试数据看，3、6 的偏移值都为 1，所以其子节点都要相应的向右移动 1
const postOrder = (
  tree: LayoutTree,
  depth = 0,
  sameLayerNextPosXGroup: number[] = [],
  offset: number[] = []
) => {
  tree.children.forEach(child => {
    postOrder(child, depth + 1, sameLayerNextPosXGroup, offset)
  })

  let posX: number

  if (sameLayerNextPosXGroup[depth] === undefined) {
    sameLayerNextPosXGroup[depth] = 0
  }

  if (offset[depth] === undefined) {
    offset[depth] = 0
  }

  if (tree.children.length === 0) {
    // 没有子节点
    posX = sameLayerNextPosXGroup[depth]
    tree.x = posX
  } else if (tree.children.length === 1) {
    // 只有一个子节点
    posX = tree.children[0].x - 1
  } else {
    // 有两个子节点
    posX = (tree.children[0].x + tree.children[1].x) / 2
  }

  // 计算偏移量
  offset[depth] = Math.max(offset[depth], sameLayerNextPosXGroup[depth] - posX)

  // 3 和 6 都偏移了 1
  // console.log(offset[depth])

  // 非叶子节点立即偏移
  if (tree.children.length > 0) {
    tree.x = posX + offset[depth]
  }

  // 让父节点居中，所以加 2
  sameLayerNextPosXGroup[depth] += 2

  // 偏移量
  tree.offset = offset[depth]
}

const moveOffset = (tree: LayoutTree, defaultOffset = 0) => {
  // 子节点按偏移量移动
  tree.x += defaultOffset
  tree.children.forEach(child => {
    // 3, 6 有 offset
    moveOffset(child, tree.offset + defaultOffset)
  })
}

export const f3 = (tree: LayoutTree) => {
  postOrder(tree)
  moveOffset(tree)
}
