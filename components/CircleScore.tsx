import React from 'react';
import { Text, View } from 'react-native';
import Svg, { Circle, G } from 'react-native-svg';

type Props = {
  value: number;
  size?: number;
  strokeWidth?: number;
  trackColor?: string;
  fillColor?: string;
  textColor?: string;
  className?: string;
};

export default function CircleScore({
  value,
  size = 44,
  strokeWidth = 4,
  trackColor = '#1F2430',
  fillColor = '#0B0E14',
  textColor = '#E7E9EE',
  className = '',
}: Props) {
  const pct = Math.max(0, Math.min(100, value));
  const radius = (size - strokeWidth) / 2;
  const cx = size / 2;
  const cy = size / 2;
  const circumference = 2 * Math.PI * radius;
  const dashOffset = circumference * (1 - pct / 100);

  // 🎨 Dynamic color selection
  const progressColor =
    pct >= 75 ? '#21C55D' : // green
    pct >= 50 ? '#EAB308' : // mustard yellow
    '#EF4444';              // red

  return (
    <View
      style={{ width: size, height: size }}
      className={`items-center justify-center ${className}`}
    >
      <Svg width={size} height={size}>
        <G transform={`rotate(-90, ${cx}, ${cy})`}>
          {/* background track */}
          <Circle
            cx={cx}
            cy={cy}
            r={radius}
            stroke={trackColor}
            strokeWidth={strokeWidth}
            fill="none"
          />
          {/* dynamic progress ring */}
          <Circle
            cx={cx}
            cy={cy}
            r={radius}
            stroke={progressColor}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeDasharray={`${circumference} ${circumference}`}
            strokeDashoffset={dashOffset}
            fill="none"
          />
        </G>
      </Svg>

      {/* inner text */}
      <View
        style={{
          position: 'absolute',
          width: size - strokeWidth * 2,
          height: size - strokeWidth * 2,
          borderRadius: (size - strokeWidth * 2) / 2,
          backgroundColor: fillColor,
        }}
        className="items-center justify-center"
      >
        <Text
          style={{ color: textColor }}
          className="font-semibold text-xs"
        >
          {Math.round(pct)}%
        </Text>
      </View>
    </View>
  );
}
