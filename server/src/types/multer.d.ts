declare module "multer" {
  import { RequestHandler } from "express";

  interface File {
    fieldname: string;
    originalname: string;
    encoding: string;
    mimetype: string;
    size: number;
    buffer: Buffer;
  }

  interface Options {
    storage?: any;
    limits?: {
      fileSize?: number;
      files?: number;
      fields?: number;
    };
    fileFilter?: (
      req: any,
      file: File,
      cb: (error: Error | null, acceptFile?: boolean) => void
    ) => void;
  }

  interface Multer {
    single(fieldname: string): RequestHandler;
    array(fieldname: string, maxCount?: number): RequestHandler;
    none(): RequestHandler;
  }

  function multer(options?: Options): Multer;

  namespace multer {
    function memoryStorage(): any;
    function diskStorage(opts: any): any;
  }

  export = multer;
}
