import React from 'react';
import { shallow } from 'enzyme';
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
