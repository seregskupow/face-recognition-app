/* eslint-disable no-nested-ternary */
/* eslint-disable class-methods-use-this */
/* eslint-disable no-underscore-dangle */
import React, { Component } from 'react';
import * as faceapi from 'face-api.js';
import { MdArrowBack } from 'react-icons/md';
import { AwesomeButton } from 'react-awesome-button';
import { AuthContext } from '../context/AuthContext';
import Loader from '../components/Loader';
import ActorCard from '../components/ActorCard';
import AlPacino from '../images/demo/al.jpg';
import Trio from '../images/demo/trio.png';
import Harley from '../images/demo/harley.jpg';
import Angelina from '../images/demo/angelina.jpg';
import Stark from '../images/demo/stark.png';
import WikiPreloader from '../components/WikiPreloader';
import ActorsPreloader from '../components/ActorsPreloader/ActorsPreloader';
import 'react-awesome-button/dist/themes/theme-blue.css';

export default class FaceMatch extends Component {
  static contextType = AuthContext;

  constructor(props) {
    super(props);
    this.state = {
      actors: [],
      loading: true,
      image: null,
      container: null,
      recognitionLoading: false,
      date: new Date(),
      dataReady: true,
      recognitionFailed: false,
      startDisabled: true,
      shouldRecognize: true,
      shouldDisplay: true,
      disableUpload: false,
      wikiResults: [],
    };
    this.start = this.start.bind(this);
    this.uploadHandler = this.uploadHandler.bind(this);
    this.fetchActorData = this.fetchActorData.bind(this);
    this.parseSessionStorage = this.parseSessionStorage.bind(this);
    this.urlUpload = this.urlUpload.bind(this);
    this.handleDropDown = this.handleDropDown.bind(this);
  }

  componentDidMount() {
    this.parseSessionStorage();
    setTimeout(this.start);
  }

  componentWillUnmount() {
    document.querySelector('.result-img-container').innerHTML = '';
  }

  handleDropDown() {
    const { recognitionLoading, dataReady } = this.state;
    let lastTarget = null;
    const dropZone = document.querySelector('#dropzone');
    const dropZoneContainer = document.querySelector('#facematch-section');
    const textNode = document.querySelector('#textnode');

    function isFile(evt) {
      const dt = evt.dataTransfer;

      for (let i = 0; i < dt.types.length; i++) {
        if (dt.types[i] === 'Files') {
          return true;
        }
      }
      return false;
    }

    dropZoneContainer.addEventListener('dragenter', (e) => {
      if (isFile(e) && !recognitionLoading && dataReady) {
        lastTarget = e.target;
        dropZone.style.visibility = '';
        dropZone.style.opacity = 1;
        textNode.innerHTML = 'Drop anywhere!';
        textNode.style.fontSize = '48px';
      }
      if (recognitionLoading && !dataReady) {
        dropZone.style.visibility = '';
        dropZone.style.opacity = 1;
        textNode.innerHTML = 'Wait for last to finish';
        textNode.style.fontSize = '48px';
      }
    });

    dropZoneContainer.addEventListener('dragleave', (e) => {
      e.preventDefault();
      if (e.target === document || e.target === lastTarget) {
        dropZone.style.visibility = 'hidden';
        dropZone.style.opacity = 0;
        textNode.style.fontSize = '42px';
      }
    });

    dropZoneContainer.addEventListener('dragover', (e) => {
      e.preventDefault();
    });

    dropZoneContainer.addEventListener('drop', (e) => {
      e.preventDefault();
      dropZone.style.visibility = 'hidden';
      dropZone.style.opacity = 0;
      textNode.style.fontSize = '42px';
      if (
        e.dataTransfer.files.length === 1
        && !recognitionLoading
        && dataReady
      ) {
        const imageUpload = document.getElementById('imageUpload');
        imageUpload.files = e.dataTransfer.files;
        this.setState({ shouldRecognize: true });
        imageUpload.dispatchEvent(new Event('change'));
      }
    });
  }

