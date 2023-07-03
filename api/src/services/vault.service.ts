import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import vault, { client, type VaultOptions } from 'node-vault';

@Injectable()
export class VaultService {
  private readonly client: client;
  private readonly keyName: string;

  constructor(private readonly configService: ConfigService) {
    const options: VaultOptions = {
      endpoint: this.configService.get<string>('vaultEndpoint') ?? '',
      token: this.configService.get<string>('vaultToken') ?? '',
    };
    this.client = vault(options);
    this.keyName = this.configService.get<string>('vaultKeyName') ?? '';
  }

  async encrypt(plaintext: string): Promise<string> {
    const result = await this.client.encryptData({
      name: this.keyName,
      plaintext: Buffer.from(plaintext).toString('base64'),
    });
    return result.data.ciphertext;
  }

  async decrypt(ciphertext: string): Promise<string> {
    const result = await this.client.decryptData({
      name: this.keyName,
      ciphertext,
    });
    return Buffer.from(result.data.plaintext, 'base64').toString('utf-8');
  }
}
