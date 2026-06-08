data "aws_ami" "amazon_linux" {
  most_recent = true
  owners      = ["amazon"]

  filter {
    name   = "name"
    values = ["al2023-ami-*-x86_64"]
  }

  filter {
    name   = "virtualization-type"
    values = ["hvm"]
  }
}

resource "aws_instance" "public" {
  #checkov:skip=CKV2_AWS_41: AWS Academy lab does not allow creating or attaching custom IAM instance profiles.
  ami                         = data.aws_ami.amazon_linux.id
  ebs_optimized               = true
  instance_type               = var.instance_type
  key_name                    = var.key_name
  monitoring                  = true
  subnet_id                   = var.public_subnet_id
  vpc_security_group_ids      = [var.public_security_group_id]
  associate_public_ip_address = false

  metadata_options {
    http_endpoint = "enabled"
    http_tokens   = "required"
  }

  root_block_device {
    encrypted             = true
    delete_on_termination = true
  }

  tags = {
    Name = "${var.project_name}-public-ec2"
  }
}

resource "aws_instance" "private" {
  #checkov:skip=CKV2_AWS_41: AWS Academy lab does not allow creating or attaching custom IAM instance profiles.
  ami                         = data.aws_ami.amazon_linux.id
  ebs_optimized               = true
  instance_type               = var.instance_type
  key_name                    = var.key_name
  monitoring                  = true
  subnet_id                   = var.private_subnet_id
  vpc_security_group_ids      = [var.private_security_group_id]
  associate_public_ip_address = false

  metadata_options {
    http_endpoint = "enabled"
    http_tokens   = "required"
  }

  root_block_device {
    encrypted             = true
    delete_on_termination = true
  }

  tags = {
    Name = "${var.project_name}-private-ec2"
  }
}
resource "aws_ec2_instance_state" "public" {
  instance_id = aws_instance.public.id
  state       = "running"
}

resource "aws_ec2_instance_state" "private" {
  instance_id = aws_instance.private.id
  state       = "running"
}
resource "aws_eip" "public" {
  domain = "vpc"

  tags = {
    Name = "${var.project_name}-public-ec2-eip"
  }
}

resource "aws_eip_association" "public" {
  allocation_id = aws_eip.public.id
  instance_id   = aws_instance.public.id

  depends_on = [aws_ec2_instance_state.public]
}
