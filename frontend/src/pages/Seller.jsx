import { Box, Button, CardActions, Typography, CardContent, Card } from '@mui/material';

export default function MediaCard() {
    // const products = [
  //   { name: "sports car" },
  //   { name: "laptop" },
  //   { name: "phone" },
  //   { name: "sports car" },
  //   { name: "laptop" },
  //   { name: "phone" },
  //   { name: "sports car" }
  // ];

  // function handleClick() {

  //   products.map((product) => {
  //     product.price = 100;
  //   });
  //   console.log(products);
  // }

  return (
  //   <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', width: '100%', padding: 2 }}>
  //     <Typography variant="h4" component="div" sx={{ marginBottom: 2 }}>
  //       Add Product
  //     </Typography>
  //     <Box sx={{ maxWidth: 345, margin: 2, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
  //       {/* <Box sx={{ width: '100%', height: 140, backgroundColor: '#f0f0f0', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
  //         <Typography gutterBottom variant="h5" component="div">
  //           Add Product
  //         </Typography>
  //       </Box> */}
  //       <Box sx={{ width: '100%', padding: 2, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
  //         <Button variant="contained" color="primary" >
  //           Add Product
  //         </Button>
  //       </Box>
  //       <Box sx={{ width: '100%', padding: 2, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
  //         <Button size="small">View Products</Button>
  //         <Button size="small">Checkout</Button>
  //       </Box>
  //     </Box>
  //   </Box>
  // );
      <Box sx={{ width: '100%', padding: 2 }}>
      <Card sx={{ maxWidth: 345, margin: 2 }}>
        <CardContent>
          <Typography gutterBottom variant="h5" component="div">
            Add Product
          </Typography>
          <Button variant="contained" color="primary" >
            Add Product
          </Button>
        </CardContent>
        <CardActions>
          <Button size="small">View Products</Button>
          <Button size="small">Checkout</Button>
        </CardActions>
      </Card>
    </Box>
  );
}
