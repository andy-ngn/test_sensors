import axios from "axios";
import type { NextApiHandler } from "next";
import Twilio from "twilio";
const accountSid = "AC3bc0e6db5c17dd06022752437a3c9178";
const authToken = "59e46fbe8bf49bb205594a420555422b";

type Payload = {
  ProfileName: string;
  Wald: string;
  Body: string;
  //! "whatsapp"+number
  To: string;
  //! "whatsapp"+number
  From: string;
};

const handler: NextApiHandler = async (req, res) => {
  try {
    const client = Twilio(accountSid, authToken);
    if (req.method === "POST") {
      const { Body, From, To, Wald, ProfileName } = req.body as Payload;
      const received_token = Body.split(":")[0];
      const phone_number = From.replace("whatsapp", "");
      const { data: dmmaResult } = await axios.post(
        `https://dmma.ariadne.inc/index.php/api/wa?tok=${received_token}&msisdn=${phone_number}`
      );
      await client.messages.create({
        body:
          `Hello ${ProfileName}, this is Ariadne.\n` + received_token
            ? `Checkout our Navigation at: https://nav.ariadne.inc/${received_token}`
            : ``,
        from: To,
        to: From,
      });
      return res.status(200).send("ok");
    } else if (req.method === "GET") {
      return res.status(200).send("ok");
    } else throw { status: 403, message: "Wrong method" };
  } catch (error) {
    console.log(error.message);
    return res.status(error.statusCode ?? 500).json(error);
  }
};

export default handler;
