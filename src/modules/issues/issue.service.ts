import { pool } from "../../db"
import { IIssue } from "./issue.interface";

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

export const issueService = {
    createIssueIntoDB,
    getAllIssues
}