import { PutObjectCommandInput } from '@aws-sdk/client-s3';
import multer from 'multer';
import sharp from 'sharp';
import dotenv from 'dotenv';

dotenv.config();
export type MFile = Express.Multer.File;

export class FileService {
  private file: MFile;
  private buffer: Buffer<ArrayBufferLike>;
  private mimeType: string;
  private converted_buffer: Promise<Buffer<ArrayBufferLike>>;

  constructor(fileParams: MFile) {
    this.file = fileParams;
    this.buffer = this.file.buffer;
    this.converted_buffer = new Promise(resolve => resolve(this.buffer));
  }

  toWebp(quality = 100) {
    this.converted_buffer = sharp(this.buffer)
    .toFormat('webp')
    .withMetadata()
    .webp({quality}).toBuffer();

    this.mimeType = 'image/webp';
    return this;
  }

  resize(size: number = 1024) {
    this.converted_buffer = sharp(this.buffer)
      .resize(size, null, {withoutEnlargement: true, fit: 'inside'})
      .withMetadata()
      .toBuffer()

    return this;
  }

  getBytes() {
    return this.converted_buffer;
  }

  async uploadParams(params?: {
    directory?: string
  }) {
    return {
      Bucket: process.env.CF_BUCKET,
      Body: await this.converted_buffer,
      Key: params ? `${params.directory}/${this.file.originalname.split(".")[0]}.${this.mimeType.split("/")[1]}`: `${this.file.filename}.${this.mimeType}`,
      ContentType: this.mimeType
    } satisfies PutObjectCommandInput;
  }
}