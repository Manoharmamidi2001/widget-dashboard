import React from 'react';
import WidgetCard from './WidgetCard';
import data from '../Data/data.json';
import Button from '@mui/material/Button';
import { useSelector, useDispatch } from 'react-redux';
import { addWidget } from '../Features/categorySlice';
import { Modal, Box, Typography, TextField, FormControl, InputLabel, Select, MenuItem, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';  // Import CloseIcon

const CategorySection = () => {
  const dispatch = useDispatch();
  const categories = useSelector(state => state.categories.categories) || data.CNAPP_Dashboard.categories;
  const searchQuery = useSelector(state => state.categories.searchQuery);
  const [openAddWidget, setOpenAddWidget] = React.useState(false);
  const [currentCategory, setCurrentCategory] = React.useState(null);
  const [newWidget, setNewWidget] = React.useState({
    title: '',
    chartType: 'pie',
    labelValuePairs: [{ label: '', value: '' }] // Initialize with one empty pair
  });

  const calculateTotal = (dataObj) => {
    if (!dataObj) return 0;
    return Object.values(dataObj).reduce((acc, val) => acc + val, 0);
  };

  const handleAddWidgetClick = (category) => {
    setCurrentCategory(category);
    setOpenAddWidget(true);
  };

  const handleSaveWidget = () => {
    const widgetData = {
      ...newWidget,
      widget_id: `widget-${Date.now()}`,
      data: newWidget.labelValuePairs.reduce((acc, pair) => {
        if (pair.label && pair.value) {
          acc[pair.label] = parseInt(pair.value, 10);
        }
        return acc;
      }, {}),
    };

    dispatch(addWidget({
      categoryId: currentCategory.id || currentCategory.category_name,
      widgetData
    }));

    setOpenAddWidget(false);
    setNewWidget({ title: '', chartType: 'pie', labelValuePairs: [{ label: '', value: '' }] });
  };

  const handleAddLabelValuePair = () => {
    setNewWidget(prevState => ({
      ...prevState,
      labelValuePairs: [...prevState.labelValuePairs, { label: '', value: '' }]
    }));
  };

  const handleRemoveLabelValuePair = (index) => {
    setNewWidget(prevState => {
      const updatedPairs = [...prevState.labelValuePairs];
      updatedPairs.splice(index, 1);
      return {
        ...prevState,
        labelValuePairs: updatedPairs
      };
    });
  };

  const handleLabelValueChange = (index, field, value) => {
    const updatedPairs = [...newWidget.labelValuePairs];
    updatedPairs[index][field] = value;
    setNewWidget({
      ...newWidget,
      labelValuePairs: updatedPairs
    });
  };

  return (
    <div style={{ padding: '20px', marginTop:'50px' }}>
      {categories.map((category, index) => (
        <div key={category.id || category.category_name} style={{ marginBottom: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor:'grey', color:'white', borderRadius: '8px' }}>
            <div style={{margin:'10px'}}>
              <h2>{category.category_name}</h2>
              <p>{category.description}</p>
            </div>
            <div style={{margin:'10px'}}>
              <Button 
                variant="contained" 
                color="primary" 
                style={{ width: '150px'}}
                onClick={() => handleAddWidgetClick(category)}
              >
                Add Widget
              </Button>
              {/* Remove Category Button */}
            </div>
          </div>
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            flexWrap: 'wrap', 
            gap: '30px',
            marginTop: '5px',
            alignItems: 'center',
          }}>
            {category.widgets
              .filter(widget => 
                widget.title.toLowerCase().includes(searchQuery) ||
                (widget.description && widget.description.toLowerCase().includes(searchQuery))
              )
              .map((widget) => (
                <WidgetCard 
                  key={widget.widget_id} 
                  widget={{ 
                    ...widget, 
                    total: calculateTotal(widget.data),
                    categoryId: category.id || category.category_name
                  }} 
                  chartType={widget.chartType || 
                    (index === 0 ? 'pie' : 
                     index === 1 ? 'bar' : 'line')} 
                />
              ))}
          </div>
        </div>
      ))}

      {/* Add Widget Modal */}
      <Modal open={openAddWidget} onClose={() => setOpenAddWidget(false)}>
  <Box sx={{
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    boxShadow: 24,
    p: 4,
    maxHeight: '80vh',  // Limit the max height
    overflowY: 'auto',  // Enable vertical scrolling
  }}>
    <Typography variant="h6" gutterBottom>
      Add Widget to {currentCategory?.category_name}
      {/* Close Icon */}
      <IconButton
        edge="end"
        color="inherit"
        onClick={() => setOpenAddWidget(false)}
        sx={{ position: 'absolute', top: 10, right: 10 }}
      >
        <CloseIcon />
      </IconButton>
    </Typography>
    <TextField
      label="Widget Title"
      fullWidth
      value={newWidget.title}
      onChange={(e) => setNewWidget({...newWidget, title: e.target.value})}
      sx={{ my: 2 }}
    />
    <FormControl fullWidth sx={{ my: 2 }}>
      <InputLabel>Chart Type</InputLabel>
      <Select
        value={newWidget.chartType}
        label="Chart Type"
        onChange={(e) => setNewWidget({...newWidget, chartType: e.target.value})}
      >
        <MenuItem value="pie">Pie Chart</MenuItem>
        <MenuItem value="bar">Bar Chart</MenuItem>
        <MenuItem value="line">Line Chart</MenuItem>
      </Select>
    </FormControl>

    {/* Label-Value Pairs */}
    {newWidget.labelValuePairs.map((pair, index) => (
      <div key={index} style={{ marginBottom: '10px' }}>
        <TextField
          label={`Label ${index + 1}`}
          fullWidth
          value={pair.label}
          onChange={(e) => handleLabelValueChange(index, 'label', e.target.value)}
          sx={{ my: 1 }}
        />
        <TextField
          label={`Value ${index + 1}`}
          fullWidth
          type="number"
          value={pair.value}
          onChange={(e) => handleLabelValueChange(index, 'value', e.target.value)}
          sx={{ my: 1 }}
        />
        <Button
          variant="outlined"
          color="secondary"
          onClick={() => handleRemoveLabelValuePair(index)}
          style={{ marginTop: '5px' }}
        >
          Remove
        </Button>
      </div>
    ))}

    {/* Button to Add More Label-Value Pairs */}
    <Button
      variant="outlined"
      color="primary"
      onClick={handleAddLabelValuePair}
      fullWidth
      style={{ marginBottom: '10px' }}
    >
      Add Label-Value Pair
    </Button>

    <Button 
      variant="contained" 
      color="primary" 
      fullWidth
      onClick={handleSaveWidget}
      disabled={!newWidget.title || newWidget.labelValuePairs.some(pair => !pair.label || !pair.value)}
    >
      Save Widget
    </Button>
  </Box>
</Modal>

    </div>
  );
};

export default CategorySection;
