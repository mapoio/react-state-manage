import { getActionName, ActionTypes } from '../src/util'

describe('Utils', () => {
  describe('ActionTypes', () => {
    it('get random Action Type', () => {
      const Types = ActionTypes
      expect(Types.INIT).toContain('@@store/INIT')
      expect(Types.REPLACE).toContain('@@store/REPLACE')
      const UNKNOW = Types.PROBE_UNKNOWN_ACTION()
      expect(UNKNOW).toContain('@@store/PROBE_UNKNOWN_ACTION')
    })
  })
  describe('getActionName', () => {
    it('params is string', () => {
      expect(getActionName('123')).toBe('123')
    })
    it('params is function', () => {
      const fn = () => {}
      const fn2 = (s: { A: any }) => s.A
      expect(getActionName(fn)).toBe('')
      expect(getActionName(fn2)).toBe('A')
    })
    it('params is other type', () => {
      expect(getActionName(123)).toBe('')
      expect(getActionName({ a: 1 })).toBe('')
      expect(() => getActionName(undefined)).toThrow()
      expect(() => getActionName(null)).toThrow()
      expect(getActionName([1, 2, 3])).toBe('')
    })
  })
})
