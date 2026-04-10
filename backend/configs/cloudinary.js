import { v2 as cloudinary } from "cloudinary"; // import 'cloudinary' library to upload files on cloudinary's cloud server
import fs from "fs"; // import 'fs' library to delete files from local storage

const uploadOnCloudinary = async (filePath) => { // create a function to upload files on cloudinary's cloud server
    // it takes 'filePath' ie path of the file to upload as an argument
    cloudinary.config({ // configure cloudinary to use our cloudinary account
        cloud_name: process.env.CLOUDINARY_CLOUD_NAME, // provide the name of the cloud to upload the file to using environment variable
        api_key: process.env.CLOUDINARY_API_KEY, // provide the api key of the cloud to actually upload the file using environment variable
        api_secret: process.env.CLOUDINARY_API_SECRET // provide the api secret of the cloud to upload the file securely by only authorised users using environment variable
    });

    try {
        if (!filePath) return null; // if path of the file to upload is not provided then return null

        // upload the file to cloudinary's cloud server, take the file from the provided path, and automatically detect the file type (PDF, WORD, etc.)
        const uploadResult = await cloudinary.uploader.upload(
            filePath,
            { resource_type: "auto" }
        );

        fs.unlinkSync(filePath); // delete the file from local storage after uploading it on cloudinary's cloud server

        return uploadResult.secure_url; // return the secure url of the uploaded file from cloudinary's cloud server
    } catch (error) { // if any error occurs while uploading the file to cloudinary
        fs.unlinkSync(filePath); // delete the file from local storage
        console.log(error); // log the error to the console to know what error occured
    }
};

export default uploadOnCloudinary; // export the function to be used in other files