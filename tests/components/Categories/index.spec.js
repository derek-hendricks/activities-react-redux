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

const categoryProps = [{
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
  let spies, wrapper, props;

  beforeEach(() => {
    spies = {};

    props = {
      loading: false,
      error: false,
      categories: categoryProps,
      ...bindActionCreators(
        { onClick: spies.onClick = sinon.spy() },
        spies.dispatch = sinon.spy()
      )
    };

    wrapper = shallow(<Categories {...props} />)
  });

  it('Should render as a nav.', () => {
    expect(wrapper.is('nav')).to.equal(true)
  });

  it('Should render nav ', () => {
    const categories = (wrapper.find('nav'));
    expect(categories).to.exist;
    expect(categories.hasClass('categories')).to.equal(true);
  });

  it('Should render three divs', () => {
    expect(wrapper.find('div')).to.have.length(3);
  });

  describe('loading state', () => {
    beforeEach(() => {
      wrapper.setProps({ loading: true });
    });

    it('should display message if loading set to true', () => {
      const loading = wrapper.find('div').filterWhere((category) => (
        category.text() === 'Categories Loading'
      ));

      expect(loading).to.exist;
      expect(loading.text()).to.equal('Categories Loading');
    });

    it('should not display categories if loading is set to true', () => {
      const categories = (wrapper.find('nav'));
      const { soccer, volleyball, running } = getCategories(wrapper);

      expect(categories).to.not.exist;
      expect(soccer).to.not.exist;
      expect(volleyball).to.not.exist;
      expect(running).to.not.exist;

      expect(wrapper.find('div.item')).to.have.length(0);
      expect(wrapper.find('active item')).to.have.length(0);

    });
  });

  describe('error state', () => {
    beforeEach(() => {
      wrapper.setProps({ error: true });
    });

    it('should display message if error set to true', () => {
      const error = wrapper.find('p').filterWhere((error) => (
        error.text() === 'Error'
      ));

      expect(error).to.exist;
      expect(error.text()).to.equal('Error');
      expect(wrapper.find('p')).to.have.length(1);
    });

    it('should not display categories if error is set to true', () => {
      const categories = (wrapper.find('nav'));
      const { soccer, volleyball, running } = getCategories(wrapper);

      expect(categories).to.not.exist;
      expect(soccer).to.not.exist;
      expect(volleyball).to.not.exist;
      expect(running).to.not.exist;

      expect(wrapper.find('div')).to.have.length(0);
      expect(wrapper.find('div.item')).to.have.length(0);
      expect(wrapper.find('div.active item')).to.have.length(0);
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
      const { volleyball, running } = getCategories(wrapper);

      expect(volleyball.hasClass('active item')).to.equal(true);
      expect(running.hasClass('active item')).to.equal(false);

      wrapper.setProps({ categories });

      const { volleyball: volleyballNotActive, running: runningActive } = getCategories(wrapper);

      expect(volleyballNotActive.hasClass("active item")).to.equal(false);
      expect(runningActive.hasClass("active item")).to.equal(true);
    });
  });

  describe('onClick dispatch', () => {
    let category;

    beforeEach(() => {
      category = wrapper.find('div').filterWhere(category => category.text() === 'Running')
    });

    it('should not dispatch an onClick action', () => {
      spies.dispatch.should.have.not.been.called;
      spies.onClick.should.have.not.been.called;

    });

    it('should dispatch an onClick action when clicked', () => {
      category.simulate('click');
      spies.dispatch.should.have.been.called;
      spies.onClick.should.have.been.called;
    });

  });
});
