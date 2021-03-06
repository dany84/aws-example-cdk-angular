import {
    aws_cloudfront,
    aws_cloudfront_origins,
    aws_route53,
    aws_route53_targets,
    CfnOutput,
    Duration,
    RemovalPolicy,
    Stack
} from 'aws-cdk-lib';
import {Construct} from 'constructs';
import {Bucket} from "aws-cdk-lib/aws-s3";
import * as path from "path";
import {BucketDeployment, Source} from "aws-cdk-lib/aws-s3-deployment";
import {AngularDeployStackProps} from "./angular-deploy-props";
import {DnsValidatedCertificate} from "aws-cdk-lib/aws-certificatemanager";

export class AngularDeployStack extends Stack {

    constructor(scope: Construct, id: string, props: AngularDeployStackProps) {
        super(scope, id, props);

        const hostedZone = aws_route53.HostedZone.fromLookup(this, "Zone", {
            domainName: props.domainName,
        });

        const siteDomain = props.subDomain + "." + props.domainName;
        new CfnOutput(this, 'Site', {value: siteDomain});

        const certificate = new DnsValidatedCertificate(this, 'Certificate', {
            domainName: '*.' + props.domainName,
            subjectAlternativeNames: ['*.' + props.domainName],
            hostedZone,
            region: "us-east-1",
        });

        const bucket = new Bucket(this, 'AngularWebsiteBucket', {
            removalPolicy: RemovalPolicy.DESTROY,
            autoDeleteObjects: true,
            publicReadAccess: true,
            websiteIndexDocument: 'index.html',
            websiteErrorDocument: 'index.html'
        });
        new CfnOutput(this, "Bucket", { value: bucket.bucketName });

        const distribution = new aws_cloudfront.Distribution(this, 'Distribution', {
            defaultRootObject: 'index.html',
            certificate: certificate,
            domainNames: [siteDomain],
            defaultBehavior: {
                origin: new aws_cloudfront_origins.S3Origin(bucket),
                cachePolicy: new aws_cloudfront.CachePolicy(this, 'CachePolicy', {
                    cachePolicyName: 'static_cache',
                    minTtl: Duration.days(365),
                    maxTtl: Duration.days(365),
                    defaultTtl: Duration.days(365),
                    enableAcceptEncodingBrotli: true,
                    enableAcceptEncodingGzip: true
                })
            }
        });

        const source = path.resolve(__dirname, '..', '..', 'dist', 'aws-example-cdk-angular');
        new BucketDeployment(this, 'AngularBucketDeploy', {
            destinationBucket: bucket,
            sources: [Source.asset(source)],
            distribution: distribution
        });

        new aws_route53.ARecord(this, 'ARecord', {
            recordName: siteDomain,
            zone: hostedZone,
            target: aws_route53.RecordTarget.fromAlias(new aws_route53_targets.CloudFrontTarget(distribution))
        });
    }
}
