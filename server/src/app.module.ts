import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { AppController } from './app.controller';
import { AirtableModule } from './airtable/airtable.module';

@Module({
  imports: [AirtableModule, ConfigModule.forRoot()],
  controllers: [AppController],
})
export class AppModule {}
