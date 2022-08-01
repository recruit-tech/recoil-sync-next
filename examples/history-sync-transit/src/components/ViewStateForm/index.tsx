import { custom } from '@recoiljs/refine'
import { atom, useRecoilState } from 'recoil'
import { syncEffect } from 'recoil-sync'

import styles from './index.module.css'

export class ViewState {
  constructor(public active: boolean, public pos: [number, number]) {}
}

const viewStateChecker = custom((x) => (x instanceof ViewState ? x : null))
const viewState = atom<ViewState>({
  key: 'viewState',
  default: new ViewState(true, [1, 2]),
  effects: [
    syncEffect({ storeKey: 'history-transit-store', refine: viewStateChecker }),
  ],
})

export const ViewStateForm: React.FC = () => {
  const [state, setState] = useRecoilState(viewState)
  const toggleActive = () => setState(new ViewState(!state.active, state.pos))
  const incrementPos = () =>
    setState(new ViewState(state.active, [state.pos[0] + 1, state.pos[1] + 1]))

  return (
    <div>
      <div className={styles.row}>
        active:{' '}
        <input type="checkbox" checked={state.active} onChange={toggleActive} />
      </div>
      <div className={styles.row}>
        <div>pos: {JSON.stringify(state.pos)}</div>
        <button onClick={incrementPos}>increment</button>
      </div>
    </div>
  )
}
