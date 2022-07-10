import { number } from '@recoiljs/refine'
import { useRecoilState } from 'recoil'
import { syncEffect } from 'recoil-sync'
import { atomFamilyWithInitialValue } from 'recoil-sync-next'

import styles from './index.module.css'

export const counter = atomFamilyWithInitialValue<number, string>({
  key: 'counterState',
  effects: [syncEffect({ storeKey: 'url-json-store', refine: number() })],
})

export const Counter = () => {
  const [count, setCount] = useRecoilState(counter('foo', 0))

  return (
    <div className={styles.wrapper}>
      <div>count: {count}</div>
      <button onClick={() => setCount((prev) => prev + 1)}>increment</button>
    </div>
  )
}
