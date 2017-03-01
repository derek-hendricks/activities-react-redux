import React from 'react'
import { HomeMain } from 'routes/Home/components/Main'
import { render } from 'enzyme'

describe('(View) Home', () => {
  let _component;

  beforeEach(() => {
    _component = render(<HomeMain />)
  });

  it('Renders a message', () => {
    const message = _component.find('h4');
    expect(message).to.exist
    expect(welcome.text()).to.match(/Home/)
  });

});
