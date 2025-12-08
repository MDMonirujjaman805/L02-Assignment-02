import bcrypt from "bcryptjs";
import { pool } from "../../config/db.js";
import config from "../../config/index.js";
import jwt from "jsonwebtoken";

const signup = async (payload: Record<string, unknown>) => {
  const { name, email, password, phone, role } = payload;
  const hashedPassword = await bcrypt.hash(password as string, 10);
  const result = await pool.query(
    `INSERT INTO users (name, email, password, phone, role) VALUES ($1, $2, $3, $4, $5) RETURNING *`,
    [name, email, hashedPassword, phone, role]
  );
  return result;
};

const signin = async (payload: { email: string; password: string }) => {
  const { email, password } = payload;
  if (!email || !password) {
    throw new Error("Email and password are required");
  }
  const userQuery = `
    SELECT id, name, email, phone, role, password 
    FROM users 
    WHERE email = $1
  `;
  const result = await pool.query(userQuery, [email]);
  if (result.rows.length === 0) {
    throw new Error("User not found");
  }
  const user = result.rows[0];
  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    throw new Error("Invalid password");
  }
  const token = jwt.sign(
    {
      id: user.id,
      name:user.name,
      role: user.role,
      email: user.email,
    },
    config.jwt_secret!,
    { expiresIn: "7d" }
  );
  const safeUser = {
    id: user.id,
    name: user.name,
    email: user.email,
    phone: user.phone,
    role: user.role,
  };
  return { token, user: safeUser };
};

export const authService = { signup, signin };
