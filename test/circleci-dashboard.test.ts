import { expect as expectCDK, matchTemplate, MatchStyle } from '@aws-cdk/assert';
import * as cdk from '@aws-cdk/core';
import * as CircleciDashboard from '../lib/circleci-dashboard-frontend';

test('Empty Stack', () => {
    const app = new cdk.App();
    // WHEN
    const stack = new CircleciDashboard.CircleciDashboardFrontendStack(app, 'MyTestStack');
    // THEN
    expectCDK(stack).to(matchTemplate({
      "Resources": {}
    }, MatchStyle.EXACT))
});
