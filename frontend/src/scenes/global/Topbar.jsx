import { Box, IconButton, Menu, MenuItem, useTheme } from "@mui/material";
import { useContext, useState } from "react";
import { ColorModeContext } from "../../theme";
import LightModeOutlinedIcon from "@mui/icons-material/LightModeOutlined";
import DarkModeOutlinedIcon from "@mui/icons-material/DarkModeOutlined";
import PersonOutlinedIcon from "@mui/icons-material/PersonOutlined";
import { Link } from "react-router-dom";
const Topbar = () => {
  const [anchorEl, setAnchorEl] = useState(null);
  const theme = useTheme();
  const colorMode = useContext(ColorModeContext);
  const isMenuOpen = Boolean(anchorEl);
  const handleMenuClose = () => {
    setAnchorEl(null);
  };
  const menuId = 'primary-search-account-menu';
  const handleProfileMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const renderMenu = (
    <Menu
      anchorEl={anchorEl}
      anchorOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
      id={menuId}
      keepMounted
      transformOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
      sx={{marginTop: 4}}
      open={isMenuOpen}
      onClose={handleMenuClose}
    >
      <Link to="/logout" style={{ textDecoration: 'none', color: 'inherit' }}> <MenuItem onClick={handleMenuClose} to='/logout'>Logout</MenuItem></Link>
    </Menu>
  );

  return (
    <Box display="flex" justifyContent="space-between" p={2}>
      {/* SEARCH BAR */}

      {/* ICONS */}
      <Box display="flex" ml={"94%"}>
        <IconButton onClick={colorMode.toggleColorMode}>
          {theme.palette.mode === "dark" ? (
            <DarkModeOutlinedIcon />
          ) : (
            <LightModeOutlinedIcon />
          )}
        </IconButton>
        
        <IconButton               
              size="large"
              edge="end"
              aria-label="account of current user"
              aria-controls={menuId}
              aria-haspopup="true"
              onClick={handleProfileMenuOpen}
              color="inherit">
          <PersonOutlinedIcon />
        </IconButton>
      </Box>
      {renderMenu}
    </Box>
  );
};

export default Topbar;