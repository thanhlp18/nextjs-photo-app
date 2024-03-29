// app/page.tsx
"use client";
import { Button, FormControl, FormLabel, Input, Text } from "@chakra-ui/react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function Page() {
  const router = useRouter();
  const [userName, setUserName] = useState("");

  function handleAddUserName() {
    localStorage.setItem("userName", userName);
    router.push("/photos");
  }

  return (
    <main className="bg-transparent max-w-4xl min-w-96">
      <div className=" bg-yellow-100 p-8 rounded-md border-2 border-solid border-black">
        <div className="mb-4 flex flex-col justify-center gap-3">
          <Image
            src="/img/logo.png"
            width={80}
            height={80}
            alt="Logo of the author"
            className="mx-auto"
          />
          <Text fontSize="sm" as="i" textAlign={"center"}>
            Where to share you photo <br></br> and your thought!
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
            isRequired
            onChange={(e) => setUserName(e.target.value)}
          />
          <Button
            colorScheme="black"
            variant="outline"
            _hover={{ bg: "white" }}
            _active={{
              bg: "#fe6509",
              transform: "scale(0.98)",
              borderColor: "black",
            }}
            className="w-fit mt-4"
            onClick={handleAddUserName}
          >
            Lets start
          </Button>
        </FormControl>
      </div>
    </main>
  );
}
