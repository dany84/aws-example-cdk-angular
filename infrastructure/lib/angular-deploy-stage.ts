import {Stage} from "aws-cdk-lib";
import {Construct} from "constructs";
import {AngularDeployStack} from "./angular-deploy-stack";
import {AngularDeployStageProps} from "./angular-deploy-props";

export class AngularDeployStage extends Stage {

    constructor(scope: Construct, id: string, props: AngularDeployStageProps) {
        super(scope, id, props);

        const angular = new AngularDeployStack(this, 'AngularDeployStack', {
            zoneName: props.zoneName
        });
    }
}