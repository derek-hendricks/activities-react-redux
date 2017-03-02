import ActivitiesView from 'routes/Activities'
import React from 'react'
import {shallow} from 'enzyme'

describe('(Route) Activities', () => {
  let _component;

  beforeEach(() => {
    _component = ActivitiesView;
  });

  it('Should return a function', () => {
    expect(typeof _component).to.equal('function');
  });

  it('Should define a route component', () => {
    expect(_component().type).to.equal('div');
  });

  describe('(Activity Component) ActivitiesView', () => {
    let _component;

    let _props, _spies, _wrapper;

    beforeEach(() => {
      _wrapper = shallow(<ActivitiesView />)
    });

    it('Should render as a div.', () => {
      expect(_wrapper.is('div')).to.equal(true)
    });

    it('Should render div with `activities-view` class', () => {
      let categories = (_wrapper.find('div'));
      expect(categories).to.exist;
      expect(categories.hasClass('activities-view')).to.equal(true);

    });

  });
});




