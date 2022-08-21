import { LayoutTree } from '../renderer/model'

// 1.当前节点是叶子节点且无左兄弟，x 设为 0
// 2.当前节点是叶子节点且有左兄弟，x 为左兄弟的 x 加上间距，即根据左兄弟定位
// 3.当前节点非叶子节点且有左兄弟，x 为左兄弟的 x 加上间距，x 相对子节点定位的差值保存到 offset 属性上
// 4.当前节点非叶子节点且无左兄弟，x 为第一个子节点的 x 加上最后一个子节点的 x 除以 2，即根据子节点定位

// 分析
// 0 -> (0, 2)
// 1 -> (0, 3) 1.5
// 2 -> (1, 3) 0.5
// 3 -> (1, 2) <-> mid = 0.5 offset = 1 - 0.5 = 0.5
// 4 -> (0.5, 1) <-> mid = 0.5
// 5 -> (0, 3) ------------ 1.5
// 6 -> (0, 2) <-> mid = 0 -------- 1.5
// 7 -> (1.5, 1) <-> mid = 0, offset = 1.5
// 8 -> (1, 0) <-> mid = 1

const firstLoop = (tree: LayoutTree, distance = 1) => {
  // 后序遍历
  tree.children.forEach(child => {
    firstLoop(child)
  })

  // 定位策略
  if (tree.children.length === 0) {
    // 叶子节点
    if (tree.leftSibling()) {
      // 有左兄弟
      tree.x = tree.leftSibling()!.x + distance
    } else {
      // 无左兄弟
      tree.x = 0
    }
  } else {
    // 非叶子节点
    let mid = (tree.children[0].x + tree.children[tree.children.length - 1].x) / 2
    if (tree.leftSibling()) {
      tree.x = tree.leftSibling()!.x + distance
      tree.offset = tree.x - mid
    } else {
      tree.x = mid
    }
  }
}

// 第二次遍历
// 默认偏移量为 0，即不偏移
// 原理：后序遍历，子节点先于父节点确定位置，父节点要美观须相对于子节点定位即在 mid 处，但为了不与左兄弟交叉
// 实际位置为左兄弟加间距，所以计算出差值做为其子节点的偏移值。
const secondLoop = (tree: LayoutTree, defaultOffset = 0) => {
  tree.x += defaultOffset
  tree.children.forEach(child => {
    secondLoop(child, defaultOffset + tree.offset)
  })
}

export const f4 = (layoutTree: LayoutTree) => {
  firstLoop(layoutTree)
  secondLoop(layoutTree)
  console.log(layoutTree)
}
