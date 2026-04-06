import {
  Controller,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Put,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { memoryStorage } from 'multer';
import { Roles } from '../../common/decorators/roles.decorator';
import { SuccessMessage } from '../../common/decorators/success-message.decorator';
import { ApiResponseDto } from '../../common/dto/api-response.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Role } from '../users/schemas/user.schema';
import { ProjectsService } from './projects.service';

@Controller('projects')
export class ProjectsController {
  constructor(private projectsService: ProjectsService) {}

  @Post('create-project/:projectOwnerId/:projectType')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.admin)
  @ApiBearerAuth('JWT-auth')
  @SuccessMessage('Project created successfully.')
  @HttpCode(HttpStatus.CREATED)
  @Put('add-media/:projectId/media')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.admin)
  @ApiBearerAuth('JWT-auth')
  @UseInterceptors(
    FilesInterceptor('files', 4, {
      storage: memoryStorage(),
    }),
  )
  @SuccessMessage('Media file uploaded successfully.')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Admin upload media.',
    description:
      'This is the endpoint that admin will use to add image or video to an existing project.',
  })
  @ApiResponse({
    status: 200,
    description: 'Media file uploaded successfully.',
    type: ApiResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Bad request. Unable to add media to project.',
  })
  @ApiResponse({
    status: 500,
    description: 'Internal server error',
  })
  async addMedia(
    @Param('projectId') projectId: string,
    @UploadedFiles() files: Express.Multer.File[],
  ) {
    return await this.projectsService.addMedia(projectId, files);
  }
}
