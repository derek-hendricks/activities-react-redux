import Categories from 'components/Categories'
import React from 'react'
import { bindActionCreators } from 'redux'
import { shallow } from 'enzyme'

function getCategories(wrapper) {
  const volleyball = wrapper.find('div').filterWhere((category) => {
    return category.text() === 'Volleyball';
  });
  const running = wrapper.find('div').filterWhere((category) => {
    return category.text() === 'Running';
  });
  const soccer = wrapper.find('div').filterWhere((category) => {
    return category.text() === 'Soccer';
  });

  return { volleyball, running, soccer }
}

const _category_props = [{
  name: 'Volleyball',
  active: true,
  id: 1,
}, {
  name: 'Soccer',
  active: false,
  id: 2,
}, {
  name: 'Running',
  active: false,
  id: 3,
}];

describe('(Categories Component) Categories', () => {
  let _spies, _wrapper, _props;
  beforeEach(() => {
    _spies = {};
    _props = {
      loading: false,
      error: false,
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
    const categories = (_wrapper.find('nav'));
    expect(categories).to.exist;
    expect(categories.hasClass('categories')).to.equal(true);
  });

  it('Should render three divs', () => {
    expect(_wrapper.find('div')).to.have.length(3);
  });

  describe('loading state', () => {
    beforeEach(() => {
      _wrapper.setProps({ loading: true });
    });

    it('should display message if loading set to true', () => {
      const loading = _wrapper.find('div').filterWhere((category) => (
        category.text() === 'Categories Loading'
      ));

      expect(loading).to.exist;
      expect(loading.text()).to.equal('Categories Loading');
    });

    it('should not display categories if loading is set to true', () => {
      const categories = (_wrapper.find('nav'));
      const { soccer, volleyball, running } = getCategories(_wrapper);

      expect(categories).to.not.exist;
      expect(soccer).to.not.exist;
      expect(volleyball).to.not.exist;
      expect(running).to.not.exist;

      expect(_wrapper.find('div.item')).to.have.length(0);
      expect(_wrapper.find('active item')).to.have.length(0);

    });
  });

  describe('error state', () => {
    beforeEach(() => {
      _wrapper.setProps({ error: true });
    });

    it('should display message if error set to true', () => {
      const error = _wrapper.find('p').filterWhere((error) => (
        error.text() === 'Error'
      ));

      expect(error).to.exist;
      expect(error.text()).to.equal('Error');
      expect(_wrapper.find('p')).to.have.length(1);
    });

    it('should not display categories if error is set to true', () => {
      const categories = (_wrapper.find('nav'));
      const { soccer, volleyball, running } = getCategories(_wrapper);

      expect(categories).to.not.exist;
      expect(soccer).to.not.exist;
      expect(volleyball).to.not.exist;
      expect(running).to.not.exist;

      expect(_wrapper.find('div')).to.have.length(0);
      expect(_wrapper.find('div.item')).to.have.length(0);
      expect(_wrapper.find('active item')).to.have.length(0);
    });

  });

  describe('Active category', () => {
    const categories = [{
      name: 'Volleyball',
      active: false,
      id: 1,
    }, {
      name: 'Soccer',
      active: false,
      id: 2,
    }, {
      name: 'Running',
      active: true,
      id: 3,
    }];

    it('Should remove active class from div if other category is selected', () => {
      const { volleyball, running } = getCategories(_wrapper);

      expect(volleyball.hasClass('active item')).to.be.true;
      expect(running.hasClass('active item')).to.not.be.true;

      _wrapper.setProps({ categories });

      const volleyballNotActive = _wrapper.find('div').filterWhere((category) => category.text() === 'Volleyball');
      const runningActive = _wrapper.find('div').filterWhere((category) => category.text() === 'Running');

      expect(volleyballNotActive.hasClass("active item")).to.not.be.true;
      expect(runningActive.hasClass("active item")).to.be.true;
    });
  });

  describe('Running category', () => {
    let category;

    beforeEach(() => {
      category = _wrapper.find('div').filterWhere(category => category.text() === 'Running')
    });

    it('has item class', () => {
      expect(category.hasClass('item')).to.be.true;
    });

    it('does not have active class', () => {
      expect(category.hasClass('active item')).to.not.be.true;
    });

    it('Should dispatch an onClick action when clicked', () => {
      _spies.dispatch.should.have.not.been.called;

      category.simulate('click');

      _spies.dispatch.should.have.been.called
      _spies.onClick.should.have.been.called
    })

  });
});
