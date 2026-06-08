resource "aws_security_group" "public_ec2" {
  #checkov:skip=CKV2_AWS_5: Attached to the public EC2 instance in the compute module through module output.
  name        = "${var.project_name}-public-ec2-sg"
  description = "Allow SSH to public EC2 from the configured CIDR."
  vpc_id      = var.vpc_id

  ingress {
    description = "SSH from configured client CIDR"
    from_port   = 22
    to_port     = 22
    protocol    = "tcp"
    cidr_blocks = [var.allowed_ssh_cidr]
  }

  egress {
    description = "HTTPS outbound for package updates and SSM"
    from_port   = 443
    to_port     = 443
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  egress {
    description = "DNS UDP to VPC resolver"
    from_port   = 53
    to_port     = 53
    protocol    = "udp"
    cidr_blocks = [var.vpc_cidr]
  }

  egress {
    description = "DNS TCP to VPC resolver"
    from_port   = 53
    to_port     = 53
    protocol    = "tcp"
    cidr_blocks = [var.vpc_cidr]
  }

  tags = {
    Name = "${var.project_name}-public-ec2-sg"
  }
}

resource "aws_security_group" "private_ec2" {
  #checkov:skip=CKV2_AWS_5: Attached to the private EC2 instance in the compute module through module output.
  name        = "${var.project_name}-private-ec2-sg"
  description = "Allow SSH to private EC2 only from the public EC2 security group."
  vpc_id      = var.vpc_id

  ingress {
    description     = "SSH from public EC2 security group"
    from_port       = 22
    to_port         = 22
    protocol        = "tcp"
    security_groups = [aws_security_group.public_ec2.id]
  }

  egress {
    description = "HTTPS outbound through NAT for package updates and SSM"
    from_port   = 443
    to_port     = 443
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  egress {
    description = "DNS UDP to VPC resolver"
    from_port   = 53
    to_port     = 53
    protocol    = "udp"
    cidr_blocks = [var.vpc_cidr]
  }

  egress {
    description = "DNS TCP to VPC resolver"
    from_port   = 53
    to_port     = 53
    protocol    = "tcp"
    cidr_blocks = [var.vpc_cidr]
  }

  tags = {
    Name = "${var.project_name}-private-ec2-sg"
  }
}
