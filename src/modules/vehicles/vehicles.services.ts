import { pool } from "../../config/db.js";

const createVehicle = async (payload: Record<string, unknown>) => {
  const {
    vehicle_name,
    type,
    registration_number,
    daily_rent_price,
    availability_status,
  } = payload;

  //   const hashPassword = await bcrypt.hash(password as string, 12);

  const result = await pool.query(
    `INSERT INTO vehicles (vehicle_name,type,registration_number,daily_rent_price,availability_status) VALUES ($1, $2, $3, $4, $5) RETURNING *`,
    [
      vehicle_name,
      type,
      registration_number,
      daily_rent_price,
      availability_status,
    ]
  );

  return result.rows[0];
};

const getAllVehicles = async () => {
  const result = await pool.query("SELECT * FROM vehicles ORDER BY id ASC");
  return result.rows;
};

const getVehicleById = async (vehicleId: number) => {
  const result = await pool.query("SELECT * FROM vehicles WHERE id = $1", [
    vehicleId,
  ]);
  return result.rows[0];
};

// Update vehicle by ID
const updateVehicle = async (vehicleId: number, payload: any) => {
  const {
    vehicle_name,
    type,
    registration_number,
    daily_rent_price,
    availability_status,
  } = payload;

  const result = await pool.query(
    `UPDATE vehicles 
     SET vehicle_name=$1, type=$2, registration_number=$3, daily_rent_price=$4, availability_status=$5
     WHERE id=$6
     RETURNING *`,
    [
      vehicle_name,
      type,
      registration_number,
      daily_rent_price,
      availability_status,
      vehicleId,
    ]
  );

  return result.rows[0];
};

// Delete vehicle by ID
const deleteVehicle = async (vehicleId: number) => {
  const result = await pool.query(
    "DELETE FROM vehicles WHERE id=$1 RETURNING *",
    [vehicleId]
  );
  return result.rows[0]; // null if not found
};

export const vehicleService = {
  createVehicle,
  getAllVehicles,
  getVehicleById,
  updateVehicle,
  deleteVehicle,
};
