import { pool } from "../../config/db";

const getUser = async () => {
  const result = await pool.query(`SELECT * FROM users`);
  return result;
};

const updateUser = async (payload: any, id: string) => {
  const getUser = await pool.query(`SELECT * FROM users WHERE id=$1`, [id]);

  const user = getUser.rows[0];

  const name = payload.name ?? user.name;
  const email = payload.email ?? user.email;
  const phone = payload.phone ?? user.phone;
  const role = payload.role ?? user.role;

  const result = await pool.query(
    `UPDATE users  SET name=$1, email=$2, phone=$3, role=$4 WHERE id=$5 RETURNING id, name, email, phone, role`,
    [name, email, phone, role, id]
  );

  return result.rows[0];
};

const deleteUser = async (id: string) => {
  const bookingCheck = await pool.query(
    `SELECT * FROM bookings WHERE vehicle_id = $1 AND status = 'active'`,
    [id]
  );

  if (bookingCheck.rowCount! > 0) {
    throw new Error("Cannot delete users with active bookings");
  }
  const result = await pool.query(`DELETE FROM users WHERE id=$1`, [id]);
  return result;
};

export const usersServices = {
  getUser,
  updateUser,
  deleteUser,
};
