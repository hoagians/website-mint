import { PrismaClient } from "@prisma/client";
import { PrismaLibSQL } from "@prisma/adapter-libsql";
import { createClient } from "@libsql/client";

const libsql = createClient({
  url: String(process.env.TURSO_DATABASE_URL),
  authToken: String(process.env.TURSO_AUTH_TOKEN),
});

const adapter = new PrismaLibSQL(libsql);
const prisma = new PrismaClient({ adapter });

export default prisma;
