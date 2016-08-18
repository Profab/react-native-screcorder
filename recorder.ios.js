'use strict';

import React, { Component, PropTypes } from 'react';
import {
  StyleSheet,
  requireNativeComponent,
  NativeModules,
  View,
} from 'react-native';

/******* ENUM **********/

const constants = {
  // Flash enum
  SCFlashModeOff: 0,
  SCFlashModeOn: 1,
  SCFlashModeAuto: 2,
  SCFlashModeLight: 3,
};

/******* STYLES **********/

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: 'transparent',
  },
});

/******* RECORDER COMPONENT **********/

class Recorder extends Component {

  static propTypes = {
    config: PropTypes.object,
    device: PropTypes.string,
    onNewSegment: PropTypes.func,
  };

  constructor(props) {
    super(props);
    
    this.recording = false;

    this.state = {
    };
  }

  /*** PUBLIC METHODS ***/

  // Start recording of the current session
  record() {
    if (this.recording) return;
    this.recording = true;
    NativeModules.RNRecorderManager.record();
  }

  // Capture a picture
  capture(callback) {
    NativeModules.RNRecorderManager.capture(callback);
  }

  // Pause recording of the current session
  pause() {
    if (!this.recording) return;
    var onNewSegment = this.props.onNewSegment || function() {};
    NativeModules.RNRecorderManager.pause(onNewSegment);
    this.recording = false;
  }

  // Save the recording
  save(callback) {
    NativeModules.RNRecorderManager.save(callback);
  }

  // Remove last segment of the session
  removeLastSegment() {
    NativeModules.RNRecorderManager.removeLastSegment();
  }

  // Remove all segments of the session
  removeAllSegments() {
    NativeModules.RNRecorderManager.removeAllSegments();
  }

  // Remove segment at the specified index
  removeSegmentAtIndex(index) {
    NativeModules.RNRecorderManager.removeSegmentAtIndex(index);
  }

  /*** RENDER ***/

  render() {
    const config = {
      autoSetVideoOrientation: false,
      flashMode: constants.SCFlashModeOff,

      video: {
        enabled: true,
        bitrate: 2000000, // 2Mbit/s
        timescale: 1, // Higher than 1 makes a slow motion, between 0 and 1 makes a timelapse effect
        format: "MPEG4",
        quality: "HighestQuality", // HighestQuality || MediumQuality || LowQuality
        filters: [
          /*{
            "CIfilter": "CIColorControls",
            "animations": [{
              "name": "inputSaturation",
              "startValue": 100,
              "endValue": 0,
              "startTime": 0,
              "duration": 0.5
            }]
          },*/
          /*{"file": "b_filter"},*/
          /*{"CIfilter":"CIColorControls", "inputSaturation": 0},
          {"CIfilter":"CIExposureAdjust", "inputEV": 0.7}*/
        ],
      },
      audio: {
        enabled: true,
        bitrate: 128000, // 128kbit/s
        channelsCount: 1, // Mono output
        format: "MPEG4AAC",
        quality: "HighestQuality", // HighestQuality || MediumQuality || LowQuality
      },
      ...this.props.config,
    };

    const nativeProps = {
      ...this.props,
      config,
      device: this.props.device || "front",
    };

    return (
      <RNRecorder {...nativeProps}>
        <View style={styles.wrapper}>{this.props.children}</View>
      </RNRecorder>
    );
  }

}

const RNRecorder = requireNativeComponent('RNRecorder', Recorder);

Recorder.constants = constants;

export default Recorder;
