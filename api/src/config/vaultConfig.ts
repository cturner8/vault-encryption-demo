export default () => ({
  vaultEndpoint: process.env.VAULT_ADDR,
  vaultToken: process.env.VAULT_APP_TOKEN,
  vaultKeyName: process.env.VAULT_KEY_NAME,
});
