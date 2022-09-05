import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { Architecture, AssetCode, Code, DockerImageCode, DockerImageFunction, Function, InlineCode, Runtime, S3Code } from 'aws-cdk-lib/aws-lambda';
import * as path from 'path';
import { DockerImage, StackProps } from 'aws-cdk-lib';
import { Location, Bucket } from 'aws-cdk-lib/aws-s3';
import { NetworkLoadBalancedFargateService } from 'aws-cdk-lib/aws-ecs-patterns';

interface MyLambdaStackProps extends StackProps {

}
export class MyLambdaStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props: MyLambdaStackProps) {
    super(scope, id, props);


    new DockerImageFunction(this, 'DockerImageFunction', {
      memorySize: 128,
      architecture: Architecture.X86_64,
      code: DockerImageCode.fromImageAsset('../rust_lambda', {
        
      }),
    });
  }
}