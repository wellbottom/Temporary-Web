import { useState, useEffect } from "react";
import api from "../api";
import Note from "../components/Notes"
import { jwtDecode } from "jwt-decode";
import { ACCESS_TOKEN } from "../constant"
import { Box, TextField, Button, Select, FormControl,MenuItem} from "@mui/material"
import { useNavigate } from "react-router-dom"


function Home() {
    const [notes, setNotes] = useState([]);


    const token = localStorage.getItem(ACCESS_TOKEN);
    const decodedToken = jwtDecode(token);
    const userId = decodedToken.user_id;

    if (!token) {
        alert("No token found. Please log in.");
        return;
    }

    let cart = new Map(JSON.parse(localStorage.getItem(`cart_${userId}`)))
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
                console.log(data);
            })
            .catch((err) => alert(err));
    };
    


    

    const push_cart = () => {
        navigate('/cart')
    }
    const add_cart = (item) => {
        if(!cart.has(item)){
            cart.set(item,1);
        }else{
            cart.set(item,parseInt(cart.get(item))+1)
        }
        localStorage.setItem(`cart_${userId}`,JSON.stringify(Array.from(cart)));
        console.log(localStorage.getItem(`cart_${userId}`))
    }
    

    
    return (

        <div>
            <div>
                <h2>Notes</h2>
                <Button onClick={push_cart}>Cart</Button>

                <Button onClick={()=>navigate('/inventory')}>My products</Button>

                {notes.map((note) => (
                    <div>
                        <Note note={note} key={note.id}/>

                        <Button variant="outlined" onClick={() => add_cart(note.id)}> Add</Button>
                    </div>

                ))}
            </div>
            
        </div>
    );
}

export default Home;