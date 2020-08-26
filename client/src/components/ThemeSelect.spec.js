import React from 'react';
import { shallow } from 'enzyme';
import Themeselect from './ThemeSelect';

describe('Themeselect', () => {

  let wrapper;

  beforeEach(() => wrapper = shallow(<Themeselect />));

  it('should render 6 divs by default state', () => {
    
    expect(wrapper.find('div').length).toEqual(6)
  });

  it('should render a  2 divs when render generator set to true', () => {
    wrapper.setState({ renderGenerator: true});

    expect(wrapper.find('div').length).toEqual(2)
  });
})