import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated } from 'react-native';

interface VoiceVisualizerProps {
  isActive: boolean;
  intensity?: number;
}

export const VoiceVisualizer: React.FC<VoiceVisualizerProps> = ({ 
  isActive, 
  intensity = 0.5 
}) => {
  const bars = Array.from({ length: 5 }, () => useRef(new Animated.Value(0.3)).current);

  useEffect(() => {
    if (isActive) {
      const animations = bars.map((bar, index) => {
        return Animated.loop(
          Animated.sequence([
            Animated.timing(bar, {
              toValue: 0.3 + (Math.random() * intensity),
              duration: 200 + (index * 50),
              useNativeDriver: true,
            }),
            Animated.timing(bar, {
              toValue: 0.1 + (Math.random() * 0.3),
              duration: 200 + (index * 50),
              useNativeDriver: true,
            }),
          ])
        );
      });

      animations.forEach(animation => animation.start());

      return () => {
        animations.forEach(animation => animation.stop());
      };
    } else {
      bars.forEach(bar => {
        Animated.timing(bar, {
          toValue: 0.3,
          duration: 300,
          useNativeDriver: true,
        }).start();
      });
    }
  }, [isActive, intensity]);

  return (
    <View style={styles.container}>
      {bars.map((bar, index) => (
        <Animated.View
          key={index}
          style={[
            styles.bar,
            {
              transform: [{ scaleY: bar }],
              height: 20 + (index % 2) * 10,
            },
          ]}
        />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 40,
  },
  bar: {
    width: 3,
    backgroundColor: '#6366F1',
    marginHorizontal: 1,
    borderRadius: 2,
  },
});