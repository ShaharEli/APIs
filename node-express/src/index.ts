import app from "./app";
import { PORT } from "./utils";

app.listen(process.env.PORT || PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});
