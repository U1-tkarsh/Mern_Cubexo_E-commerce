import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import { Box } from '@mui/material';
import Grid from '@mui/material/Grid';

import { useEffect, useState } from "react";
import API from "../../api/axios";

export default function MediaCard() {
  const [product, setProduct] = useState([]);


  const fetchTasks = async () => {
    try {
      const { data } = await API.get("/product");
      setProduct(data);
    } catch {
      alert("Failed to fetch tasks");
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  return (
    <Box sx={{ width: '100%', padding: 2 }}>
      <Grid container spacing={{ xs: 2, md: 3 }} columns={{ xs: 4, sm: 8, md: 12 }}>
        {product.map((product, index) => (
          <Grid key={index} size={{ xs: 2, sm: 4, md: 4 }}>
            <Card sx={{ maxWidth: 345, margin: 2 }}>
              <Typography component="div" variant="h5" sx={{ padding: 2 }}>
                {product.title}
              </Typography>
              <CardMedia
                sx={{ height: 140 }}
                image={product.image}
                component="img"
                title="green iguana"
              />

              <CardContent>
                <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                  {product.description}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}
