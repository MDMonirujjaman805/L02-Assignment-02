import { pool } from "../../config/db.js";

// const createUser = async (payload: Record<string, unknown>) => {
//   const { name, email, password } = payload;

//   //   const hashPassword = await bcrypt.hash(password as string, 12);

//   const result = await pool.query(
//     `INSERT INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING *`,
//     [name, email, password]
//   );

//   return result;
// };

const getUsers = async () => {
  const result = await pool.query(`SELECT * FROM users`);
  return result;
};

const updatedUser = async ()=>{}
const deletedUser = async ()=>{}

export const userServices = {  getUsers,updatedUser,deletedUser };
