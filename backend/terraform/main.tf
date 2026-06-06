variable "repo_url" {
  description = "The GitHub repository to clone and build"
  type        = string
}

variable "pr_number" {
  description = "The PR number being deployed"
  type        = string
}

# 100% KEYLESS PROVIDER
provider "aws" {
  region = "us-east-1"
  # Terraform will automatically pull credentials from ~/.aws/credentials (locally)
  # or the attached IAM Role (when running on EC2).
}

resource "aws_security_group" "zegion_sg" {
  name        = "zegion_preview_sg_${var.pr_number}"
  description = "Allow HTTP and SSH inbound for PR preview"
}

resource "aws_vpc_security_group_ingress_rule" "allow_http_ipv4" {
  security_group_id = aws_security_group.zegion_sg.id
  cidr_ipv4         = "0.0.0.0/0"
  from_port         = 80
  ip_protocol       = "tcp"
  to_port           = 80
  description       = "Anyone can access"
}

resource "aws_vpc_security_group_ingress_rule" "allow_ssh_ipv4" {
  security_group_id = aws_security_group.zegion_sg.id
  cidr_ipv4         = "0.0.0.0/0"
  from_port         = 22
  ip_protocol       = "tcp"
  to_port           = 22
  description       = "Emergency SSH access"
}

resource "aws_vpc_security_group_egress_rule" "allow_all_traffic_ipv4" {
  security_group_id = aws_security_group.zegion_sg.id
  cidr_ipv4         = "0.0.0.0/0"
  ip_protocol       = "-1" 
  description       = "EC2 can connect to the whole world to download code"
}

# SPOT INSTANCES!
resource "aws_spot_instance_request" "zegion_preview" {
  ami                    = "ami-04b70fa74e45c3917" # Ubuntu 24.04 LTS
  instance_type          = "t3.micro"
  spot_price             = "0.01"
  wait_for_fulfillment   = true
  vpc_security_group_ids = [aws_security_group.zegion_sg.id]

  # 🔥 THE OPTIMIZED ZEGION STATE-MACHINE UPGRADES 🔥
  spot_type                      = "persistent"
  instance_interruption_behavior = "stop"

  root_block_device {
    volume_size = 20
    volume_type = "gp3" 
  }

  user_data = <<-EOF
              #!/bin/bash 
              exec > >(tee /var/log/user-data.log|logger -t user-data -s 2>/dev/console) 2>&1
              export HOME=/root
              
              apt-get remove -y docker.io docker-doc docker-compose docker-compose-v2 podman-docker containerd runc || true
              apt-get autoremove -y || true

              apt-get update -y
              apt-get install -y ca-certificates curl gnupg git

              install -m 0755 -d /etc/apt/keyrings
              rm -f /etc/apt/keyrings/docker.gpg
              curl -fsSL https://download.docker.com/linux/ubuntu/gpg | gpg --batch --yes --dearmor -o /etc/apt/keyrings/docker.gpg
              chmod a+r /etc/apt/keyrings/docker.gpg

              echo "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/ubuntu \
              $(. /etc/os-release && echo "$VERSION_CODENAME") stable" | tee /etc/apt/sources.list.d/docker.list > /dev/null

              apt-get update -y
              apt-get install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin

              systemctl enable docker
              systemctl start docker
              usermod -aG docker ubuntu
                              
              curl -sSL "https://github.com/buildpacks/pack/releases/download/v0.40.6/pack-v0.40.6-linux.tgz" | tar -C /usr/local/bin/ --no-same-owner -xzv pack
                              
              git clone ${var.repo_url} /app
              cd /app
                              
              git fetch origin pull/${var.pr_number}/head:pr-preview
              git checkout pr-preview

              pack build zegion-app --builder paketobuildpacks/builder-jammy-base
                              
              docker run -d -p 80:8080 --name zegion-web --restart unless-stopped zegion-app
              # This fires the exact millisecond the build finishes to trigger auto-hibernation.
              curl -X POST http://54.86.145.100/api/webhooks/github/ \
                -H "x-velzion-secret: L0JFLBRiyyWiCatJeju2IHXOm-yQUFuhSzjflv8q_a8SgeDP9SoKNeRmyE_xyCre5lZ0TpREAdxbK37q84IjfA" \
                -H "Content-Type: application/json" \
                -d '{"repo_url": "'"${var.repo_url}"'", "pr_number": "'"${var.pr_number}"'", "status": "BUILT"}'
              EOF
}

output "instance_id" {
  value = aws_spot_instance_request.zegion_preview.spot_instance_id
}

output "public_ip" {
  value = aws_spot_instance_request.zegion_preview.public_ip
}