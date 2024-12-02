import React from "react";
import { Button, Typography, List, ListItem } from "@mui/material";
import "../style/style.css";

function truncateText(text, maxLength) {
  if (text.length > maxLength) {
    return text.slice(0, maxLength) + "...";
  }
  return text;
}
function Note({ note, categories }) {
  const formattedDate = new Date(note.created_at).toLocaleDateString("vn-VN");
  const cate = note.category;
  const description = JSON.stringify(note.content)
  const name = JSON.stringify(note.product_name)
  return (
    <div className="note-container">
      <Typography className="note-id">Id: {note.id}</Typography>
      <Typography>Product name:</Typography>
      <div>{truncateText(name,20)}</div>
      <Typography>Description</Typography>
      <div>{truncateText(description,20)}</div>
      <Typography className="note-date">Created at: {formattedDate}</Typography>
      <Typography className="note-price">Price: {note.price}</Typography>

      <Typography>Category:</Typography>
      <List className="list">
        {cate.map((cate) => (
          <ListItem key={cate}>
            {categories.find((s) => s.id === cate).cate_name}
          </ListItem>
        ))}
      </List>
      <img
        src={note.image} 
        alt={note.product_name}
        style={{ width: "200px", height: "200px" }}
        className="product-img"
      ></img>

    </div>
  );
}

export default Note;
