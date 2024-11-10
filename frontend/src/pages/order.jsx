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
        <div key={order.id}>
             <h3>Order ID:{order.id}</h3>
             <Typography>order_date:{order_date}</Typography>
             {isOpen  ?  <Button variant="outlined" onClick={hideDetail}>Hide Detail</Button> : <Button variant="outlined" onClick={()=>{showDetail(order.id)}}>Show Detail</Button>}

            {isOpen && (
                <div>
                {orderdetails.map((detail) =>(
                    <div key={detail.id}>
                        <Typography>Product ID: {detail.product} Quantity: {detail.quantity} Price: {detail.price}</Typography>
                    </div>
                    
                ))}
                {order.paymentmethod === 1 && <Typography>Payment Method: Credit Card</Typography>}
                {order.paymentmethod === 2 && <Typography>Payment Method: Cash</Typography>}
                {order.paymentmethod === 3 && <Typography>Payment Method: Debit Card</Typography>}
                <Typography>Total: {total}</Typography>
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
