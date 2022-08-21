import type { LayoutTree } from '../renderer/model'
import { traverse } from '../utils/traverse'

export const f1 = (layoutTree: LayoutTree) => {
  // 中序遍历
  // 位置由遍历顺序决定，x 随遍历次序往右一位一位移动
  // 遍历开始时的 x 值为 1 时，第一个渲染的节点坐标为 (0, depth)
  let traverseStartX = 1
  ;[...traverse(layoutTree, 1)].forEach(tree => {
    // 每个节点 x 都被初始化为 -1，y 为深度
    tree.x += traverseStartX
    traverseStartX++
  })
}
