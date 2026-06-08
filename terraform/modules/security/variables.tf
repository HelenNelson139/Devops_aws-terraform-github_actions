variable "project_name" {
  description = "Project name used for resource naming."
  type        = string
}

variable "vpc_id" {
  description = "VPC ID for the security groups."
  type        = string
}

variable "vpc_cidr" {
  description = "CIDR block of the VPC, used for internal DNS egress rules."
  type        = string
}

variable "allowed_ssh_cidr" {
  description = "CIDR allowed to SSH to the public EC2 instance."
  type        = string
}
