import { configureStore } from '@reduxjs/toolkit';
// slices import는 추후 추가 예정
// import projectSlice from './slices/projectSlice';
// import inquirySlice from './slices/inquirySlice';

export const store = configureStore({
  reducer: {
    // project: projectSlice,
    // inquiry: inquirySlice,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [],
      },
    }),
});

// TypeScript 사용 시 주석 해제
// export type RootState = ReturnType<typeof store.getState>;
// export type AppDispatch = typeof store.dispatch;
