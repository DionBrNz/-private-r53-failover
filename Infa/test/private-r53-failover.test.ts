import * as cdk from "aws-cdk-lib";
import { Template } from "aws-cdk-lib/assertions";
import * as PrivateR53Failover from "../lib/private-r53-failover-stack";

// example test. To run these tests, uncomment this file along with the
// example resource in lib/private-r53-failover-stack.ts
test("Alarm Created", () => {
  const app = new cdk.App();
  //     // WHEN
  const stack = new PrivateR53Failover.PrivateR53FailoverStack(
    app,
    "MyTestStack"
  );
  //     // THEN
  const template = Template.fromStack(stack);

  template.hasResourceProperties("AWS::CloudWatch::Alarm", {
    ComparisonOperator: "GreaterThanOrEqualToThreshold",
    EvaluationPeriods: 2,
    MetricName: "api-ping",
  });
});

test("Health check Created", () => {
  const app = new cdk.App();
  //     // WHEN
  const stack = new PrivateR53Failover.PrivateR53FailoverStack(
    app,
    "MyTestStack"
  );
  //     // THEN
  const template = Template.fromStack(stack);

  template.hasResourceProperties("AWS::Route53::HealthCheck", {
    HealthCheckConfig: {
      AlarmIdentifier: {
        Name: "failed-pings",
        Region: { Ref: "AWS::Region" },
      },
      Type: "CLOUDWATCH_METRIC",
    },
  });
});
