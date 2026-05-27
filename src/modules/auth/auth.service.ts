import { pool } from "../../db";
import bcrypt from "bcrypt";
import { IAuth } from "./auth.interface";


// Service function to create a new user in the database
const createUserIntoDB = async (payload: IAuth) => {
  const { name, email, password, role } = payload;

  const existingUser = await pool.query(
    "SELECT * FROM users WHERE email = $1",
    [email],
  );

  if (existingUser.rows.length > 0) {
    throw new Error("User with this email already exists");
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const result = await pool.query(
    "INSERT INTO users (name, email, password, role) VALUES ($1, $2, $3, $4) RETURNING id, name, email, role, created_at, updated_at",
    [name, email, hashedPassword, role],
  );

  return result.rows[0];
};

export const authService = {
  createUserIntoDB,
};
