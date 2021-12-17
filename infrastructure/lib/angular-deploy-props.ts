import {StackProps, StageProps} from "aws-cdk-lib";

export interface AngularDeployStageProps extends StageProps {
    domainName: string;
    subDomain: string;
}

export interface AngularDeployStackProps extends StackProps{
    domainName: string;
    subDomain: string;
}