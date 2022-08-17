// 多叉树
export type Tree = {
  val: string
  x?: number
  y?: number
  children: Tree[]
}

export const treeData: Tree = {
  val: '5',
  children: [
    {
      val: '3',
      children: [
        // {
        //   val: '0',
        //   children: []
        // },
        // {
        //   val: '4',
        //   children: []
        // }
      ]
    },
    {
      val: '6',
      children: [
        {
          val: '1',
          children: [
            {
              val: 'x',
              children: []
            },
            {
              val: 'x',
              children: []
            }
          ]
        },
        {
          val: '8',
          children: [
            {
              val: 'x',
              children: [
                {
                  val: 'x',
                  children: []
                },
                {
                  val: 'x',
                  children: []
                }
              ]
            },
            {
              val: 'x',
              children: [
                // {
                //   val: 'x',
                //   children: []
                // },
                // {
                //   val: 'x',
                //   children: []
                // }
              ]
            }
          ]
        }
      ]
    }
  ]
}

export const sourceTree = {
  val: '0',
  children: [
    {
      val: '0-1',
      children: [
        {
          val: '0-1-1',
          children: [
            {
              val: '0-1-1-1',
              children: [
                {
                  val: '0-1-1-1-1',
                  children: [
                    {
                      val: '0-1-1-1-1',
                      children: []
                    },
                    {
                      val: '0-1-1-1-1-2',
                      children: []
                    }
                  ]
                },
                {
                  val: '0-1-1-1-2',
                  children: []
                }
              ]
            },
            {
              val: '0-1-1-2',
              children: []
            }
          ]
        },
        {
          val: '0-1-2',
          children: []
        }
      ]
    },
    {
      val: '0-2',
      children: [
        {
          val: '0-2-1',
          children: [
            {
              val: '0-2-1-1',
              children: []
            },
            {
              val: '0-2-1-2',
              children: []
            }
          ]
        },
        {
          val: '0-2-2',
          children: [
            {
              val: '0-2-2-1',
              children: []
            }
          ]
        }
      ]
    }
  ]
}
