import React from 'react';
import { shallow, mount } from 'enzyme';
import PlaylistGenerator from './PlaylistGenerator';

describe('PlaylistGenerator', () => {

  let wrapper;

  beforeEach(() => wrapper = shallow(<PlaylistGenerator
    playListType={''}
    desiredDuration={''}
    token={''}
    playlistIsComplete={''}
    playlistIsNotComplete={''}
    playlistComplete={''}
     />));

  it('should render a div', () => {
    expect(wrapper.find('div').length).toEqual(10)
  })

  it('should render a  2 divs when render finaliser set to true', () => {
    wrapper.setState({ renderFinaliser: true});
    expect(wrapper.find('div').length).toEqual(2)
  });

})

describe('mounted playlistGenerator', () => {

  let component

  beforeEach(() => component = mount(<PlaylistGenerator
    playListType={''}
    desiredDuration={''}
    token={''}
    playlistIsComplete={jest.fn()}
    playlistIsNotComplete={''}
    playlistComplete={''}
    
    
   /> ))

   it('should change renderfinaliser to true when click Im done', () => {
    component
    .find("#imdonebutton")
    .simulate('click')
    expect(component.state("renderFinaliser")).toEqual(true);
     
   });

   it('should renderFinaliser if currentDuration is greater than desiredDuration', () => {
    component.setProps({ desiredDuration: 10000})
    component.setState({ currentDuration: 11000})
    component.instance().checkPlaylistComplete()
    expect(component.state("renderFinaliser")).toEqual(true);
     
   });
  
});
