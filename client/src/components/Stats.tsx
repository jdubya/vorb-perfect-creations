import * as React from 'react';
import axios from 'axios';

import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import CircularProgress from '@mui/material/CircularProgress';
import Alert from '@mui/material/Alert';

import {
  useQuery,
  useQueryClient,
} from 'react-query'

export interface RecentOrder {
  order_id: number;
  order_placed: string;
  product_name: string;
  price: string;
  first_name: string;
  last_name: string;
  address: string;
  email: string;
  order_status: string;
}

export interface ApiStats {
  ordersThisMonth: number;
  ordersLastMonth: number;
  ordersTotal: number;
  revenueThisMonth: number;
  revenueLastMonth: number;
  revenueTotal: number;
  ordersInProgress: number;
  mostRecent: RecentOrder[]
}

function fetchStats(): Promise<ApiStats> {
  return axios.get('http://localhost:3001/stats').then((response) => response.data)
}

function useStats() {
  return useQuery('stats', fetchStats, {
    staleTime: 60000,
  })
}

export default function Stats() {
  // const queryClient = useQueryClient()
 
  // const { isLoading, isError, error, data } = useQuery('fetchStats', () => fetch('http://localhost:3001/stats'), {
  //   staleTime: 60000,
  // })

  const stats = useStats();

  if (stats.isLoading) {
    return (
      <Box mt={10} sx={{  display: 'flex', justifyContent: 'center',}}>
        <CircularProgress />
      </Box>
    );
  }

  if (stats.error instanceof Error) {
    return (
      <Box mt={4} sx={{  display: 'flex', justifyContent: 'center',}}>
        <Alert severity="warning">Unable to fetch the stats from the API: {stats.error.message}</Alert>
      </Box>
    );
  }

  /*
    "ordersThisMonth": 12,
    "ordersLastMonth": 76,
    "ordersTotal": 1000,
    "revenueThisMonth": 1629.49,
    "revenueLastMonth": 8370.76,
    "revenueTotal": 108407.58,
    "ordersInProgress": 260,
    "mostRecent": [
      {
        "order_id": 604,
        "order_placed": "2021-10-05",
        "product_name": "i heart milk brooch",
        "price": 68.83,
        "first_name": "Janeva",
        "last_name": "Canadine",
        "address": "2263 Maple Avenue",
        "email": "jcanadinegr@sphinn.com",
        "order_status": "in_progress"
      },
  */

  return (
    <Grid container spacing={3}>
      <Grid item xs={12} md={6}>
        <Paper elevation={3}>
          <Box sx={{ my: 4, px: 4, py: 2 }}>
          <List component="nav" aria-label="mailbox folders">
            <ListItem divider>
              <ListItemText primary="Orders This Month" secondary={stats.data?.ordersThisMonth} />
            </ListItem>
            <ListItem divider>
              <ListItemText primary="Orders Last Month" secondary={stats.data?.ordersLastMonth} />
            </ListItem>
            <ListItem divider>
              <ListItemText primary="Total Orders" secondary={stats.data?.ordersTotal} />
            </ListItem>
            <ListItem divider>
              <ListItemText primary="Revenue This Month ($)" secondary={stats.data?.revenueThisMonth} />
            </ListItem>
            <ListItem divider>
              <ListItemText primary="Revenue Last Month ($)" secondary={stats.data?.revenueLastMonth} />
            </ListItem>
            <ListItem divider>
              <ListItemText primary="Total Revenue ($)" secondary={stats.data?.revenueTotal} />
            </ListItem>
          </List>
          </Box>
        </Paper>
      </Grid>
      <Grid item xs={12} md={6}>
        <Paper elevation={3}>
          <Box sx={{ my: 4, px: 4, py: 2 }}>
            <List component="nav" aria-label="mailbox folders">
              <ListItem>
                <ListItemText primary="Orders In Progress" secondary={stats.data?.ordersInProgress} />
              </ListItem>
            </List>
          </Box>
        </Paper>
        <Paper elevation={3}>
          <Box sx={{ my: 4, px: 4, py: 2 }}>
            <List component="nav" aria-label="mailbox folders">
              <ListItem divider>
                <ListItemText primary="5 Most Recent Orders" />
              </ListItem>
              {stats.data?.mostRecent.map((order) => {
                return (
                  <ListItem key={order.order_id}>
                    <ListItemText primary={order.product_name.concat(` ($${order.price})`)} />
                  </ListItem>
                );
              })}
            </List>
          </Box>
        </Paper>
      </Grid>
    </Grid>
  );
}