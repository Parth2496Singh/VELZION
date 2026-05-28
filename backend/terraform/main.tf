variable "repo_url" {
  description = "The GitHub repository to clone and build"
  type        = string
}

variable "pr_number" {
  description = "The PR number being deployed"
  type        = string
}

provider "aws" {
  region = "us-east-1"
}

resource "aws_security_group" "zegion_sg" {
  name        = "zegion_preview_sg_${var.pr_number}"
  description = "Allow HTTP and SSH inbound for PR preview"
}

# Web Traffic Rule
resource "aws_vpc_security_group_ingress_rule" "allow_http_ipv4" {
  security_group_id = aws_security_group.zegion_sg.id
  cidr_ipv4         = "0.0.0.0/0"
  from_port         = 80
  ip_protocol       = "tcp"
  to_port           = 80
  description       = "Anyone can access"
}

# SSH Lifeline Rule
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

resource "aws_spot_instance_request" "zegion_preview" {
  ami                    = "ami-04b70fa74e45c3917" # Ubuntu 24.04 LTS
  instance_type          = "t3.micro"
  spot_price             = "0.01"
  wait_for_fulfillment   = true
  vpc_security_group_ids = [aws_security_group.zegion_sg.id]

  # CRITICAL FIX: Expand the hard drive from 8GB to 20GB so Docker has room to breathe
  root_block_device {
    volume_size = 20
    volume_type = "gp3" # gp3 is faster and cheaper than the older gp2
  }

  user_data = <<-EOF
  #!/bin/bash
  # 0. Force all logs to the AWS Console for debugging
  exec > >(tee /var/log/user-data.log|logger -t user-data -s 2>/dev/console) 2>&1
  
  export HOME=/root
  
  # 1. Clean out old distribution docker engines if they exist
  apt-get remove -y docker.io docker-doc docker-compose docker-compose-v2 podman-docker containerd runc || true
  apt-get autoremove -y || true

  # 2. Update and install repository prerequisites
  apt-get update -y
  apt-get install -y ca-certificates curl gnupg git

  # 3. Add official Docker GPG archive keyrings
  install -m 0755 -d /etc/apt/keyrings
  rm -f /etc/apt/keyrings/docker.gpg
  curl -fsSL https://download.docker.com/linux/ubuntu/gpg | gpg --batch --yes --dearmor -o /etc/apt/keyrings/docker.gpg
  chmod a+r /etc/apt/keyrings/docker.gpg

  # 4. Set up the stable official repository path
  echo "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/ubuntu \
  $(. /etc/os-release && echo "$VERSION_CODENAME") stable" | tee /etc/apt/sources.list.d/docker.list > /dev/null

  # 5. Install the official production Docker Engine suite
  apt-get update -y
  apt-get install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin

  # 6. Verify and boot the service daemon
  systemctl enable docker
  systemctl start docker
  usermod -aG docker ubuntu
              
  # 7. Install the absolute latest CNCF Pack CLI (v0.40.6) - Great catch!
  curl -sSL "https://github.com/buildpacks/pack/releases/download/v0.40.6/pack-v0.40.6-linux.tgz" | tar -C /usr/local/bin/ --no-same-owner -xzv pack
              
  # 8. Clone the target repo and isolate the workspace
  git clone ${var.repo_url} /app
  cd /app
              
  # 9. Fetch the exact Pull Request code dynamically
  git fetch origin pull/${var.pr_number}/head:pr-preview
  git checkout pr-preview

  # 10. Compile into an OCI container image dynamically
  pack build zegion-app --builder paketobuildpacks/builder-jammy-base
              
  # 11. Run the compiled application architecture on port 80
  docker run -d -p 80:8080 zegion-app
  EOF
}

output "instance_id" {
  value = aws_spot_instance_request.zegion_preview.spot_instance_id
}

output "public_ip" {
  value = aws_spot_instance_request.zegion_preview.public_ip
}