import api from "../api";
import { ACCESS_TOKEN } from "../constant";
import {jwtDecode} from "jwt-decode";
import { useState, useEffect, useCallback } from "react";
import { Button, Typography } from "@mui/material";

import "../style/style.css"
function Confirm() {
  const [notes, setNotes] = useState([]);
  const [orderDetails, setOrderDetails] = useState([]);

  const token = localStorage.getItem(ACCESS_TOKEN);
  const decodedToken = jwtDecode(token);
  const userId = decodedToken.user_id;

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = useCallback(async () => {
    try {
      // Fetch notes
      const notesResponse = await api.get(`/api/notes/?user_id=${userId}`);
      const notesData = notesResponse.data;
      setNotes(notesData);

      // Extract note IDs
      const noteIds = notesData.map((note) => note.id);
      if (noteIds.length === 0) return;

      // Fetch order details using note IDs
      const query = noteIds.map((id) => `product-id=${id}`).join("&");
      const orderDetailsResponse = await api.get(`/api/orderdetails/?${query}`);
      setOrderDetails(orderDetailsResponse.data);
    } catch (err) {
      alert(err);
    }
  }, [userId]);

  const handleConfirm = async (detail) => {
    try {
      await api.put(`/api/confirm-order/${detail.id}/`, {
        orderId: detail.orderId,
        product: detail.product,
        quantity: detail.quantity,
        price: detail.price,
        confirm: true,
      });
      alert("Order confirmed successfully!");
      // Update UI
      setOrderDetails((prev) =>
        prev.map((item) =>
          item.id === detail.id ? { ...item, confirm: true } : item
        )
      );
    } catch (err) {
      alert("Error confirming order: " + err);
    }
  };

  return (
    <div className="container">
      <Typography variant="h4" gutterBottom>
        Confirm Order:
      </Typography>
      {orderDetails.length === 0 ? (
        <Typography variant="body1">No orders to confirm.</Typography>
      ) : (
        orderDetails.map((detail) => (
          <div key={detail.id} className="order-detail">
            <Typography variant="body2" className="detail-text">
              <strong>Product ID:</strong> {detail.product}{" "}
              <strong>Quantity:</strong> {detail.quantity}{" "}
              <strong>Price:</strong> {detail.price}{" "}
              <strong>Confirm:</strong>{" "}
              {detail.confirm ? "Confirmed" : "Not Confirmed"}
            </Typography>
            {!detail.confirm && (
              <Button
                variant="contained"
                color="primary"
                onClick={() => handleConfirm(detail)}
                className="confirm-button"
              >
                Confirm
              </Button>
            )}
          </div>
        ))
      )}
    </div>
  );
}

export default Confirm;
