import React from "react";
import { useState, useEffect } from "react";
import { Select, MenuItem, TextField, List, ListItem } from "@mui/material";
import api from "../api";
function Create() {

    const [content, setContent] = useState("");
    const [title, setTitle] = useState("");
    const [category, setCategory] = useState([]);
    const [categories, SetCategories] = useState([]);
    const [price,SetPrice] = useState();

    useEffect(() => {
        getCategory();
    }, [])

    let cate_list = []

    const getCategory = () => {
        api.get("/api/category/")
            .then((res) => res.data)
            .then((data) => {
                SetCategories(data);
                console.log(data)
            })
            .catch((err) => alert(err));
    }
    const createNote = (e) => {
        e.preventDefault();
        api
            .post("/api/notes/", { content: content, title: title, category: category, price:price })
            .then((res) => {
                if (res.status === 201) {
                    alert("Note created!");
                    setTitle('');
                    setContent('');
                    setCategory([])
                }
                else alert("Failed to make note.");
            })
            .catch((err) => alert(err));
    };

    const select_cate = (cate) => {
        const target = cate.target.value;

        const index = cate_list.findIndex(item =>
            Object.keys(target).every(key => item[key] === target[key])
        );

        if (index !== -1) {
            // If found, remove it from the list
            cate_list.splice(index, 1);
        } else {
            // If not found, add it to the list
            cate_list.push(target);
        }

        setCategory((prevList) => {
            const index = prevList.findIndex(item =>
                Object.keys(target).every(key => item[key] === target[key])
            );

            if (index !== -1) {
                // If found, remove it from the list
                return prevList.filter((_, i) => i !== index);
            } else {
                // If not found, add it to the list
                return [...prevList, target];
            }
        })
        console.log(category)

    }

    return (<div>
        <h2>Create a Note</h2>

        <form onSubmit={createNote}>

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

            <Select value={''} onChange={select_cate}>
                {categories.map((cate) => (
                    <MenuItem value={cate} label={cate.cate_name} key={cate.id}>{cate.cate_name}</MenuItem>
                ))}
            </Select>
            <div>
                <h3>Selected Categories:</h3>
                <List>
                    {category.map((cate, index) => (
                        <ListItem key={index}>{cate.cate_name}</ListItem>
                    ))}
                </List>
            </div>
            <div>
                <TextField placeholder="Price" required type="number" onChange={(e)=>SetPrice(e.target.value)} ></TextField>
            </div>
            <br />
            <TextField type="submit" value="Submit"></TextField>
        </form>
    </div>)
}

export default Create