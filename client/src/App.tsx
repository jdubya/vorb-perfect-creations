import * as React from 'react';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';

import Stats from './components/Stats';

export default function App() {
  return (
    <>
      <AppBar position="static">
        <Container maxWidth="md">
          <Toolbar>
            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
              My Dashboard
            </Typography>
          </Toolbar>
        </Container>
      </AppBar>
      <Container maxWidth="md">
        <Stats />
      </Container>
    </>
  );
}
