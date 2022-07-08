import '@testing-library/jest-dom'
import { fireEvent, render, renderHook, waitFor } from '@testing-library/react'
import { ReactNode } from 'react'
import { act } from 'react-dom/test-utils'
import { RecoilRoot, useRecoilState, useRecoilValue } from 'recoil'

import { atomFamilyWithInitialValue } from './atomFamilyWithInitialValue'

let atomIndex = 0
const nextKey = () => `atomFamilyWithInitialValue/test/${atomIndex++}`

const testStringState = atomFamilyWithInitialValue<string, string>({
  key: nextKey(),
})

const testNumberState = atomFamilyWithInitialValue<number, string>({
  key: nextKey(),
})

const App: React.FC<{ children: ReactNode }> = ({ children }) => (
  <RecoilRoot>{children}</RecoilRoot>
)

describe('atomFamilyWithInitialValue', () => {
  describe('just hook', () => {
    describe('single state', () => {
      it('should be initialized with a specific value', async () => {
        const { result } = renderHook(
          () => useRecoilValue(testStringState('foo', 'Foo')),
          {
            wrapper: App,
          }
        )

        expect(result.current).toBe('Foo')
      })

      it('should be updated', async () => {
        const { result } = renderHook(
          () => useRecoilState(testStringState('foo', '')),
          {
            wrapper: App,
          }
        )
        const [value, setValue] = result.current
        expect(value).toBe('')

        act(() => setValue('Foo'))

        expect(result.current[0]).toBe('Foo')
      })
    })

    describe('multiple states', () => {
      it('should be initialized with a specific value individually', async () => {
        const { result } = renderHook(
          () => {
            const foo = useRecoilValue(testStringState('foo', 'Foo'))
            const bar = useRecoilValue(testStringState('bar', 'Bar'))
            const baz = useRecoilValue(testStringState('baz', 'Baz'))
            return { foo, bar, baz }
          },
          {
            wrapper: App,
          }
        )

        expect(result.current.foo).toBe('Foo')
        expect(result.current.bar).toBe('Bar')
        expect(result.current.baz).toBe('Baz')
      })

      it('should be updated individually', async () => {
        const { result } = renderHook(
          () => {
            const foo = useRecoilState(testStringState('foo', ''))
            const bar = useRecoilState(testStringState('bar', ''))
            const baz = useRecoilState(testStringState('baz', ''))
            return { foo, bar, baz }
          },
          {
            wrapper: App,
          }
        )

        expect(result.current.foo[0]).toBe('')
        expect(result.current.bar[0]).toBe('')
        expect(result.current.baz[0]).toBe('')

        act(() => result.current.foo[1]('Foo'))
        expect(result.current.foo[0]).toBe('Foo')
        expect(result.current.bar[0]).toBe('')
        expect(result.current.baz[0]).toBe('')

        act(() => result.current.bar[1]('Bar'))
        expect(result.current.foo[0]).toBe('Foo')
        expect(result.current.bar[0]).toBe('Bar')
        expect(result.current.baz[0]).toBe('')

        act(() => result.current.baz[1]('Baz'))
        expect(result.current.foo[0]).toBe('Foo')
        expect(result.current.bar[0]).toBe('Bar')
        expect(result.current.baz[0]).toBe('Baz')
      })
    })
  })

  describe('with React component', () => {
    const Child = () => {
      const [val1, setVal1] = useRecoilState(testNumberState('foo', 0))
      const [val2, setVal2] = useRecoilState(testNumberState('bar', 100))
      const [val3, setVal3] = useRecoilState(testNumberState('baz', -10))

      return (
        <div>
          <button data-testid="button1" onClick={() => setVal1((v) => v + 1)}>
            {val1}
          </button>
          <button data-testid="button2" onClick={() => setVal2((v) => v / 2)}>
            {val2}
          </button>
          <button data-testid="button3" onClick={() => setVal3((v) => v * 2)}>
            {val3}
          </button>
        </div>
      )
    }

    it('should be initialized and updated individually', async () => {
      const { getByTestId } = render(
        <App>
          <Child />
        </App>
      )

      expect(getByTestId('button1').textContent).toBe('0')
      expect(getByTestId('button2').textContent).toBe('100')
      expect(getByTestId('button3').textContent).toBe('-10')

      fireEvent.click(getByTestId('button1'))
      await waitFor(() => expect(getByTestId('button1').textContent).toBe('1'))
      expect(getByTestId('button2').textContent).toBe('100')
      expect(getByTestId('button3').textContent).toBe('-10')

      fireEvent.click(getByTestId('button2'))
      await waitFor(() => expect(getByTestId('button2').textContent).toBe('50'))
      expect(getByTestId('button1').textContent).toBe('1')
      expect(getByTestId('button3').textContent).toBe('-10')

      fireEvent.click(getByTestId('button3'))
      await waitFor(() =>
        expect(getByTestId('button3').textContent).toBe('-20')
      )
      expect(getByTestId('button1').textContent).toBe('1')
      expect(getByTestId('button2').textContent).toBe('50')
    })
  })
})
