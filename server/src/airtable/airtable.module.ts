import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AirtableService } from './airtable.service';

@Module({
  providers: [AirtableService],
  imports: [ConfigModule],
  exports: [AirtableService],
})
export class AirtableModule {}
