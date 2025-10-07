import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as s3 from 'aws-cdk-lib/aws-s3';
import * as iam from 'aws-cdk-lib/aws-iam';
import { RemovalPolicy } from 'aws-cdk-lib';


export class S3BucketStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // Create S3 with  public read access
    const bucket = new s3.Bucket(this, 'MyPublicBucket', {
      removalPolicy: RemovalPolicy.DESTROY,
      bucketName: `team-test-${cdk.Aws.ACCOUNT_ID}`,
      publicReadAccess: true, // Read access public//
      blockPublicAccess: s3.BlockPublicAccess.BLOCK_ACLS, // allow public bucket access
    });

    // Allow policy
    bucket.addToResourcePolicy(new iam.PolicyStatement({
      actions: ['s3:GetObject'],
      resources: [`${bucket.bucketArn}/*`],
      effect: iam.Effect.ALLOW,
      principals: [new iam.ArnPrincipal('*')],
    }));

    // Output name and URL
    new cdk.CfnOutput(this, 'BucketURL', {
      value: bucket.bucketWebsiteUrl,
      description: 'URL s3 bucket',
    });
  }
}

