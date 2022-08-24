import { LayoutTree } from '../data/model'

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
  // 后序遍历
  tree.children.forEach(child => {
    firstLoop(child)
    // 初始化线程
    // 自下而上，生成节点 x 位置 !important
    // 因为我们是后序遍历树，所以 x 确定位置要先于线程连接
    // 越下层的节点线程连接的越早
    // 处理子树冲突时，其下层的节点线程已经连接完璧
    connectThread(child, distance)
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

// 连接线程节点
const connectThread = (tree: LayoutTree, distance: number) => {
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

    // 往树下一层遍历
    while (leftTreeRightOutLine.nextRight() && rightTreeLeftOutLine.nextLeft()) {
      // 更新指针
      leftTreeRightOutLine = leftTreeRightOutLine.nextRight()!
      rightTreeLeftOutLine = rightTreeLeftOutLine.nextLeft()!
      leftTreeLeftOutLine = leftTreeLeftOutLine.nextLeft()!
      rightTreeRightOutLine = rightTreeRightOutLine.nextRight()!

      // 通过指针循环找到冲突的节点，计算出当前节点的移位长度
      handleShift(tree, leftTreeRightOutLine.x, rightTreeLeftOutLine.x, distance)
    }

    // 指针都指向了树底部节点，此时连接线程节点
    // 右树右轮廓指向左树右轮廓
    if (leftTreeRightOutLine.nextRight() && !rightTreeRightOutLine.nextRight()) {
      rightTreeRightOutLine.thread = leftTreeRightOutLine.nextRight()
    }

    // 左树左轮廓指向右树左轮廓
    if (rightTreeLeftOutLine.nextLeft() && !leftTreeLeftOutLine.nextLeft()) {
      leftTreeLeftOutLine.thread = rightTreeLeftOutLine.nextLeft()
    }
  }
}

// 当前子树，下一层左树右轮廓指针指向节点 x 坐标
const handleShift = (
  currTree: LayoutTree,
  nextLeftTreeRightOutLinePosX: number,
  nextRightTreeLeftOutLinePosX: number,
  distance: number
) => {
  // 移位处理
  // leftTreeRightOutLine.x - rightTreeLeftOutLine.x === 0 表示节点位置重合
  // 处理每一层子树的左右轮廓是否交叉
  let diff = nextLeftTreeRightOutLinePosX - nextRightTreeLeftOutLinePosX
  let shift = diff + distance
  // 移位
  if (shift > 0) {
    moveCurrTree(currTree, shift)
  }
}

// 节点位移
const moveCurrTree = (tree: LayoutTree, shift: number) => {
  tree.x += shift // 自身移动
  // 后序遍历后代节点比父节点先确定位置，所以自身节点立即移动，后代节点保存移动值到 offset 后续处理
  tree.offset += shift // 后代节点移动
}

export const f4 = (layoutTree: LayoutTree) => {
  firstLoop(layoutTree)
  secondLoop(layoutTree)
  // ;[...traverse(layoutTree, -1)].forEach(tree => {
  //   console.log(tree.data, tree.thread)
  // })
}
