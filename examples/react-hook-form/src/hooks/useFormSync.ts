import { useCallback, useRef } from 'react'
import {
  DeepPartial,
  FieldValues,
  useForm,
  UseFormProps,
  UseFormReturn,
} from 'react-hook-form'
import {
  RecoilState,
  useRecoilCallback,
  useResetRecoilState,
  useSetRecoilState,
} from 'recoil'

type UseFormSyncReturn<
  TFieldValues extends FieldValues,
  TContext = any
> = UseFormReturn<TFieldValues, TContext> & { onChangeForm: () => void }

export function useFormSync<TFieldValues extends FieldValues, TContext = any>(
  formState: RecoilState<TFieldValues>,
  props?: Omit<UseFormProps<TFieldValues, TContext>, 'defaultValues'>
): UseFormSyncReturn<TFieldValues, TContext> {
  const getDefaultValues = useRecoilCallback(
    ({ snapshot }) =>
      () => {
        const formLoadable = snapshot.getLoadable(formState)
        if (formLoadable.state !== 'hasValue') {
          throw new Error('useFormSync: not support async state.')
        }
        return formLoadable.contents
      },
    []
  )
  const defaultValuesRef = useRef<TFieldValues>()
  defaultValuesRef.current ??= getDefaultValues()

  const {
    getValues,
    reset: resetForm,
    ...rest
  } = useForm<TFieldValues, TContext>({
    ...props,
    // `DeepPartial` is expected to be removed in the future
    // https://github.com/react-hook-form/react-hook-form/issues/8510#issuecomment-1157129666
    defaultValues: defaultValuesRef.current as DeepPartial<TFieldValues>,
  })

  const setFormValues = useSetRecoilState(formState)
  const onChangeForm = useCallback(() => {
    setFormValues(getValues())
  }, [setFormValues, getValues])

  const resetState = useResetRecoilState(formState)
  const reset = useCallback(() => {
    resetState()
    resetForm(getDefaultValues())
  }, [getDefaultValues, resetForm, resetState])

  return { ...rest, getValues, reset, onChangeForm }
}
