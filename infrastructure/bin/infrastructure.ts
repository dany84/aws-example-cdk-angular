#!/usr/bin/env node
import * as cdk from 'aws-cdk-lib';
import {PipelineStack} from "../lib/pipeline-stack";

const app = new cdk.App();
new PipelineStack(app, 'ExampleAngularPipelineStack', {
    codeStarConnectionArnParam: app.node.tryGetContext('codeStarConnectionArnParam'),
    zoneName: app.node.tryGetContext('zoneName')
});
