function productForm(categories) {
  const [content, setContent] = useState("");
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState([]);
  
  const [price, SetPrice] = useState();
  const [file, setFile] = useState(null);
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
    <div>
      <h2>Create a product</h2>

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
    </div>
  );
}

export default productForm;
