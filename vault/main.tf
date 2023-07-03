terraform {
  required_providers {
    vault = {
      source  = "hashicorp/vault"
      version = "~> 3.17.0"
    }
  }
}

provider "vault" {}

resource "vault_policy" "admin" {
  name = "admin"

  policy = file("./policies/admin-policy.hcl")
}

resource "vault_policy" "app" {
  name = "app"

  policy = file("./policies/app-policy.hcl")
}

resource "vault_mount" "transit" {
  path = "transit"
  type = "transit"
}

resource "vault_transit_secret_backend_key" "app_key" {
  backend = vault_mount.transit.path
  name    = "app_key"
}

resource "vault_token" "app_token" {
  policies = ["app"]
}

output "app_client_token" {
  value     = vault_token.app_token.client_token
  sensitive = true
}
