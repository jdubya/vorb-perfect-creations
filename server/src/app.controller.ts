import { Controller, Get } from '@nestjs/common';
import { AirtableService } from './airtable/airtable.service';

@Controller()
export class AppController {
  constructor(private readonly airtableService: AirtableService) {}

  @Get('stats')
  getStats() {
    return this.airtableService.getStats();
  }
}
