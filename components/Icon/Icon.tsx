import Svg, { Path } from "react-native-svg";
import React from "react";

const Icon: React.FC<{ path: string }> = ({ path }) => {
  return (
    <Svg width="20" height="20" viewBox="0 0 24 24" fill="none">
      <Path d={path} stroke="black" strokeWidth="2" />
    </Svg>
  );
};
export { Icon };
