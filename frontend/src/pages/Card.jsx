import Card from '@mui/material/Card';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import { Box, Button } from '@mui/material';
import Grid from '@mui/material/Grid';
import DeleteIcon from '@mui/icons-material/Delete';

import { useEffect, useState } from "react";
import API from "../../api/axios";

export default function MediaCard() {
  const [product, setProduct] = useState([]);
  const [cart, setCart] = useState([]);

  const fetchTasks = async () => {
    try {
      const { data } = await API.get("/product");
      setProduct(data);
    } catch {
      alert("Failed to fetch tasks");
    }
  };

  const addCart = async (productId) => {
    try {
      const { data } = await API.post("/cart/add", { productId, quantity: 1 });
      setCart((prevCart) => [...prevCart, data]);
    } catch {
      alert("Failed to add product to cart");
    }
  }

  useEffect(() => {
    fetchTasks();
  }, []);

  return (
    <Box sx={{ width: '100%', padding: 2 }}>
      <Grid container spacing={{ xs: 2, md: 3 }} columns={{ xs: 4, sm: 8, md: 12 }}>
        {product.map((product, index) => (
          <Grid item xs={2} sm={4} md={4} key={index}>
            <Card sx={{ maxWidth: 345, margin: 2 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingX: 1 }}>
                <Typography component="div" variant="h5" sx={{ paddingX: 2, paddingY: 1 }}>
                  {product.title}
                </Typography>
                {localStorage.getItem("role") == 'admin' ? <Box>
                  <DeleteIcon
                    sx={{ cursor: 'pointer', color: 'red' }}
                    onClick={async () => {
                      try {
                        await API.delete(`/product/${product._id}`);
                        setProduct((prevProducts) => prevProducts.filter((p) => p._id !== product._id));
                      } catch {
                        alert("Failed to delete product");
                      }
                    }}
                  />
                </Box> : null}
              </Box>
              <CardMedia
                sx={{ p: 0, height: 140, objectFit: 'fill' }}
                image={product.image}
                component="img"
                alt={product.title}
              />
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="body2" sx={{ p: 1, color: 'text.secondary' }}>
                  Price: ₹{product.price}
                </Typography>
                <Button onClick={() => addCart(product._id)} variant='outlined' color="primary" sx={{ m: 1 }}>
                  Add to Cart
                </Button>
              </Box>
              <Typography variant="body2" sx={{ p: 1, color: 'text.secondary' }}>
                {product.description}
              </Typography>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}
