import React, {useState} from 'react';
import { StyleSheet, View, Animated, GestureResponderEvent } from 'react-native';

const WeeklyScreen = () => {
  const d: Date = new Date();
  const [startY, setStartY] = useState(0);
  const [week, setWeek] = useState(getISOWeekNumber(d));
  const [swipeAnim] = useState(new Animated.Value(0));

  const handleTouchStart = (event: GestureResponderEvent) => {
    setStartY(event.nativeEvent.pageY);
    swipeAnim.setValue(0);
  };

  const handleTouchEnd = (event: GestureResponderEvent) => {
    const endY = event.nativeEvent.pageY;
    const scrollDist = endY - startY;
    if (Math.abs(scrollDist) > 100) {
      const scrollingDown = scrollDist > 0;
      if (Math.abs(scrollDist) > 150) {
        setWeek(week + (scrollingDown ? -1 : 1));
      }
      const animToValue = scrollingDown ? -1 : 1;
      Animated.timing(swipeAnim, {
        toValue: animToValue,
        duration: 250,
        useNativeDriver: true,
      }).start(() => {
        // Bounce-back animation
        Animated.spring(swipeAnim, {
          toValue: 0,
          friction: 100, //5,
          tension: 100,
          useNativeDriver: true,
        }).start();
      });
    } else {
      swipeAnim.setValue(0);
    }
  };

  const counterStyle = [
    styles.counter,
    {
      transform: [
        {
          translateY: swipeAnim.interpolate({
            inputRange: [-1, 0, 1],
            outputRange: [-50, 0, 50],
          }),
        },
      ],
    },
  ];

  return (
    <View
      style={styles.container}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}>
      <Animated.Text style={counterStyle}>Week {week}</Animated.Text>
    </View>
  );
};

function getISOWeekNumber(date: Date): number {
  const firstDayOfYear = new Date(date.getFullYear(), 0, 1);
  const pastDaysOfYear: number =
    (date.getTime() - firstDayOfYear.getTime()) / 86400000;
  return Math.ceil((pastDaysOfYear + firstDayOfYear.getUTCDay() + 1) / 7);
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
  },
  counter: {
    fontSize: 20,
    textAlign: 'center',
  },
});

export default WeeklyScreen;
