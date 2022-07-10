import { number } from '@recoiljs/refine'
import { syncEffect } from 'recoil-sync'
import { atomFamilyWithInitialValue } from 'recoil-sync-next'

export const counter = atomFamilyWithInitialValue<number>({
  key: 'counterState',
  effects: [syncEffect({ storeKey: 'url-json-store', refine: number() })],
})
