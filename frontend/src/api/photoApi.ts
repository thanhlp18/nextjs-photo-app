import { BASE_API_URL } from "@/constant/apiConstant";
import axios from "axios";

// GET ALL PHOTO
export function getAllPhotos(): { id: string; url: string }[] {
  axios.get(`${BASE_API_URL}/photos`).then((response) => {
    return response.data;
  });
  return [];
}

// ADD COMMENT
export function addComment(comment: {
  name: string;
  comment: string;
  photoId: string;
}) {
  return axios
    .post(`${BASE_API_URL}/comment/`, comment)
    .then((response) => {
      return { ...response.data, status: response.status };
    })
    .catch((error) => {
      throw error; // Rethrow the error to be handled elsewhere
    });
}

// ADD PHOTO
export async function addPhoto(photo: {
  image: File;
  ownerName: string;
  ownerComment: string;
}) {
  try {
    const { image, ownerName, ownerComment } = photo;

    const formData = new FormData();
    formData.append("image", image);
    formData.append("ownerName", ownerName);
    formData.append("ownerComment", ownerComment);

    const response = await axios.post(`${BASE_API_URL}/photo`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    console.log(response.data);
    return response.data; // Return the response data if needed
  } catch (error) {
    console.error("Error uploading image and comment:", error);
    throw error; // Rethrow the error to handle it elsewhere
  }
}
