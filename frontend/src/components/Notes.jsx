import React from "react";
import { Typography } from "@mui/material";

function Note({ note }) {
    const formattedDate = new Date(note.created_at).toLocaleDateString("vn-VN")
    const cate = note.category

    return (
        <div className="note-container">
            <Typography className="note-title">Id: {note.id}</Typography>
            
            <Typography className="note-title">Title: {note.title}</Typography>
            <Typography className="note-content">Content: {note.content}</Typography>
            <Typography className="note-date">Created at: {formattedDate}</Typography>
            <Typography className="note-price">Price: {note.price}</Typography>
            <Typography>Category:</Typography>
            {cate.map((category)=>(
                <div key={category.id}>
                    
                    <Typography>{category.cate_name}</Typography>
                </div>
            ))}
        </div>
    );
}

export default Note