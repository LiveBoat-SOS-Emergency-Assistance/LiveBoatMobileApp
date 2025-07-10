import {StyleSheet, View, FlatList, ViewToken, Image} from 'react-native';
import React, { useEffect } from 'react';
import Animated, {
  useSharedValue,
  useAnimatedScrollHandler,
  useAnimatedRef,
  withRepeat,
  withSequence,
  withTiming,
  useAnimatedStyle,
} from 'react-native-reanimated';
import data, {OnboardingData} from './data/data';
import Pagination from './components/Pagination';
import CustomButton from './components/CustomButton';
import RenderItem from './components/RenderItem';

// Accept onDone as a prop
const OnBoardingScreen = ({ onDone }: { onDone: () => void }) => {
  const flatListRef = useAnimatedRef<FlatList<OnboardingData>>();
  const x = useSharedValue(0);
  const flatListIndex = useSharedValue(0);

  // Animated value for left arrow
  const arrowTranslateX = useSharedValue(0);

  useEffect(() => {
    // Animate left/right in a loop
    arrowTranslateX.value = withRepeat(
      withSequence(
        withTiming(-15, { duration: 500 }),
        withTiming(0, { duration: 500 })
      ),
      -1,
      true
    );
  }, []);

  const leftArrowStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: arrowTranslateX.value }],
    opacity: flatListIndex.value >= 1 && flatListIndex.value < 3 ? 1 : 0,
  }));

  const onViewableItemsChanged = ({
    viewableItems,
  }: {
    viewableItems: ViewToken[];
  }) => {
    if (viewableItems && viewableItems.length > 0 && viewableItems[0].index !== null) {
      flatListIndex.value = viewableItems[0].index;
    }
  };

  const onScroll = useAnimatedScrollHandler({
    onScroll: event => {
      x.value = event.contentOffset.x;
    },
  });

  return (
    <View style={styles.container}>
      {/* Animated left arrow, only visible from slide 2 onward */}
      <Animated.Image
        source={require('./assets/images/swipe-left.png')}
        style={[
          {
            position: 'absolute',
            left: 20,
            top: '37%',
            width: 36,
            height: 36,
            zIndex: 10,
            tintColor: '#333',
          },
          leftArrowStyle,
        ]}
        resizeMode="contain"
      />
      {/* Onboarding slides */}
      <Animated.FlatList
        ref={flatListRef}
        onScroll={onScroll}
        data={data}
        renderItem={({item, index}) => {
          return <RenderItem item={item} index={index} x={x} />;
        }}
        keyExtractor={item => item.id.toString()}
        scrollEventThrottle={16}
        horizontal={true}
        bounces={false}
        pagingEnabled={true}
        showsHorizontalScrollIndicator={false}
        onViewableItemsChanged={onViewableItemsChanged}
        viewabilityConfig={{
          minimumViewTime: 300,
          viewAreaCoveragePercentThreshold: 10,
        }}
      />
      <View style={styles.bottomContainer}>
        <Pagination data={data} x={x} />
        <CustomButton
          flatListRef={flatListRef}
          flatListIndex={flatListIndex}
          dataLength={data.length}
          x={x}
          onDone={onDone} // Pass the onDone prop
        />
      </View>
    </View>
  );
};

export default OnBoardingScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  bottomContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginHorizontal: 30,
    paddingVertical: 30,
    position: 'absolute',
    bottom: 20,
    left: 0,
    right: 0,
  },
});
