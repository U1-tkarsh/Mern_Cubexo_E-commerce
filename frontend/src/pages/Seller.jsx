import { Box, Button, CardActions, TextField, CardContent, Card } from '@mui/material';
import { useState } from "react";
import API from "../../api/axios";
import { Link } from 'react-router-dom';

export default function MediaCard() {
  const [newTitle, setNewTitle] = useState("");
  const [newImage, setNewImage] = useState("");
  const [newDescription, setNewDescription] = useState("");

  const addTask = async (e) => {
    e.preventDefault();
    if (!newTitle.trim()) return;
    if (!newImage.trim()) return;
    if (!newDescription.trim()) return;

    try {
      await API.post("/product", { title: newTitle, image: newImage, description: newDescription });
      setNewImage("");
      setNewDescription("");
      setNewTitle("");
      alert("Product added successfully");
    } catch {
      console.log("Failed to add product");
    }
  };

  return (
    <Box sx={{ width: '100%', padding: 2 }}>
      <Card sx={{ maxWidth: 345, margin: 2 }}>
        <CardContent>
          <Box display={'flex'} flexDirection={'column'} marginBottom={2}>
            <TextField
              id="outlined-basic"
              label="Product Title"
              variant="outlined"
              value={newTitle}
              margin='dense'
              onChange={(e) => setNewTitle(e.target.value)}
              fullWidth
              required
            />
            <TextField
              id="outlined-basic"
              label="Product Image URL"
              variant="outlined"
              value={newImage}
              onChange={(e) => setNewImage(e.target.value)}
              fullWidth
              required
            />
            <TextField
              id="outlined-basic"
              label="Product Description"
              variant="outlined"
              value={newDescription}
              margin='dense'
              onChange={(e) => setNewDescription(e.target.value)}
              fullWidth
              required
            />
          </Box>
          <Button onClick={addTask} variant="contained" color="primary">
            Add Product
          </Button>
        </CardContent>
        <CardActions>
          <Button size="small"><Link to='/'>View Products</Link></Button>
          <Button size="small">Checkout</Button>
        </CardActions>
      </Card>
    </Box>
  );
}
