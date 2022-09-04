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
  TFieldValues extends FieldValues = FieldValues,
  TContext = any
> = UseFormReturn<TFieldValues, TContext> & { onChangeForm: () => void }

export function useFormSync<
  TFieldValues extends FieldValues = FieldValues,
  TContext = any
>(
  formState: RecoilState<TFieldValues>,
  props?: Omit<UseFormProps<TFieldValues, TContext>, 'defaultValues'>
): UseFormSyncReturn<TFieldValues> {
  const getDefaultValues = useRecoilCallback(
    ({ snapshot }) =>
      () => {
        return snapshot.getLoadable(formState).contents
      },
    []
  )
  const defaultValuesRef = useRef<DeepPartial<TFieldValues>>()
  defaultValuesRef.current ??= getDefaultValues()

  const {
    getValues,
    reset: resetForm,
    ...rest
  } = useForm<TFieldValues, TContext>({
    ...props,
    defaultValues: defaultValuesRef.current,
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
