"use client";
import { addComment } from "@/api/photoApi";
import { BASE_API_URL } from "@/constant/apiConstant";
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
import Comment from "postcss/lib/comment";
import { useEffect, useState } from "react";
import useSWR from "swr";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function Page({ params }: { params: { id: string } }) {
  const [photoDetail, setPhotoDetail] = useState<any>(null); // State to store photo detail
  const [isAddComment, setIsAddComment] = useState(false); // State to store add comment form status
  const { data, error, isLoading } = useSWR(
    `${BASE_API_URL}/photo/${params.id}`,
    fetcher
  );
  useEffect(() => {
    setPhotoDetail(data?.data);
  }, [data]);

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
    <Card className="max-w-2xl h-[90%] bg-orange-800 p-4">
      <CardHeader>
        <Heading size="md">
          {"Photo uploaded by " + photoDetail?.ownerName}
        </Heading>
      </CardHeader>

      {/* Image detail block */}
      <div className="grid grid-cols-3 gap-4 group ">
        <Image
          objectFit="cover"
          src={photoDetail?.image}
          alt={photoDetail?.image}
          className="col-span-1   group-hover:transform group-hover:scale-110 transition duration-300 ease-in-out"
        />
        <Text fontSize="sm" display={"block"} className="col-span-2">
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
      <ul className=" mt-2 gap-2 overflow-y-scroll">
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

      <Button
        colorScheme="orange"
        size="sm"
        className=" !absolute right-4 top-4"
        leftIcon={<Icon as={ChevronLeftIcon} />}
        onClick={() => window.history.back()}
      >
        Back
      </Button>
    </Card>
  );
}
