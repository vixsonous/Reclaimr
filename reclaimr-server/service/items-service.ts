import { ListBucketsCommand, S3Client} from '@aws-sdk/client-s3';
import {Upload} from '@aws-sdk/lib-storage';
import dotenv from 'dotenv';
import multer from 'multer';
import { FileService } from './file-service';

dotenv.config();

const s3 = new S3Client({
  region: 'auto',
  endpoint: `https://${process.env.CF_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: process.env.CF_ACCESS_KEY || '',
    secretAccessKey: process.env.CF_SECRET_ACCESS_KEY || ''
  }
})
export class ItemsService {

  static async uploadObjectCommand(files: Express.Multer.File[], directory?: string) {
    
    const uploads = await Promise.allSettled(files.map(async f => new Upload({
      client: s3,
      params: await new FileService(f)
      .toWebp(85)
      .resize()
      .uploadParams(directory ? {directory: directory} : undefined)
    }).done())).then(uploadResult => {
      return uploadResult.map(res => {
        if(res.status === 'fulfilled') {
          return res.value;
        }
      });
    });

    console.log(uploads);
  }

  
}