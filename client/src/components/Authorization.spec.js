import React from 'react'
import { shallow } from 'enzyme'
import Authorization from './Authorization'

describe('Authorization', () => {
    let wrapper

    beforeEach(() => wrapper = shallow(<Authorization />));

    it('should render two divs', () => {
        console.log(wrapper)
        expect(wrapper.find('div').length).toEqual(2);
      });


    
});