// 多叉树
export type Tree = {
  val: string
  x?: number
  y?: number
  children: Tree[]
}

export const treeData: Tree = {
  val: '0',
  children: [
    {
      val: '0-0',
      children: [
        {
          val: '0-0-0',
          children: [
            {
              val: '0-0-0-0',
              children: [
                {
                  val: '0-0-0-0-0',
                  children: []
                },
                {
                  val: '0-0-0-0-1',
                  children: []
                }
              ]
            },
            {
              val: '0-0-0-1',
              children: []
            }
          ]
        },
        {
          val: '0-0-1',
          children: []
        }
      ]
    },
    {
      val: '0-1',
      children: [
        {
          val: '0-1-0',
          children: [
            {
              val: '0-1-0-0',
              children: []
            },
            {
              val: '0-1-0-1',
              children: []
            }
          ]
        },
        {
          val: '0-1-1',
          children: [
            {
              val: '0-1-1-0',
              children: []
            }
          ]
        }
      ]
    }
  ]
}
