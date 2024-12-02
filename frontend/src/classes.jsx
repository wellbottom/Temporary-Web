import React from "react"


class User{
    constructor(username,password){
        this.username = username
        this.password = password
    

        if(this.constructor === User){
            throw new Error("Can't initiate abstract class")
        }
    }
}

class UserProfile extends User{
    constructor(username,password,name,mail,address,profilePicture = null){
        super(username,password)
        this.name = name,
        this.mail = mail,
        this.address = address,
        this.profilePicture = profilePicture 
    }

    async editProfile(id){
        const [formData, setFormData] = useState({
            user: id,
            mail: "",
            address: "",
            profile_picture: null,
        });
        
        const formDataToSend = new FormData();
        for (const key in formData) {
            formDataToSend.append(key, formData[key]);
        }

        try {
            const response = await api.post("/api/userprofile/", formDataToSend);
      
            if (response.status === 201) {
              alert("Profile updated successfully!");
            } else {
              alert("Failed to update profile.");
            }
          } catch (error) {
            
            console.log(error.response.data);
            alert("An error occurred: " + error.response?.data || error.message);
          } finally {
            setLoading(false);
          }
    }
}