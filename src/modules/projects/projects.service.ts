import { Injectable } from '@nestjs/common';
import { CloudinaryService } from '../../common/infrastructure/cloudinary/cloudinary.service';
import { JwtUser } from '../../common/types/jwt-user.type';
import { CreateProjectDto } from './dto/create-project.dto';
import { ProjectsRepository } from './repositories/project.repository';

@Injectable()
export class ProjectsService {
  constructor(
    private projectsRepository: ProjectsRepository,
    private cloudinaryService: CloudinaryService,
  ) {}

  async createProject(user: JwtUser, createProjectDto: CreateProjectDto) {
    return await this.projectsRepository.createProject(user, createProjectDto);
  }

  async addMedia(projectId: string, files: Express.Multer.File[]) {
    const uploads = await this.cloudinaryService.uploadMany(
      files,
      'Kay-Brooks',
    );
    return await this.projectsRepository.addMedia(projectId, uploads);
  }
}
