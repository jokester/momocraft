import { Sanitize } from "./input-santinizer";

describe('Sanitize', () => {
  it('launders email', () => {
      expect(Sanitize.email('momocraft@gmail.com')).toMatchSnapshot()
    }
  )
})
