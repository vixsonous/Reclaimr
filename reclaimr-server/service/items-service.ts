import { CompleteMultipartUploadCommandOutput, ListBucketsCommand, S3Client} from '@aws-sdk/client-s3';
import {Upload} from '@aws-sdk/lib-storage';
import dotenv from 'dotenv';
import multer from 'multer';
import { FileService } from './file-service';
import { InsertItemReturn, ItemsCategory, NewItem, NewItemImage } from '../db/types';
import { LogsService } from './logs-service';
import { db } from '../db/database';

dotenv.config();

const s3 = new S3Client({
  region: 'auto',
  endpoint: `https://${process.env.CF_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: process.env.CF_ACCESS_KEY || '',
    secretAccessKey: process.env.CF_SECRET_ACCESS_KEY || ''
  }
});



export const ITEMS_SERVICE_LOGS = {
  SUCCESS_IMAGE_UPLOAD: "Successfully uploaded the images!",
  ERROR_IMAGE_UPLOAD: "There was an error uploading an image!",
  SUCCESS_ITEM_UPLOAD: "Successfully inserted item into the database!",
  ERROR_ITEM_UPLOAD: "There was an error inserting item into the database!"
}
export class ItemsService {

  static async uploadObjectCommand(files: Express.Multer.File[], directory?: string): Promise<boolean | CompleteMultipartUploadCommandOutput[]> {
    
    try {
      const uploads = await Promise.all(files.map(async f => new Upload({
        client: s3,
        params: await new FileService(f)
        .toWebp(85)
        .uploadParams(directory ? {directory: directory} : undefined)
      }).done())).then(uploadResult => {
        return uploadResult.map(res => {
          return res
        });
      });

      LogsService.log(ITEMS_SERVICE_LOGS.SUCCESS_IMAGE_UPLOAD);
      console.log(uploads);
      return uploads;
    } catch (error) {
      LogsService.error(error);
      return false;
    }
  }

  
}

export class ItemsDatabaseService {
  static async convertR2UploadOutputToNewItemImages(
    uploadOutput: CompleteMultipartUploadCommandOutput[], 
    item_id: number,
    item_owner_id: number,
  ): Promise<NewItemImage[] | boolean> {
    try {
      const newItemImages: Array<NewItemImage> = uploadOutput.map(output => {

        if(!output.Key || !output.Location) {
          throw new Error("Missing output data!");
        }

        return {
          image_relative_path: output.Key,
          image_url: output.Location,
          item_id: item_id,
          image_owner_id: item_owner_id,
          metadata: JSON.stringify({
            lastModifiedDate: new Date().toISOString()
          })
        }
      });

      return newItemImages;
    } catch(error) {
      LogsService.error(error);
      return false;
    }
  }

  static async uploadItemToDatabase(newItem: NewItem): Promise<boolean | InsertItemReturn> {
    try {
      const resultItem = await db.insertInto("item_table")
        .values(newItem)
        .returningAll()
        .executeTakeFirstOrThrow();
      
      LogsService.info(ITEMS_SERVICE_LOGS.SUCCESS_ITEM_UPLOAD);
      return resultItem;
    } catch(error) {
      console.log(error);
      LogsService.error(error);
      return false;
    }
  }
}