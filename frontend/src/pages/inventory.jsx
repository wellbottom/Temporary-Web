import React, { useEffect, useState } from 'react';
import { ACCESS_TOKEN } from '../constant';
import { jwtDecode } from 'jwt-decode';
import api from '../api';
import Note from "../components/Notes"
import { TextField, Button, Typography, Grid2, List, ListItem, IconButton, Select, MenuItem } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
function Inventory() {
    const [notes, setNotes] = useState([]);
    const [categories, SetCategories] = useState([]);

    const [editingNote, setEditingNote] = useState(null);
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');

    let cate_list = []


    const token = localStorage.getItem(ACCESS_TOKEN)
    const decodedtoken = jwtDecode(token)
    const userId = decodedtoken.user_id


 
    // Fetch notes by author ID
    useEffect(() => {
        getNotes();

    }, []);

    const getNotes = () => {


        api.get(`/api/notes/?user_id=${userId}`)
            .then((res) => {
                setNotes(res.data)
            })
            .catch((err) => alert(err));

        api.get("/api/category/")
            .then((res) => res.data)
            .then((data) => {
                SetCategories(data);
                console.log(data)
            })
            .catch((err) => alert(err));
    }

    // Function to handle edit mode
    const startEdit = (note) => {
        setEditingNote(note);
        setTitle(note.title);
        setContent(note.content);
        cate_list=[]
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
    const updateNote = (noteId) => {
        const updateDate = new Date().toLocaleDateString("vi-VN")
        api
            .put(`/api/notes/update/${noteId}/`, { content:content, title:title, category:cate_list, created_at:updateDate })
            .then(() => {
                setNotes(notes.map(note => note.id === noteId ? { ...note, title: title, content: content } : note));
                setEditingNote(null);
                setTitle('');
                setContent('');
                alert("Update completed")
                getNotes();
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


        console.log(cate_list);
    }
    
    return (
        <div>
            <Typography variant="h4">My products</Typography>
            {notes.map((note) => (
                <div key={note.id}>
                    <Note note={note}></Note>
                    <Button variant="outlined" onClick={() => startEdit(note)}>Edit</Button>
                    <Button variant="outlined" onClick={() => deleteNote(note.id)}>Delete</Button>

                </div>
            ))}
            {editingNote && (
                <div style={{ marginTop: '20px' }}>
                    <TextField
                        label="Title"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        fullWidth
                        margin="normal"
                    />
                    <TextField
                        label="Content"
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        fullWidth
                        multiline
                        rows={4}
                        margin="normal"
                    />
                    <Select
                        value={cate_list}
                        onChange={select_cate}
                    >
                        {categories.map((cate) => (
                            <MenuItem value={cate} key={cate.id}>
                                {cate.cate_name}
                            </MenuItem>
                        ))}
                    </Select>


                    <Button
                        variant="contained"
                        onClick={() => updateNote(editingNote.id)}
                        color="primary"
                    >
                        Save
                    </Button>
                </div>
            )}
        </div>
    );
}

export default Inventory;
