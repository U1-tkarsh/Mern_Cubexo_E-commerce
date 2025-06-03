import { Box, Button, Card, CardMedia, Grid, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { Delete, AddBox, Remove } from '@mui/icons-material';
import API from "../../api/axios";
export default function Cart() {
  const [cart, setCart] = useState({ products: [] });

  const fetchCart = async () => {
    try {
      const response = await API.get('/cart');
      setCart(response.data);
    } catch (error) {
      console.error("Failed to fetch cart:", error);
    }
  }

  const updateCart = async (productId, quantity, symbol) => {
    try {
      if (symbol === 'plus') {
        quantity += 1;
      } else if (symbol === 'minus') {
        quantity -= 1;
        if (quantity < 1) {
          if (quantity === 0) {
            await API.delete(`/cart/remove/${productId}`);
            setCart((prevCart) => ({
              ...prevCart,
              products: prevCart.products.filter((p) => p.product._id !== productId)
            }));
            return;
          }
          quantity = 1;
        }
      }

      await API.put(`/cart/update/${productId}`, { quantity });
      setCart((prevCart) => ({
        ...prevCart,
        products: prevCart.products.map((p) =>
          p.product._id === productId ? { ...p, quantity } : p
        )
      }));
      fetchCart();

    } catch (error) {
      console.error("Failed to update cart:", error);
    }
  }

  useEffect(() => {
    fetchCart();
  }, []);

  return (
    <Box sx={{ width: '100%', padding: 2 }}>
      <Typography variant="h4" sx={{ display: 'flex', justifyContent: 'center', marginBottom: 2 }}>
        Your Cart
      </Typography>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', marginBottom: 2 }}>
        <Typography variant="subtitle1" sx={{ marginBottom: 2 }}>
          Total Items: {cart.products.length}
        </Typography>
        <Typography variant="subtitle1" sx={{ marginBottom: 2 }}>
          Total Price: ₹{cart.products.reduce((total, item) => total + item.product.price * item.quantity, 0)}
        </Typography>
        <Typography variant="subtitle1" sx={{ marginBottom: 2 }}>
          Total Quantity: {cart.products.reduce((total, item) => total + item.quantity, 0)}
        </Typography>
      </Box>
      <Grid container spacing={{ xs: 2, md: 3 }} columns={{ xs: 4, sm: 8, md: 12 }}>
        {cart.products.map((product, index) => (
          <Grid item xs={2} sm={4} md={4} key={index}>
            <Card sx={{ maxWidth: 345, margin: 2 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingX: 1 }}>
                <Typography component="div" variant="h5" sx={{ paddingX: 2, paddingY: 1 }}>
                  {product.product.title}
                </Typography>
                <Box>
                  <Delete
                    sx={{ cursor: 'pointer', color: 'red' }}
                    onClick={async () => {
                      try {
                        await API.delete(`/cart/remove/${product.product._id}`);
                        setCart((prevCart) => ({
                          ...prevCart,
                          products: prevCart.products.filter((p) => p._id !== product._id)
                        }));
                      } catch {
                        alert("Failed to delete product");
                      }
                    }}
                  />
                </Box>
              </Box>
              <CardMedia
                sx={{ p: 0, height: 140, objectFit: 'fill' }}
                image={product.product.image}
                component="img"
                alt={product.title}
              />
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="body2" sx={{ p: 1, color: 'text.secondary' }}>
                  Price: ₹{product.product.price}
                </Typography>
                <Button variant="outlined" onClick={() => updateCart(product.product._id, product.quantity, 'minus')}>
                  <Remove />
                </Button>
                <Typography variant="body1" sx={{ p: 1 }}>
                  {product.quantity}
                </Typography>
                <Button variant="outlined" onClick={() => updateCart(product.product._id, product.quantity, 'plus')}>
                  <AddBox />
                </Button>
              </Box>
              <Typography variant="body2" sx={{ p: 1, color: 'text.secondary' }}>
                {product.product.description}
              </Typography>
            </Card>
          </Grid>
        ))}
        {cart.products.length === 0 && (
          <Typography variant="h6" sx={{ width: '100%', textAlign: 'center', marginTop: 2 }}>
            Your cart is empty
          </Typography>
        )}
      </Grid>
    </Box>
  );
}