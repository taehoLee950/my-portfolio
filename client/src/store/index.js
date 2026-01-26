import { configureStore } from '@reduxjs/toolkit';
import projectReducer from './slices/projectSlice.js';
import skillCaseReducer from './slices/skillCaseSlice.js';
import authReducer from './slices/authSlice.js';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    projects: projectReducer,
    skillCases: skillCaseReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['auth/login/fulfilled', 'projects/create', 'projects/update', 'skillCases/create', 'skillCases/update'],
        ignoredPaths: ['auth.user', 'projects.projects', 'skillCases.skillCases'],
      },
    }),
});

// TypeScript 사용 시 주석 해제
// export type RootState = ReturnType<typeof store.getState>;
// export type AppDispatch = typeof store.dispatch;
