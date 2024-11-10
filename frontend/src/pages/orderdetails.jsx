import React from "react"
import { useState, useEffect } from "react"
import api from "../api"
function OrderDetails(){   
    const [orders,SetOrders]= useState([]);


    useEffect(()=>{
        getOrders
    },[])
    const getOrders = () =>{
        api
            .get()
    }
    return(<div>Order Details</div>)
}

export default OrderDetails