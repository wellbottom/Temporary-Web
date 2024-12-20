import { useEffect, useState } from "react";
import api from "../api";
import Note from "../components/Notes";
import { Button, MenuItem, Select, TextField, Typography,Grid2 } from "@mui/material";
import { jwtDecode } from "jwt-decode";
import { ACCESS_TOKEN } from "../constant";
import { useNavigate } from "react-router-dom";
import { fontGrid } from "@mui/material/styles/cssUtils";
function Cart() {
  const [notes, setNotes] = useState([]);

  const [num, SetNum] = useState();

  const [orderId, SetOrderId] = useState();

  const [price, SetPrice] = useState([]);

  const [payment, SetPayment] = useState();

  const [categories, SetCategories] = useState([]);

  const token = localStorage.getItem(ACCESS_TOKEN);
  const decodedToken = jwtDecode(token);
  const userId = decodedToken.user_id;

  let cart = new Map(JSON.parse(localStorage.getItem(`cart_${userId}`))) || [];

  const navigate = useNavigate();

  const distinguish_item = Array.from(cart.keys());

  useEffect(() => {
    getNotes();
  }, []);

  const getNotes = () => {
    const query_string = distinguish_item.map((id) => `ids=${id}`).join("&");
    api
      .get(`/api/notes/?${query_string}`)
      .then((res) => res.data)
      .then((data) => {
        setNotes(data);
        const childMap = {};
        data.forEach((child) => {
          childMap[child.id] = child.price;
        });
        const fetchprice = distinguish_item.map((id) => childMap[id]);
        SetPrice(fetchprice);
        console.log(price[0]);
      })
      .catch((err) => alert(err));

    api
      .get("/api/category/")
      .then((res) => res.data)
      .then((data) => {
        SetCategories(data);
        console.log(data);
      })
      .catch((err) => alert(err));
  };

  const order = () => {
    api
      .post("/api/order/", {
        products: distinguish_item,
        user: userId,
        paymentmethod: payment,
      })
      .then((res) => {
        if (res.status === 201) {
          SetOrderId(res.data.id);
          alert("Order created");

          for (let i = 0; i < distinguish_item.length; i++) {
            const payload = {
              orderId: res.data.id,
              product: distinguish_item[i],
              quantity: cart.get(distinguish_item[i]),
              price: price[i],
            };
            api
              .post("/api/orderdetails/", {
                orderId: res.data.id,
                product: distinguish_item[i],
                quantity: cart.get(distinguish_item[i]),
                price: price[i] * cart.get(distinguish_item[i]),
              })
              .then((res) => {
                if (res.status === 201) {
                } else alert(res.status);
              })
              .catch((err) => alert(err));
          }
        } else alert(res.status);
      })
      .catch((err) => alert(err));
    localStorage.removeItem(`cart_${userId}`);
  };

  if (distinguish_item.length === 0) {
    return (
      <div>
        <h2>You haven't chosen any item</h2>{" "}
        <Button onClick={() => navigate("/order")}>See my order</Button>
      </div>
    );
  } else {
    return (
      <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto', backgroundColor: '#f9f9f9', borderRadius: '8px', boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)' }}>
  <Grid2
    container
    spacing={2}
    sx={{ flexGrow: 1 }}
    className="product-display"
    style={{ marginBottom: '20px' }}
  >
    {notes.map((note) => (
      <div
        key={note.id}
        style={{
          padding: '10px',
          border: '1px solid #ddd',
          borderRadius: '8px',
          backgroundColor: '#fff',
          marginBottom: '15px',
        }}
      >
        <Note note={note} categories={categories} />
        <Typography className="note-count" style={{ marginTop: '10px', fontSize: '14px', color: '#555' }}>
          Count: {cart.get(note.id)}
        </Typography>

        <h3 style={{ margin: '10px 0 5px' }}>Quantity:</h3>
        <TextField
          size="small"
          variant="standard"
          onChange={(e) => {
            SetNum(e.target.value);
          }}
          style={{ width: '60%', marginBottom: '10px' }}
        />
        <Button
          variant="contained"
          color="primary"
          onClick={() => {
            cart.set(note.id, num);
            localStorage.setItem(
              `cart_${userId}`,
              JSON.stringify(Array.from(cart))
            );
          }}
          style={{ marginLeft: '10px' }}
        >
          Ok
        </Button>
      </div>
    ))}
  </Grid2>
  <Typography
    style={{
      fontSize: '16px',
      fontWeight: 'bold',
      margin: '20px 0 10px',
      color: '#333',
    }}
  >
    Select payment method:
  </Typography>
  <Select
    onChange={(e) => SetPayment(e.target.value)}
    style={{ width: '100%', marginBottom: '20px' }}
  >
    <MenuItem value={1}>CREDIT CARD</MenuItem>
    <MenuItem value={2}>CASH</MenuItem>
    <MenuItem value={3}>DEBIT CARD</MenuItem>
  </Select>
  <Button onClick={order} variant="contained" color="secondary" style={{ width: '100%', padding: '10px', fontSize: '16px' }}>
    Order
  </Button>
</div>

    );
  }
}

export default Cart;
