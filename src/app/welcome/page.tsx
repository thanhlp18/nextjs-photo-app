// app/page.tsx
"use client";
import {
  Button,
  CircularProgress,
  FormControl,
  FormLabel,
  Input,
  Text,
} from "@chakra-ui/react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";

export default function Page() {
  const router = useRouter();
  const [userName, setUserName] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  function handleAddUserName() {
    if (userName === "") {
      toast.error("Please enter your name");
      setIsLoading(false);
      return;
    }
    localStorage.setItem("userName", userName);
    toast.success("Hello " + userName);
    setIsLoading(false);
    router.push("/photos");
  }

  return (
    <main className="bg-transparent max-w-4xl min-w-36 sm:min-w-72 lg:min-w-96 group">
      <div className=" bg-yellow-100 p-8 rounded-md border-2 border-solid border-black">
        <div className="mb-4 flex flex-col justify-center gap-3">
          <Image
            src="/img/logo.png"
            width={80}
            height={80}
            alt="Logo of the author"
            className="mx-auto group-hover:transform group-hover:scale-110 transition duration-300 ease-in-out"
          />
          <Text fontSize="sm" as="i" textAlign={"center"}>
            Where to share your photo and your thought!
          </Text>
        </div>
        <FormControl className="flex flex-col items-center">
          <FormLabel className="!text-center !text-xl">
            Enter your name to continue
          </FormLabel>
          <Input
            type="text"
            size="lg"
            value={userName}
            focusBorderColor="black"
            borderColor="black"
            placeholder="End your name"
            bgColor={"white"}
            className="hover:transform hover:scale-110 transition duration-300 ease-in-out"
            isRequired
            onChange={(e) => setUserName(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                setIsLoading(true);
                handleAddUserName();
              }
            }}
          />
          <Button
            colorScheme="orange"
            _hover={{
              bg: "white",
              color: "black",
              borderColor: "black",
              borderWidth: "1px",
            }}
            _active={{
              bg: "#fe6509",
              transform: "scale(0.98)",
              borderColor: "black",
            }}
            className="hover:transform hover:scale-110 transition duration-300 ease-in-out w-fit mt-4"
            disabled={isLoading}
            onClick={() => {
              setIsLoading(true);
              handleAddUserName();
            }}
          >
            {!isLoading ? (
              " Start!"
            ) : (
              <CircularProgress
                isIndeterminate
                color="white"
                size={"1rem"}
                className="ml-2"
              />
            )}
          </Button>
        </FormControl>
      </div>
    </main>
  );
}
