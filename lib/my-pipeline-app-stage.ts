import * as cdk from 'aws-cdk-lib';
import { StageProps } from 'aws-cdk-lib';
import { NodejsFunction } from 'aws-cdk-lib/aws-lambda-nodejs';
import { Location } from 'aws-cdk-lib/aws-s3';
import { Construct } from "constructs";
import { MyLambdaStack } from './my-pipeline-lambda-stack';

interface MyPipelineAppStageProps extends StageProps {
  
}

export class MyPipelineAppStage extends cdk.Stage {

  constructor(scope: Construct, id: string, props: MyPipelineAppStageProps) {
    super(scope, id, props);


    const lambdaStack = new MyLambdaStack(this, 'LambdaStack', {});
  }
}