# Devops AWS Terraform GitHub Actions

README này chỉ hướng dẫn cách triển khai project.

## 1. Chuẩn bị
Kiểm tra các công cụ cần có:
```powershell
git --version
aws --version
terraform version
```
Cấu hình AWS profile:
```powershell
aws configure --profile aws-real
$env:AWS_PROFILE="aws-real"
aws sts get-caller-identity
```
Lấy IP public hiện tại để cấu hình SSH:
```powershell
curl.exe https://checkip.amazonaws.com
```
## 2. Tạo Terraform backend
```powershell
$Region = "us-east-1"
$StateBucket = "devops-lab02-terraform-state-105237831888"
$LockTable = "devops-lab02-terraform-lock"

aws s3 mb "s3://$StateBucket" --region $Region

aws dynamodb create-table `
  --table-name $LockTable `
  --attribute-definitions AttributeName=LockID,AttributeType=S `
  --key-schema AttributeName=LockID,KeyType=HASH `
  --billing-mode PAY_PER_REQUEST `
  --region $Region

aws dynamodb wait table-exists `
  --table-name $LockTable `
  --region $Region
```

## 3. Cấu hình GitHub Actions
Cấu hình các repository secrets:
```text
AWS_ROLE_ARN
DEPLOY_HOST
DEPLOY_USER
DEPLOY_SSH_KEY
SONAR_TOKEN
SONAR_HOST_URL
```
Cấu hình các repository variables:
```text
AWS_REGION
EC2_KEY_NAME
ALLOWED_SSH_CIDR
TF_STATE_BUCKET
TF_STATE_KEY
TF_LOCK_TABLE
DEPLOY_PATH
```
Ví dụ giá trị:

```text
AWS_REGION=us-east-1
EC2_KEY_NAME=devops-lab02-key
ALLOWED_SSH_CIDR=<ip-public-cua-ban>/32
TF_STATE_BUCKET=devops-lab02-terraform-state-105237831888
TF_STATE_KEY=terraform/devops-lab02.tfstate
TF_LOCK_TABLE=devops-lab02-terraform-lock
DEPLOY_PATH=/home/ec2-user/mood-journal
```

Set bằng GitHub CLI:
```powershell
& "C:\Program Files\GitHub CLI\gh.exe" auth login

& "C:\Program Files\GitHub CLI\gh.exe" secret set AWS_ROLE_ARN --body "arn:aws:iam::105237831888:role/devops-lab02-github-actions-role"
& "C:\Program Files\GitHub CLI\gh.exe" variable set AWS_REGION --body "us-east-1"
& "C:\Program Files\GitHub CLI\gh.exe" variable set EC2_KEY_NAME --body "devops-lab02-key"
& "C:\Program Files\GitHub CLI\gh.exe" variable set ALLOWED_SSH_CIDR --body "<ip-public-cua-ban>/32"
& "C:\Program Files\GitHub CLI\gh.exe" variable set TF_STATE_BUCKET --body "devops-lab02-terraform-state-105237831888"
& "C:\Program Files\GitHub CLI\gh.exe" variable set TF_STATE_KEY --body "terraform/devops-lab02.tfstate"
& "C:\Program Files\GitHub CLI\gh.exe" variable set TF_LOCK_TABLE --body "devops-lab02-terraform-lock"
```

## 4. Triển khai hạ tầng Terraform

Chạy bằng GitHub Actions:
```text
GitHub repository -> Actions -> Terraform Infrastructure -> Run workflow -> main
```
Hoặc chạy local:

```powershell
cd <duong-dan-repo>\terraform
$env:AWS_PROFILE="aws-real"
terraform init
terraform plan
terraform apply
terraform output
```
## 5. SSH vào EC2 public

SSH vào EC2 public:

```powershell
ssh -i "<duong-dan-file-pem>" ec2-user@<public-instance-public-ip>
```
## 6. SSH vào EC2 private
Copy key lên public EC2:

```powershell
scp -i "<duong-dan-file-pem>" "<duong-dan-file-pem>" ec2-user@<public-instance-public-ip>:~/devops-lab02-key.pem
```
Trên public EC2:

```bash
chmod 400 ~/devops-lab02-key.pem
ssh -i ~/devops-lab02-key.pem ec2-user@<private-instance-private-ip>
```
## 7. Triển khai microservices bằng Docker Compose
SSH vào public EC2:

```powershell
ssh -i "<duong-dan-file-pem>" ec2-user@<public-instance-public-ip>
```
Trên public EC2, kiểm tra Docker:

```bash
docker --version
docker compose version
git --version
```
Bật Docker nếu cần:
```bash
sudo systemctl enable --now docker
sudo usermod -aG docker ec2-user
```
Clone source code:
```bash
git clone https://github.com/HelenNelson139/Devops_aws-terraform-github_actions.git ~/mood-journal
cd ~/mood-journal
```
Nếu source đã tồn tại:
```bash
cd ~/mood-journal
git pull --ff-only
```
Chạy ứng dụng:

```bash
docker compose -f microservices/docker-compose.yml up -d --build
```
Kiểm tra container:

```bash
docker compose -f microservices/docker-compose.yml ps
```
Kiểm tra service:
```bash
curl http://localhost:3000/health
curl http://localhost:3001/health
curl -I http://localhost:8080
```
## 8. Mở website bằng SSH tunnel
Trên máy local:
```powershell
ssh -i "<duong-dan-file-pem>" -L 8080:localhost:8080 ec2-user@<public-instance-public-ip>
```
Mở trình duyệt:
```text
http://localhost:8080
```

## 9. Cấu hình GitHub Actions deploy microservices lên EC2
Set deploy secrets:
```powershell
& "C:\Program Files\GitHub CLI\gh.exe" secret set DEPLOY_HOST --body "<public-instance-public-ip>"
& "C:\Program Files\GitHub CLI\gh.exe" secret set DEPLOY_USER --body "ec2-user"

$key = Get-Content "<duong-dan-file-pem>" -Raw
& "C:\Program Files\GitHub CLI\gh.exe" secret set DEPLOY_SSH_KEY --body $key

& "C:\Program Files\GitHub CLI\gh.exe" variable set DEPLOY_PATH --body "/home/ec2-user/mood-journal"
```
Chạy lại CI/CD trên GitHub:
```text
Actions -> Message Service CI/CD -> Run workflow -> main
Actions -> API Service CI/CD -> Run workflow -> main
Actions -> Frontend CI/CD -> Run workflow -> main
```
## 10. Dọn dẹp
Dừng ứng dụng Docker:
```bash
cd ~/mood-journal
docker compose -f microservices/docker-compose.yml down
```
Xóa hạ tầng AWS:
```powershell
cd <duong-dan-repo>\terraform
$env:AWS_PROFILE="aws-real"
terraform destroy
```
