import type { LayoutTree } from '../data/model'

// 同树的轮廓算法
export const f2 = (layoutTree: LayoutTree) => {
  // 同深度节点坐标指针，指针会在再次遍历到这一层时指向同层的下个节点坐标，数组存储的是所有深度的指针的集合
  const sameLayerNextPosXGroup: number[] = []
  // 先序遍历
  const preOrder = (tree: LayoutTree, depth = 0) => {
    // 树每一层第一个节点的 x 坐标都设置为 0
    if (sameLayerNextPosXGroup[depth] === undefined) {
      sameLayerNextPosXGroup[depth] = 0
    }
    tree.x = sameLayerNextPosXGroup[depth]
    // 指针指向同层下个节点的 x 坐标
    // 为了与算法三对比此处 +2，一般 +1
    sameLayerNextPosXGroup[depth] += 2
    tree.children.forEach(child => {
      preOrder(child, depth + 1)
    })
  }

  preOrder(layoutTree)
}
