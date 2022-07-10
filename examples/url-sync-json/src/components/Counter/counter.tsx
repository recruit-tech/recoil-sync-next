import { useRecoilState } from 'recoil'
import styles from './index.module.css'
import { counter } from './recoil'

export const Counter = () => {
  const [count, setCount] = useRecoilState(counter('foo', 0))

  return (
    <div className={styles.wrapper}>
      <div>count: {count}</div>
      <button onClick={() => setCount((prev) => prev + 1)}>increment</button>
    </div>
  )
}
