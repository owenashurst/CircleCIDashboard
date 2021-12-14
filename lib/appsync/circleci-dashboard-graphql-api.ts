#!/usr/bin/env node
import { join } from 'path';
import { Construct, Expiration } from '@aws-cdk/core';
import { GraphqlApi, FieldLogLevel, AuthorizationType, Schema, } from '@aws-cdk/aws-appsync';
import { PipelinesDataSource } from './datasources/pipelines';

export class CircleCiDashboardApi extends Construct {
    constructor(parent: Construct, id: string) {
        super(parent, id);

        const graphqlApi = new GraphqlApi(this, 'circleci-dashboard-api', {
            name: `CircleCI Dashboard API`,
            logConfig: {
              fieldLogLevel: FieldLogLevel.ALL,
            },
            authorizationConfig: {
                defaultAuthorization: {
                    authorizationType: AuthorizationType.API_KEY,
                    apiKeyConfig: {
                        name: 'Website API Key',
                        expires: Expiration.atDate(new Date(new Date().getTime()+(365*24*60*60*1000))) // 365 days
                    }
                }
            },
            schema: Schema.fromAsset(join(__dirname, 'schema.graphql'))
        });

        //const appsyncGeneratedDomain = new URL(graphqlApi.graphqlUrl);

        // const appsyncCloudFrontDistribution = new cloudfront.CloudFrontWebDistribution(this, 'appsync-cloudfrontdistribution', {
        //     aliasConfiguration: {
        //         acmCertRef: props.certificateArn, // Manually created as the certificate needs to live in N.Virginia (us-east-1)
        //         names: [ GRAPHQL_API_URL ],
        //         sslMethod: cloudfront.SSLMethod.SNI,
        //         securityPolicy: cloudfront.SecurityPolicyProtocol.TLS_V1_1_2016
        //     },
        //     originConfigs: [{
        //         customOriginSource: {
        //             domainName: appsyncGeneratedDomain.hostname,
        //             originProtocolPolicy: OriginProtocolPolicy.HTTPS_ONLY,
        //             originPath: appsyncGeneratedDomain.pathname
        //         },
        //         behaviors : [{
        //             isDefaultBehavior: true,
        //             compress: true,
        //             minTtl: Duration.seconds(0),
        //             maxTtl: Duration.seconds(0),
        //             defaultTtl: Duration.seconds(0),
        //             allowedMethods: CloudFrontAllowedMethods.ALL,
        //             forwardedValues: {
        //                 queryString: true,
        //                 headers: ['Authorization']
        //             }
        //         }]
        //     }],
        //     viewerProtocolPolicy: cloudfront.ViewerProtocolPolicy.HTTPS_ONLY
        // });

        // new route53.ARecord(this, 'appsync-aliasrecord', {
        //     recordName: GRAPHQL_API_URL,
        //     target: route53.RecordTarget.fromAlias(new targets.CloudFrontTarget(appsyncCloudFrontDistribution)),
        //     zone: route53.HostedZone.fromLookup(this, 'zone', { domainName: props.domainName })
        // });

        new PipelinesDataSource(this, 'pipelines-data-source', {
            graphqlApi
        });
    }
}