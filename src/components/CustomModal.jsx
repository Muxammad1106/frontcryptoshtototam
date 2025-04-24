import React from 'react';
import { 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  DialogActions, 
  Button, 
  Typography,
  Box
} from '@mui/material';

const CustomModal = ({ 
  open, 
  onClose, 
  title, 
  message, 
  confirmText = 'OK', 
  icon = null,
  disableBackdropClick = false
}) => {
  const handleClose = (event, reason) => {
    if (disableBackdropClick && reason === 'backdropClick') {
      return;
    }
    onClose();
  };

  return (
    <Dialog 
      open={open} 
      onClose={handleClose}
      PaperProps={{
        sx: {
          backgroundColor: '#1a1a1a',
          color: 'white',
          borderRadius: 3,
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.5)',
          width: '90%',
          maxWidth: '350px'
        }
      }}
    >
      <DialogTitle sx={{ 
        textAlign: 'center', 
        fontWeight: 'bold',
        pt: 3,
        pb: 1
      }}>
        {title}
      </DialogTitle>
      
      <DialogContent sx={{ pb: 3, px: 3 }}>
        {icon && (
          <Box sx={{ textAlign: 'center', fontSize: '40px', mb: 2 }}>
            {icon}
          </Box>
        )}
        <Typography 
          align="center" 
          sx={{ 
            fontSize: '15px',
            opacity: 0.9 
          }}
        >
          {message}
        </Typography>
      </DialogContent>
      
      <DialogActions sx={{ 
        display: 'flex', 
        justifyContent: 'center', 
        pb: 3,
        px: 3 
      }}>
        <Button 
          onClick={onClose} 
          variant="contained" 
          fullWidth
          sx={{
            background: 'linear-gradient(180deg, #4839C3 0%, #7B57D6 100%)',
            borderRadius: '12px',
            color: 'white',
            textTransform: 'none',
            fontWeight: 'medium',
            '&:hover': {
              background: 'linear-gradient(180deg, #4839C3 0%, #6B4EC6 100%)',
            }
          }}
        >
          {confirmText}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CustomModal; 