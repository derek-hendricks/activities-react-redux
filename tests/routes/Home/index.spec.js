import HomeRoute from 'routes/Home'
import React from 'react'
import { render } from 'enzyme'

describe('(Route) Home', () => {
  let _component;

  beforeEach(() => {
    _component = HomeRoute
  });

  it('Should return a function', () => {
    expect(typeof _component).to.equal('function')
  });

  it('Should define a route component', () => {
    expect(_component().type).to.equal('div')
  });

  describe('(Main Component) Home', () => {
    let _component;

    beforeEach(() => {
      _component = render(HomeRoute());
    });

    it('Renders a message', () => {
      const message = _component.find('h2');
      expect(message).to.exist;
      expect(message.text()).to.match(/Home/)
    });

    it('Does not render h1 element', () => {
      const not_message = _component.find('h1');
      expect(not_message).to.not.exist;
    });

  });

});



