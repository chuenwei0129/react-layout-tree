import { LayoutTree } from '../renderer/model'

// 1.当前节点是叶子节点且无左兄弟，x 设为 0
// 2.当前节点是叶子节点且有左兄弟，x 为左兄弟的 x 加上间距，即根据左兄弟定位
// 3.当前节点非叶子节点且有左兄弟，x 为左兄弟的 x 加上间距，x 相对子节点定位的差值保存到 offset 属性上
// 4.当前节点非叶子节点且无左兄弟，x 为第一个子节点的 x 加上最后一个子节点的 x 除以 2，即根据子节点定位

// d3 数据分析
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
    let defaultAncestor = tree.children[0]
    tree.children.forEach(child => {
      firstLoop(child)
      defaultAncestor = initThread(child, distance, defaultAncestor)
    })

    // 将 shift 分摊添加到中间的节点上，也就是添加到节点的 x 及mod值上
    handleShift(tree)

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

// 初始化线程
const initThread = (tree: LayoutTree, distance: number, defaultAncestor: LayoutTree) => {
  // 兄弟节点存在才需要线程连接
  if (tree.leftSibling()) {
    // 初始化
    // 指针指向当前节点的左兄弟节点
    //      1
    //   2      3
    // 4  5   6   7
    // 函数入口是 3
    // 1-2-5 左树右轮廓指针
    // 1-2-4 左树左轮廓指针
    let leftTreeRightOutLine = tree.leftSibling()!
    // 指针指向当前节点的最左侧的兄弟节点，当只有一个左兄弟节点时，和 leftSibling 相等
    let leftTreeLeftOutLine = tree.firstSibling()!
    // 指针当指向前节点的左轮廓
    let rightTreeLeftOutLine = tree
    // 当只有一个节点时左轮廓 === 右轮廓
    let rightTreeRightOutLine = tree

    // 获取节点偏移量
    let leftTreeRightOutLineOffset = leftTreeRightOutLine.offset
    let leftTreeLeftOutLineOffset = leftTreeLeftOutLine.offset
    let rightTreeLeftOutLineOffset = rightTreeLeftOutLine.offset
    let rightTreeRightOutLineOffset = rightTreeRightOutLine.offset

    // 往树下一层遍历
    while (leftTreeRightOutLine.nextRight() && rightTreeLeftOutLine.nextLeft()) {
      // ...
      // 更新指针
      leftTreeRightOutLine = leftTreeRightOutLine.nextRight()!
      rightTreeLeftOutLine = rightTreeLeftOutLine.nextLeft()!
      leftTreeLeftOutLine = leftTreeLeftOutLine.nextLeft()!
      rightTreeRightOutLine = rightTreeRightOutLine.nextRight()!

      // 节点下面的每一层右轮廓节点都关联当前节点
      rightTreeLeftOutLine.ancestor = tree

      // 计算真实 x 是否交叉，真实 x 依赖父节点的 offset
      let diff =
        leftTreeRightOutLine.x +
        leftTreeRightOutLineOffset -
        (rightTreeLeftOutLine.x + rightTreeLeftOutLineOffset)
      let shift = diff + distance
      // 规则：当节点间距比 distance 小时就需要移动
      if (shift > 0) {
        let ancestor = handleAncestor(leftTreeRightOutLine, tree, defaultAncestor)
        // 移位
        moveCurrTree(tree, shift, ancestor)
        // 更新移位后偏移量
        leftTreeRightOutLineOffset += shift
        rightTreeLeftOutLineOffset += shift
      }

      // 循环处理 offset，一个子节点可能其祖父位移 1，父亲位移 2，那么累加的 offset 就是 1 + 2
      leftTreeRightOutLineOffset += leftTreeRightOutLine.offset
      rightTreeLeftOutLineOffset += rightTreeLeftOutLine.offset
      leftTreeLeftOutLineOffset = leftTreeLeftOutLineOffset + leftTreeLeftOutLine.offset
      rightTreeRightOutLineOffset = rightTreeRightOutLineOffset + rightTreeRightOutLine.offset
    }

    // 指针都指向了树底部节点，此时连接线程节点
    // 右树右轮廓指向左树右轮廓
    if (leftTreeRightOutLine.nextRight() && !rightTreeRightOutLine.nextRight()) {
      rightTreeRightOutLine.thread = leftTreeRightOutLine.nextRight()
      // 修正因为线程影响导致 offset 累加出错的问题
      rightTreeRightOutLine.offset += leftTreeRightOutLineOffset - rightTreeRightOutLineOffset
    } else {
      // 左树左轮廓指向右树左轮廓
      if (rightTreeLeftOutLine.nextLeft() && !leftTreeLeftOutLine.nextLeft()) {
        leftTreeLeftOutLine.thread = rightTreeLeftOutLine.nextLeft()
        leftTreeLeftOutLine.offset += rightTreeLeftOutLineOffset - leftTreeLeftOutLineOffset
      }

      defaultAncestor = tree
    }
  }

  return defaultAncestor
}

const moveCurrTree = (tree: LayoutTree, shift: number, ancestor: LayoutTree) => {
  let subTrees = tree.index - ancestor.index // 索引相减，得到之间被分隔的数量
  let average = shift / subTrees // 平分偏移量
  tree.shift += shift // 完整的shift值添加到v节点的shift属性上
  tree.change -= average
  ancestor.change += average

  tree.x += shift // 自身移动
  // 后序遍历后代节点比父节点先确定位置，所以自身节点立即移动，后代节点保存移动值到 offset 后续处理
  tree.offset += shift // 后代节点移动
}

// 应用分摊
const handleShift = (tree: LayoutTree) => {
  let [change, shift] = [0, 0]
  // 从后往前遍历子节点
  for (let i = tree.children.length - 1; i >= 0; i--) {
    let node = tree.children[i]
    node.x += shift
    node.offset += shift

    change += node.change
    shift += node.shift + change
  }
}

// 找出节点所属的根节点
const handleAncestor = (
  leftTreeRightOutLine: LayoutTree,
  tree: LayoutTree,
  defaultAncestor: LayoutTree
) => {
  if (tree.parent!.children.includes(leftTreeRightOutLine.ancestor)) {
    return leftTreeRightOutLine.ancestor
  } else {
    return defaultAncestor
  }
}

export const f6 = (layoutTree: LayoutTree) => {
  firstLoop(layoutTree)
  secondLoop(layoutTree)
}
