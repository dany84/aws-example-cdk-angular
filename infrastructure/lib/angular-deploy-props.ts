import {StackProps, StageProps} from "aws-cdk-lib";

export interface AngularPipelineDeployProps extends StackProps {
    codeStarConnectionArnParam: string;
    zoneName: string;
}

export interface AngularDeployStageProps extends StageProps {
    zoneName: string;
}

export interface AngularDeployStackProps extends StackProps{
    zoneName: string;
}