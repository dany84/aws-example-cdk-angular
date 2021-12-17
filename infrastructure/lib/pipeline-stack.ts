import {Construct} from "constructs";
import {CfnParameter, Stack, StackProps} from "aws-cdk-lib";
import {CodePipeline, CodePipelineSource, ShellStep} from "aws-cdk-lib/pipelines";

export class PipelineStack extends Stack {
    constructor(scope: Construct, id: string, props?: StackProps) {
        super(scope, id, props);

        const codeStarConnectionArnParam = new CfnParameter(this, 'codeStarConnectionArnParam', {
            type: 'String',
            description: 'connectionArn to pulling src'
        });
        console.log('codeStarConnectionArnParam: ', codeStarConnectionArnParam.valueAsString);

        const pipeline = new CodePipeline(this, 'Pipeline', {
            pipelineName: 'ExampleAngularPipeline',
            synth: new ShellStep('Synth', {
                input: CodePipelineSource.connection('dany84/aws-example-cdk-angular', 'main', {
                    connectionArn: codeStarConnectionArnParam.valueAsString
                }),
                primaryOutputDirectory: 'infrastructure/cdk.out',
                commands: [
                    'npm install',
                    'echo installing angular cli',
                    'npm i -g @angular/cli',
                    'echo Building angular-app',
                    'ng build',
                    'npm ci',
                    'npm run build',
                    'cd infrastructure',
                    'npx cdk synth'
                ]
            })
        });
    }
}