import { date, map, set, string } from '@recoiljs/refine'
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

import { RecoilHistorySyncTransitNext } from './RecoilHistorySyncTransitNext'

jest.mock('next/router', () => require('next-router-mock'))

let atomIndex = 0
const nextKey = () => `RecoilHistorySyncNext/test/${atomIndex++}`

const App: React.FC<{ children: ReactNode }> = ({ children }) => (
  <RecoilRoot>
    <RecoilHistorySyncTransitNext>{children}</RecoilHistorySyncTransitNext>
  </RecoilRoot>
)

describe('<RecoilHistorySyncTransitNext />', () => {
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

  describe('builtin handlers', () => {
    describe('Date', () => {
      const date1 = new Date(0)
      const date2 = new Date(24 * 60 * 60 * 1000)
      const testState = atom<Date>({
        key: nextKey(),
        default: date1,
        effects: [syncEffect({ refine: date() })],
      })

      const Child = () => {
        const [foo, setFoo] = useRecoilState(testState)

        return (
          <div>
            <button data-testid="foo" onClick={() => setFoo(() => date2)}>
              {foo.toISOString()}
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
          expect(getByTestId('foo').textContent).toBe(date1.toISOString())
        })

        describe('then, update state', () => {
          beforeEach(() => {
            fireEvent.click(getByTestId('foo'))
          })

          it('should be rendered with updated value', async () => {
            await waitFor(() =>
              expect(getByTestId('foo').textContent).toBe(date2.toISOString())
            )
          })

          describe('then, navigate to the same URL (replacestate)', () => {
            beforeEach(() => {
              act(() => {
                mockRouter.replace('/')
              })
            })

            it('should be rendered with same value', async () => {
              expect(getByTestId('foo').textContent).toBe(date2.toISOString())
            })

            describe('then, navigate the new URL (pushstate)', () => {
              beforeEach(() => {
                act(() => {
                  mockRouter.push('/next')
                  global.history.state.key = 'test2'
                })
              })

              it('should be restored default value', async () => {
                expect(getByTestId('foo').textContent).toBe(date1.toISOString())
              })

              describe('then, backward', () => {
                beforeEach(() => {
                  act(() => {
                    global.history.state.key = 'test1'
                    mockRouter.push('/') // back() is not supported yet
                  })
                })

                it('should be restored updated value', async () => {
                  expect(getByTestId('foo').textContent).toBe(
                    date2.toISOString()
                  )
                })
              })
            })
          })
        })
      })
    })

    describe('Set', () => {
      const set1 = new Set<string>(['Foo'])
      const set2 = new Set<string>(['Bar', 'Baz'])
      const testState = atom<Set<string>>({
        key: nextKey(),
        default: set1,
        effects: [syncEffect({ refine: set(string()) })],
      })

      const Child = () => {
        const [foo, setFoo] = useRecoilState(testState)

        return (
          <div>
            <button data-testid="foo" onClick={() => setFoo(() => set2)}>
              {[...foo].join(',')}
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
              expect(getByTestId('foo').textContent).toBe('Bar,Baz')
            )
          })

          describe('then, navigate to the same URL (replacestate)', () => {
            beforeEach(() => {
              act(() => {
                mockRouter.replace('/')
              })
            })

            it('should be rendered with same value', async () => {
              expect(getByTestId('foo').textContent).toBe('Bar,Baz')
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
                  expect(getByTestId('foo').textContent).toBe('Bar,Baz')
                })
              })
            })
          })
        })
      })
    })

    describe('Map', () => {
      const map1 = new Map<string, string>([['foo', 'Foo']])
      const map2 = new Map<string, string>([
        ['bar', 'Bar'],
        ['baz', 'Baz'],
      ])
      const testState = atom<Map<string, string>>({
        key: nextKey(),
        default: map1,
        effects: [syncEffect({ refine: map(string(), string()) })],
      })

      const Child = () => {
        const [foo, setFoo] = useRecoilState(testState)

        return (
          <div>
            <button data-testid="foo" onClick={() => setFoo(() => map2)}>
              {[...foo.entries()].join(',')}
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
          expect(getByTestId('foo').textContent).toBe('foo,Foo')
        })

        describe('then, update state', () => {
          beforeEach(() => {
            fireEvent.click(getByTestId('foo'))
          })

          it('should be rendered with updated value', async () => {
            await waitFor(() =>
              expect(getByTestId('foo').textContent).toBe('bar,Bar,baz,Baz')
            )
          })

          describe('then, navigate to the same URL (replacestate)', () => {
            beforeEach(() => {
              act(() => {
                mockRouter.replace('/')
              })
            })

            it('should be rendered with same value', async () => {
              expect(getByTestId('foo').textContent).toBe('bar,Bar,baz,Baz')
            })

            describe('then, navigate to the new URL (pushstate)', () => {
              beforeEach(() => {
                act(() => {
                  mockRouter.push('/next')
                  global.history.state.key = 'test2'
                })
              })

              it('should be restored default value', async () => {
                expect(getByTestId('foo').textContent).toBe('foo,Foo')
              })

              describe('then, backward', () => {
                beforeEach(() => {
                  act(() => {
                    global.history.state.key = 'test1'
                    mockRouter.push('/') // back() is not supported yet
                  })
                })

                it('should be restored updated value', async () => {
                  expect(getByTestId('foo').textContent).toBe('bar,Bar,baz,Baz')
                })
              })
            })
          })
        })
      })
    })
  })
})
