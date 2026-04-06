import {
  Controller,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';
import type { Request } from 'express';
import { GetCurrentUser } from '../../common/decorators/get-current-user.decorator';
import { Roles } from '../../common/decorators/roles.decorator';
import { SuccessMessage } from '../../common/decorators/success-message.decorator';
import { ApiResponseDto } from '../../common/dto/api-response.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import type { JwtUser } from '../../common/types/jwt-user.type';
import { ProjectType } from '../projects/schemas/project.schema';
import { Role } from '../users/schemas/user.schema';
import { PaymentsService } from './payments.service';
import { PaymentProvider } from './schemas/payment.schema';

@Controller('payments')
export class PaymentsController {
  constructor(private paymentsService: PaymentsService) {}
  @Post('create-payment-intent/:provider/:plan')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.user)
  @ApiBearerAuth('JWT-auth')
  @SuccessMessage('Payment intent successfully created.')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: 'User creates payment intent',
    description:
      'This is the endpoint to be called when user clicks on button to make payment. This endpoint returns with payment processor URL for user to make the payment.',
  })
  @ApiResponse({
    status: 201,
    description: 'Payment intent successfully created.',
    type: ApiResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Bad request. Unable to create payment intent.',
  })
  @ApiResponse({
    status: 500,
    description: 'Internal server error',
  })
  async createPaymentIntent(
    @Param('provider') provider: PaymentProvider,
    @Param('projectType') projectType: ProjectType,
    @Param('amountToPay') amountToPay: number,
    @GetCurrentUser() user: JwtUser,
  ) {
    console.log('user._id:', user.sub);
    console.log('user:', user);
    return await this.paymentsService.createPaymentIntent(
      provider,
      projectType,
      user,
      amountToPay,
    );
  }

  @Post('webhook/:provider')
  @HttpCode(HttpStatus.OK)
  async handleWebhook(
    @Param('provider') provider: PaymentProvider,
    @Req() req: Request,
  ) {
    // console.log('Body:', req.body);
    return await this.paymentsService.handleWebhook(provider, req);
  }
}
