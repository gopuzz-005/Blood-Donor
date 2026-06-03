
import React from 'react';
import { 
  Box, 
  Container, 
  Grid, 
  Typography, 
  IconButton, 
  Button, 
  TextField, 
  Divider,
  Stack
} from '@mui/material';
import { 
  Facebook, 
  Twitter, 
  Instagram, 
  LinkedIn, 
  Bloodtype, 
  Send, 
  Phone, 
  Email, 
  LocationOn 
} from '@mui/icons-material';

import '../../styles/Footer.css';

const Footer = () => {
  return (
    <Box component="footer" className="footer-section" sx={{ pt: 8, pb: 4 }}>
      <Container maxWidth="lg">
        <Grid container spacing={5}>
          
          <Grid item xs={12} md={4}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <Bloodtype sx={{ fontSize: 40, color: '#d32f2f', mr: 1 }} />
              <Typography variant="h5" fontWeight="bold" className="footer-logo-text">
                BLOODLINK
              </Typography>
            </Box>
            <Typography variant="body2" sx={{ lineHeight: 1.8, mb: 3, maxWidth: '300px' }}>
              Revolutionizing the blood donation ecosystem with the MERN stack. We bridge the gap between donors, hospitals, and those in need to save lives in real-time.
            </Typography>
            <Stack direction="row" spacing={1}>
              <IconButton className="social-icon-btn" size="small" sx={{ color: 'white' }}>
                <Facebook fontSize="small" />
              </IconButton>
              <IconButton className="social-icon-btn" size="small" sx={{ color: 'white' }}>
                <Twitter fontSize="small" />
              </IconButton>
              <IconButton className="social-icon-btn" size="small" sx={{ color: 'white' }}>
                <Instagram fontSize="small" />
              </IconButton>
              <IconButton className="social-icon-btn" size="small" sx={{ color: 'white' }}>
                <LinkedIn fontSize="small" />
              </IconButton>
            </Stack>
          </Grid>

          <Grid item xs={12} sm={6} md={2}>
            <Typography variant="subtitle1" fontWeight="700" color="white" gutterBottom sx={{ mb: 2 }}>
              Platform
            </Typography>
            <Box>
              <a href="#" className="footer-link">Home</a>
              <a href="#" className="footer-link">About Us</a>
              <a href="#" className="footer-link">Find a Donor</a>
              <a href="#" className="footer-link">Hospital Network</a>
              <a href="#" className="footer-link">Success Stories</a>
            </Box>
          </Grid>

          <Grid item xs={12} sm={6} md={2}>
            <Typography variant="subtitle1" fontWeight="700" color="white" gutterBottom sx={{ mb: 2 }}>
              Support
            </Typography>
            <Box>
              <a href="#" className="footer-link">Contact Support</a>
              <a href="#" className="footer-link">Privacy Policy</a>
              <a href="#" className="footer-link">Terms of Service</a>
              <a href="#" className="footer-link">Donor FAQ</a>
              <a href="#" className="footer-link">Admin Login</a>
            </Box>
          </Grid>

          <Grid item xs={12} md={4}>
            <Typography variant="subtitle1" fontWeight="700" color="white" gutterBottom sx={{ mb: 2 }}>
              Stay Connected
            </Typography>
            
            <Box sx={{ mb: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1.5 }}>
                <LocationOn sx={{ color: '#d32f2f', fontSize: 18, mr: 1.5 }} />
                <Typography variant="body2">123 Health Avenue, MedCity, NY</Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1.5 }}>
                <Phone sx={{ color: '#d32f2f', fontSize: 18, mr: 1.5 }} />
                <Typography variant="body2">+1 (555) 123-4567</Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Email sx={{ color: '#d32f2f', fontSize: 18, mr: 1.5 }} />
                <Typography variant="body2">help@bloodlink.com</Typography>
              </Box>
            </Box>

            <Typography variant="body2" sx={{ mb: 1, color: '#64748b' }}>
              Subscribe to our newsletter for updates:
            </Typography>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <TextField 
                variant="outlined" 
                placeholder="Your email" 
                size="small" 
                fullWidth
                className="newsletter-input"
              />
              <Button 
                variant="contained" 
                color="primary"
                sx={{ 
                  bgcolor: '#d32f2f',
                  minWidth: '50px',
                  '&:hover': { bgcolor: '#b71c1c' } 
                }}
              >
                <Send fontSize="small" />
              </Button>
            </Box>
          </Grid>
        </Grid>

        <Divider sx={{ borderColor: 'rgba(255,255,255,0.1)', mt: 6, mb: 3 }} />

        <Grid container alignItems="center" justifyContent="space-between">
          <Grid item xs={12} md={6}>
            <Typography variant="body2" sx={{ color: '#64748b', textAlign: { xs: 'center', md: 'left' } }}>
              © {new Date().getFullYear()} BloodLink System. All rights reserved.
            </Typography>
          </Grid>
          <Grid item xs={12} md={6}>
            <Box sx={{ display: 'flex', justifyContent: { xs: 'center', md: 'flex-end' }, gap: 3, mt: { xs: 2, md: 0 } }}>
              <Typography variant="body2" sx={{ cursor: 'pointer', '&:hover': { color: '#d32f2f' } }}>
                Privacy
              </Typography>
              <Typography variant="body2" sx={{ cursor: 'pointer', '&:hover': { color: '#d32f2f' } }}>
                Cookies
              </Typography>
              <Typography variant="body2" sx={{ cursor: 'pointer', '&:hover': { color: '#d32f2f' } }}>
                Accessibility
              </Typography>
            </Box>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default Footer;