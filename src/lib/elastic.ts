import { Client } from "@elastic/elasticsearch";
import type { Client as NewClient } from "@elastic/elasticsearch/api/new";

//@ts-expect-error
const client2: NewClient = new Client({
  node: [
    "https://3.123.243.39:9200",
    "https://18.157.148.228:9200",
    "https://3.66.200.79:9200",
    "https://18.157.195.47:9200",
    "https://3.127.18.236:9200",
  ],
  auth: {
    username: "elastic",
    password: "DfgbH6QCiPO2GW6hbbLO",
  },
  ssl: {
    rejectUnauthorized: false,
  },
});
//@ts-expect-error
const client3: NewClient = new Client({
  node: [
    "https://3.97.188.177:9200",
    "https://3.98.180.200:9200",
    "https://3.99.28.194:9200",
    "https://3.99.84.2:9200",
  ],
  auth: {
    username: "elastic",
    password: "qLs3vJFbGX3HBiWYC14d",
  },
  ssl: {
    rejectUnauthorized: false,
  },
});

export { client2, client3 };
