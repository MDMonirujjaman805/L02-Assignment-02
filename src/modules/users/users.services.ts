import { pool } from "../../config/db.js";

const ALLOWED_UPDATES = ["name", "email", "phone", "role"];
const getAllUsers = async () => {
  const result = await pool.query(
    "SELECT id, name, email, phone, role FROM users ORDER BY id ASC"
  );
  return result.rows;
};

const getUserById = async (userId: number) => {
  const result = await pool.query(
    "SELECT id, name, email, phone, role FROM users WHERE id = $1",
    [userId]
  );
  return result.rows[0];
};

const updateUser = async (userId: number, payload: Record<string, any>) => {
  const keys = Object.keys(payload).filter((key) =>
    ALLOWED_UPDATES.includes(key)
  );
  if (keys.length === 0) {
    return getUserById(userId);
  }

  const setClauses = keys.map((key, index) => `${key} = $${index + 1}`);
  const values = keys.map((key) => payload[key]);
  values.push(userId);

  const query = `
    UPDATE users
    SET ${setClauses.join(", ")}
    WHERE id = $${keys.length + 1}
    RETURNING id, name, email, phone, role
  `;

  const result = await pool.query(query, values);
  return result.rows[0];
};

const userHasActiveBookings = async (userId: number) => {
  const result = await pool.query(
    "SELECT 1 FROM bookings WHERE customer_id=$1 AND status='active' LIMIT 1",
    [userId]
  );
  return result.rows.length > 0;
};

const deleteUser = async (userId: number) => {
  if (await userHasActiveBookings(userId)) {
    throw new Error("User has active bookings and cannot be deleted");
  }
  const result = await pool.query(
    "DELETE FROM users WHERE id=$1 RETURNING id",
    [userId]
  );
  if (!result.rows.length) {
    throw new Error("User not found");
  }
  return result.rows[0];
};

export const userServices = {
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
};
