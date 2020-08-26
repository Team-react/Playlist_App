import React from 'react';
import App from './App';
import { shallow } from 'enzyme';


describe('App', () => {
  let wrapper

  beforeEach(() => 
  wrapper = shallow(<App />));

  it('should render 2 dives with default state', () => {
    expect(wrapper.find('div').length).toEqual(2)
    
  });
  

  
  
});