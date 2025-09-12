import { Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  async onModuleInit() {
    console.log('🗄️ Connecting to database...');
    await this.$connect();
    console.log('✅ Database connected successfully!');
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }
}
