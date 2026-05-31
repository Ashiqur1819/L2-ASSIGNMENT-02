import { pool } from "../../db"
import { IIssue } from "./issue.interface.js";

const createIssueIntoDB = async (issueData: IIssue, reporter_id: number) => {
    const {title, description, type, status} = issueData;


    const result = await pool.query(
        "INSERT INTO issues (title, description, type, status, reporter_id) VALUES ($1, $2, $3, COALESCE($4, 'open'), $5) RETURNING *",
        [title, description, type, status, reporter_id]
    );

    return result.rows[0];
}


export const getAllIssues = async (queryData: any) => {

    let { sort = "newest", type, status } = queryData;

    let query = "SELECT * FROM issues";
    const values: any[] = [];
    const conditions: string[] = [];

    // filter by type
    if (type) {
      values.push(type);
      conditions.push(`type = $${values.length}`);
    }

    // filter by status
    if (status) {
      values.push(status);
      conditions.push(`status = $${values.length}`);
    }

    // add WHERE
    if (conditions.length > 0) {
      query += ` WHERE ${conditions.join(" AND ")}`;
    }

    // sorting
    if (sort === "oldest") {
      query += " ORDER BY created_at ASC";
    } else {
      query += " ORDER BY created_at DESC";
    }

    // get all issues
    const issuesResult = await pool.query(query, values);

    const issues = issuesResult.rows;


    const formattedIssues = [];

    for (const issue of issues) {
      const reporterResult = await pool.query(
        `
        SELECT id, name, role
        FROM users
        WHERE id = $1
        `,
        [issue.reporter_id]
      );

      formattedIssues.push({
        id: issue.id,
        title: issue.title,
        description: issue.description,
        type: issue.type,
        status: issue.status,
        reporter: reporterResult.rows[0] || null,
        created_at: issue.created_at,
        updated_at: issue.updated_at,
      });
    }

    return formattedIssues;

};


const getIssueById = async (id: number) => {
    const result = await pool.query(
      `
      SELECT 
        issues.id,
        issues.title,
        issues.description,
        issues.type,
        issues.status,
        issues.created_at,
        issues.updated_at,

        users.id AS reporter_id,
        users.name AS reporter_name,
        users.role AS reporter_role

      FROM issues
      JOIN users ON issues.reporter_id = users.id
      WHERE issues.id = $1
      `,
      [id]
    );

    
    return result.rows[0];
}

const updateIssueByID = async (
  id: number,
  payload: {
    title?: string;
    description?: string;
    type?: string;
  }
) => {
  const { title, description, type } = payload || {};

  const result = await pool.query(
    `
    UPDATE issues
    SET
      title = COALESCE($1, title),
      description = COALESCE($2, description),
      type = COALESCE($3, type),
      updated_at = CURRENT_TIMESTAMP
    WHERE id = $4
    RETURNING *
    `,
    [title, description, type, id]
  );

  return result.rows[0];
};

const deleteIssueByID = async (id: number) => {
  const result = await pool.query(
    `
    DELETE FROM issues
    WHERE id = $1
    RETURNING *
    `,
    [id]
  );

  return result.rows[0];
};

export const issueService = {
    createIssueIntoDB,
    getAllIssues,
    getIssueById,
    updateIssueByID,
    deleteIssueByID,
}