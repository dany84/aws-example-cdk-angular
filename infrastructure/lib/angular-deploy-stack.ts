import {RemovalPolicy, Stack, StackProps} from 'aws-cdk-lib';
import {Construct} from 'constructs';
import {Bucket} from "aws-cdk-lib/aws-s3";
import * as path from "path";
import {BucketDeployment, Source} from "aws-cdk-lib/aws-s3-deployment";

export class AngularDeployStack extends Stack {
    constructor(scope: Construct, id: string, props?: StackProps) {
        super(scope, id, props);

        const bucket = new Bucket(this, 'AngularWebsiteBucket', {
            removalPolicy: RemovalPolicy.DESTROY,
            autoDeleteObjects: true
        });

        const source = path.resolve(__dirname, '..', '..', 'dist', 'aws-example-cdk-angular');
        new BucketDeployment(this, 'AngularBucketDeploy', {
            destinationBucket: bucket,
            sources: [Source.asset(source)]
        });
    }
}
