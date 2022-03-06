import {
  CloudWatchClient,
  PutMetricDataCommand,
  PutMetricDataCommandInput,
  PutMetricDataCommandOutput,
} from "@aws-sdk/client-cloudwatch";
import { Axios } from "axios";

const client = new CloudWatchClient({ region: "REGION" });
const axios = new Axios();
export const pingHandler = async () => {
  axios.get("https://www.google.com").then((res) => {
    if (res.status != 200) {
      logCouldwatchError();
    }
  });
};

/**
 * Sends a failed metric to Cloudwatch metrics
 */
async function logCouldwatchError() {
  const params = {
    MetricData: [
      {
        Timestamp: new Date(),
        MetricName: "failed-pings",
        Value: 1,
        Unit: "Count",
        StorageResolution: 1,
      },
    ],
    Namespace: "api-errors",
  };
  const command = new PutMetricDataCommand(params);
  let result = await client.send(command);
  console.log(`Send metric, got result ${result}`);
}
