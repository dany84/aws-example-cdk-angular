#!/usr/bin/env node
import * as cdk from 'aws-cdk-lib';
import {PipelineStack} from "../lib/pipeline-stack";

const app = new cdk.App();
const env_name = 'def';
new PipelineStack(app, 'ExampleAngularPipelineStack', {
    env: {
        account: app.node.tryGetContext(env_name).account,
        region: app.node.tryGetContext(env_name).region
    },
    env_name
});
