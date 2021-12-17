import {Stage, StageProps} from "aws-cdk-lib";
import {Construct} from "constructs";
import {AngularDeployStack} from "./angular-deploy-stack";

export class AngularDeployStage extends Stage {

    constructor(scope: Construct, id: string, props?: StageProps) {
        super(scope, id, props);

        const angular = new AngularDeployStack(this, 'AngularDeployStack');
    }
}