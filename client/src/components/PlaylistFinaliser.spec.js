import React from 'react';
import { shallow, mount } from 'enzyme';
import PlaylistFinaliser from './PlaylistFinaliser';

describe('PlaylistFinaliser', () => {

  let wrapper;

  beforeEach(() => wrapper = shallow(<PlaylistFinaliser     
  token={''}
  playlistComplete={jest.fn()}
  customPlaylist={{songs:[], playlistDuration:[], list_of_tracks:[]}}
  playlistIsNotComplete={jest.fn()}
  unmountFinaliser={jest.fn()}
  overidePlaylist={jest.fn()}
  getRandomPlaylist={jest.fn()}
  playlistType={jest.fn()} 
  />));

  it('should render a <div />', () => {
    expect(wrapper.find('div').length).toEqual(9)
  })
});

describe('mounted PlaylistFinaliser', () => {
  
  let component;

  const baseprops = {token:'',
  playlistComplete: jest.fn(),
  customPlaylist: {songs:[], playlistDuration:[], list_of_tracks:[]},
  playlistIsNotComplete: jest.fn(),
  unmountFinaliser:jest.fn(),
  overidePlaylist: jest.fn(),
  getRandomPlaylist: jest.fn(),
  playlistType: jest.fn()}

  beforeEach(() => component = mount(<PlaylistFinaliser
  {...baseprops}
  />));

  it('should unmount playlistFinaliser when return back to playlistGenerator button is pressed', () => {
    component
    .find('#notFinished')
    .simulate('click')
    expect(baseprops.unmountFinaliser).toHaveBeenCalledTimes(1)
  });

});

