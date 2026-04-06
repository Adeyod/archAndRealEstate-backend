import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Query,
  Res,
} from '@nestjs/common';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import type { Response } from 'express';
import { SuccessMessage } from '../../common/decorators/success-message.decorator';
import { ApiResponseDto } from '../../common/dto/api-response.dto';
import { LeadsService } from './leads.service';
import { LeadStatus } from './schemas/lead.schema';

@Controller('leads')
export class LeadsController {
  constructor(private leadsService: LeadsService) {}

  @Get('/ref')
  @SuccessMessage('Lead processed successfully.')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Lead processing endpoint.',
    description:
      'This is the endpoint that we use to process lead so as to know the person that refer the new user. After that we direct the user to the whatsapp of the admin.',
  })
  @ApiResponse({
    status: 200,
    description: 'Lead processed successfully.',
    type: ApiResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Bad request. Unable to process lead.',
  })
  @ApiResponse({
    status: 500,
    description: 'Internal server error',
  })
  async createLead(@Query('ref') ref: string, @Res() res: Response) {
    const status = LeadStatus.new;
    const lead = await this.leadsService.createLead(ref, status);
    const message = encodeURIComponent(
      `Hello, I came from your website. My code is ${lead.leadCode}`,
    );

    const whatsappUrl = `https://wa.me/2347036776378?text=${message}`;

    return res.redirect(whatsappUrl);
  }
}
