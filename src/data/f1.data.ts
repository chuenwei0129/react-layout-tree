import { SourceTree } from './model'

export const d1: SourceTree = {
  val: '5',
  children: [
    {
      val: '1',
      children: [
        {
          val: '0',
          children: []
        },
        {
          val: '3',
          children: [
            {
              val: '2',
              children: []
            },
            {
              val: '4',
              children: []
            }
          ]
        }
      ]
    },
    {
      val: '8',
      children: [
        {
          val: '7',
          children: [
            {
              val: '6',
              children: []
            }
          ]
        }
      ]
    }
  ]
}
