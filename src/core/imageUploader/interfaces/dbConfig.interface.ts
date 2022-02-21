export interface ICloudinaryConfigAttributes {
  cloud_name: string;
  api_key: string;
  api_secret: string;
  secure: boolean;
}

export interface ICloudinaryConfig {
  development: ICloudinaryConfigAttributes;
  test: ICloudinaryConfigAttributes;
  production: ICloudinaryConfigAttributes;
}
