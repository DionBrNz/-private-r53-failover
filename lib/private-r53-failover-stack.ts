import { Stack, StackProps } from 'aws-cdk-lib';
import { CfnAlarm, ComparisonOperator } from "aws-cdk-lib/aws-cloudwatch";
import { CfnHealthCheck, CfnHealthCheckProps, CfnRecordSet } from 'aws-cdk-lib/aws-route53';
import { Construct } from 'constructs';
// import * as sqs from 'aws-cdk-lib/aws-sqs';

export class PrivateR53FailoverStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    const alarm = new CfnAlarm(this, "alarm", {
      metricName : "api-ping",
      alarmName: "failed-pings",
      evaluationPeriods: 2,
      comparisonOperator: ComparisonOperator.GREATER_THAN_OR_EQUAL_TO_THRESHOLD
    })


    const healthchedkProps : CfnHealthCheckProps= {
      healthCheckConfig: {
        type: 'CLOUDWATCH_METRIC',
        alarmIdentifier: {
          name: alarm.alarmName as string,
          region: this.region,
        }     
    }
  }
    const healthcheck = new CfnHealthCheck(this, "health-check", healthchedkProps)

    new CfnRecordSet(this, "primary", {
      name : "api.todothisofname.net",
      type: "CNAME",
      failover: 'PRIMARY',
      ttl: "60",
      setIdentifier: "Primary",
      healthCheckId: healthcheck.attrHealthCheckId
    })
  }
}