  parseSessionStorage() {
    const imageSrc = JSON.parse(sessionStorage.getItem('image'));
    const actors = JSON.parse(sessionStorage.getItem('actordata'));
    const shouldRecognize = JSON.parse(sessionStorage.getItem('repeat'));
    if (actors && imageSrc) {
      const image = document.createElement('img');
      image.src = imageSrc || '';
      image.classList.add('result-img');
      this.setState({ image, actors, shouldRecognize });
    }
  }

  urlUpload(link = null) {
    const url = link !== null ? link : prompt('Input image url');
    fetch(url)
      .then((res) => res.blob())
      .then((blob) => {
        const file = new File([blob], 'actor.jpg', blob);
        const imageUpload = document.getElementById('imageUpload');
        const list = new DataTransfer();
        list.items.add(file);
        const myFileList = list.files;
        imageUpload.files = myFileList;
        imageUpload.dispatchEvent(new Event('change'));
      });
  }

  async start() {
    const {
      image, recognitionLoading, recognitionFailed, dataReady, shouldRecognize,
    } = this.state;
    this.setState({ loading: false });
    this.handleDropDown();
    const container = document.createElement('div');
    const imageUpload = document.getElementById('imageUpload');
    const result = document.querySelector('.result');
    container.classList.add('result-img-container');
    container.style.position = 'relative';
    result.innerHTML = '';
    result.append(container);
    if (image) {
      container.append(image);
    }

    window.addEventListener('paste', (e) => {
      if (
        (!recognitionLoading && dataReady)
        || (!recognitionLoading && recognitionFailed)
      ) {
        document.querySelector('.result-img-container').innerHTML = '';
        imageUpload.files = e.clipboardData.files;
        this.setState({ shouldRecognize: true });
        imageUpload.dispatchEvent(new Event('change'));
      }
    });

    imageUpload.addEventListener('change', async () => {
      container.innerHTML = '';
      this.setState({ image: null });
      const imageToUpload = await faceapi.bufferToImage(imageUpload.files[0]);
      imageUpload.files = null;
      imageToUpload.classList.add('result-img');
      container.append(imageToUpload);
      this.setState({ image: imageToUpload });

      if (shouldRecognize) this.uploadHandler();
    });
  }

