import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { JwtUser } from '../../../common/types/jwt-user.type';
import { CreateProjectDto } from '../dto/create-project.dto';
import { MediaType, Project, ProjectDocument } from '../schemas/project.schema';

@Injectable()
export class ProjectsRepository {
  constructor(
    @InjectModel(Project.name)
    private projectModel: Model<ProjectDocument>,
  ) {}

  async createProject(
    user: JwtUser,
    createProjectDto: CreateProjectDto,
  ): Promise<ProjectDocument | null> {
    const project = await new this.projectModel({
      ...createProjectDto,
      projectOwner: user.sub,
    }).save();

    return project;
  }

  async addMedia(
    projectId: string,
    media: {
      type: MediaType;
      url: string;
      publicUrl: string;
    }[],
  ) {
    const id = new Types.ObjectId(projectId);
    const project = await this.projectModel.findByIdAndUpdate(
      id,
      {
        $push: { media },
      },
      {
        new: true,
        runValidators: true,
      },
    );

    return project;
  }
}
