import Categories from 'routes/Activities/Components/Categories'
import React from 'react'
import {bindActionCreators} from 'redux'
import {shallow} from 'enzyme'
let _category_props = [{
  title: 'Volleyball',
  active: true,
  id: 1,
}, {
  title: 'Soccer',
  active: false,
  id: 2,
}, {
  title: 'Running',
  active: false,
  id: 3,
}];

describe('(Categories Component) Categories', () => {

  let _spies, _wrapper, _props;
  beforeEach(() => {
    _spies = {};
    _props = {
      categories: _category_props,
      ...bindActionCreators({
        onClick: (_spies.onClick = sinon.spy())
      }, _spies.dispatch = sinon.spy())
    };
    _wrapper = shallow(<Categories {..._props} />)
  });

  it('Should render as a nav.', () => {
    expect(_wrapper.is('nav')).to.equal(true)
  });

  it('Should render nav ', () => {
    let categories = (_wrapper.find('nav'));
    expect(categories).to.exist;
    expect(categories.hasClass('categories')).to.equal(true);
  });

  it('Should render three divs', () => {
    expect(_wrapper.find('div')).to.have.length(3);
  });

  describe('Active category', () => {
    let _category;
    let _running_category;
    let _new_category_props;

    beforeEach(() => {
      _category = _wrapper.find('div').filterWhere((category) => {
        return category.text() === 'Volleyball';
      });
      _running_category = _wrapper.find('div').filterWhere((category) => {
        return category.text() === 'Running';
      });
      _new_category_props = [{
        title: 'Volleyball',
        active: false,
        id: 1,
      }, {
        title: 'Soccer',
        active: false,
        id: 2,
      }, {
        title: 'Running',
        active: true,
        id: 3,
      }];
    });

    it('Should remove active class from div if other category is selected', () => {
      expect(_category.hasClass('active item')).to.be.true;
      expect(_running_category.hasClass('active item')).to.not.be.true;

      _wrapper.setProps({categories: _new_category_props});

      let _same_category = _wrapper.find('div').filterWhere((category) => category.text() === 'Volleyball');
      let _same_running_category = _wrapper.find('div').filterWhere((category) => category.text() === 'Running');

      expect(_same_category.hasClass("active item")).to.not.be.true;
      expect(_same_running_category.hasClass("active item")).to.be.true;
    });
  });

  describe('Running category', () => {
    let _category;

    beforeEach(() => {
      _category = _wrapper.find('div').filterWhere((category) => {
          return category.text() === 'Running';
        }
      )
    });

    it('has item class', () => {
      expect(_category.hasClass('item')).to.be.true;
    });

    it('does not have active class', () => {
      expect(_category.hasClass('active item')).to.not.be.true;
    });

    it('Should dispatch an onClick action when clicked', () => {
      _spies.dispatch.should.have.not.been.called;

      _category.simulate('click');

      _spies.dispatch.should.have.been.called
      _spies.onClick.should.have.been.called
    })

  });
});
