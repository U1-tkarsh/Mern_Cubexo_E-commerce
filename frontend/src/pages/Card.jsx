import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import { Box } from '@mui/material';
import Grid from '@mui/material/Grid';

export default function MediaCard() {
  const products = [
    { name: "sports car" },
    { name: "laptop" },
    { name: "phone" },
    { name: "sports car" },
    { name: "laptop" },
    { name: "phone" },
    { name: "sports car" }
  ];

  return (
    <Box sx={{ width: '100%', padding: 2 }}>
      <Grid container spacing={{ xs: 2, md: 3 }} columns={{ xs: 4, sm: 8, md: 12 }}>
        {products.map((product, index) => (
          <Grid key={index} size={{ xs: 2, sm: 4, md: 4 }}>
            <Card sx={{ maxWidth: 345, margin: 2 }}>
              <CardMedia
                sx={{ height: 140 }}
                image="https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                title="green iguana"
              />

              <CardContent>
                <Typography gutterBottom variant="h5" component="div">
                  {product.name}
                </Typography>
                <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                  {product.name} is a great product.
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}
