import { configureStore } from '@reduxjs/toolkit';
import categoryReducer from '../Features/categorySlice';

const loadState = () => {
  try {
    const serialized = localStorage.getItem('dashboardState');
    if (!serialized) return undefined;

    const parsed = JSON.parse(serialized);
    return {
      categories: {
        categories: Array.isArray(parsed?.categories) ? parsed.categories : [],
        searchQuery: parsed?.searchQuery || ''
      }
    };
  } catch (err) {
    console.error("Failed to load state:", err);
    return undefined;
  }
};

export const saveState = (state) => {
  try {
    const toSave = {
      categories: state.categories.categories || [],
      searchQuery: state.categories.searchQuery || ''
    };
    localStorage.setItem('dashboardState', JSON.stringify(toSave));
  } catch (err) {
    console.error("Failed to save state:", err);
  }
};

const store = configureStore({
  reducer: {
    categories: categoryReducer,
  },
  preloadedState: loadState(),
});

let saveTimeout;
store.subscribe(() => {
  clearTimeout(saveTimeout);
  saveTimeout = setTimeout(() => saveState(store.getState()), 500);
});

export default store;
