import type { NextApiHandler } from "next";
import axios from "axios";
const api_token =
  "EAASemvjYD9cBO2saAfQ9e17OVScAwdD3lTJ9zZC3F7P46nueS7ZC0xlXAL4IUO0AQZCvPbG2thIkhNFRNneD8Fy0FXoCz3EB2N1LxpKqwY77OyBMYd8TWZAteiuq3Ag5ijV62LxznO5nW4pniaN4lw3DvOfIl01oIZCEjnOrIHsjZAIWe3WjAA1yCjo5Ezv7zmhmUGW7ZAFFn210TOVSoMZD";
const handler: NextApiHandler = async (req, res) => {
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
