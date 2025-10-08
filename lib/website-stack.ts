import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as s3 from 'aws-cdk-lib/aws-s3';
import * as s3deploy from 'aws-cdk-lib/aws-s3-deployment';
import * as cloudfront from 'aws-cdk-lib/aws-cloudfront';
import * as iam from 'aws-cdk-lib/aws-iam';
import { RemovalPolicy } from 'aws-cdk-lib';


export class WebsiteStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // Get bucket name from context 
    const userSuffix = this.node.tryGetContext('bucketName') || 'default';
    const bucketName = `team-test-${userSuffix}`;
    
    
    // Create S3 bucket with public read access & website hosting
    const bucket = new s3.Bucket(this, 'WebsiteBucket', {
      bucketName: bucketName,
      websiteIndexDocument: 'index.html',
      publicReadAccess: true,
      blockPublicAccess: s3.BlockPublicAccess.BLOCK_ACLS, // uncheck block public access
      removalPolicy: cdk.RemovalPolicy.DESTROY, // delete bucket when destroy stack
});


    // All files in bucket can access public
    bucket.addToResourcePolicy(new iam.PolicyStatement({
      actions: ['s3:GetObject'],
      resources: [`${bucket.bucketArn}/*`],
      effect: iam.Effect.ALLOW,
      principals: [new iam.ArnPrincipal('*')],
    }));

    // Deploy index.html from local
    new s3deploy.BucketDeployment(this, 'DeployWebsite', {
      sources: [s3deploy.Source.asset('./website')],
      destinationBucket: bucket,
    });

    // Config Cloudfront
    const distribution = new cloudfront.CloudFrontWebDistribution(this, 'WebsiteDistribution', {
      originConfigs: [
        {
          s3OriginSource: {
            s3BucketSource: bucket,
          },
          behaviors: [{ isDefaultBehavior: true }],
        },
      ],
    });

    // Output  URL for accessing website
    new cdk.CfnOutput(this, 'WebsiteURL', {
      value: distribution.distributionDomainName,
      description: 'URL of website was distributed by CloudFront',
    });
  }
}s

