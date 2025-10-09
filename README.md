#1 Cấu hình AWS credentials
  aws configure

#2 Chuẩn bị hạ tầng AWS cho CDK hoạt động ( S3, IAM,... ) -> Nếu đã có CDK Toolkit rồi thì không phải chạy lệnh
  cdk bootstrap

#3 Biên dịch code CDK -> CloudFormation Template
  cdk synth

#4 Triển khai lên AWS 

  cdk deploy => (Ex: bucketName=team-test-default)

  cdk deploy -c bucketName="<ten>" => (Ex: bucketName=team-test-<ten>
  
#5 Gỡ bỏ stack khỏi AWS
  cdk destroy
