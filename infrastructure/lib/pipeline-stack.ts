import {Construct} from "constructs";
import {CfnParameter, Stack, StackProps} from "aws-cdk-lib";
import {CodePipeline, CodePipelineSource, ShellStep} from "aws-cdk-lib/pipelines";
import {AngularDeployStage} from "./angular-deploy-stage";

export class PipelineStack extends Stack {
    constructor(scope: Construct, id: string, props?: StackProps) {
        super(scope, id, props);

        const pipeline = new CodePipeline(this, 'Pipeline', {
            pipelineName: 'ExampleAngularPipeline',
            synth: new ShellStep('Synth', {
                input: CodePipelineSource.connection('dany84/aws-example-cdk-angular', 'main', {
                    connectionArn: this.node.tryGetContext('codeStarConnectionArnParam')
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
                ]
            })
        });


        pipeline.addStage(new AngularDeployStage(this, 'Deploy', {
            domainName: this.node.tryGetContext('domainName'),
            subDomain: this.node.tryGetContext('subDomain')
        }));
    }
}