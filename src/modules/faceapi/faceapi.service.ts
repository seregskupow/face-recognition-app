import '@tensorflow/tfjs-node';
import * as faceapi from 'face-api.js';

import { Injectable } from '@nestjs/common';
import { promisify } from 'util';
import { unlink } from 'fs';

import * as descriptorsJson from './descriptors/descriptors.json';

import {
  Box,
  FaceDetection,
  FaceMatch,
  FaceMatcher,
  LabeledFaceDescriptors,
  TinyFaceDetectorOptions,
  WithFaceDetection,
} from 'face-api.js';
import {
  AnchorPosition,
  IDrawTextFieldOptions,
} from 'face-api.js/build/commonjs/draw';

type FaceDetectionWithLandmarks = faceapi.WithFaceDescriptor<
  faceapi.WithFaceLandmarks<
    {
      detection: faceapi.FaceDetection;
    },
    faceapi.FaceLandmarks68
  >
>;

@Injectable()
export class FaceapiService {
  private _canvas: any;
  private removeFile: Promise<any> | any;
  private fetchedDescriptors: Array<faceapi.LabeledFaceDescriptors>;
  private faceMatcher: FaceMatcher;
  private faceDetectorOptions: TinyFaceDetectorOptions =
    new faceapi.TinyFaceDetectorOptions({ scoreThreshold: 0.5 });
  private boxColor = '#6d17cb';
  private drawLabelOptions: IDrawTextFieldOptions = {
    backgroundColor: this.boxColor,
    fontSize: 35,
  };

  constructor() {
    this.startUp();
    this.removeFile = promisify(unlink);
  }

  async startUp() {
    this._canvas = require('canvas');

    const { Canvas, Image, ImageData } = this._canvas;
    faceapi.env.monkeyPatch({ Canvas, Image, ImageData });

    Promise.all([
      //faceapi.nets.ssdMobilenetv1.loadFromDisk('./models'),
      faceapi.nets.tinyFaceDetector.loadFromDisk(process.cwd() + '/models'),
      faceapi.nets.faceLandmark68Net.loadFromDisk(process.cwd() + '/models'),
      faceapi.nets.faceRecognitionNet.loadFromDisk(process.cwd() + '/models'),
      (this.fetchedDescriptors = await this.fetchDescriptors(descriptorsJson)),
      (this.faceMatcher = new faceapi.FaceMatcher(
        this.fetchedDescriptors,
        0.9,
      )),
    ]).then(() => console.log('Models ready'));
  }

  get canvas() {
    return this._canvas;
  }

  async recogniseFaces(imagePath: string) {
    const image = await this.canvas.loadImage(imagePath);

    await this.removeFile(imagePath);

    const detections = await this.detectFaces(image);

    const recognisedFaces = detections.map((res) =>
      this.faceMatcher.findBestMatch(res.descriptor),
    );
    return this.drawFaces(detections, recognisedFaces, image);
  }

  private detectFaces(image: any) {
    return faceapi
      .detectAllFaces(image, this.faceDetectorOptions)
      .withFaceLandmarks()
      .withFaceDescriptors();
  }

  private drawFaces(
    detections: FaceDetectionWithLandmarks[],
    recognisedFaces: FaceMatch[],
    image: any,
  ) {
    const out = faceapi.createCanvasFromMedia(image) as any;
    for (let i = 0; i < detections.length; i++) {
      if (recognisedFaces[i].label === 'unknown') continue;
      const box: Box = new Box(detections[i].detection.box);
      const drawBox = new faceapi.draw.DrawBox(box, {
        label: recognisedFaces[i].label.split('(')[0],
        boxColor: this.boxColor,
        drawLabelOptions: this.drawLabelOptions,
        lineWidth: 6,
      });
      drawBox.draw(out);
    }
    return out.toBuffer('image/jpeg');
  }

  async fetchDescriptors(descriptors) {
    //console.log(descriptors[0]);
    const fetchedDescriptors: Array<LabeledFaceDescriptors> = [];
    await descriptors.map((item, index) => {
      const arr = [];
      for (let k = 0; k < item.descriptors.length; k++) {
        arr.push(new Float32Array(Object.keys(item.descriptors[k]).length));
      }
      for (let j = 0; j < item.descriptors.length; j++) {
        for (let i = 0; i < Object.keys(item.descriptors[j]).length; i++) {
          arr[j][i] = item.descriptors[j][i];
        }
      }
      fetchedDescriptors[index] = new faceapi.LabeledFaceDescriptors(
        item.label,
        arr,
      );
    });
    return fetchedDescriptors;
  }
}
