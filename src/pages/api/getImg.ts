import type { NextApiHandler } from "next";

const handler: NextApiHandler = async (req, res) => {
  if (!req.query.url) {
    return res.status(400).json({ message: "Missing url" });
  }

  const url = decodeURI(req.query.url as string);
  try {
    const imageResponse = await fetch(url, { cache: "force-cache" });

    if (!imageResponse.ok) {
      throw new Error("Image request failed");
    }

    const contentType = imageResponse.headers.get("content-type");
    if (contentType) {
      res.setHeader("Content-Type", contentType);
    }

    const imageBuffer = await imageResponse.arrayBuffer();
    res.status(200).end(Buffer.from(imageBuffer));
  } catch (e: any) {
    res.status(500).json({ message: "Failed to fetch image" });
  }
};

export default handler;
