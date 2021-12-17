import {Construct} from "constructs";
import {aws_iam, Stack, StackProps} from "aws-cdk-lib";
import {CodeBuildStep, CodePipeline, CodePipelineSource, ShellStep} from "aws-cdk-lib/pipelines";
import {AngularDeployStage} from "./angular-deploy-stage";

export interface PipelineStackProps extends StackProps {
    env_name: string;
}

export class PipelineStack extends Stack {
    constructor(scope: Construct, id: string, props: PipelineStackProps) {
        super(scope, id, props);

        const pipeline = new CodePipeline(this, 'Pipeline', {
            pipelineName: 'ExampleAngularPipeline',
            synth: new CodeBuildStep('Synth', {
                input: CodePipelineSource.connection('dany84/aws-example-cdk-angular', 'main', {
                    connectionArn: this.node.tryGetContext(props.env_name).codeStarConnectionArnParam
                }),
                primaryOutputDirectory: 'infrastructure/cdk.out',
                commands: [
                    'echo installing dependencies',
                    'npm install',
                    'echo installing angular cli',
                    'npm i -g @angular/cli',
                    'echo Building angular-app',
                    'ng build',
                    'cd infrastructure',
                    'npm ci',
                    'npm run build',
                    'npx cdk synth'
                ],
                rolePolicyStatements:[
                    new aws_iam.PolicyStatement({
                        actions: ['sts:AssumeRole'],
                        resources: ['*'],
                        conditions: {
                            StringEquals: {
                                'iam:ResourceTag/aws-cdk:bootstrap-role': 'lookup',
                            },
                        }
                    })
                ]
            })
        });


        pipeline.addStage(new AngularDeployStage(this, 'Deploy', {
            domainName: this.node.tryGetContext(props.env_name).domainName,
            subDomain: this.node.tryGetContext(props.env_name).subDomain,
            env: props.env
        }));
    }
}