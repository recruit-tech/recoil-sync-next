import { string } from '@recoiljs/refine'
import {
  fireEvent,
  Matcher,
  MatcherOptions,
  render,
  waitFor,
} from '@testing-library/react'
import mockRouter from 'next-router-mock'
import { ReactNode } from 'react'
import { act } from 'react-dom/test-utils'
import { atom, RecoilRoot, useRecoilState } from 'recoil'
import { syncEffect } from 'recoil-sync'

import { RecoilURLSyncJSONNext } from './RecoilURLSyncJSONNext'

jest.mock('next/router', () => require('next-router-mock'))

let atomIndex = 0
const nextKey = () => `RecoilURLSyncJSONNext/test/${atomIndex++}`

const App: React.FC<{ children: ReactNode }> = ({ children }) => (
  <RecoilRoot>
    <RecoilURLSyncJSONNext location={{ part: 'queryParams' }}>
      {children}
    </RecoilURLSyncJSONNext>
  </RecoilRoot>
)

describe('<RecoilURLSyncJSONNext />', () => {
  beforeEach(() => {
    history.replaceState({ key: 'test1' }, '')
    mockRouter.setCurrentUrl('/')
  })

  describe('use atom()', () => {
    const testStringState = atom<string>({
      key: nextKey(),
      default: 'Foo',
      effects: [syncEffect({ refine: string() })],
    })

    const Child = () => {
      const [foo, setFoo] = useRecoilState(testStringState)

      return (
        <div>
          <button data-testid="foo" onClick={() => setFoo((v) => v + 'Foo')}>
            {foo}
          </button>
        </div>
      )
    }

    describe('Initial Render', () => {
      let getByTestId: (
        id: Matcher,
        options?: MatcherOptions | undefined
      ) => HTMLElement

      beforeEach(() => {
        const screen = render(
          <App>
            <Child />
          </App>
        )
        getByTestId = screen.getByTestId
      })

      it('should be rendered with default value', async () => {
        expect(getByTestId('foo').textContent).toBe('Foo')
      })

      describe('then, update state', () => {
        let urlPath: string

        beforeEach(() => {
          fireEvent.click(getByTestId('foo'))
        })

        it('should be rendered with updated value', async () => {
          await waitFor(() =>
            expect(getByTestId('foo').textContent).toBe('FooFoo')
          )
          urlPath = mockRouter.asPath
        })

        describe('then, navigate (pushstate)', () => {
          beforeEach(() => {
            act(() => {
              mockRouter.push('/next')
            })
          })

          it('should be restored default value', async () => {
            expect(getByTestId('foo').textContent).toBe('Foo')
          })

          describe('then, backward', () => {
            beforeEach(() => {
              act(() => {
                mockRouter.push(urlPath) // back() is not supported yet
              })
            })

            it('should be restored updated value', async () => {
              expect(getByTestId('foo').textContent).toBe('FooFoo')
            })
          })
        })
      })
    })
  })
})
