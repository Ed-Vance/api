import dotenv from "dotenv";
import app from "./app";
import { drizzle } from "drizzle-orm/node-postgres";
import { migrate } from "drizzle-orm/node-postgres/migrator";
dotenv.config();

const db = drizzle(process.env.DATABASE_URL!);
const PORT = process.env.PORT || 3000;

//brings db up to speed, then runs app;
migrate(db, { migrationsFolder: "./drizzle" }).then(() => {
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
});
