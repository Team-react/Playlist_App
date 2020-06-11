import React from 'react';
import { shallow } from 'enzyme';
import ThemeSelect from './components/ThemeSelect';
describe('ThemeSelect', () => {
  it('should render correctly in "debug" mode', () => {
    const component = shallow(<ThemeSelect debug />);
  
    expect(component).toMatchSnapshot();
  });
});