type getAllPhotosResponse = {
  photoId: string;
  image: string;
  ownerName: string;
  ownerComment: string;
  commentsCount: number;
};

type getPhotoByIdResponse = {
  id: string;
  image: string;
  ownerName: string;
  ownerComment: string;
  comments: {
    id: string;
    name: string;
    comment: string;
    createdAt: string;
  }[];
};

type commentType = {
  id: string;
  name: string;
  comment: string;
  createdAt: string;
};

type photoType = {
  id: string;
  image: string;
  ownerName: string;
  ownerComment: string;
  commentsCount: number;
  comments: commentType[];
};
