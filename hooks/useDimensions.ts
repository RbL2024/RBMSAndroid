// DimensionsUtil.js
import { Dimensions } from 'react-native';

const { width, height, scale } = Dimensions.get('window');

const RDim = {
  width,
  height,
  scale
};

// Listen for dimension changes
Dimensions.addEventListener('change', ({ window }) => {
  RDim.width = window.width;
  RDim.height = window.height;
  RDim.scale = window.scale;
});

export default RDim;