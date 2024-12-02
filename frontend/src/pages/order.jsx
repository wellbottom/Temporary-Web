import { useEffect, useState } from "react";
import api from "../api";
import { Button, Typography } from "@mui/material";
import { Navigate, useNavigate } from "react-router-dom";

const OrderDetailsReact = ({order}) =>{
    const [isOpen, setIsOpen] = useState(false);
    const[orderdetails,Setorderdetails] = useState([]);
    const[total,SetTotal] = useState(0);

    const order_date = new Date(order.order_date).toLocaleDateString("vi-VN")

    const showDetail = (orderId) => {
        api
            .get(`/api/orderdetails/?orderid=${orderId}`)
            .then((res) => {
                Setorderdetails(res.data);
                console.log(res.data)
                const calculatedTotal = res.data.reduce((acc, item) => acc + item.price, 0);
                SetTotal(calculatedTotal);
            })
            .catch((err) => alert(err));
    
        setIsOpen(!isOpen);
    };
    

    const hideDetail = () =>{
        SetTotal(0)
        setIsOpen(!isOpen);
    }

    return(
        <div key={order.id} style={{ margin: '20px 0', padding: '20px', border: '1px solid #ccc', borderRadius: '8px', backgroundColor: '#f9f9f9' }}>
  <h3 style={{ marginBottom: '10px' }}>Order ID: {order.id}</h3>
  <Typography variant="body1" style={{ marginBottom: '10px' }}>Order Date: {order_date}</Typography>
  {isOpen ? (
    <Button variant="outlined" onClick={hideDetail} style={{ marginBottom: '10px' }}>
      Hide Detail
    </Button>
  ) : (
    <Button variant="outlined" onClick={() => showDetail(order.id)} style={{ marginBottom: '10px' }}>
      Show Detail
    </Button>
  )}

  {isOpen && (
    <div style={{ padding: '10px', backgroundColor: '#fff', border: '1px solid #ddd', borderRadius: '6px' }}>
      {orderdetails.map((detail) => (
        <div key={detail.id} style={{ marginBottom: '10px' }}>
          <Typography variant="body2">
            <strong>Product ID:</strong> {detail.product} <strong>Quantity:</strong> {detail.quantity}{' '}
            <strong>Price:</strong> {detail.price}
          </Typography>
        </div>
      ))}
      <Typography variant="body2" style={{ marginTop: '10px' }}>
        <strong>Payment Method:</strong>{' '}
        {order.paymentmethod === 1
          ? 'Credit Card'
          : order.paymentmethod === 2
          ? 'Cash'
          : 'Debit Card'}
      </Typography>
      <Typography variant="h6" style={{ marginTop: '10px' }}>
        Total: {total}
      </Typography>
    </div>
  )}
</div>

    )
}



function Order() {
    const [orders, SetOrders] = useState([]);

    const navigate = useNavigate();
    useEffect(() => {
        getOrder();
    }, []);

    const getOrder = () => {
        api
            .get("/api/order/")
            .then((res) => res.data)
            .then((data) => {
                SetOrders(data);
            })
            .catch((err) => alert(err));
    };

    return (
        <div>
            {orders.length > 0 ? (
                orders.map((order) => (
                    <div key={order.id}>
                    <OrderDetailsReact order={order} key={order.id} />
                    <br/>
                    </div>
                ))
            ) : (
                <p>No orders available.</p>
            )}
        </div>
    );
}

export default Order;
