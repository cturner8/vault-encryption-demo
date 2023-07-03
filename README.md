# Vault Encryption Demo

Demo application for utilising [Hashicorp Vault](https://www.vaultproject.io/) for encryption.

## Technologies Used

- [Node JS](https://nodejs.org/en)
- [TypeScript](https://www.typescriptlang.org/)
- [Nest JS](https://nestjs.com/)
- [Prisma](https://www.prisma.io/)
- [Vault](https://www.vaultproject.io/)
- [Terraform](https://www.terraform.io/)
- [Docker](https://www.docker.com/)
- [VS Code Dev Containers](https://code.visualstudio.com/docs/devcontainers/containers)

## Required Environment Variables

- `JWT_SECRET`: a random secret value used for signing the JWT's issued by the api.
- `JWT_EXPIRY`: how long the issued JWT's should last. e.g. `"30m"` for 30 minutes.
- `JWT_ISSUER`: used to populate the `iss` claim of generated JWT's. e.g. `http://localhost:7777`
- `JWT_AUDIENCE`: used to populate the `aud` claim of generated JWT's. e.g. `http://localhost:7777`
- `VAULT_APP_TOKEN`: the token output from terraform after deploying the vault resources.
- `VAULT_KEY_NAME`: name of the transit key for the application to use for encryption/decryption. this should align with the name of the transit key in the terraform configuration file [main.tf](./vault/main.tf)

## Running the application locally

1. Open the repo in VS Code
2. Use the "Reopen in container" command from the Dev containers extension
3. Once the container is built, run `yarn` from the project root.
4. Initialise the SQLite DB: `sqlite3 db/prisma/dev.db "VACUUM;"`.
5. Initialise prisma: `yarn generate --cwd db`.
6. Change directory into the `vault` folder from the terminal.
7. Run `terraform init` to initialise terraform.
8. Run `terraform plan -out tfplan` to create a terrform plan file.
9. Run `terraform apply tfplan` to apply the generated plan file and create the required vault resources.
10. Run `terraform output app_client_token` to print out the generated app token for vault.
11. In the API folder, copy the `.env.example` file and rename to `.env.development`, populating the required environment variables with values.
12. Run the API in watch mode: `yarn dev --cwd api`.
