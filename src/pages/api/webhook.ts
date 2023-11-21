import type { NextApiHandler } from "next";
import axios from "axios";
const api_token =
  "EAASemvjYD9cBOxXJYpt9ISxGSAbphTJjZBUzWz4KIBgNgxv1zfdG86ZAgwhBvx2FT12SYq6RmALs07vYZALJD2ZA1l47llTa6QqmTprh8h6ZCv93UqjtlnDstSpOQua6mVgeFNSrkXNljyjpOkMkTRTsE7FIZB9FNHejw6kGmsFVDZAeO8xBDEiVoqid2fWMFwljyszTxqOyLeZCvnZCwaoDN";
const handler: NextApiHandler = async (req, res) => {
  console.log("headers: ", req.headers);
  console.log("body: ", req.body);
  try {
    const result = await axios.post(
      "https://graph.facebook.com/v17.0/117329494728345/messages",
      {
        messaging_product: "whatsapp",
        to: "4917641317141",
        type: "template",
        template: { name: "hello_world", language: { code: "en_US" } },
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + api_token,
        },
      }
    );

    return res.status(200).json(result.data);
  } catch (error) {
    console.log(error.message);
    return res.status(error.statusCode ?? 500).json(error);
  }
};

export default handler;
