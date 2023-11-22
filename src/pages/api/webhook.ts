import type { NextApiHandler } from "next";
import Twilio from "twilio";
const accountSid = "AC3bc0e6db5c17dd06022752437a3c9178";
const authToken = "59e46fbe8bf49bb205594a420555422b";
const handler: NextApiHandler = async (req, res) => {
  try {
    const client = Twilio(accountSid, authToken);
    if (req.method === "POST") {
      const content = req.body;
      await client.messages.create({
        body: "Body: " + JSON.stringify(content, null, 2),
        from: "whatsapp:+14155238886",
        to: "whatsapp:+4917641317141",
      });
    } else if (req.method === "GET") {
    } else throw { status: 403, message: "Wrong method" };
  } catch (error) {
    console.log(error.message);
    return res.status(error.statusCode ?? 500).json(error);
  }
};

export default handler;
