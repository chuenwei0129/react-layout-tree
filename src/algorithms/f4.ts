import { LayoutTree } from '../renderer/model'

const moveOffset = (tree: LayoutTree, offset = 0) => {
  tree.x += offset
  tree.children.forEach(child => {
    moveOffset(child, offset + tree.offset)
  })
  return tree
}

export const f4 = (layoutTree: LayoutTree) => {
  console.log(layoutTree)
}
