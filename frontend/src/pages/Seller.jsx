import { Box, Button, TextField, Paper } from '@mui/material';
import { useState } from "react";
import API from "../../api/axios";
import { Link } from 'react-router-dom';
import { styled } from '@mui/material/styles';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';

const VisuallyHiddenInput = styled('input')({
  clip: 'rect(0 0 0 0)',
  clipPath: 'inset(50%)',
  height: 1,
  overflow: 'hidden',
  position: 'absolute',
  bottom: 0,
  left: 0,
  whiteSpace: 'nowrap',
  width: 1,
});


export default function MediaCard() {
  const [newTitle, setNewTitle] = useState("");
  const [newImage, setNewImage] = useState("");
  const [preview, setPreview] = useState('');
  const [price, setPrice] = useState("");
  const [newDescription, setNewDescription] = useState("");

  const uploadImage = async (file) => {
    const formData = new FormData();
    formData.append("image", file);

    console.log("Uploading image:", file);
    
    const response = await API.post("/product/upload", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    return response.data.imageUrl;
  };

  const addTask = async (e) => {
    e.preventDefault();
    if (!newTitle.trim()) return;
    if (!newDescription.trim()) return;

    try {
      let imageUrl = "";

      if (typeof newImage === "string") {
        imageUrl = newImage;
      } else {
        imageUrl = await uploadImage(newImage);
      }
      await API.post("/product", { title: newTitle, image: imageUrl, description: newDescription, price: price });
      setNewImage("");
      setNewDescription("");
      setNewTitle("");
      setPrice("");
      alert("Product added successfully");
    } catch {
      console.log("Failed to add product");
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setNewImage(file);
      setPreview(imageUrl);
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
                label="Product Description"
                variant="outlined"
                value={newDescription}
                margin='dense'
                onChange={(e) => setNewDescription(e.target.value)}
                fullWidth
                required
              />
              <TextField
                id="outlined-basic"
                label="Product Price"
                variant="outlined"
                value={price}
                margin='dense'
                onChange={(e) => setPrice(e.target.value)}
                fullWidth
                required
              />
            </Box>
            <Button
              component="label"
              role={undefined}
              variant="contained"
              tabIndex={-1}
              startIcon={<CloudUploadIcon />}
            >
              Upload Image
              <VisuallyHiddenInput
                type="file"
                onChange={handleFileChange}
                multiple
              />
            </Button>
            {preview && (
              <img
                src={preview}
                alt="Preview"
                style={{ marginTop: '1rem', maxHeight: 200 }}
              />
            )}
            <Box className="button-container" sx={{ display: 'flex', justifyContent: 'space-between', marginTop: 2 }}>
              <Button size="small" variant="outlined" color="secondary" onClick={() => {
                setNewTitle("");
                setNewImage("");
                setNewDescription("");
                setPrice("");
              }}>
                Clear
              </Button>
              <Button onClick={addTask} variant="contained" color="primary">
                Add Product
              </Button>
              <Button size="small">
                <Link to='/'>
                  View Products
                </Link>
              </Button>
            </Box>
          </Box>
        </Box>
      </Box>
    </Paper>
  );
}
