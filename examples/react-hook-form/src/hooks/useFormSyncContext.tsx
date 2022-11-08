import { FieldValues, FormProvider, useFormContext } from 'react-hook-form'
import { UseFormSyncReturn } from './useFormSync'

export type FormSyncProviderProps<
  TFieldValues extends FieldValues = FieldValues,
  TContext = any
> = {
  children: React.ReactNode | React.ReactNode[]
} & UseFormSyncReturn<TFieldValues, TContext>

export function FormSyncProvider<
  TFieldValues extends FieldValues,
  TContext = any
>(props: FormSyncProviderProps<TFieldValues, TContext>) {
  const { children, ...methods } = props
  return <FormProvider {...methods}>{children}</FormProvider>
}

export function useFormSyncContext<
  TFieldValues extends FieldValues
>(): UseFormSyncReturn<TFieldValues> {
  return useFormContext() as unknown as UseFormSyncReturn<TFieldValues>
}
