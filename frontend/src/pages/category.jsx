import { useEffect, useState } from "react";
import api from "../api";
import {Box,Button,TextField} from "@mui/material"

function Category(){

    const [category,Setcategory] = useState([]);
    const [categoryname,SetCategoryName] = useState("");
    const [categorydescription,SetCategoryDescription] = useState("");

    useEffect(()=>{
        getCategory();
},[]);

    const getCategory = () => {
        api
            .get("/api/category/")
            .then((res) => res.data)
            .then((data) => {
                Setcategory(data);
            })
            .catch((err) => alert(err));
    };


    const handleSubmit = (e) => {
        e.preventDefault();
        api
            .post("/api/category/", { cate_name:categoryname,cate_description:categorydescription })
            .then((res) => {
                if (res.status === 201) alert("Category created!");
                else alert("Failed to make category.");
            })
            .catch((err) => alert(err));
    };
    return(
        <div>
            <Box component= "form"
            sx={{ '& .MuiTextField-root': { m: 1, width: '25ch' } }}
            noValidate
            autoComplete="off"
            alignSelf={'center'}
            onSubmit={handleSubmit}>

                <TextField value={categoryname} onChange={(e)=>SetCategoryName(e.target.value)}/>

                <TextField value={categorydescription} onChange={(e)=>SetCategoryDescription(e.target.value)}/>
                
                <Button type="submit" value="submit">Create</Button>
            </Box>
        </div>
    );
}

export default Category