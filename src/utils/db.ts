import level from "level";
import path from "path";

const dbPath = path.resolve(__dirname, "../../db")
const db = level(dbPath);

export default db;
