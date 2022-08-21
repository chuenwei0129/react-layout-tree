// 数据模型
export type SourceTree = {
  val: string
  children: SourceTree[]
}

export class LayoutTree {
  // 节点内热
  public val: string
  // 坐标
  public x: number
  public y: number
  // 子节点
  public children: LayoutTree[]
  // 父节点
  public parent: LayoutTree | null
  // 线程节点，也就是指向下一个轮廓节点
  public thread: LayoutTree | null
  // 根据左兄弟定位的 x 与根据子节点中间定位的 x 之差
  public offset: number
  // 指向自身
  public ancestor: LayoutTree
  // 同一层级节点索引，从 1 开始
  // public index: number
  // 获取同一层级第一个兄弟节点，初始化时都为 null，动态赋值
  private _firstSibling: LayoutTree | null
  constructor(tree: SourceTree, depth = 0, parent: LayoutTree | null = null) {
    this.val = tree.val
    this.x = -1
    this.y = depth
    this.children = tree.children.map((child, index) => {
      return new LayoutTree(child, depth + 1, this)
    })
    this.parent = parent
    this.thread = null
    this.offset = 0
    this.ancestor = this
    this._firstSibling = null
    // this.index = index
  }

  // 关联了线程则返回线程节点，否则返回最右侧的子节点，也就是树的右轮廓的下一个节点
  right() {
    return (
      this.thread ?? (this.children.length > 0 ? this.children[this.children.length - 1] : null)
    )
  }

  // 关联了线程则返回线程节点，否则返回最左侧的子节点，也就是树的左轮廓的下一个节点
  left() {
    return this.thread ?? (this.children.length > 0 ? this.children[0] : null)
  }

  // 获取前一个兄弟节点
  leftSibling() {
    // 根节点返回 null
    let node = null
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

  // 获取同一层级第一个兄弟节点，如果第一个是自身，那么返回 null
  firstSibling() {
    // root 节点，父节点只有一个子节点，都返回 null
    if (this.parent && this !== this.parent.children[0] && !this._firstSibling) {
      this._firstSibling = this.parent.children[0]
    }
    return this._firstSibling
  }
}
