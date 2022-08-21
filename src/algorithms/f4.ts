import { LayoutTree } from '../renderer/model'
import { traverse } from '../utils/traverse'

// const moveOffset = (tree: LayoutTree, offset = 0) => {
//   tree.x += offset
//   tree.children.forEach(child => {
//     moveOffset(child, offset + tree.offset)
//   })
//   return tree
// }

const getOutLine = (tree: LayoutTree, leftOutLine: number[] = [], rightOutLine: number[] = []) => {
  ;[...traverse(tree, -1)].forEach(tree => {
    if (tree.children.length === 0) {
      tree.x = 0
    } else if (tree.children.length === 1) {
      tree.x = tree.children[0].x + 1
    } else {
      tree.x = (tree.children[0].x + tree.children[1].x) / 2
    }

    leftOutLine[tree.y] = leftOutLine[tree.y] ?? tree.x
    rightOutLine[tree.y] = tree.x
  })
  console.log(leftOutLine)
  console.log(rightOutLine)
}

export const f4 = (layoutTree: LayoutTree) => {
  getOutLine(layoutTree)
}
