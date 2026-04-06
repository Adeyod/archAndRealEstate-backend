import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  v2 as cloudinary,
  UploadApiOptions,
  UploadApiResponse,
} from 'cloudinary';
import { MediaType } from '../../../modules/projects/schemas/project.schema';
import { CloudinaryResponse } from './cloudinary.types';

@Injectable()
export class CloudinaryService {
  constructor(private configService: ConfigService) {
    cloudinary.config({
      cloud_name: this.configService.getOrThrow<string>('CLOUD_NAME'),
      api_key: this.configService.getOrThrow<string>('CLOUDINARY_API_KEY'),
      api_secret: this.configService.getOrThrow<string>(
        'CLOUDINARY_API_SECRET',
      ),
    });
  }

  private uploadToCloudinary(
    file: Express.Multer.File,
    folder: string,
  ): Promise<CloudinaryResponse> {
    return new Promise((resolve, reject) => {
      const options: UploadApiOptions = {
        resource_type: 'auto',
        folder,
      };

      const stream = cloudinary.uploader.upload_stream(
        options,
        (error: any, result: UploadApiResponse | undefined) => {
          if (error) {
            return reject(
              new Error(`Cloudinary upload error: ${error.message || error}`),
            );
          }

          if (!result) {
            return reject(new Error('Upload failed.'));
          }

          resolve({
            url: result.secure_url,
            publicUrl: result.public_id,
            type: result.secure_url.includes('video')
              ? MediaType.video
              : MediaType.image,
          });
        },
      );

      stream.end(file.buffer);
    });
  }

  async uploadSingle(
    file: Express.Multer.File,
    folder: 'Kay-Brooks',
  ): Promise<CloudinaryResponse> {
    const result = await this.uploadToCloudinary(file, folder);
    return result;
  }

  async uploadMany(
    files: Express.Multer.File[],
    folder: 'Kay-Brooks',
  ): Promise<CloudinaryResponse[]> {
    const uploads = files.map((file) => this.uploadToCloudinary(file, folder));
    return Promise.all(uploads);
  }

  private async deleteSingle(publicId: string) {
    return cloudinary.uploader.destroy(publicId);
  }

  private async deleteMultiple(publicIds: string[]) {
    const deletions = publicIds.map((id) => cloudinary.uploader.destroy(id));
    return Promise.all(deletions);
  }

  async delete(publicIds: string | string[]) {
    if (Array.isArray(publicIds)) {
      return this.deleteMultiple(publicIds);
    }

    return this.deleteSingle(publicIds);
  }
}
