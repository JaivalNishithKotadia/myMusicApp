'use strict';

import Slider from 'react-native-slider';

import {Text, View, StyleSheet} from 'react-native';
import React, {Component} from 'react';

export default class SliderExample extends Component {
  constructor(props) {
    super(props);
    this.state = {
      value: 0.2,
    };
  }
  componentDidMount() {
    console.log(this.state.value);
  }
  render() {
    return (
      <View style={styles.container}>
        <Slider
          value={this.state.value}
          minimumValue={0}
          maximumValue={2}
          thumbTintColor="#FFF"
          maximumTrackTintColor="#FFF"
        />
        <Text>Value: {this.state.value}</Text>
      </View>
    );
  }
}

var styles = StyleSheet.create({
  container: {
    marginLeft: 10,
    marginRight: 10,
    alignItems: 'stretch',
    justifyContent: 'center',
  },
});
