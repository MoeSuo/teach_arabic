import { getSession } from "next-auth/react";

export default async function handle(req, res) {
  try {
    const session = await getSession({ req });
    return res.status(200).json(session);
  } catch (error) {
    return res.status(500).json({ ...error, message: error.message });
  }
}
