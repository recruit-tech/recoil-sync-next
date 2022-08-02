import {
  SerializableParam,
  atom,
  selectorFamily,
  RecoilState,
  AtomOptions,
} from 'recoil'

export function atomWithInitialValue<T extends SerializableParam>(
  options: Omit<AtomOptions<T>, 'default'>
): (initialValue: T) => RecoilState<T> {
  const baseAtom: RecoilState<T> = atom<T>({
    ...options,
    default: undefined,
  })

  const evaluationSelector = selectorFamily<T, T>({
    key: `${options.key}::withInitialValue`,
    get:
      (initialValue) =>
      ({ get }) =>
        get(baseAtom) ?? initialValue,
    set:
      () =>
      ({ set }, newValue) =>
        set(baseAtom, newValue),
  })

  return (initialValue) => {
    return evaluationSelector(initialValue)
  }
}
