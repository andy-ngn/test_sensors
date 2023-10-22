import { client2 } from "@/lib/elastic";
import type { NextApiRequest, NextApiResponse } from "next";
const pattern = "ikea_villesse*";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const { body } = await client2.cat.indices({
      format: "json",
      index: pattern,
    });
    const indexNames = body.map((entry) => entry.index);
    return res.status(200).json(indexNames);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}
