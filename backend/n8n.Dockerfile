# Stage 1: Grab the official Terraform image
FROM hashicorp/terraform:1.8.4 AS terraform_binary

FROM amazon/aws-cli:latest AS aws_cli_binary

# Stage 2: Inject it into the bleeding-edge n8n image
FROM docker.n8n.io/n8nio/n8n:latest

USER root

# Copy the binary directly from Stage 1. No package managers needed.
COPY --from=terraform_binary /bin/terraform /usr/local/bin/terraform

# Set permissions so the node user can execute it
RUN chmod +x /usr/local/bin/terraform

#Inject AWS CLI natively (Copies the entire embedded AWS ecosystem)
COPY --from=aws_cli_binary /usr/local/aws-cli/ /usr/local/aws-cli/
RUN ln -s /usr/local/aws-cli/v2/current/bin/aws /usr/local/bin/aws

# Bake the Terraform IaC code directly into the production image!
# This removes the need for local volume mounts.
COPY ./terraform /home/node/terraform

USER node