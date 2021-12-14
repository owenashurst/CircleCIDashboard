import cdk = require('@aws-cdk/core');
import cloudfront = require('@aws-cdk/aws-cloudfront');
import route53 = require('@aws-cdk/aws-route53');
import targets = require('@aws-cdk/aws-route53-targets/lib');
import s3 = require('@aws-cdk/aws-s3');
import s3deploy = require('@aws-cdk/aws-s3-deployment');

export interface FrontendStackProps extends cdk.StackProps {
  rootDomain: string,
  rootDomainCertificate: string
  domainName: string
}

export class CircleciDashboardFrontendStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props: FrontendStackProps) {
    super(scope, id, props);

    //const hostedZone = route53.HostedZone.fromLookup(this, 'zone', { domainName: props.rootDomain });

    const siteBucket = new s3.Bucket(this, 'bucket', {
        bucketName: props.domainName,
        websiteIndexDocument: 'index.html',
        websiteErrorDocument: 'index.html',
        publicReadAccess: true,
        removalPolicy: cdk.RemovalPolicy.DESTROY
    });

    const cloudFrontDistribution = new cloudfront.CloudFrontWebDistribution(this, 'cloudfront-distribution', {
        aliasConfiguration: {
            acmCertRef: props.rootDomainCertificate, // Manually created as the certificate needs to live in N.Virginia (us-east-1)
            names: [ props.domainName ],
            sslMethod: cloudfront.SSLMethod.SNI,
            securityPolicy: cloudfront.SecurityPolicyProtocol.TLS_V1_2_2021,
        },
        originConfigs: [{
            s3OriginSource: {
                s3BucketSource: siteBucket
            },
            behaviors : [{
                isDefaultBehavior: true,
                compress: true
            }],
        }],
        defaultRootObject: 'index.html',
        viewerProtocolPolicy: cloudfront.ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
        errorConfigurations: [{
            errorCode: 400,
            responsePagePath: '/index.html',
            responseCode: 200
        },
        {
            errorCode: 403,
            responsePagePath: '/index.html',
            responseCode: 200
        }]
    });

    // DNS is within another AWS account - will uncomment once everything is moved into one.
    // new route53.ARecord(this, 'website-alias-record', {
    //     recordName: props.domainName,
    //     target: route53.RecordTarget.fromAlias(new targets.CloudFrontTarget(cloudFrontDistribution)),
    //     zone: hostedZone
    // });

    new s3deploy.BucketDeployment(this, 'bucket-deployment', {
        sources: [ s3deploy.Source.asset('./website/dist') ],
        destinationBucket: siteBucket,
        distribution: cloudFrontDistribution,
        distributionPaths: ['/*']
    });
  }
}
