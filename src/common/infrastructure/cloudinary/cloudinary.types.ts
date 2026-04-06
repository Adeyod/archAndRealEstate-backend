import { MediaType } from '../../../modules/projects/schemas/project.schema';

export type CloudinaryResponse = {
  url: string;
  publicUrl: string;
  type: MediaType;
};
