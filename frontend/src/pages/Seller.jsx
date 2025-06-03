import { Box, Button, CardActions, TextField, Paper } from '@mui/material';
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
    <Paper>
      <Box sx={{ width: '100%', padding: 2 }}>
        <Box sx={{ display: 'flex', alignContent: 'center', alignItems: 'center', flexDirection: 'column', padding: 2 }}>
          <Box sx={{ width: '100%' }}>
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
          </Box>
          <CardActions>
            <Button size="small"><Link to='/'>View Products</Link></Button>
            <Button size="small">Checkout</Button>
          </CardActions>
        </Box>
      </Box>
    </Paper>
  );
}
