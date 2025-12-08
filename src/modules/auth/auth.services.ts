import { pool } from "../../config/db";
import bcrypt from "bcryptjs";

import jwt from "jsonwebtoken";
import config from "../../config";

const signupUser = async (
  name: string,
  email: string,
  password: string,
  phone: string,
  role: string
) => {
  const checkUser = await pool.query(`SELECT * FROM users WHERE email=$1`, [
    email.toLowerCase(),
  ]);
  if (checkUser.rows.length > 0) {
    throw new Error("Email already registered");
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const result = await pool.query(
    `INSERT INTO users (name, email, password, phone, role) VALUES ($1, $2, $3, $4, $5) RETURNING id, name, email, phone, role`,
    [name, email.toLowerCase(), hashedPassword, phone, role]
  );

  return result.rows[0];
};

const loginUser = async (email: string, password: string) => {
  const result = await pool.query(`SELECT * FROM users WHERE email=$1`, [
    email,
  ]);

  if (result.rows.length === 0) {
    return null;
  }

  const userWithPass = result.rows[0];

  const match = await bcrypt.compare(password, userWithPass.password);

  if (!match) {
    return false;
  }

  const token = jwt.sign(
    {
      id: userWithPass.id,
      name: userWithPass.name,
      email: userWithPass.email,
      role: userWithPass.role,
    },
    config.secret as string,
    {
      expiresIn: "7d",
    }
  );

  const user = {
    id: userWithPass.id,
    name: userWithPass.name,
    email: userWithPass.email,
    phone: userWithPass.phone,
    role: userWithPass.role,
  };

  return { token, user };
};

export const authServices = {
  loginUser,
  signupUser,
};
