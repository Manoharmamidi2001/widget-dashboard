import { createSlice, nanoid } from '@reduxjs/toolkit';
import data from '../Data/data.json';

// Initialize with empty array if data is not available
const initialState = {
  categories: data?.CNAPP_Dashboard?.categories?.map(cat => ({
    ...cat,
    id: nanoid(),
    widgets: cat.widgets?.map(w => ({
      ...w,
      widget_id: nanoid()
    })) || []
  })) || [], // Fallback to empty array
  searchQuery: '',
};

const categorySlice = createSlice({
  name: 'category',
  initialState,
  reducers: {
    addWidget: (state, action) => {
      const { categoryId, widgetData } = action.payload;
      const category = state.categories?.find(cat => 
        cat.id === categoryId || cat.category_name === categoryId
      );
      if (category) {
        if (!category.widgets) {
          category.widgets = [];
        }
        category.widgets.push({
          ...widgetData,
          widget_id: nanoid(),
        });
      }
    },
    removeWidget: (state, action) => {
      const { categoryId, widgetId } = action.payload;
      return {
        ...state,
        categories: state.categories?.map(category => {
          if (category.id === categoryId || category.category_name === categoryId) {
            return {
              ...category,
              widgets: category.widgets?.filter(w => w.widget_id !== widgetId) || []
            };
          }
          return category;
        }) || []
      };
    },
    // New action to remove multiple selected widgets
    removeSelectedWidgets: (state, action) => {
      const { categoryId, widgetIds } = action.payload;
      return {
        ...state,
        categories: state.categories?.map(category => {
          if (category.id === categoryId || category.category_name === categoryId) {
            return {
              ...category,
              widgets: category.widgets?.filter(w => !widgetIds.includes(w.widget_id)) || []
            };
          }
          return category;
        }) || []
      };
    },
    setSearchQuery: (state, action) => {
      state.searchQuery = action.payload.toLowerCase();
    },
  },
});

export const { 
  addCategory, 
  addWidget, 
  removeWidget, 
  removeSelectedWidgets, 
  setSearchQuery, 
  removeCategory 
} = categorySlice.actions;

export default categorySlice.reducer;
