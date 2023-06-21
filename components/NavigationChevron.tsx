import React from 'react';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {TouchableOpacity} from 'react-native';

interface Props {
  onPress: () => void;
}

const ChevronButton: React.FC<Props> = ({onPress, children}) => {
  return (
    <TouchableOpacity onPress={onPress} style={{paddingHorizontal: 15}}>
      {children}
    </TouchableOpacity>
  );
};

export const PreviousChevronButton: React.FC<Props> = ({onPress}) => {
  return (
    <ChevronButton onPress={onPress}>
      <Ionicons name={'ios-chevron-back-outline'} size={25} />
    </ChevronButton>
  );
};

export const NextChevronButton: React.FC<Props> = ({onPress}) => {
  return (
    <ChevronButton onPress={onPress}>
      <Ionicons name={'ios-chevron-forward-outline'} size={25} />
    </ChevronButton>
  );
};
