import React from 'react';
import { shallow } from 'enzyme';
import Themeselect from './ThemeSelect';

describe('Themeselect', () => {

  let wrapper;

  beforeEach(() => wrapper = shallow(<Themeselect />));

  it('should render a div', () => {
    expect(wrapper.find('div').length).toEqual(6)
  });
})