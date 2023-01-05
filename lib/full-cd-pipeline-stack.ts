import * as cdk from 'aws-cdk-lib';
import { LinuxArmBuildImage, Project } from 'aws-cdk-lib/aws-codebuild';
import { Repository } from 'aws-cdk-lib/aws-codecommit';
import { Action, Artifact, Pipeline } from 'aws-cdk-lib/aws-codepipeline';
import { CodeBuildAction, CodeCommitSourceAction } from 'aws-cdk-lib/aws-codepipeline-actions';
import { CodeBuildProject } from 'aws-cdk-lib/aws-events-targets';
import { CodePipeline, CodePipelineSource, ManualApprovalStep, ShellStep } from 'aws-cdk-lib/pipelines';
import { Construct } from 'constructs';
import { MyPipelineAppStage } from './my-pipeline-app-stage';

export class FullCdPipelineStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const codePipeline = new CodePipeline(this, 'Pipeline', {
      pipelineName: 'MyPipeline',
      dockerEnabledForSelfMutation: true, // https://docs.aws.amazon.com/cdk/api/v1/docs/pipelines-readme.html#using-docker-image-assets-in-the-pipeline
      synth: new ShellStep('Synth', {
        input: CodePipelineSource.connection('georgantas/full-cd-pipeline', 'main', {
          connectionArn: 'arn:aws:codestar-connections:us-east-1:879320377447:connection/470d19a4-0ae5-485d-925e-e4b4fd0d71f9'
        }),
        commands: ['npm ci', 'npm run build', 'npx cdk synth'],
        additionalInputs: {
          '../rust_lambda': CodePipelineSource.connection('georgantas/rust-lambda', 'main', {
            connectionArn: 'arn:aws:codestar-connections:us-east-1:879320377447:connection/470d19a4-0ae5-485d-925e-e4b4fd0d71f9'
          }),
        },
      })
    });

    const alpha = codePipeline.addStage(new MyPipelineAppStage(this, "AlphaStage", {
      env: {
        account: '879320377447',
        region: 'us-east-1',
      },
    }));

    alpha.addPost(new ManualApprovalStep('Approval'));
  }
}
