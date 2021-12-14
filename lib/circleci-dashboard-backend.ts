import * as cdk from '@aws-cdk/core';
import { CircleCiDashboardApi } from './appsync/circleci-dashboard-graphql-api';

export class CircleciDashboardBackendStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props: cdk.StackProps) {
    super(scope, id, props);

    new CircleCiDashboardApi(this, 'graphql-api');
  }
}
