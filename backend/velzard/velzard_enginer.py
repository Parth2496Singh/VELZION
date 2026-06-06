import os
import sys
import yaml

def generate_velzard_deployment():
    if not os.path.exists("velzion.yaml"):
        print("VELZARD ERROR: velzion.yaml not found in repository root.")
        sys.exit(1)

    with open("velzion.yaml", 'r') as f:
        config = yaml.safe_load(f)

    services = config.get("services", {})
    database_config = config.get("database", {})
    routes = config.get("routes", {})

    has_database = bool(database_config)
    
    compose = {
        "version": "3.8",
        "services": {},
        "networks": {"velzion-network": {"driver": "bridge"}},
        "volumes": {}
    }

    # 1. Stateful Production Database Provisioning
    if has_database:
        db_engine = database_config.get("engine", "postgres:16-alpine")
        compose["services"]["database"] = {
            "image": db_engine,
            "environment": [
                "POSTGRES_USER=velzion_prod",
                "POSTGRES_PASSWORD=secure_prod_password_123",
                "POSTGRES_DB=velzion_db"
            ],
            "volumes": ["db_data:/var/lib/postgresql/data"],
            "networks": ["velzion-network"]
        }
        compose["volumes"]["db_data"] = {}

    # 2. Strict Dockerfile Validation & Service Mapping
    for service_name, service_data in services.items():
        build_path = service_data.get("path", ".")
        
        # 🚨 THE VELZARD STRICT CHECK
        if not os.path.exists(os.path.join(build_path, "Dockerfile")):
            print(f"VELZARD FATAL ERROR: No Dockerfile found in '{build_path}' for '{service_name}'.")
            print("Velzard requires explicit Dockerfiles for production deployments.")
            sys.exit(1)

        service_entry = {
            "build": {"context": build_path},
            "networks": ["velzion-network"],
            "expose": [str(service_data.get("port", 80))],
            "environment": service_data.get("env", [])
        }

        # Auto-inject database credentials if 'needs: [database]' is declared
        if "needs" in service_data and "database" in service_data["needs"]:
            if has_database:
                service_entry["depends_on"] = ["database"]
                service_entry["environment"].append(
                    "DATABASE_URL=postgres://velzion_prod:secure_prod_password_123@database:5432/velzion_db"
                )

        compose["services"][service_name] = service_entry

    # 3. Nginx API Gateway for Production Routing
    compose["services"]["gateway"] = {
        "image": "nginx:alpine",
        "ports": ["80:80"],
        "volumes": ["./nginx.conf:/etc/nginx/conf.d/default.conf:ro"],
        "networks": ["velzion-network"],
        "depends_on": list(services.keys())
    }

    # 4. Generate the Nginx Routes
    nginx_conf = ["server {", "    listen 80;", ""]
    for route_path, target_service in routes.items():
        target_port = services.get(target_service, {}).get("port", 80)
        nginx_conf.append(f"    location {route_path} {{")
        nginx_conf.append(f"        proxy_pass http://{target_service}:{target_port};")
        nginx_conf.append("        proxy_set_header Host $host;")
        nginx_conf.append("        proxy_set_header X-Real-IP $remote_addr;")
        nginx_conf.append("    }\n")
    nginx_conf.append("}")

    # 5. Write Production Artifacts
    with open("docker-compose.yml", "w") as f:
        yaml.dump(compose, f, default_flow_style=False, sort_keys=False)
        
    with open("nginx.conf", "w") as f:
        f.write("\n".join(nginx_conf))

    print("Velzard artifacts compiled successfully. Ready for boot.")

if __name__ == "__main__":
    generate_velzard_deployment()