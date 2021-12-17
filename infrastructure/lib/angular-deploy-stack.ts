import {RemovalPolicy, Stack, StackProps} from 'aws-cdk-lib';
import {Construct} from 'constructs';
import {Bucket} from "aws-cdk-lib/aws-s3";
import * as path from "path";
import {BucketDeployment, Source} from "aws-cdk-lib/aws-s3-deployment";
import {HostedZone, PublicHostedZone} from "aws-cdk-lib/aws-route53";
import {AngularDeployStackProps} from "./angular-deploy-props";

export class AngularDeployStack extends Stack {

    public readonly hostedZone: HostedZone;

    constructor(scope: Construct, id: string, props: AngularDeployStackProps) {
        super(scope, id, props);

        this.hostedZone = new PublicHostedZone(this, 'HostedZone', {
            zoneName: props.zoneName,
            caaAmazon: true
        });

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
