import { CompleteMultipartUploadCommandOutput, ListBucketsCommand, S3Client} from '@aws-sdk/client-s3';
import {Upload} from '@aws-sdk/lib-storage';
import dotenv from 'dotenv';
import multer from 'multer';
import { FileService } from './file-service';
import { InsertItemImageReturn, InsertItemReturn, ItemsCategory, NewItem, NewItemImage } from '../db/types';
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
  SUCCESS_IMAGE_CLOUD_UPLOAD: "Successfully uploaded the images!",
  SUCCESS_IMAGE_DB_UPLOAD: "Successfully inserted the images to the database!",
  ERROR_IMAGE_CLOUD_UPLOAD: "There was an error uploading an image!",
  ERROR_IMAGE_DB_UPLOAD: "There was an error uploading an image to the database!",
  SUCCESS_ITEM_UPLOAD: "Successfully inserted item into the database!",
  ERROR_ITEM_UPLOAD: "There was an error inserting item into the database!"
}
export class ItemImagesService {

  static async uploadObjectCommand(files: Express.Multer.File[], directory?: string): Promise<null | CompleteMultipartUploadCommandOutput[]> {
    
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

      LogsService.log(ITEMS_SERVICE_LOGS.SUCCESS_IMAGE_CLOUD_UPLOAD);
      return uploads;
    } catch (error) {
      LogsService.error(error);
      return null;
    }
  }

  static async convertR2UploadOutputToNewItemImages(
    uploadOutput: CompleteMultipartUploadCommandOutput[], 
    item_id: number,
    item_owner_id: number,
  ): Promise<NewItemImage[] | null> {
    try {
      const newItemImages: Array<NewItemImage> = uploadOutput.map(output => {

        if(!output.Key || !output.Location) {
          throw new Error("Missing output data!");
        }

        return {
          image_relative_path: output.Key,
          item_id: item_id,
          image_owner_id: item_owner_id,
          metadata: JSON.stringify({
            lastModifiedDate: new Date().toISOString(),
            name: output.Key.split("/")[output.Key.split("/").length - 1].split(".")[0]
          })
        }
      });

      return newItemImages;
    } catch(error) {
      LogsService.error(error);
      return null;
    }
  }

  static async uploadItemImagesToDatabase(newItemImages: NewItemImage[]): Promise<null | InsertItemImageReturn[]> {
    try {
      const resultItemImages = await db.insertInto("item_image_table")
        .values(newItemImages)
        .returningAll()
        .execute();

      LogsService.log(ITEMS_SERVICE_LOGS.SUCCESS_IMAGE_DB_UPLOAD);

      return resultItemImages;
    } catch (error) {
      LogsService.error(ITEMS_SERVICE_LOGS.ERROR_IMAGE_DB_UPLOAD);
      console.error(error);
      return null;
    }
  }
}

export class ItemsService {

  static async uploadItemToDatabase(newItem: NewItem): Promise<null | InsertItemReturn> {
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
      return null;
    }
  }
}