const canvas = require('canvas');
const fs = require('fs');
const config = require('config');
const fetch = require('node-fetch');
const faceapi = require('face-api.js');
const { Canvas, Image, ImageData } = canvas;
faceapi.env.monkeyPatch({ fetch: fetch, Canvas, Image, ImageData });

const { logger } = require('../utils/logger');
const upload = require('../core/multer');

const labels = require('../labels/labels.json');
const descriptors2 = require('../descriptors/descriptors.json');

class RecognitionController {
  constructor() {
    this.fetchedDescriptors = null;

    this.loadModels = this.loadModels.bind(this);
    this.processImage = this.processImage.bind(this);
    this.loadLabeledImages = this.loadLabeledImages.bind(this);
    this.trainModels = this.trainModels.bind(this);

    this.loadModels();
  }
  async loadModels() {
    try {
      Promise.all([
        faceapi.nets.faceRecognitionNet.loadFromDisk('./models'),
        faceapi.nets.faceLandmark68Net.loadFromDisk('./models'),
        faceapi.nets.ssdMobilenetv1.loadFromDisk('./models'),
        (this.fetchedDescriptors = await this.FetchDescriptors(descriptors2)),
      ]).then(logger.success('Models ready'));
    } catch (e) {
      logger.error(e);
    }
  }

  async processImage(req, res) {
    try {
      await upload(req, res, (err) => {
        if (err || !req.file) {
          logger.error('Error while uploading', err);
          return res.status(400).json({ msg: 'Something went wrong' });
        }
        logger.pending('Uploaded filename: ', req.file.filename);
        fs.readFile(`./uploads/${req.file.filename}`, async (err, img) => {
          if (err) {
            logger.error('error while reading image', err.message);
            return res
              .status(400)
              .json({ message: 'error while reading image' });
          }
          const canvasSize = {
            width: 1920,
            height: 1080,
            imgWidth: 1920,
            imgHeight: 1080,
          };
          //JSON.parse(req.body.displaySize);
          console.log({ canvasSize });
          let imgProportion = canvasSize.imgWidth / canvasSize.imgHeight;
          let finalWidth = 1920,
            finalHeight = 1080;
          console.log({ finalWidth });
          logger.action('Start recognition process');
          let canvas2 = canvas.createCanvas(finalWidth, finalHeight);
          let ctx = canvas2.getContext('2d');
          canvas.loadImage(img).then((image) => {
            ctx.drawImage(
              image,
              finalWidth / 2 - finalWidth / 2,
              0,
              finalWidth,
              finalHeight
            );
          });
          const image = await canvas.loadImage(img);
          const displaySize = {
            width: canvasSize.width,
            height: canvasSize.height,
          };
          logger.log('Image info: ');
          logger.log({
            image,
            size: displaySize,
          });
          const displaySizeLocal = {
            width: finalWidth,
            height: finalHeight,
          };
          const detections = await faceapi
            .detectAllFaces(image)
            .withFaceLandmarks()
            .withFaceDescriptors();
          const resizedDetections = faceapi.resizeResults(
            detections,
            displaySize
          );
          const resizedDetectionsLocal = faceapi.resizeResults(
            detections,
            displaySizeLocal
          );
          let faceMatcher = [];
          faceMatcher = new faceapi.FaceMatcher(this.fetchedDescriptors, 0.9);
          let results = resizedDetections.map((d) =>
            faceMatcher.findBestMatch(d.descriptor)
          );
          let resizedBoxes = [];
          let newImg;
          const drawLabelOptions = {
            backgroundColor: '#6d17cb',
            fontSize: 35,
          };
          for (let i = 0; i < results.length; i++) {
            results[i] = new faceapi.FaceMatch(
              results[i]._label,
              results[i]._distance
            );
            let box = resizedDetectionsLocal[i].detection._box;
            resizedBoxes[i] = new faceapi.Box(box);

            const drawBox = new faceapi.draw.DrawBox(resizedBoxes[i], {
              label: results[i].toString().split('(')[0],
              boxColor: '#6d17cb',
              lineWidth: 6,
              drawLabelOptions: drawLabelOptions,
            });
            drawBox.draw(canvas2);
          }
          canvas.width = finalWidth;
          canvas.height = finalHeight;
          newImg = canvas2.toDataURL();
          var data = newImg.replace(/^data:image\/\w+;base64,/, '');
          var buf = new Buffer(data, 'base64');
          let filename = Date.now();
          fs.writeFile(`./userImages/${filename}.jpg`, buf, function () {});
          let detectedActors = results.reduce((acc, curr) => {
            curr._label !== 'unknown' && acc.add(curr._label);
            return acc;
          }, new Set());
          res.status(200).json({
            results,
            detectedActors: [...detectedActors],
            imageSrc: config.get('adress') + '/' + filename + '.jpg',
          });
          fs.unlink(`./uploads/${req.file.filename}`, function (err) {
            if (err) throw err;
            logger.success('File deleted!');
          });
          // });
        });
      });
    } catch (e) {
      res.status(500).json({ message: e.message });
      logger.error({ e });
    }
  }

  async trainModels(req, res) {
    try {
      const dir = './descriptors';

      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir);
      }
      const detections = await this.loadLabeledImages();
      fs.writeFileSync(dir + `/descriptors.json`, JSON.stringify(detections));
      logger.success('Training was successful');
      res.status(200).json({ message: 'success' });
    } catch (e) {
      logger.error('Error while training models', e.message);
    }
  }

  async loadLabeledImages() {
    logger.action('Start training model');
    let labels2 = labels.slice(0, 3);
    return Promise.all(
      labels2.map(async (label) => {
        const descriptions = [];
        for (let i = 1; i <= 2; i++) {
          try {
            const img = await canvas.loadImage(
              // `./labeled_images/${label}/${i}.jpg`
              `F:/actors/${label}/${i}.jpg`
            );
            logger.log('Img loaded: ', img);
            const detections = await faceapi
              .detectSingleFace(img)
              .withFaceLandmarks()
              .withFaceDescriptor();
            descriptions.push(detections.descriptor);
            logger.success(`Detections for ${label} ${i} ready`);
          } catch (e) {
            logger.error('error in ' + label + ' ' + i);
          }
        }
        return new faceapi.LabeledFaceDescriptors(label, descriptions);
      })
    );
  }

  async FetchDescriptors(descriptors) {
    try {
      let a = [];
      await descriptors.map((item, index) => {
        let arr = [];
        for (let k = 0; k < item.descriptors.length; k++) {
          arr.push(new Float32Array(Object.keys(item.descriptors[k]).length));
        }
        for (let j = 0; j < item.descriptors.length; j++) {
          for (let i = 0; i < Object.keys(item.descriptors[j]).length; i++) {
            arr[j][i] = item.descriptors[j][i];
          }
        }
        a[index] = new faceapi.LabeledFaceDescriptors(item.label, arr);
      });
      return a;
    } catch (e) {
      logger.error(e.message);
    }
  }
}

module.exports.RecognitionController = new RecognitionController();
