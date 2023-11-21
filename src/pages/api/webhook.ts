import type { NextApiHandler } from "next";
import axios from "axios";
const token =
  "EAASemvjYD9cBOxXJYpt9ISxGSAbphTJjZBUzWz4KIBgNgxv1zfdG86ZAgwhBvx2FT12SYq6RmALs07vYZALJD2ZA1l47llTa6QqmTprh8h6ZCv93UqjtlnDstSpOQua6mVgeFNSrkXNljyjpOkMkTRTsE7FIZB9FNHejw6kGmsFVDZAeO8xBDEiVoqid2fWMFwljyszTxqOyLeZCvnZCwaoDN";
const handler: NextApiHandler = async (req, res) => {
  try {
    if (req.method === "POST") {
      let body = req.body;
      console.log(JSON.stringify(req.body, null, 2));
      let from = req.body.entry[0].changes[0].value.messages[0].from; // extract the phone number from the webhook payload
      let phone_number_id =
        req.body.entry[0].changes[0].value.metadata.phone_number_id;
      await axios.post(
        `https://graph.facebook.com/v17.0/${phone_number_id}/messages/?access_token=${token}`,
        {
          messaging_product: "whatsapp",
          to: from,
          type: "template",
          template: { name: "ariadne_nav", language: { code: "en_US" } },
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + token,
          },
        }
      );
      // if (req.body.object) {
      //   if (
      //     req.body.entry &&
      //     req.body.entry[0].changes &&
      //     req.body.entry[0].changes[0] &&
      //     req.body.entry[0].changes[0].value.messages &&
      //     req.body.entry[0].changes[0].value.messages[0]
      //   ) {
      // let phone_number_id =
      //   req.body.entry[0].changes[0].value.metadata.phone_number_id;
      // let from = req.body.entry[0].changes[0].value.messages[0].from; // extract the phone number from the webhook payload
      //     let msg_body =
      //       req.body.entry[0].changes[0].value.messages[0].text.body; // extract the message text from the webhook payload
      //     axios({
      //       method: "POST", // Required, HTTP method, a string, e.g. POST, GET
      //       url:
      //         "https://graph.facebook.com/v12.0/" +
      //         phone_number_id +
      //         "/messages?access_token=" +
      //         token,
      //       data: {
      //         messaging_product: "whatsapp",
      //         to: from,
      //         text: { body: "Ack: " + msg_body },
      //       },
      //       headers: { "Content-Type": "application/json" },
      //     });

      //   }
      //   return res.status(200).send("OK");
      // } else {
      //   // Return a '404 Not Found' if event is not from a WhatsApp API
      //   throw { status: 404, message: "No" };
      // }
    } else if (req.method === "GET") {
      const verify_token = "some_token";
      let mode = req.query["hub.mode"];
      let token = req.query["hub.verify_token"];
      let challenge = req.query["hub.challenge"];
      if (mode && token) {
        // Check the mode and token sent are correct
        if (mode === "subscribe" && token === verify_token) {
          // Respond with 200 OK and challenge token from the request
          console.log("WEBHOOK_VERIFIED");
          res.status(200).send(challenge);
        } else {
          throw { status: 403, message: "some error" };
        }
      }
    } else throw { status: 403, message: "Wrong method" };
  } catch (error) {
    console.log(error.message);
    return res.status(error.statusCode ?? 500).json(error);
  }
};

export default handler;
