import React from 'react';
import { Box, Button } from '@mui/material';
import { useNavigate, useLocation } from 'react-router-dom';

// Иконки
import HomeIcon from '../assets/Icon_NavBar/Icon_home.svg';
import P2PIcon from '../assets/Icon_NavBar/Icon_p2p.svg';
import ListIcon from '../assets/Icon_NavBar/Icon_list.svg';
import PersonIcon from '../assets/Icon_NavBar/Icon_person.svg';
import CartIcon from '../assets/Icon_NavBar/Icon_shop.svg';

const ROUTES = [
  { path: '/', icon: HomeIcon, label: 'Главная' },
  { path: '/p2p', icon: P2PIcon, label: 'P2P' },
  { path: '/list', icon: ListIcon, label: 'Список' },
  { path: '/friends', icon: PersonIcon, label: 'Друзья' },
  { path: '/shop', icon: CartIcon, label: 'Магазин' },
];

const NavBar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleNavigation = (path) => {
    navigate(path);
  };

  return (
    <Box
      sx={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 100,
        background: '#27187E',
        display: 'flex',
        justifyContent: 'space-around',
        alignItems: 'center',
        height: '70px',
        borderTopLeftRadius: '32px',
        borderTopRightRadius: '32px',
        maxWidth: '414px',
        mx: 'auto',
        boxShadow: '0px -4px 10px rgba(0, 0, 0, 0.1)',
      }}
    >
      {ROUTES.map(({ path, icon, label }) => (
        <Button
          key={path}
          onClick={() => handleNavigation(path)}
          sx={{
            minWidth: 'auto',
            padding: '8px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            color: location.pathname === path ? '#ffffff' : 'rgba(255, 255, 255, 0.7)',
            '&:hover': {
              backgroundColor: 'rgba(255, 255, 255, 0.1)',
            },
            transition: 'all 0.3s ease',
            transform: location.pathname === path ? 'scale(1.1)' : 'scale(1)',
          }}
        >
          <img 
            src={icon} 
            alt={label} 
            width={24} 
            height={24}
            style={{
              opacity: location.pathname === path ? 1 : 0.7,
              filter: location.pathname === path ? 'brightness(1.2)' : 'none',
            }}
          />
        </Button>
      ))}
    </Box>
  );
};

export default NavBar;
