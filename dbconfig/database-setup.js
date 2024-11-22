import pkg from "pg";
const { Pool } = pkg;

const pool = new Pool({
  user: "postgres.ctrswfhteqalhatrrese",
  host: "aws-0-ap-southeast-1.pooler.supabase.com",
  database: "postgres",
  password: "barangaysystem2024",
  port: 6543,
  ssl: {
    rejectUnauthorized: false, // Required for Supabase
  },
});

export default pool;
