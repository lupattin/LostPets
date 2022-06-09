import {v2 as cloudinary} from "cloudinary"

cloudinary.config({ 
    cloud_name: 'dbaovcgwz', 
    api_key: process.env.CLAUDINARY_KEY, 
    api_secret: process.env.CLAUDINARY_SECRET 
  });

  export {cloudinary}