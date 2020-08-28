import React from 'react';
import { shallow, mount } from 'enzyme';
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

describe('mounted ThemeSelect', () => {
  
  let component;
  
  beforeEach(() => component = mount(<Themeselect />));

  it('should show the default state of playlistType', () => {
    expect(component.state("playlist_type")).toEqual(null)
  });
    
  it('should update playlist_type state when input is changed', () => {
    component
    .find("#playlistinput")
    .simulate("change", { target: {value: "Pop"}});
    expect(component.state("playlist_type")).toEqual("Pop");
    component.unmount();
  });

  it('should update playlist duration when input is changed', () => {
    component
    .find("#durationinput")
    .simulate("change", { target: { value: "20"}});
    expect(component.state("desiredDuration")).toEqual(1200000);
    component.unmount();
  });

  it('Should render the playlist generator when user clicks im ready', () => {
    component
    .find("#playlistinput")
    .simulate("change", { target: {value: "Pop"}})
    component
    .find("#durationinput")
    .simulate("change", { target: { value: "20"}})
    component
    .find("#imReadyButton")
    .simulate("click")
    expect(component.state("renderGenerator")).toEqual(true);
    component.unmount()
  });
});