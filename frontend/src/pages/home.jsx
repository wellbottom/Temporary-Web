import { useState, useEffect } from "react";
import api from "../api";
import Note from "../components/Notes";
import { jwtDecode } from "jwt-decode";
import { ACCESS_TOKEN } from "../constant";
import {
  List,
  TextField,
  Button,
  Select,
  ListItem,
  MenuItem,
  Typography,
  Grid2,
} from "@mui/material";
import { useNavigate } from "react-router-dom";

import "../style/style.css";
import ccImgae from "../style/cc.png";

import Avatar from "@mui/material/Avatar";

function Home() {
  const[profile, setProfile] = useState([]);
  const [notes, setNotes] = useState([]);
  const [filters, setFilter] = useState();
  const [dnotes, setDnotes] = useState([]);
  const [categories, SetCategories] = useState([]);
  const [category, setCategory] = useState([]);

  const token = localStorage.getItem(ACCESS_TOKEN);
  const decodedToken = jwtDecode(token);
  const userId = decodedToken.user_id;

  const navigate = useNavigate();
  useEffect(() => {
    getNotes();
  }, []);

  const getNotes = () => {
    api
      .get("/api/notes/")
      .then((res) => res.data)
      .then((data) => {
        setNotes(data);
        setDnotes(data);
        console.log(data)
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
      .get(`/api/userprofile/?userId=${userId}`)
      .then((res) => res.data)
      .then((data) => {
        setProfile(data);
        console.log(data);
      })
      .catch((err) => alert(err));
  };

  const handleSearch = (e) => {
    setDnotes(
      notes.filter((note) => note.product_name.toLowerCase().includes(filters))
    );
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
  const handleEnter = (e) => {
    if (e.key == "Enter") {
      handleSearch();
    }
  };

  const push_cart = () => {
    navigate("/cart");
  };
  let cart = new Map(JSON.parse(localStorage.getItem(`cart_${userId}`)));

  const add_cart = (item) => {
    if (!cart.has(item)) {
      cart.set(item, 1);
    } else {
      cart.set(item, parseInt(cart.get(item)) + 1);
    }
    localStorage.setItem(`cart_${userId}`, JSON.stringify(Array.from(cart)));
    console.log(localStorage.getItem(`cart_${userId}`));
  };

  const handleCategoryFilte = () => {
    const matchingItems = notes.filter((item) =>
      item.category.some((value) => category.includes(value))
    );

    setDnotes(matchingItems);
  };

  return (
    <div className="page">
      <div className="header-container">
        <a href="/">
          <img src={ccImgae} alt="image" className="front-img" />
        </a>
        <div>
          <TextField
            placeholder="Search Item"
            onChange={(e) => setFilter(e.target.value.toLowerCase())}
            onKeyDown={handleEnter}
            className="searchbar"
          ></TextField>
          <button variant="contained" onClick={handleSearch} className="button">
            Search
          </button>
        </div>
        <div>
          <button className="button" onClick={push_cart}>
            Cart
          </button>

          <button className="button" onClick={() => navigate("/inventory")}>
            My Product
          </button>

          <button className="button" onClick={() => navigate("/create")}>Create</button>
        </div>

        <Avatar alt={profile.mail} src={profile.profile_picture} onClick={()=>navigate("/profile")}></Avatar>
      </div>
      <div className="category-search">
        <Typography>Search by Category:</Typography>
        <Select value={""} onChange={select_cate} placeholder="Select category">
          <em>Select category</em>
          {categories.map((cate) => (
            <MenuItem value={cate.id} label={cate.cate_name} key={cate.id}>
              {cate.cate_name}
            </MenuItem>
          ))}
        </Select>
        <List className="list">
          {category.map((cate) => (
            <ListItem key={cate} className="product-category">
              {categories.find((s) => s.id === cate).cate_name}
            </ListItem>
          ))}
        </List>
        <button
          variant="contained"
          onClick={handleCategoryFilte}
          className="button"
        >
          Search
        </button>
      </div>

      
      <Grid2 sx={{ flexGrow: 1 }} className="product-display">
        {dnotes.length > 0 ? (
          dnotes.map((note) => (
            <div>
              <Note note={note} categories={categories} key={note.id} />

              <Button
                className="button"
                variant="outlined"
                onClick={() => add_cart(note.id)}
              >
                {" "}
                Add
              </Button>
            </div>
          ))
        ) : (
          <Typography>There is no products</Typography>
        )}
      </Grid2>
    </div>
  );
}

export default Home;
