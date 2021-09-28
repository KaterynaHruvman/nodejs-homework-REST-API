require("dotenv").config();
const createFolderIsNotExist = require("../src/helpers/create-folder");
const UPLOAD_DIR = process.env.UPLOAD_DIR;
const AVATAR_OF_USERS = process.env.AVATAR_OF_USERS;

const app = require("../app");
const { connectMongo } = require("../src/db/conections");

const PORT = process.env.PORT || 3000;

const starts = async () => {
  try {
    await connectMongo();
    await createFolderIsNotExist(UPLOAD_DIR);
    await createFolderIsNotExist(AVATAR_OF_USERS);
    app.listen(PORT, () => {
      console.log(`Server running. Use our API on port: ${PORT}`);
    });
  } catch (error) {
    console.log(`Error on server start ${error.message}`);
  }
};
starts();
