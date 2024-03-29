"use client";
import { addPhoto } from "@/api/photoApi";
import { BASE_API_URL } from "@/constant/apiConstant";
import { ChatIcon, EditIcon } from "@chakra-ui/icons";
import {
  Button,
  Card,
  CardBody,
  CardFooter,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  Icon,
  Image,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Text,
  Textarea,
  useDisclosure,
} from "@chakra-ui/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import useSWR from "swr";

const fetcher = (url: string) => fetch(url).then((res) => res.json());
export default function Page() {
  const router = useRouter();
  const [allPhotos, setAllPhotos] = useState<photoType[]>([]); // State to store all photos
  const [userName, setUserName] = useState(""); // State to store user name
  const [image, setImage] = useState(null);
  const [comment, setComment] = useState("");
  const [name, setName] = useState(userName);
  const { isOpen, onOpen, onClose } = useDisclosure();
  // Load all photos
  const { data, error, isLoading } = useSWR(`${BASE_API_URL}/photo/`, fetcher);

  // Set user name from local storage
  useEffect(() => {
    const userName = localStorage.getItem("userName");
    setUserName(userName || "Anonymous");
  }, []);

  // Set all photos to state
  useEffect(() => {
    setAllPhotos(data?.data);
  }, [data, isLoading]);

  // function handle view all comment
  async function handleViewAllComment(photoId: string) {
    router.push(`/photos/${photoId}`);
  }

  const handleImageChange = (e: any) => {
    setImage(e.target.files[0]);
  };

  // Function to add photo
  function handleAddPhoto(e: any) {
    e.preventDefault();
    if (image && name && comment)
      addPhoto({ image, ownerName: name, ownerComment: comment }).then(
        (res: any) => {
          const newPhoto: photoType = res.data;
          setAllPhotos([newPhoto, ...allPhotos]);
          onClose();
        }
      );
  }

  if (isLoading) return <div>Loading...</div>;
  return (
    <main className="!bg-orange-700 pt-8 h-full w-full overflow-y-scroll">
      <div className="px-4 mb-4 flex flex-row justify-between items-center gap-8">
        <Text fontSize="xl" as="b" textAlign={"center"} display={"block"}>
          Hello {userName}, find your interest photo and share your thought!
        </Text>{" "}
        <Button
          size={"lg"}
          rightIcon={<Icon as={EditIcon} />}
          colorScheme="yellow"
          _hover={{ bg: "#fbd7c0" }}
          _active={{
            bg: "#fe6509",
            transform: "scale(0.98)",
            borderColor: "black",
          }}
          className="!px-8"
          onClick={onOpen}
        >
          Share your photo here
        </Button>
      </div>
      <div className="grid grid-cols-3 lg:grid-cols-4 gap-3 px-4">
        {allPhotos?.map((photo: getAllPhotosResponse, idx: number) => (
          // Photo card
          <Card maxW="md" key={photo.id} className="overflow-hidden !min-w-56">
            <Image
              objectFit="cover"
              src={photo.image}
              alt={photo.image}
              aspectRatio={1}
            />
            <CardBody>
              <div>
                <Heading size="sm">{photo.ownerName}</Heading>
                <Text fontSize="sm" display={"block"}>
                  {photo.ownerComment || "No comment"}
                </Text>
              </div>
            </CardBody>
            <CardFooter
              justify="space-between"
              flexWrap="wrap"
              sx={{
                "& > button": {
                  minW: "136px",
                },
              }}
            >
              <div className="flex flex-row flex-nowrap justify-center items-center w-full">
                <Button
                  size={"sm"}
                  rightIcon={
                    <div className="flex flex-row gap-1">
                      <Icon as={ChatIcon} />
                      <Text
                        fontSize="sm"
                        textAlign={"center"}
                        display={"block"}
                      >
                        {photo.commentsCount}
                      </Text>
                    </div>
                  }
                  colorScheme="black"
                  variant="outline"
                  _hover={{ bg: "#fbd7c0" }}
                  _active={{
                    bg: "#fe6509",
                    transform: "scale(0.98)",
                    borderColor: "black",
                  }}
                  className="w-full mt-4"
                  onClick={() => handleViewAllComment(photo.id)}
                >
                  View all comment
                </Button>

                <></>
              </div>
            </CardFooter>
          </Card>
        ))}
        <Modal onClose={onClose} isOpen={isOpen} isCentered>
          <ModalOverlay />
          <ModalContent className="md:h-[90%] h-full flex flex-col overflow-hidden ">
            <ModalHeader>Share you photo here!</ModalHeader>
            <ModalCloseButton />
            <ModalBody className="flex flex-col flex-1 lg:h-[90%] md:h-[80%] h-[40%]">
              <form onSubmit={handleAddPhoto}>
                <FormControl id="ownerName">
                  <FormLabel>Your Name</FormLabel>
                  <Input
                    type="text"
                    value={name || ""}
                    onChange={(e) => setName(e.target.value)}
                  />
                </FormControl>

                <FormControl id="image">
                  <FormLabel>Upload Image</FormLabel>
                  <Input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                  />
                </FormControl>

                <FormControl id="ownerComment">
                  <FormLabel>Comment</FormLabel>
                  <Textarea
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                  />
                </FormControl>

                <Flex justify="flex-end" mt={4}>
                  <Button colorScheme="blue" type="submit">
                    Submit
                  </Button>
                </Flex>
              </form>
            </ModalBody>
          </ModalContent>
        </Modal>
      </div>
    </main>
  );
}
