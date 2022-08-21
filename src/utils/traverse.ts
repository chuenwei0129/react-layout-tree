import type { LayoutTree } from '../renderer/model'

// 通用遍历
// ord = 0 -> 先序
// ord < 0 || ord >= tree.children.length -> 后序
// ord = (0, tree.children.length) -> 中序
export function* traverse(tree: LayoutTree, ord = 0): Generator<LayoutTree> {
  let traversed = false
  if (!tree.children) {
    yield tree
    return
  }
  for (let i = 0; i < tree.children.length; i++) {
    if (i === ord) {
      traversed = true
      yield tree
    }
    yield* traverse(tree.children[i], ord)
  }
  !traversed && (yield tree)
}
