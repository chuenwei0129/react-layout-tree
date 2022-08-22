// 数据模型
export type SourceTree = {
  val: string
  children: SourceTree[]
}

export class LayoutTree {
  // 节点数据
  public data: any
  // 坐标
  public x: number
  public y: number
  // 父节点
  public parent: LayoutTree | undefined
  // 子节点
  public children: LayoutTree[]
  // 根据左兄弟定位的 x 与根据子节点中间定位的 x 之差
  public offset: number
  // 指向自身
  public ancestor: LayoutTree
  // 同一层级节点索引，从 1 开始
  // public index: number
  // 获取同一层级第一个兄弟节点，定义时都为 undefined
  private _firstSibling: LayoutTree | undefined
  // 线程节点，也就是指向下一个轮廓节点，定义时都为 undefined
  public thread: LayoutTree | undefined

  constructor(tree: SourceTree, depth = 0, parent: LayoutTree | undefined = undefined) {
    this.data = tree.val
    this.x = -1
    this.y = depth
    this.parent = parent
    this.children = tree.children.map((child, index) => {
      return new LayoutTree(child, depth + 1, this)
    })
    this.offset = 0
    this.thread = undefined
    this._firstSibling = undefined
    this.ancestor = this
    // this.index = index
  }

  // 关联了线程则返回线程节点，否则返回最右侧的子节点，也就是树的右轮廓的下一个节点
  nextRight() {
    return (
      this.thread ??
      (this.children.length > 0 ? this.children[this.children.length - 1] : undefined)
    )
  }

  // 关联了线程则返回线程节点，否则返回最左侧的子节点，也就是树的左轮廓的下一个节点
  nextLeft() {
    return this.thread ?? (this.children.length > 0 ? this.children[0] : undefined)
  }

  // 获取前一个兄弟节点
  leftSibling() {
    // 根节点返回 undefined
    let node = undefined
    if (this.parent) {
      for (let i = 0; i < this.parent.children.length; i++) {
        // 如果节点为自身就返回 null
        if (this.parent.children[i] === this) {
          return node
        } else {
          node = this.parent.children[i]
        }
      }
    }
    return node
  }

  // 获取同一层级第一个兄弟节点，如果第一个是自身，那么返回 undefined
  firstSibling() {
    // root 节点，父节点只有一个子节点，都返回 undefined
    if (this.parent && this !== this.parent.children[0] && !this._firstSibling) {
      this._firstSibling = this.parent.children[0]
    }
    return this._firstSibling
  }
}
