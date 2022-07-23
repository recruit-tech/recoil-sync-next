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
import { atom, atomFamily, RecoilRoot, useRecoilState } from 'recoil'
import { syncEffect } from 'recoil-sync'

import { atomFamilyWithInitialValue } from '../utils/atomFamilyWithInitialValue'

import { RecoilHistorySyncJSONNext } from './RecoilHistorySyncJSONNext'

jest.mock('next/router', () => require('next-router-mock'))

let atomIndex = 0
const nextKey = () => `RecoilHistorySyncNext/test/${atomIndex++}`

const App: React.FC<{ children: ReactNode }> = ({ children }) => (
  <RecoilRoot>
    <RecoilHistorySyncJSONNext>{children}</RecoilHistorySyncJSONNext>
  </RecoilRoot>
)

describe('<RecoilHistorySyncJSONNext />', () => {
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
        beforeEach(() => {
          fireEvent.click(getByTestId('foo'))
        })

        it('should be rendered with updated value', async () => {
          await waitFor(() =>
            expect(getByTestId('foo').textContent).toBe('FooFoo')
          )
        })

        describe('then, navigate to the same URL (replacestate)', () => {
          beforeEach(() => {
            act(() => {
              mockRouter.replace('/')
            })
          })

          it('should be rendered with same value', async () => {
            expect(getByTestId('foo').textContent).toBe('FooFoo')
          })

          describe('then, navigate to the new URL (pushstate)', () => {
            beforeEach(() => {
              act(() => {
                mockRouter.push('/next')
                global.history.state.key = 'test2'
              })
            })

            it('should be restored default value', async () => {
              expect(getByTestId('foo').textContent).toBe('Foo')
            })

            describe('then, backward', () => {
              beforeEach(() => {
                act(() => {
                  global.history.state.key = 'test1'
                  mockRouter.push('/') // back() is not supported yet
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

  describe('use atomFamily()', () => {
    const testStringState = atomFamily<string, string>({
      key: nextKey(),
      default: 'Foo',
      effects: [syncEffect({ refine: string() })],
    })

    const Child = () => {
      const [bar, setBar] = useRecoilState(testStringState('bar'))
      const [baz, setBaz] = useRecoilState(testStringState('baz'))

      return (
        <div>
          <button data-testid="bar" onClick={() => setBar((v) => v + 'Bar')}>
            {bar}
          </button>
          <button data-testid="baz" onClick={() => setBaz((v) => v + 'Baz')}>
            {baz}
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

      it('should be rendered with default values', async () => {
        expect(getByTestId('bar').textContent).toBe('Foo')
        expect(getByTestId('baz').textContent).toBe('Foo')
      })

      describe('then, update "bar" state', () => {
        beforeEach(() => {
          fireEvent.click(getByTestId('bar'))
        })

        it('should be rendered with updated value', async () => {
          await waitFor(() =>
            expect(getByTestId('bar').textContent).toBe('FooBar')
          )
          expect(getByTestId('baz').textContent).toBe('Foo')
        })

        describe('then, update "baz" state', () => {
          beforeEach(() => {
            fireEvent.click(getByTestId('baz'))
          })

          it('should be rendered with updated value', async () => {
            await waitFor(() =>
              expect(getByTestId('baz').textContent).toBe('FooBaz')
            )
            expect(getByTestId('bar').textContent).toBe('FooBar')
          })

          describe('then, navigate to the same URL (replacestate)', () => {
            beforeEach(() => {
              act(() => {
                mockRouter.replace('/')
              })
            })

            it('should be rendered with same values', async () => {
              expect(getByTestId('baz').textContent).toBe('FooBaz')
              expect(getByTestId('bar').textContent).toBe('FooBar')
            })

            describe('then, navigate to the new URL (pushstate)', () => {
              beforeEach(() => {
                act(() => {
                  mockRouter.push('/next')
                  global.history.state.key = 'test2'
                })
              })

              it('should be restored default values', async () => {
                expect(getByTestId('bar').textContent).toBe('Foo')
                expect(getByTestId('baz').textContent).toBe('Foo')
              })

              describe('then, backward', () => {
                beforeEach(() => {
                  act(() => {
                    global.history.state.key = 'test1'
                    mockRouter.push('/') // back() is not supported yet
                  })
                })

                it('should be restored updated values', async () => {
                  expect(getByTestId('bar').textContent).toBe('FooBar')
                  expect(getByTestId('baz').textContent).toBe('FooBaz')
                })
              })
            })
          })
        })
      })
    })
  })

  describe('use atomFamilyWithInitialValue()', () => {
    const testStringState = atomFamilyWithInitialValue<string, string>({
      key: nextKey(),
      effects: [syncEffect({ refine: string() })],
    })

    const Child = () => {
      const [foo, setFoo] = useRecoilState(testStringState('foo', 'Foo'))
      const [bar, setBar] = useRecoilState(testStringState('bar', 'Bar'))
      const [baz, setBaz] = useRecoilState(testStringState('baz', 'Baz'))

      return (
        <div>
          <button data-testid="foo" onClick={() => setFoo((v) => v + 'Foo')}>
            {foo}
          </button>
          <button data-testid="bar" onClick={() => setBar((v) => v + 'Bar')}>
            {bar}
          </button>
          <button data-testid="baz" onClick={() => setBaz((v) => v + 'Baz')}>
            {baz}
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

      it('should be rendered with initial values', async () => {
        expect(getByTestId('foo').textContent).toBe('Foo')
        expect(getByTestId('bar').textContent).toBe('Bar')
        expect(getByTestId('baz').textContent).toBe('Baz')
      })

      describe('then, update "foo" state', () => {
        beforeEach(() => {
          fireEvent.click(getByTestId('foo'))
        })

        it('should be rendered with updated value', async () => {
          await waitFor(() =>
            expect(getByTestId('foo').textContent).toBe('FooFoo')
          )
          expect(getByTestId('bar').textContent).toBe('Bar')
          expect(getByTestId('baz').textContent).toBe('Baz')
        })

        describe('then, update "bar" state', () => {
          beforeEach(() => {
            fireEvent.click(getByTestId('bar'))
          })

          it('should be rendered with updated value', async () => {
            await waitFor(() =>
              expect(getByTestId('bar').textContent).toBe('BarBar')
            )
            expect(getByTestId('foo').textContent).toBe('FooFoo')
            expect(getByTestId('baz').textContent).toBe('Baz')
          })

          describe('then, update "baz" state', () => {
            beforeEach(() => {
              fireEvent.click(getByTestId('baz'))
            })

            it('should be rendered with updated value', async () => {
              await waitFor(() =>
                expect(getByTestId('baz').textContent).toBe('BazBaz')
              )
              expect(getByTestId('foo').textContent).toBe('FooFoo')
              expect(getByTestId('bar').textContent).toBe('BarBar')
            })

            describe('then, navigate to the same URL (replacestate)', () => {
              beforeEach(() => {
                act(() => {
                  mockRouter.replace('/')
                })
              })

              it('should be rendered with same values', async () => {
                expect(getByTestId('foo').textContent).toBe('FooFoo')
                expect(getByTestId('bar').textContent).toBe('BarBar')
                expect(getByTestId('baz').textContent).toBe('BazBaz')
              })

              describe('then, navigate to the new URL (pushstate)', () => {
                beforeEach(() => {
                  act(() => {
                    mockRouter.push('/next')
                    global.history.state.key = 'test2'
                  })
                })

                it('should be restored initial values', async () => {
                  expect(getByTestId('foo').textContent).toBe('Foo')
                  expect(getByTestId('bar').textContent).toBe('Bar')
                  expect(getByTestId('baz').textContent).toBe('Baz')
                })

                describe('then, backward', () => {
                  beforeEach(() => {
                    act(() => {
                      global.history.state.key = 'test1'
                      mockRouter.push('/') // back() is not supported yet
                    })
                  })

                  it('should be restored initial values', async () => {
                    expect(getByTestId('foo').textContent).toBe('FooFoo')
                    expect(getByTestId('bar').textContent).toBe('BarBar')
                    expect(getByTestId('baz').textContent).toBe('BazBaz')
                  })
                })
              })
            })
          })
        })
      })
    })
  })
})
