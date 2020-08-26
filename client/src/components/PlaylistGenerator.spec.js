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

})
