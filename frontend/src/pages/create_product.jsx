import React from "react";
import { useState, useEffect } from "react";
import { Select, MenuItem, TextField, List, ListItem, Button} from "@mui/material";
import api from "../api";
import { ACCESS_TOKEN } from "../constant";
import { jwtDecode } from "jwt-decode";
function Create() {
  const [content, setContent] = useState("");
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState([]);
  const [categories, SetCategories] = useState([]);
  const [price, SetPrice] = useState();
  const [file, setFile] = useState(null);

  const token = localStorage.getItem(ACCESS_TOKEN);
  const decodedToken = jwtDecode(token);
  const userId = decodedToken.user_id;

  useEffect(() => {
    getCategory();
  }, []);



  const getCategory = () => {
    api
      .get("/api/category/")
      .then((res) => res.data)
      .then((data) => {
        SetCategories(data);
        console.log(data);
      })
      .catch((err) => alert(err));

    console.log(userId);
  };
  const createNote = async (e) => {
    e.preventDefault();

    // Create FormData to handle file upload
    const formData = new FormData();
    formData.append("product_name", title);
    formData.append("content", content);
    formData.append("price", price);
    formData.append("author", userId);
    formData.append("image", file); // Image is uploaded as a file
    category.forEach((id) => formData.append("category", id));

    try {
      // const response = await api.post("/api/notes/", {product_name:title,content:content,price:price,author:userId,image:file,category:category});

      const response = await api.post("/api/notes/", formData);

      if (response.status === 201) {
        alert("Product created successfully!");
        setTitle("");
        setContent("");
        setCategory([]);
        setFile(null);
        SetPrice(0);
      } else {
        alert("Failed to create product.");
      }
    } catch (error) {
      console.log(error.response.data);
      alert("An error occurred: " + error.response?.data || error.message);
    }
  };

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
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

  return (
    <div
      style={{
        maxWidth: "600px",
        margin: "0 auto",
        padding: "20px",
        backgroundColor: "#f9f9f9",
        borderRadius: "8px",
        boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
      }}
    >
      <h2 style={{ textAlign: "center", marginBottom: "20px", color: "#333" }}>
        Create a Product
      </h2>

      <form
        onSubmit={createNote}
        style={{ display: "flex", flexDirection: "column", gap: "20px" }}
      >
        <TextField
          type="text"
          id="title"
          name="title"
          required
          onChange={(e) => setTitle(e.target.value)}
          value={title}
          autoComplete="off"
          placeholder="Title"
          variant="outlined"
          fullWidth
        />

        <TextField
          id="content"
          name="content"
          required
          value={content}
          onChange={(e) => setContent(e.target.value)}
          rows={6}
          placeholder="Content"
          multiline
          variant="outlined"
          fullWidth
        />

        <Select
          value=""
          onChange={select_cate}
          variant="outlined"
          displayEmpty
          style={{ width: "100%" }}
        >
          <MenuItem value="" disabled>
            Select a category
          </MenuItem>
          {categories.map((cate) => (
            <MenuItem value={cate.id} key={cate.id}>
              {cate.cate_name}
            </MenuItem>
          ))}
        </Select>

        <div>
          <h3 style={{ marginBottom: "10px", color: "#555" }}>
            Selected Categories:
          </h3>
          <List
            dense
            style={{
              backgroundColor: "#fff",
              padding: "10px",
              borderRadius: "6px",
              border: "1px solid #ddd",
            }}
          >
            {category.map((cate) => (
              <ListItem key={cate} style={{ fontSize: "14px" }}>
                {categories.find((s) => s.id === cate)?.cate_name}
              </ListItem>
            ))}
          </List>
        </div>

        <TextField
          placeholder="Price"
          required
          type="number"
          onChange={(e) => SetPrice(e.target.value)}
          variant="outlined"
          fullWidth
        />

        <input
          type="file"
          onChange={handleFileChange}
          style={{ marginTop: "10px", marginBottom: "20px" }}
        />

        <Button
          type="submit"
          variant="contained"
          color="primary"
          style={{ padding: "10px", fontSize: "16px" }}
        >
          Submit
        </Button>
      </form>
    </div>
  );
}

export default Create;
