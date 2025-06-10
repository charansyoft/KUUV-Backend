import dotenv from "dotenv";
import mongoose from "mongoose";
dotenv.config();

export function connect() {
  const connectdb = () =>
    mongoose
      .connect(`${process.env.MONGODB_CONNECTION_URL}`)
      .then(() => {
        console.log("connected ...");
      })
      .catch((error) => {
        console.log({ error });
      });

  connectdb();

  // mongoose.connection.on("disconnected", connectdb);
}
