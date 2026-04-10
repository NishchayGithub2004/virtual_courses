import multer from "multer"; // import 'multer' library to upload files to local folder

let storage = multer.diskStorage({ // create a storage object to upload files on local folder and provide it following configuration
    // file is stored in 'public' folder
    destination: (_req, _file, cb) => {
        cb(null, "./public");
    },
    // file is stored with same name as it is provided with by the user
    filename: (_, file, cb) => {
        cb(null, file.originalname);
    }
});

const upload = multer({ storage }); // create a multer object to upload files with above configuration

export default upload; // export the multer object to use it in other files
