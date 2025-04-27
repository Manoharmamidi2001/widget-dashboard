import * as React from 'react';
import { styled, alpha } from '@mui/material/styles';
import { AppBar, Box, Toolbar, Typography, InputBase, Button, Drawer, List, ListItem, ListItemText, Checkbox, Divider, IconButton } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import CloseIcon from '@mui/icons-material/Close';
import { useDispatch, useSelector } from 'react-redux';
import { setSearchQuery, removeSelectedWidgets } from '../Features/categorySlice';

const Search = styled('div')(({ theme }) => ({
  position: 'relative',
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.common.white, 0.15),
  '&:hover': {
    backgroundColor: alpha(theme.palette.common.white, 0.25),
  },
  marginRight: theme.spacing(2),
  marginLeft: theme.spacing(3),
  width: '100%',
  [theme.breakpoints.up('sm')]: {
    width: 'auto',
  },
}));

const SearchIconWrapper = styled('div')(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: '100%',
  position: 'absolute',
  pointerEvents: 'none',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: 'inherit',
  '& .MuiInputBase-input': {
    padding: theme.spacing(1, 1, 1, 0),
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create('width'),
    width: '100%',
    [theme.breakpoints.up('md')]: {
      width: '20ch',
    },
  },
}));

export default function Header() {
  const dispatch = useDispatch();
  const categories = useSelector(state => state.categories.categories);
  const searchQuery = useSelector(state => state.categories.searchQuery);

  const [drawerOpen, setDrawerOpen] = React.useState(false);
  const [selectedWidgets, setSelectedWidgets] = React.useState({});

  const toggleDrawer = (open) => () => {
    setDrawerOpen(open);
  };

  const handleToggleWidgetSelection = (categoryId, widgetId) => {
    setSelectedWidgets(prev => ({
      ...prev,
      [categoryId]: {
        ...prev[categoryId],
        [widgetId]: !prev[categoryId]?.[widgetId]
      }
    }));
  };

  const handleSearchChange = (e) => {
    dispatch(setSearchQuery(e.target.value));
  };

  const handleRemoveSelectedWidgets = (categoryId) => {
    const selectedWidgetIds = Object.keys(selectedWidgets[categoryId] || {}).filter(widgetId => selectedWidgets[categoryId]?.[widgetId]);
    if (selectedWidgetIds.length > 0) {
      dispatch(removeSelectedWidgets({ categoryId, widgetIds: selectedWidgetIds }));
    }
    setSelectedWidgets(prev => ({
      ...prev,
      [categoryId]: {}
    }));
  };

  const isRemoveButtonDisabled = (categoryId) => {
    return Object.values(selectedWidgets[categoryId] || {}).every(value => !value);
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="fixed">
        <Toolbar>
          <Typography variant="h6" noWrap component="div" sx={{ display: { xs: 'none', sm: 'block' } }}>
            Dashboard
          </Typography>
          <Search>
            <SearchIconWrapper>
              <SearchIcon />
            </SearchIconWrapper>
            <StyledInputBase
              placeholder="Search Widgets…"
              inputProps={{ 'aria-label': 'search' }}
              onChange={handleSearchChange}
            />
          </Search>

          <Box sx={{ flexGrow: 1 }} />

          <Button 
            variant="contained" 
            color="primary" 
            sx={{ position: 'absolute', top: '10px', right: '10px' }}
            onClick={toggleDrawer(true)}
          >
            Manage Categories
          </Button>
        </Toolbar>
      </AppBar>

      <Drawer
        anchor="right"
        open={drawerOpen}
        onClose={toggleDrawer(false)}
      >
        <Box sx={{ width: 350, p: 2 }}>
          <IconButton
            edge="start"
            color="inherit"
            onClick={toggleDrawer(false)}
            sx={{ position: 'absolute', top: '10px', right: '10px' }}
          >
            <CloseIcon />
          </IconButton>

          <Typography variant="h6" sx={{ mb: 2 }}>
            Manage Categories
          </Typography>

          {categories?.map((category) => (
            <div key={category.id || category.category_name}>
              <Typography variant="subtitle1" sx={{ mt: 2 }}>
                {category.category_name}
              </Typography>
              <Divider sx={{ mb: 1 }} />
              <List dense>
                {category.widgets
                  .filter(widget => widget.title.toLowerCase().includes(searchQuery.toLowerCase()))
                  .map(widget => (
                    <ListItem key={widget.widget_id} disablePadding>
                      <Checkbox
                        checked={!!selectedWidgets[category.id]?.[widget.widget_id]}
                        onChange={() => handleToggleWidgetSelection(category.id, widget.widget_id)}
                      />
                      <ListItemText primary={widget.title} />
                    </ListItem>
                  ))}
              </List>
              <Button
                variant="contained"
                color="secondary"
                onClick={() => handleRemoveSelectedWidgets(category.id)}
                sx={{ mt: 2 }}
                disabled={isRemoveButtonDisabled(category.id)}
              >
                Remove Selected Widgets
              </Button>
            </div>
          ))}
        </Box>
      </Drawer>
    </Box>
  );
}
