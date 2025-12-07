import { pool } from "../../config/db.js";

const createVehicle = async (payload: Record<string, unknown>) => {
  const { name, email, password } = payload;

  //   const hashPassword = await bcrypt.hash(password as string, 12);

  const result = await pool.query(
    `INSERT INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING *`,
    [name, email, password]
  );

  return result;
};

const getVehicles = async () => {
  const result = await pool.query(`SELECT * FROM users`);
  return result;
};
export const vehicleService = { createVehicle,getVehicles };
