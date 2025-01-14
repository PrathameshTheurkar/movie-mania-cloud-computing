import * as React from 'react';
import PropTypes from 'prop-types';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import CssBaseline from '@mui/material/CssBaseline';
import Divider from '@mui/material/Divider';
import Drawer from '@mui/material/Drawer';
import IconButton from '@mui/material/IconButton';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import MenuIcon from '@mui/icons-material/Menu';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import { useNavigate } from 'react-router-dom';
import { Menu, MenuItem } from '@mui/material';
import axios from 'axios';
import LogoutIcon from '@mui/icons-material/Logout';
import toast from 'react-hot-toast'


const drawerWidth = 240;

const  Appbar = (props) =>  {
  const { window, children } = props;
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const [anchorEl, setAnchorEl] = React.useState(null);
  const navigate = useNavigate()

  const handleDrawerToggle = () => {
    setMobileOpen((prevState) => !prevState);
  };

  const handleClose = () => {
    setAnchorEl(null)
  }

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  }

  // const {user, auth, handleAuthentication} = useAuth()

  const [auth, setAuth] = React.useState(false)
  const [user, setUser] = React.useState('')
  async function handleAuth(){
      const {data} = await axios.get('/admin/me', {
          headers: {
              "Content-Type" : "application/json",
              "Authorization" : "Bearer " + localStorage.getItem('token')
          }
      }) 
      if(data.auth){
          setAuth(data.auth)
          setUser(data.user)
      }
      // if(status == 404)setAuth(false)
      
  }

  React.useEffect(()=>{
    handleAuth()
  }, [user, auth])

  const drawer = (
    <Box onClick={handleDrawerToggle} sx={{ textAlign: 'center' }}>
      <Typography variant="h6" sx={{ my: 2 }}>
      Movie Mania
      </Typography>
      <Divider />
      <List>
          <ListItem disablePadding>
            <ListItemButton onClick={()=> navigate('/movies')} sx={{ textAlign: 'center' }}>
              <ListItemText primary={'Movies'} />
            </ListItemButton>
          </ListItem>

          <ListItem disablePadding>
            <ListItemButton onClick={()=> navigate('/addmovie')} sx={{ textAlign: 'center' }}>
              <ListItemText primary={'Add Movie'} />
            </ListItemButton>
          </ListItem>
      </List>
    </Box>
  );

  const container = window !== undefined ? () => window().document.body : undefined;

  return (
    <Box sx={{ display: 'flex'}}>
      <CssBaseline />
      <AppBar component='nav'>
        <Toolbar>
          <div className='w-screen flex justify-between'>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { sm: 'none' } }}
          >
            <MenuIcon />
          </IconButton>

          <Typography
            variant="h6"
            component="div"
            sx={{ flexGrow: 1, display: 'flex', alignItems: 'center'}}
          >
            MovieMania
          </Typography>
          
          <Box component='main' sx={{ mr: {sm: 4}, display: { xs: 'none', sm: 'block' } }}>
              <Button onClick={()=> {navigate('/movies')}} sx={{ color: '#fff' }}>
                Movies
              </Button>

              <Button onClick={()=> navigate('/addmovie')} sx={{ color: '#fff' }}>
                Add Movie
              </Button>
          </Box>

          <Box sx={{display: 'flex', alignItems: 'center'}}>
          <IconButton onClick={handleMenu}>
          <AccountCircleIcon sx={{color: 'white'}}/>
          </IconButton>

          <Menu
                id="menu-appbar"
                anchorEl={anchorEl}
                anchorOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                keepMounted
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                open={Boolean(anchorEl)}
                onClose={handleClose}
              >
                <MenuItem onClick={handleClose}>{user}</MenuItem>
                <MenuItem onClick={()=>{
                  handleClose()
                  localStorage.setItem('token', null)
                  toast.success('Logout Successfully')
                  navigate('/login')
                }}
                className='flex gap-x-2'
                >Logout<LogoutIcon /> </MenuItem>
              </Menu>
          </Box>
          </div>

        </Toolbar>
      </AppBar>
      <nav>
        <Drawer
          container={container}
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true,
          }}
          sx={{
            display: { xs: 'block', sm: 'none' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
          }}
        >
          {drawer}
        </Drawer>
      </nav>
      <Box component="main" sx={{ p: 3, width: '100vw' }}>
        <Toolbar />
        {children}
      </Box>
    </Box>
  );
}

Appbar.propTypes = {
  window: PropTypes.func,
  children: React.ReactNode
};

export default Appbar;