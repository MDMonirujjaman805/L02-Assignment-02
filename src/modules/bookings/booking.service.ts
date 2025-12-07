import { pool } from "../../config/db.js";
const createBooking = async (payload: any) => {
  const { customer_id, vehicle_id, rent_start_date, rent_end_date } = payload;

  // 1️⃣ Vehicle info check
  const vehicleRes = await pool.query(
    `SELECT * FROM vehicles WHERE id=$1 AND availability_status='available'`,
    [vehicle_id]
  );

  if (vehicleRes.rows.length === 0) {
    throw new Error("Vehicle not available or not found");
  }

  const vehicle = vehicleRes.rows[0];

  // 2️⃣ Calculate total price
  const start = new Date(rent_start_date);
  const end = new Date(rent_end_date);

  const diffDays = Math.ceil(
    (end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)
  );

  if (diffDays <= 0) {
    throw new Error("Invalid rent date range");
  }

  const totalPrice = diffDays * vehicle.daily_rent_price;

  // 3️⃣ Insert booking
  const bookingRes = await pool.query(
    `
    INSERT INTO bookings
    (customer_id, vehicle_id, rent_start_date, rent_end_date, total_price, status)
    VALUES ($1, $2, $3, $4, $5, 'active')
    RETURNING *
    `,
    [customer_id, vehicle_id, rent_start_date, rent_end_date, totalPrice]
  );

  const booking = bookingRes.rows[0];

  // 4️⃣ Update vehicle availability → rented
  await pool.query(
    `UPDATE vehicles SET availability_status='booked' WHERE id=$1`,
    [vehicle_id]
  );

  // 5️⃣ Attach vehicle info in response
  return {
    ...booking,
    vehicle: {
      vehicle_name: vehicle.vehicle_name,
      daily_rent_price: vehicle.daily_rent_price,
    },
  };
};

const getAllBookings = async (user: any) => {
  if (user.role === "admin") {
    const res = await pool.query(`
      SELECT b.*, 
        json_build_object('name', u.name, 'email', u.email) as customer,
        json_build_object('vehicle_name', v.vehicle_name, 'registration_number', v.registration_number) as vehicle
      FROM bookings b
      JOIN users u ON b.customer_id = u.id
      JOIN vehicles v ON b.vehicle_id = v.id
    `);
    return res.rows;
  } else {
    const res = await pool.query(
      `
      SELECT b.*, 
        json_build_object('vehicle_name', v.vehicle_name, 'registration_number', v.registration_number, 'type', v.type) as vehicle
      FROM bookings b
      JOIN vehicles v ON b.vehicle_id = v.id
      WHERE b.customer_id = $1
    `,
      [user.id]
    );
    return res.rows;
  }
};

const updateBooking = async (bookingId: number, status: string, user: any) => {
  const bookingRes = await pool.query(`SELECT * FROM bookings WHERE id=$1`, [
    bookingId,
  ]);
  if (!bookingRes.rows.length) throw new Error("Booking not found");

  // const booking = bookingRes.rows[0];

  // Customer can cancel only
  if (user.role === "customer" && status !== "cancelled") {
    throw new Error("Customers can only cancel bookings");
  }

  // Admin can mark as returned
  if (user.role === "admin" && status !== "returned") {
    throw new Error("Admin can only mark as returned");
  }

  const updateRes = await pool.query(
    `UPDATE bookings SET status=$1 WHERE id=$2 RETURNING *`,
    [status, bookingId]
  );
  const updated = updateRes.rows[0];

  // If returned, vehicle becomes available
  if (status === "returned") {
    await pool.query(
      `UPDATE vehicles SET availability_status='available' WHERE id=$1`,
      [updated.vehicle_id]
    );
    return {
      message: "Booking marked as returned. Vehicle is now available",
      data: { ...updated, vehicle: { availability_status: "available" } },
    };
  }

  if (status === "cancelled") {
    // Optionally make vehicle available again if cancelled before rent start?
    await pool.query(
      `UPDATE vehicles SET availability_status='available' WHERE id=$1`,
      [updated.vehicle_id]
    );
    return { message: "Booking cancelled successfully", data: updated };
  }

  return { message: "Booking updated", data: updated };
};

export default { createBooking, getAllBookings, updateBooking };
