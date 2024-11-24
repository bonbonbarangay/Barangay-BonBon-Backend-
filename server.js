import express from "express";
import cors from "cors";
import "dotenv/config";
import AnnouncementRoutes from "./routes/Announcement-route.js";
import authenticationRoutes from "./routes/Authentication-route.js";
import officialsRoutes from "./routes/Official-route.js";
import eventRoute from "./routes/Event-route.js";
const app = express();
app.use(cors());
app.use(express.json());

const PORT = 4000;
app.use("/announcement", AnnouncementRoutes);
app.use("/authentication", authenticationRoutes);
app.use("/official", officialsRoutes);
app.use("/event", eventRoute);

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}`);
});
