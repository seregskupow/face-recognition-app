const { Router } = require("express");
const router = Router();
const fs = require("fs");

//third-party-libraries
const fetch = require("node-fetch");
const faceapi = require("face-api.js");
const multer = require("multer");
const chalk = require("chalk");
const canvas = require("canvas");
const { Canvas, Image, ImageData } = canvas;
faceapi.env.monkeyPatch({ fetch: fetch, Canvas, Image, ImageData });

//middlewares
const auth = require("../middlewares/auth.middleware");

//helper modules
const scrapper = require("../modules/actorParser");

//configs
const config = require("config");

//files for faceapi
const labels = require("../labels/labels.json");
const descriptors2 = require("../descriptors/descriptors.json");

//mongoDB models
const userHistory = require("../dbmodels/userHistory");
const Actor = require("../dbmodels/Actor");

//console messages customization
const error = chalk.bold.red;
const done = chalk.bold.green;
const action = chalk.bold.hex("#dbab79");
const step = chalk.bold.blue;

let fetchedDescriptors;
async function loadModels() {
  Promise.all([
    faceapi.nets.faceRecognitionNet.loadFromDisk("./server/models"),
    faceapi.nets.faceLandmark68Net.loadFromDisk("./server/models"),
    faceapi.nets.ssdMobilenetv1.loadFromDisk("./server/models"),
    (fetchedDescriptors = await FetchDescriptors(descriptors2)),
  ]).then(console.log(done("Models ready")));
}
loadModels();

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./server/uploads/");
  },

  filename: function (req, file, cb) {
    cb(null, "file" + Date.now() + "." + file.originalname.split(".").pop());
    req.name = file.originalname;
  },
});
var limits = {
  files: 1,
  fileSize: 1000000 * 90,
};
const upload = multer({
  storage: storage,
  limits,
}).single("actor");

router.post("/upload", auth, async (req, res) => {
  try {
    await upload(req, res, (err) => {
      if (err || !req.file) {
        console.log(error("Error while uploading"), err);
        return res.status(400).json({ message: "Something went wrong" });
      }
      console.log(step("Uploaded filename: ", req.file.filename));
      fs.readFile(`./server/uploads/${req.file.filename}`, async (err, img) => {
        if (err) {
          console.log(error("error while reading image", err.message));
          return res.status(400).json({ message: "error while reading image" });
        }
        const canvasSize = JSON.parse(req.body.displaySize);
        let imgProportion = canvasSize.imgWidth/canvasSize.imgHeight;
        let finalWidth = imgProportion*760,
        finalHeight = 760;
        console.log(action("Start recognition process"));
        let canvas2 = canvas.createCanvas(finalWidth, finalHeight);
        let ctx = canvas2.getContext("2d");      
        canvas.loadImage(img).then((image) => {
          ctx.drawImage(image, finalWidth/2 - finalWidth/2, 0, finalWidth, finalHeight);
        });
        const image = await canvas.loadImage(img);
        console.log(image);
        const displaySize = {
          width: canvasSize.width,
          height: canvasSize.height,
				};
				console.log(displaySize)
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
        faceMatcher = new faceapi.FaceMatcher(
          fetchedDescriptors,
          0.9
        );
        let results = resizedDetections.map((d) =>
          faceMatcher.findBestMatch(d.descriptor)
        );
        let resizedBoxes = [];
        let newImg;
        const drawLabelOptions = {
          backgroundColor: '#6d17cb',
          fontSize:35
        }
        for (let i = 0; i < results.length; i++) {
          results[i] = new faceapi.FaceMatch(
            results[i]._label,
            results[i]._distance
          );
          let box = resizedDetectionsLocal[i].detection._box;
          resizedBoxes[i] = new faceapi.Box(box);

          const drawBox = new faceapi.draw.DrawBox(resizedBoxes[i], {
            label: results[i].toString().split("(")[0],
            boxColor:'#6d17cb',
            lineWidth:6,
            drawLabelOptions:drawLabelOptions
          });
          drawBox.draw(canvas2);
        }
        console.log()
        canvas.width = finalWidth;
        canvas.height = finalHeight;
        newImg = canvas2.toDataURL();
        var data = newImg.replace(/^data:image\/\w+;base64,/, "");
        var buf = new Buffer(data, "base64");
        let filename  = Date.now();
        fs.writeFile(`./server/userImages/${filename}.jpg`, buf, function () {});
        res.status(200).json({ results, resizedDetections,imageSrc:config.get('adress')+'/'+filename+'.jpg' });
        fs.unlink(`./server/uploads/${req.file.filename}`, function (err) {
          if (err) throw err;
          console.log(done("File deleted!"));
        });
        // });
      });
    });
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
});

router.get("/train", async (req, res) => {
  try {
    const dir = "./server/descriptors";

    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir);
    }
    const detections = await loadLabeledImages();
    fs.writeFileSync(dir + `/descriptors.json`, JSON.stringify(detections));
    console.log(done("Training was successful"));
    res.status(200).json({ message: "success" });
  } catch (e) {
    console.log(error("Error while training models"), e.message);
  }
});

function loadLabeledImages() {
  console.log(action("Start training model"));
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
          console.log("Img loaded: ", img);
          const detections = await faceapi
            .detectSingleFace(img)
            .withFaceLandmarks()
            .withFaceDescriptor();
          descriptions.push(detections.descriptor);
          console.log(done(`Detections for ${label} ${i} ready`));
        } catch (e) {
          console.log(error("error in " + label + " " + i));
        }
      }
      return new faceapi.LabeledFaceDescriptors(label, descriptions);
    })
  );
}
async function FetchDescriptors(descriptors) {
  try {
    let f = descriptors;
    let a = [];
    await descriptors.map((item, index) => {
      let arr = [];
      for (let k = 0; k < item.descriptors.length; k++) {
        arr.push(new Float32Array(Object.keys(item.descriptors[k]).length));
      }
      // arr[0] = new Float32Array(Object.keys(item.descriptors[0]).length);
      // arr[1] = new Float32Array(Object.keys(item.descriptors[1]).length);
      for (let j = 0; j < item.descriptors.length; j++) {
        for (let i = 0; i < Object.keys(item.descriptors[j]).length; i++) {
          arr[j][i] = item.descriptors[j][i];
        }
      }
      a[index] = new faceapi.LabeledFaceDescriptors(item.label, arr);
    });
    return a;
  } catch (e) {
    console.log(error(e.message));
  }
}

module.exports = router;
