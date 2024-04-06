"use client";
import { addComment, getPhotoById } from "@/app/api/photoApi";
import { ChevronLeftIcon } from "@chakra-ui/icons";
import {
  Button,
  Card,
  CardHeader,
  CircularProgress,
  Divider,
  Heading,
  Icon,
  Image,
  Input,
  Text,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function Page({ params }: { params: { id: string } }) {
  const [photoDetail, setPhotoDetail] = useState<any>(null); // State to store photo detail
  const [isAddComment, setIsAddComment] = useState(false); // State to store add comment form status
  const [isLoading, setIsLoading] = useState(true);
  // const { data, error, isLoading } = useSWR(
  //   `${BASE_API_URL}/photos/${params.id}`,
  //   fetcher
  // );
  useEffect(() => {
    getPhotoById(params.id)
      .then((res) => {
        setPhotoDetail(res.data);
        setIsLoading(false);
      })
      .catch((error) => {
        toast.error("Error fetching photo detail: " + error.message);
      });

    // Cleanup function (optional)
    return () => {
      // Any cleanup logic here
    };
  }, [params.id]); // Dependency array

  // Function to add comment
  async function handleAddComment(
    e: React.ChangeEvent<HTMLInputElement> | any
  ) {
    setIsAddComment(true);

    e.preventDefault(); // Prevent form submit
    const userName = await localStorage.getItem("userName");
    // Get form comment value
    // Call add comment api
    const res = await addComment({
      name: userName || "Anonymous",
      comment: e.target[0].value,
      photoId: params.id,
    });

    if (res?.status === 200) {
      setIsAddComment(false);
      setPhotoDetail({
        ...photoDetail,
        comments: [
          {
            id: res.data.id,
            name: userName || "Anonymous",
            comment: res.data.comment,
            createdAt: res.data.createdAt,
          },
          ...photoDetail.comments,
        ],
      });
    }

    // Reset form data
    e.target.reset();
  }

  if (isLoading)
    return (
      <CircularProgress
        isIndeterminate
        color="orange.300"
        size={"8rem"}
        thickness="1rem"
        className="mx-auto"
      />
    );

  return (
    <Card className="max-w-2xl h-[90%] bg-orange-800 p-4 overflow-y-scroll">
      <CardHeader className="!px-0">
        <Heading
          size="md"
          className="flex sm:flex-row flex-col-reverse justify-between gap-2"
        >
          <span> {"Photo uploaded by " + photoDetail?.ownerName}</span>

          <Button
            colorScheme="orange"
            size="sm"
            className=""
            leftIcon={<Icon as={ChevronLeftIcon} />}
            onClick={() => window.history.back()}
          >
            Back
          </Button>
        </Heading>
      </CardHeader>

      {/* Image detail block */}
      <div className="grid grid-cols-1 gap-4 group ">
        <Image
          objectFit="cover"
          src={`${photoDetail?.image}/public`}
          alt={`${photoDetail?.ownerName} | ${photoDetail?.ownerComment}`}
          className="col-span-1 group-hover:transform group-hover:scale-105 transition duration-300 ease-in-out rounded-md"
        />
        <Text fontSize="sm" display={"block"} className="col-span-1">
          <span className="font-bold">{photoDetail?.ownerName}</span>:{" "}
          {photoDetail?.ownerComment || "No comment"}
        </Text>
      </div>
      <Divider className="my-3" />
      {/* Add comment block */}
      <div>
        <>
          <form onSubmit={handleAddComment}>
            <Text mb="8px">Leave your comment: </Text>
            <div className="relative">
              <Input
                placeholder="Leave your comment here!"
                size="sm"
                isDisabled={isAddComment}
              />
              {isAddComment && (
                <CircularProgress
                  isIndeterminate
                  color="green.300"
                  size={"1rem"}
                  className="absolute left-[97%] bottom-[30px] transform -translate-x-1/2"
                />
              )}
            </div>
          </form>
        </>
      </div>
      {/* Comment render block */}
      <ul className=" mt-2 gap-2">
        {photoDetail?.comments?.map((ele: commentType, index: number) => (
          <li key={index} className="border-t">
            <div>
              <span className="font-bold">{ele.name}</span>
              <span> | </span>
              <span>{new Date(ele.createdAt).toLocaleDateString("en-GB")}</span>
            </div>
            <Text size={"sm"}>{ele.comment}</Text>
          </li>
        ))}
      </ul>
    </Card>
  );
}
