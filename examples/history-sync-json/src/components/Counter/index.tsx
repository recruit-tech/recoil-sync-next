import { number } from '@recoiljs/refine'
import { useRecoilState } from 'recoil'
import { syncEffect } from 'recoil-sync'
import { initializableAtomFamily } from 'recoil-sync-next'

import styles from './index.module.css'

export const counter = initializableAtomFamily<number, string>({
  key: 'counterState',
  effects: [syncEffect({ refine: number() })],
})

export type Props = {
  name: string
  initialValue: number
}

export const Counter: React.FC<Props> = ({ name, initialValue }) => {
  const [count, setCount] = useRecoilState(counter(name, initialValue))

  return (
    <div key={name} className={styles.wrapper}>
      <div>
        count[{name}]: {count}
      </div>
      <div>
        <button onClick={() => setCount((prev) => prev + 1)}>+</button>
        <button onClick={() => setCount((prev) => prev - 1)}>-</button>
      </div>
    </div>
  )
}
