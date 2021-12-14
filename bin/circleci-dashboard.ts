#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from '@aws-cdk/core';
import { CircleciDashboardBackendStack } from '../lib/circleci-dashboard-backend';
import { CircleciDashboardFrontendStack } from '../lib/circleci-dashboard-frontend';

export const NONPRODUCTION_OLD_ACCOUNT_ID = '005840164515';
export const NONPRODUCTION_ACCOUNT_ID= '740654597456' // Where the tote.digital certificate lives

const ROOT_DOMAIN = 'tote.digital';

const DOMAIN_NAME = `circleci-dashboard.${ROOT_DOMAIN}`;
const NONPRODUCTION_CERTIFICATE_ARN = `arn:aws:acm:us-east-1:${NONPRODUCTION_ACCOUNT_ID}:certificate/7fc70bcb-85b2-415b-828b-44cb0a85adc3`;

const app = new cdk.App();

new CircleciDashboardBackendStack(app, 'circleci-dashboard-backend-stack', {
  env: {
    region: process.env.AWS_DEFAULT_REGION || 'eu-west-2', 
    account: process.env.AWS_ACCOUNT_ID || NONPRODUCTION_ACCOUNT_ID
  }
});

new CircleciDashboardFrontendStack(app, 'circleci-dashboard-frontend-stack', {
  rootDomain: ROOT_DOMAIN,
  rootDomainCertificate: NONPRODUCTION_CERTIFICATE_ARN,
  domainName: DOMAIN_NAME,
  env: {
    region: process.env.AWS_DEFAULT_REGION || 'eu-west-2', 
    account: process.env.AWS_ACCOUNT_ID || NONPRODUCTION_ACCOUNT_ID
  }
});
