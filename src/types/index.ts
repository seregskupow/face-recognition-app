export type ActorInfo = {
  photo: string;
  name: string;
  id: string;
  birthDay: string;
  birthPlace: string;
};
export type WikiActorInfo = {
  photo: string;
  name: string;
  link: string;
};
export type RecognitionResponse = {
  detectedActors: string[];
  imageSrc: string;
};
