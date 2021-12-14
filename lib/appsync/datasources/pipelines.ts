import { GraphqlApi } from "@aws-cdk/aws-appsync";
import { Function, Code, Runtime, Tracing } from "@aws-cdk/aws-lambda";
import { Construct, Duration } from "@aws-cdk/core";
import { join } from "path";

export interface PipelinesDataSourceProps {
    graphqlApi: GraphqlApi
};

export class PipelinesDataSource extends Construct {
    constructor(parent: Construct, id: string, props: PipelinesDataSourceProps) {
        super(parent, id);

        const getPipelinesLambda = new Function(this, 'get-pipelines-lambda-resolver', {
            functionName: 'Get-Pipelines',
            handler: 'index.handler',
            runtime: Runtime.NODEJS_14_X,
            memorySize: 512,
            timeout: Duration.seconds(30),
            code: Code.fromAsset(join(__dirname, 'lambdas/get-pipelines/src')),
            tracing: Tracing.ACTIVE,
            environment: {
                CIRCLECI_API_KEY: process.env.CIRCLECI_API_KEY || ''
            }
        });

        const getPipelinesLambdaDataSource = props.graphqlApi.addLambdaDataSource('getPipelinesLambdaDataSource', getPipelinesLambda);

        getPipelinesLambdaDataSource.createResolver({
            typeName: 'Query',
            fieldName: 'getPipelines'
        });
    }
}