  async fetchActorData(labels, imgUrl = '') {
    const { token } = this.context;
    const { date } = this.state;
    try {
      const response = await fetch(
        `${process.env.REACT_APP_PORT}/api/db/parseactors`,
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          method: 'POST',
          body: JSON.stringify({ labels, time: date, imgUrl }),
        },
      );
      const data = await response.json();
      return data;
    } catch (e) {
      return e.message;
    }
  }

  async uploadHandler() {
    this.setState({
      recognitionLoading: true,
      actors: [],
      dataReady: false,
      recognitionFailed: false,
      shouldDisplay: true,
    });
    const imageUpload = document.getElementById('imageUpload');
    const result = document.querySelector('.result');
    const resultImage = document.querySelector('.result-img');
    const displaySize = {
      width: result.offsetWidth,
      height: result.offsetHeight,
      imgWidth: resultImage.offsetWidth,
      imgHeight: resultImage.offsetHeight,
    };
    const formData = new FormData();
    formData.append('actor', imageUpload.files[0]);
    formData.append('displaySize', JSON.stringify(displaySize));
    // const results = [];
    // const resizedBoxes = [];
    // let img;
    fetch('/api/recognition/upload', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${this.context.token}`,
      },
      body: formData,
    })
      .then((res) => res.json())
      .then(async ({ results, imageSrc }) => {
        document.querySelector('.result-img').src = imageSrc;
        this.setState({ image: imageSrc });
        sessionStorage.setItem('image', JSON.stringify(imageSrc));
        sessionStorage.setItem('repeat', JSON.stringify(false));
        this.setState({ recognitionLoading: false });
        const filtered = results.filter(
          (item) => !item._label.includes('unknown'),
        );
        this.setState({
          actors: [
            ...new Set(
              filtered.map((item) => ({ ...item, name: item._label })),
            ),
          ],
        });
        if (filtered.length !== 0) {
          const data = await this.fetchActorData(
            [...new Set(filtered.map((res) => res._label))],
            imageSrc,
          );
          if (data.actorData !== undefined) {
            this.setState({ actors: data.actorData });
            sessionStorage.setItem('actordata', JSON.stringify(data.actorData));
            this.setState({ dataReady: true });
          } else {
            this.setState({ recognitionFailed: true });
            sessionStorage.removeItem('actordata');
          }
        } else {
          this.setState({ recognitionFailed: true });
          sessionStorage.removeItem('actordata');
        }
      });
  }

  render() {
    const {
      loading, image, shouldDisplay, dataReady,
      recognitionFailed, recognitionLoading, actors, disableUpload,
    } = this.state;
    if (loading) {
      return <Loader position="fixed" />;
    }

    return (
      <section id="facematch-section" className="container-fluid">
        <div style={{ visibility: 'hidden', opacity: '0' }} id="dropzone">
          <div id="textnode">Drop anywhere!</div>
        </div>
        <div className="face-matcher">
          <div
            className="control-panel"
            style={{
              display:
                image && shouldDisplay ? 'block' : 'none',
            }}
          >
            <button
              type="button"
              style={{
                display: `${
                  dataReady || recognitionFailed
                    ? 'block'
                    : 'none'
                }`,
              }}
              className="close-button"
              onClick={() => {
                this.setState({
                  image: null,
                  actors: [],
                  shouldRecognize: true,
                  shouldDisplay: false,
                  disableUpload: false,
                });
                document.querySelector('.result-img-container').innerHTML = '';
                sessionStorage.clear();
                sessionStorage.setItem('repeat', JSON.stringify(true));
              }}
            >
              <span>
                <MdArrowBack />
              </span>
              <span>Back</span>
            </button>
          </div>
          <div className="face-matcher-wrapper">
            <div
              style={{
                display:
                  image && shouldDisplay
                    ? 'flex'
                    : 'none',
              }}
              className="result-wrapper"
            >
              <div className="result">
                {recognitionLoading ? (
                  <Loader position="absolute" border="10px" />
                ) : null}
              </div>

              <div className="wiki-wrapper">
                <div className="wiki">
                  <div
                    style={{
                      display:
                        image && shouldDisplay
                          ? 'flex'
                          : 'none',
                    }}
                    className="results-wrap"
                  >
                    <h3>Wikipedia related pages:</h3>
                    <div className="reco">
                      {!recognitionLoading ? (
                        actors.length > 0 ? (
                          <>
                            {actors.map((item) => (
                              <div key={Math.random() * 100}>
                                <a
                                  href={`https://en.wikipedia.org/wiki/${item.name}`}
                                >
                                  {item.name}
                                </a>
                              </div>
                            ))}
                          </>
                        ) : (
                          <>
                            <div className="not_found">
                              <h1>Could not recognize actors</h1>
                            </div>
                          </>
                        )
                      ) : (
                        <WikiPreloader />
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="intro-caption">
              <h2
                style={{
                  display:
                    image && shouldDisplay
                      ? 'none'
                      : 'inline-block',
                }}
              >
                Upload file to recognize actor
              </h2>
            </div>
            <div
              style={{
                display:
                  image && shouldDisplay
                    ? 'none'
                    : 'flex',
              }}
              className="options"
            >
              <div className="upload-type">
                <div className="upload-type-item">
                  <AwesomeButton
                    type="primary"
                    size="large"
                    onPress={() => {
                      document.getElementById('imageUpload').click();
                    }}
                    button-hover-pressure="3"
                  >
                    <span>Upload from disk</span>
                  </AwesomeButton>
                </div>
              </div>

              <div className="">
                <div style={{ textAlign: 'center' }}>
                  <p style={{ color: 'white' }}>OR just Ctr+V</p>
                </div>
              </div>
              <div className="demo-img-wrapper">
                <p>No image? try one of these</p>
                <div className="demo-img-container">
                  <div
                    role="button"
                    tabIndex="0"
                    onKeyDown={() => {
                      this.urlUpload(AlPacino);
                      this.setState({ disableUpload: true });
                    }}
                    style={{
                      pointerEvents: `${
                        disableUpload === true ? 'none' : 'auto'
                      }`,
                    }}
                    onClick={() => {
                      this.urlUpload(AlPacino);
                      this.setState({ disableUpload: true });
                    }}
                    className="demo-img"
                  >
                    <img className="d-img" src={AlPacino} alt="" />
                  </div>
                  <div
                    role="button"
                    tabIndex="0"
                    onKeyDown={() => {
                      this.urlUpload(Trio);
                      this.setState({ disableUpload: true });
									 }}
                    style={{
                      pointerEvents: `${
                        disableUpload === true ? 'none' : 'auto'
                      }`,
                    }}
                    onClick={() => {
                      this.urlUpload(Trio);
                      this.setState({ disableUpload: true });
                    }}
                    className="demo-img"
                  >
                    <img className="d-img" src={Trio} alt="" />
                  </div>
                  <div
                    role="button"
                    tabIndex="0"
                    onKeyDown={() => {
                      this.urlUpload(Angelina);
                      this.setState({ disableUpload: true });
                    }}
                    style={{
                      pointerEvents: `${
                        disableUpload === true ? 'none' : 'auto'
                      }`,
                    }}
                    onClick={() => {
                      this.urlUpload(Angelina);
                      this.setState({ disableUpload: true });
                    }}
                    className="demo-img"
                  >
                    <img className="d-img" src={Angelina} alt="" />
                  </div>
                  <div
                    role="button"
                    tabIndex="0"
                    onKeyDown={() => {
                      this.urlUpload(Harley);
                      this.setState({ disableUpload: true });
                    }}
                    style={{
                      pointerEvents: `${
                        disableUpload === true ? 'none' : 'auto'
                      }`,
                    }}
                    onClick={() => {
                      this.urlUpload(Harley);
                      this.setState({ disableUpload: true });
                    }}
                    className="demo-img"
                  >
                    <img className="d-img" src={Harley} alt="" />
                  </div>
                  <div
                    role="button"
                    tabIndex="0"
                    onKeyDown={() => {
                      this.urlUpload(Stark);
                      this.setState({ disableUpload: true });
                    }}
                    style={{
                      pointerEvents: `${
                        disableUpload === true ? 'none' : 'auto'
                      }`,
                    }}
                    onClick={() => {
                      this.urlUpload(Stark);
                      this.setState({ disableUpload: true });
                    }}
                    className="demo-img"
                  >
                    <img className="d-img" src={Stark} alt="" />
                  </div>
                </div>
              </div>
              <input
                type="file"
                id="imageUpload"
                accept="image/jpeg,image/png,image/gif"
                name="actor"
              />
            </div>
          </div>
        </div>
        <div className="found-actors">
          <div
            className="found-actor-wrapper-title"
            style={{
              display:
                image && shouldDisplay ? 'block' : 'none',
            }}
          >
            <h1>Found actors in the photo :</h1>
          </div>

          {dataReady && shouldDisplay === true
            ? actors.length > 0 && (
            <div className="found-actor-wrapper">
              {actors.map((actor) => (
                <ActorCard
                  key={Math.random() * (9999 - 1000) * 1000}
                  actorData={actor}
                />
              ))}
            </div>
            )
            : !recognitionFailed
              && shouldDisplay && (
                <div className="found-actor-wrapper">
                  <ActorsPreloader />
                </div>
            )}
          {recognitionFailed
            && image
            && shouldDisplay && (
              <div className="found-actor-wrapper">
                <div className="not_found">
                  <h1>Could not recognize actors in the photo</h1>
                </div>
              </div>
          )}
        </div>
      </section>
    );
  }
}
