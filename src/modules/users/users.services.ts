import { pool } from "../../config/db.js";

// fields allowed to update from request body
const ALLOWED_UPDATES = ["name", "email", "phone", "role"];
const getAllUsers = async () => {
  const res = await pool.query(
    `SELECT id, name, email, phone, role FROM users ORDER BY id ASC`
  );
  return res.rows;
};

const updateUser = async (userId: number, payload: Record<string, any>) => {
  // Build dynamic SET clause but only for allowed fields
  const keys = Object.keys(payload).filter((k) => ALLOWED_UPDATES.includes(k));
  if (keys.length === 0) {
    // nothing to update
    const existing = await pool.query(
      `SELECT id, name, email, phone, role FROM users WHERE id=$1`,
      [userId]
    );
    return existing.rows[0] ?? null;
  }
  const setClauses: string[] = [];
  const values: any[] = [];
  let idx = 1;
  for (const key of keys) {
    setClauses.push(`${key} = $${idx}`);
    values.push(payload[key]);
    idx++;
  }
  values.push(userId); // last param for WHERE
  const query = `UPDATE users SET ${setClauses.join(
    ", "
  )} WHERE id = $${idx} RETURNING id, name, email, phone, role`;
  const res = await pool.query(query, values);
  return res.rows[0] ?? null;
};

const userHasActiveBookings = async (userId: number) => {
  const res = await pool.query(
    `SELECT 1 FROM bookings WHERE customer_id = $1 AND status = 'active' LIMIT 1`,
    [userId]
  );
  return res.rows.length > 0;
};

const deleteUser = async (userId: number) => {
  // check active bookings constraint
  if (await userHasActiveBookings(userId)) {
    throw new Error("User has active bookings and cannot be deleted");
  }
  const res = await pool.query(`DELETE FROM users WHERE id=$1 RETURNING id`, [
    userId,
  ]);
  if (res.rows.length === 0) {
    throw new Error("User not found");
  }
  return;
};
export const userServices = { getAllUsers, updateUser, deleteUser };
