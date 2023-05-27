import {TypedUseSelectorHook, useDispatch, useSelector} from 'react-redux';
import {AppDispatch, RootState} from './store';
import {useNavigation as useReactNavigation} from '@react-navigation/native';

// Use throughout your app instead of plain `useDispatch` and `useSelector`
export const useAppDispatch: () => AppDispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
export const useNavigation = () => {
  return useReactNavigation();
};
