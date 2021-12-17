import {Construct} from "constructs";
import {CfnParameter, Stack, StackProps} from "aws-cdk-lib";
import {CodePipeline, CodePipelineSource, ShellStep} from "aws-cdk-lib/pipelines";
import {AngularDeployStage} from "./angular-deploy-stage";
import {AngularPipelineDeployProps} from "./angular-deploy-props";

export class PipelineStack extends Stack {
    constructor(scope: Construct, id: string, props: AngularPipelineDeployProps) {
        super(scope, id, props);

        const pipeline = new CodePipeline(this, 'Pipeline', {
            pipelineName: 'ExampleAngularPipeline',
            synth: new ShellStep('Synth', {
                input: CodePipelineSource.connection('dany84/aws-example-cdk-angular', 'main', {
                    connectionArn: props.codeStarConnectionArnParam
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

        /*
        pipeline.addStage(new AngularDeployStage(this, 'Deploy', {
            zoneName: props.zoneName
        }));

         */
    }
}