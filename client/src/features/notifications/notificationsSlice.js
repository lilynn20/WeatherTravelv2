import { createSlice, nanoid } from '@reduxjs/toolkit';

const initialState = {
  items: [],
};

const notificationsSlice = createSlice({
  name: 'notifications',
  initialState,
  reducers: {
    addNotification: {
      reducer: (state, action) => {
        state.items.push(action.payload);
      },
      prepare: ({
        message,
        type = 'success',
        duration = 3000,
        position = 'top',
        persist = false,
        linkTo = null,
      }) => ({
        payload: {
          id: nanoid(),
          message,
          type,
          duration,
          position,
          persist,
          linkTo,
        },
      }),
    },
    removeNotification: (state, action) => {
      state.items = state.items.filter((item) => item.id !== action.payload);
    },
    clearNotifications: (state) => {
      state.items = [];
    },
  },
});

export const {
  addNotification,
  removeNotification,
  clearNotifications,
} = notificationsSlice.actions;

export const selectNotifications = (state) => state.notifications.items;

export default notificationsSlice.reducer;
