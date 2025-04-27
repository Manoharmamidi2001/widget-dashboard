  import React from 'react';
  import { PieChart, Pie, Cell, BarChart, Bar, LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
  import { useDispatch } from 'react-redux';
  import { removeWidget } from '../Features/categorySlice';
  import { IconButton } from '@mui/material';
  import DeleteIcon from '@mui/icons-material/Delete';
  import store, { saveState } from '../Store/store';

  const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff8042', '#8dd1e1', '#a4de6c'];

  const WidgetCard = ({ widget, chartType }) => {
    const dispatch = useDispatch();
    const chartData = Object.entries(widget.data || {}).map(([key, value]) => ({
      name: key,
      value: value
    }));

    const handleRemoveWidget = (categoryId, widgetId) => {
      dispatch(removeWidget({ categoryId, widgetId }));
      const updatedState = store.getState();
      saveState(updatedState);
    };

    return (
      <div style={{ 
        border: '1px solid #ccc',
        borderRadius: '8px',
        padding: '10px',
        width: '420px',
        minHeight: '250px',
        backgroundColor: '#fff',
        boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
      }}>
        <IconButton 
          size="small" 
          onClick={() => handleRemoveWidget(widget.categoryId, widget.widget_id)} 
          sx={{ position: 'absolute', right: 8, top: 8, color:'red' }}
        >
          <DeleteIcon fontSize="small" />
        </IconButton>

        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', marginBottom: '8px' }}>
          <h4 style={{ margin: 0, fontSize: '18px', fontWeight: 600 }}>{widget.title}</h4>
          <p style={{ margin: 0, fontSize: '14px', color: '#555' }}>Total: {widget.total}</p>
        </div>

        <div style={{ flexGrow: 1, display: 'flex', width: '100%', marginTop: '8px' }}>
          <div style={{ flex: 3, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <ResponsiveContainer width="100%" height="100%">
              {chartType === 'pie' && (
                <PieChart>
                  <Pie 
                    data={chartData} 
                    dataKey="value" 
                    nameKey="name" 
                    outerRadius={65}
                    label
                  >
                    {chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              )}
              {chartType === 'bar' && (
                <BarChart data={chartData}>
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="value" fill="#8884d8" barSize={20} />
                </BarChart>
              )}
              {chartType === 'line' && (
                <LineChart data={chartData}>
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="value" stroke="#8884d8" strokeWidth={3} />
                </LineChart>
              )}
            </ResponsiveContainer>
          </div>

          <div style={{ flex: 1, paddingLeft: '8px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
            {chartData.map((entry, index) => (
              <div key={index} style={{ display: 'flex', alignItems: 'center', marginBottom: '6px' }}>
                <div style={{
                  width: '12px',
                  height: '12px',
                  backgroundColor: COLORS[index % COLORS.length],
                  marginRight: '8px',
                  borderRadius: '50%'
                }} />
                <span style={{ fontSize: '13px', color: '#555' }}>{entry.name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  export default WidgetCard;
