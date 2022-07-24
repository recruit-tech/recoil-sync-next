import { string } from '@recoiljs/refine'
import { atom, useRecoilState } from 'recoil'
import { syncEffect } from 'recoil-sync'

import styles from './index.module.css'

export const textState = atom<string>({
  key: 'textState',
  default: '',
  effects: [syncEffect({ refine: string() })],
})

export const Textfield: React.FC = () => {
  const [text, setText] = useRecoilState(textState)

  return (
    <div className={styles.wrapper}>
      <input value={text} onChange={(e) => setText(e.currentTarget.value)} />
    </div>
  )
}
