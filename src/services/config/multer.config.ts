import multer from "multer";
import path from "path";

const _dirname = path.resolve();

const storage = multer.diskStorage({
  destination: (req, file, callback) => {
    let uploadFolder = "";
    if (req.body.name === "DNI" || req.body.name === "address" || req.body.name === "account_status") {
      uploadFolder = "documents";
    } else if (req.body.name === "profiles") {
      uploadFolder = "profiles";
    } else if (req.body.name === "products") {
      uploadFolder = "products";
    } else {
      return callback(new Error("Invalid field name"), "");
    }
    const destinationFolder = path.join(_dirname, "public", uploadFolder);
    callback(null, destinationFolder);
  },
  filename: (req, file, callback) => {
    callback(null, file.originalname);
  },
});

export const uploader = multer({ storage });
