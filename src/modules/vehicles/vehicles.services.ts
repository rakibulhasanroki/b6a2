import { pool } from "../../config/db";
const postVehicle = async (payload: Record<string, unknown>) => {
  const {
    vehicle_name,
    type,
    registration_number,
    daily_rent_price,
    availability_status,
  } = payload;

  const checkVehicles = await pool.query(
    `SELECT * FROM vehicles WHERE registration_number=$1`,
    [registration_number]
  );
  if (checkVehicles.rows.length > 0) throw new Error("Vehicle already exists");

  const result = await pool.query(
    `INSERT INTO vehicles (vehicle_name, type, registration_number, daily_rent_price, availability_status)
     VALUES ($1,$2,$3,$4,$5) RETURNING *`,
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

const getVehicles = async () => {
  const result = await pool.query(`SELECT * FROM vehicles`);
  return result.rows;
};

const getVehicleByID = async (id: string) => {
  const result = await pool.query(`SELECT * FROM vehicles WHERE id=$1`, [id]);
  return result.rows[0];
};

const putVehicle = async (payload: Record<string, unknown>, id: string) => {
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
      id,
    ]
  );

  return result.rows[0];
};

const deleteVehicles = async (id: string) => {
  const vehicleCheck = await pool.query(
    "SELECT * FROM vehicles WHERE id = $1",
    [id]
  );

  if (vehicleCheck.rowCount === 0) {
    throw new Error("Vehicle not found");
  }

  const bookingCheck = await pool.query(
    `SELECT * FROM bookings WHERE vehicle_id = $1 AND status = 'active'`,
    [id]
  );
  if (bookingCheck.rowCount! > 0) {
    throw new Error("Cannot delete vehicle with active bookings");
  }

  const result = await pool.query("DELETE FROM vehicles WHERE id = $1", [id]);
  return result;
};

export const vehiclesServices = {
  postVehicle,
  getVehicles,
  getVehicleByID,
  putVehicle,
  deleteVehicles,
};
