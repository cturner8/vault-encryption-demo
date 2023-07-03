path "transit/keys/app_key" {
  capabilities = ["read"]
}

path "transit/rewrap/app_key" {
  capabilities = ["update"]
}

path "transit/encrypt/app_key" {
  capabilities = ["update"]
}