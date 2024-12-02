import React, { useEffect, useState } from "react";
import { ACCESS_TOKEN } from "../constant";
import { jwtDecode } from "jwt-decode";
import api from "../api";
import Note from "../components/Notes";
import {
  TextField,
  Button,
  Typography,
  Grid2,
  List,
  ListItem,
  IconButton,
  Select,
  MenuItem,
} from "@mui/material";
import ccImgae from "../style/cc.png"
import "../style/style.css";
function Inventory() {
  const [notes, setNotes] = useState([]);
  const [categories, SetCategories] = useState([]);
  const [category, setCategory] = useState([]);

  const [editingNote, setEditingNote] = useState(null);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [price, SetPrice] = useState();
  const [file, setFile] = useState(null);

  const[orderdetails,Setorderdetails] = useState([]);


  const token = localStorage.getItem(ACCESS_TOKEN);
  const decodedtoken = jwtDecode(token);
  const userId = decodedtoken.user_id;

  // Fetch notes by author ID
  useEffect(() => {
    getNotes();
  }, []);

  const getNotes = () => {
    api
      .get(`/api/notes/?user_id=${userId}`)
      .then((res) => {
        setNotes(res.data);
      })
      .catch((err) => alert(err));

    api
      .get("/api/category/")
      .then((res) => res.data)
      .then((data) => {
        SetCategories(data);
      })
      .catch((err) => alert(err));

      api
        .get(`/api/orderdetails/`)
        .then((res) => {
            Setorderdetails(res.data);
            console.log(res.data)
        })
        .catch((err) => alert(err));
  };
  
  const ordered_number = (id) =>{
    const products = orderdetails.filter(od => od.product === id)
    let num = 0
    products.forEach(product =>{
      num += product.quantity
    })
    return num
  }

  // Function to handle edit mode
  const startEdit = (note) => {
    setEditingNote(note);
    setTitle(note.title);
    setContent(note.content);
    cate_list = [];
  };

  const deleteNote = (id) => {
    api
      .delete(`/api/notes/delete/${id}/`)
      .then((res) => {
        if (res.status === 204) {
          alert("Note deleted successfully!");
        } else {
          alert("Failed to delete note.");
        }
        getNotes();
      })
      .catch((error) => {
        alert("An error occurred: " + error.message);
      });
  };

  // Function to update a note
  const updateNote = async (noteId) => {
    const formData = new FormData();
    formData.append("product_name", title);
    formData.append("content", content);
    formData.append("price", price);
    formData.append("author", userId);
    if (file) formData.append("image", file);
    category.forEach((id) => formData.append("category", id));
  
    try {
      const response = await api.put(`/api/notes/update/${noteId}/`, formData);
  
      if (response.status === 200) {
        alert("Product updated successfully!");
        setEditingNote(null);
        getNotes();
      } else {
        alert("Failed to update product.");
      }
    } catch (error) {
      console.error(error);
      alert("An error occurred: " + error.message);
    }
  };
  

  const select_cate = (cate) => {
    const target = cate.target.value;

    setCategory((prevList) => {
      const index = prevList.findIndex((item) => item === target);

      if (index !== -1) {
        // If found, remove it from the list
        return prevList.filter((_, i) => i !== index);
      } else {
        // If not found, add it to the list
        return [...prevList, target];
      }
    });
  };
  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };
  return (
    <div>
      <a href="/">
          <img src={ccImgae} alt="image" className="front-img" />
        </a>
      <Typography variant="h4">My products</Typography>
      <div className="product-display">
        {notes.map((note) => (
          <div key={note.id}>
            <Note note={note} categories={categories}></Note>
            <Typography>Number Ordered: {ordered_number(note.id)}</Typography>
            <Button variant="outlined" onClick={() => startEdit(note)}>
              Edit
            </Button>
            <Button variant="outlined" onClick={() => deleteNote(note.id)}>
              Delete
            </Button>
          </div>
        ))}
        {editingNote && (
          <form onSubmit={(e) =>{
            e.preventDefault();
            updateNote(editingNote.id)
            }}>
            <br />
            <TextField
              type="text"
              id="title"
              name="title"
              required
              onChange={(e) => setTitle(e.target.value)}
              value={title}
              autoComplete="off"
              placeholder="Title"
            />

            <br />
            <TextField
              id="content"
              name="content"
              required
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={10}
              placeholder="Content"
              multiline
            ></TextField>
            <br />

            <Select value={""} onChange={select_cate}>
              {categories.map((cate) => (
                <MenuItem value={cate.id} label={cate.cate_name} key={cate.id}>
                  {cate.cate_name}
                </MenuItem>
              ))}
            </Select>
            <div>
              <h3>Selected Categories:</h3>
              <List>
                {category.map((cate) => (
                  <ListItem key={cate}>
                    {categories.find((s) => s.id === cate).cate_name}
                  </ListItem>
                ))}
              </List>
            </div>
            <div>
              <TextField
                placeholder="Price"
                required
                type="number"
                onChange={(e) => SetPrice(e.target.value)}
              ></TextField>
            </div>
            <br />
            <input type="file" onChange={handleFileChange} />
            <TextField type="submit" value="Submit"></TextField>
          </form>
        )}
      </div>
    </div>
  );
}

export default Inventory;
