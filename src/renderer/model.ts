// 数据模型
export type SourceTree = {
  val: string
  children: SourceTree[]
}

export class LayoutTree {
  public x: number
  public y: number
  public children: LayoutTree[]
  public offset: number
  constructor(public tree: SourceTree, depth = 0) {
    this.x = -1
    this.y = depth
    this.offset = 0
    this.children = tree.children.map(child => {
      return new LayoutTree(child, depth + 1)
    })
  }
}
