import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RefreshToken } from '../entities/refresh-token.entity';

@Injectable()
export class RefreshTokenRepository {
  constructor(
    @InjectRepository(RefreshToken)
    private readonly repo: Repository<RefreshToken>,
  ) {}

  save(token: Partial<RefreshToken>): Promise<RefreshToken> {
    return this.repo.save(token);
  }

  findByTokenHash(tokenHash: string): Promise<RefreshToken | null> {
    return this.repo.findOne({
      where: { tokenHash },
      relations: ['user', 'user.role'],
    });
  }

  async revokeByTokenHash(tokenHash: string): Promise<void> {
    await this.repo.update({ tokenHash }, { isRevoked: true });
  }

  async revokeAllByUserId(userId: number): Promise<void> {
    await this.repo
      .createQueryBuilder()
      .update()
      .set({ isRevoked: true })
      .where('user_id = :userId', { userId })
      .execute();
  }

  async deleteExpiredTokens(): Promise<void> {
    await this.repo
      .createQueryBuilder()
      .delete()
      .where('expires_at < NOW()')
      .execute();
  }
}
