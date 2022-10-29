import { useCallback, useRef } from 'react'
import {
  DeepPartial,
  FieldPath,
  FieldValues,
  InternalFieldName,
  RegisterOptions,
  Resolver,
  useFieldArray,
  UseFieldArrayAppend,
  UseFieldArrayInsert,
  UseFieldArrayMove,
  UseFieldArrayPrepend,
  UseFieldArrayProps,
  UseFieldArrayRemove,
  UseFieldArrayReplace,
  UseFieldArrayReturn,
  UseFieldArraySwap,
  UseFieldArrayUpdate,
  useForm,
  UseFormProps,
  UseFormRegister,
  UseFormRegisterReturn,
  UseFormReturn,
} from 'react-hook-form'
import {
  RecoilState,
  useRecoilCallback,
  useResetRecoilState,
  useSetRecoilState,
} from 'recoil'

type RegisterWithDefaultChecked<
  TFieldValues extends FieldValues,
  TContext = any
> = <TFieldName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>>(
  name: TFieldName,
  value: TFieldValues[TFieldName] extends Readonly<Array<infer E>>
    ? E
    : TFieldValues[TFieldName],
  options?: RegisterOptions<TFieldValues, TFieldName>
) => UseFormRegisterReturn<TFieldName>

type UseFormSyncReturn<
  TFieldValues extends FieldValues,
  TContext = any
> = UseFormReturn<TFieldValues, TContext> & {
  registerWithDefaultValue: UseFormRegister<TFieldValues>
  registerWithDefaultChecked: RegisterWithDefaultChecked<TFieldValues, TContext>
  onChangeForm: () => void
  useFieldArraySync: (
    props: UseFieldArrayProps<TFieldValues>
  ) => UseFieldArrayReturn<TFieldValues>
}

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

  const getDefaultValue = (name: string) => {
    return name
      .split('.')
      .reduce((value, segment) => value?.[segment], defaultValuesRef.current!)
  }

  const {
    register,
    getValues,
    reset: resetForm,
    ...rest
  } = useForm<TFieldValues, TContext>({
    ...props,
    // `DeepPartial` is expected to be removed in the future
    // https://github.com/react-hook-form/react-hook-form/issues/8510#issuecomment-1157129666
    defaultValues: defaultValuesRef.current as DeepPartial<TFieldValues>,
  })

  const registerWithDefaultValue: UseFormRegister<TFieldValues> = useCallback(
    (name, options) => {
      const defaultValue = getDefaultValue(name) ?? null
      return { ...register(name, options), defaultValue }
    },
    [register]
  )

  const registerWithDefaultChecked: RegisterWithDefaultChecked<
    TFieldValues,
    TContext
  > = useCallback(
    (name, value, options) => {
      const defaultValue = getDefaultValue(name)
      const defaultChecked =
        defaultValue == null
          ? false
          : Array.isArray(defaultValue)
          ? defaultValue.includes(value)
          : defaultValue === value
      return { ...register(name, options), value, defaultChecked }
    },
    [register]
  )

  const resetState = useResetRecoilState(formState)
  const reset = useCallback(() => {
    resetState()
    resetForm(getDefaultValues())
  }, [getDefaultValues, resetForm, resetState])

  const setFormValues = useSetRecoilState(formState)
  const onChangeForm = useCallback(() => {
    setFormValues(structuredClone(getValues()))
  }, [setFormValues, getValues])

  const useFieldArraySync = (
    props: UseFieldArrayProps<TFieldValues>
  ): UseFieldArrayReturn<TFieldValues> => {
    const origin = useFieldArray(props)
    const swap: UseFieldArraySwap = (indexA, indexB) => {
      origin.swap(indexA, indexB)
      onChangeForm()
    }
    const move: UseFieldArrayMove = (indexA, indexB) => {
      origin.move(indexA, indexB)
      onChangeForm()
    }
    const prepend: UseFieldArrayPrepend<TFieldValues> = (value, options) => {
      origin.prepend(value, options)
      onChangeForm()
    }
    const append: UseFieldArrayAppend<TFieldValues> = (value, options) => {
      origin.append(value, options)
      onChangeForm()
    }
    const remove: UseFieldArrayRemove = (index) => {
      origin.remove(index)
      onChangeForm()
    }
    const insert: UseFieldArrayInsert<TFieldValues> = (
      index,
      value,
      options
    ) => {
      origin.insert(index, value, options)
      onChangeForm()
    }
    const update: UseFieldArrayUpdate<TFieldValues> = (index, value) => {
      origin.update(index, value)
      onChangeForm()
    }
    const replace: UseFieldArrayReplace<TFieldValues> = (value) => {
      origin.replace(value)
      onChangeForm()
    }

    return {
      swap,
      move,
      prepend,
      append,
      remove,
      insert,
      update,
      replace,
      fields: origin.fields,
    }
  }

  return {
    ...rest,
    register,
    registerWithDefaultValue,
    registerWithDefaultChecked,
    getValues,
    reset,
    onChangeForm,
    useFieldArraySync,
  }
}
