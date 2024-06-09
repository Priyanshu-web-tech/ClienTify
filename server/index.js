import connectDB from "./src/db/index.js";
import { app } from "./src/app.js";
import { port } from "./src/constants.js";

connectDB()
  .then(() => {
    app.on("error", (error) => {
      console.log("Errr: ", error);
      throw error;
    });

    app.listen(port, () => {
      console.log(`Server is running at port ${port}`);
    });
  })
  .catch((err) => {
    console.log("Mongo db connection failed !!!", err);
  });
