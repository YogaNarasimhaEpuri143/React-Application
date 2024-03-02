const express = require("express");
const app = express();
const cors = require("cors");
const prismaInstance = require("./prisma/client");

app.use(express.json());
app.use(express.urlencoded({ extended: true })); // Fetch the query parameters and store in the req.body,

app.use(cors({ origin: "http://localhost:5173" })); // Allow requests from your client's origin

app.get("/users", async (req, res) => {
  const users = await prismaInstance.user.findMany();

  return res.status(200).send({ users: users });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => `Listening on PORT ${PORT}`);
