import { pool } from "../../db";
import bcrypt from "bcrypt";
import { IAuth } from "./auth.interface";
import jwt from "jsonwebtoken";


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
  `INSERT INTO users (name, email, password, role)
   VALUES ($1, $2, $3, COALESCE($4, 'contributor'))
   RETURNING id, name, email, role, created_at, updated_at`,
  [name, email, hashedPassword, role]
);

  return result.rows[0];
};

// Service function to authenticate a user and generate a JWT token
const loginUserIntoDB = async (email: string, password: string) => {
    const result = await pool.query(
        "SELECT * FROM users WHERE email = $1",
        [email]
    );

    if (result.rows.length === 0) {
        return null;
    }

    const user = result.rows[0];
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
        return null;
    }

    delete user.password;

    const token = jwt.sign(
        { id: user.id, email: user.email, role: user.role },
        process.env.JWT_SECRET as string,
        { expiresIn: "1d" }
    );

    return { token, user };
};

export const authService = {
  createUserIntoDB,
  loginUserIntoDB
};
