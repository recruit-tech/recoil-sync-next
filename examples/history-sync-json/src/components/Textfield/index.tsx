import { string } from '@recoiljs/refine'
import { useRecoilState } from 'recoil'
import { syncEffect } from 'recoil-sync'
import { atomWithInitialValue } from 'recoil-sync-next'

import styles from './index.module.css'

export const textState = atomWithInitialValue<string>({
  key: 'textState',
  effects: [syncEffect({ refine: string() })],
})

export const Textfield: React.FC = () => {
  const [text, setText] = useRecoilState(textState('Recoil'))

  return (
    <div className={styles.wrapper}>
      <input value={text} onChange={(e) => setText(e.currentTarget.value)} />
    </div>
  )
}
