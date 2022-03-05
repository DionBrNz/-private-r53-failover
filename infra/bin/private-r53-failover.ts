#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import { PrivateR53FailoverStack } from '../lib/private-r53-failover-stack';

const app = new cdk.App();
new PrivateR53FailoverStack(app, 'PrivateR53FailoverStack', {
  env: { account: process.env.CDK_DEFAULT_ACCOUNT, region: process.env.CDK_DEFAULT_REGION },
});