"use client";

import { Button, Container, Group, Image, Text, Title } from "@mantine/core";
import image from "../../../public/hero.svg";
import { useRouter } from "next/navigation";
import classes from "./Hero.module.css";

export function Hero() {
  const router = useRouter();

  return (
    <Container size="md">
      <div className={classes.inner}>
        <div className={classes.content}>
          <Title className={classes.title}>
            An <span className={classes.highlight}>AI-powered</span> flashcard
            maker
            <br />{" "}
          </Title>
          <Text c="dimmed" mt="md">
            Build fully functional accessible web applications faster than ever
            – Mantine includes more than 120 customizable components and hooks
            to cover you in any situation
          </Text>
          <Group mt={30}>
            <Button
              radius="xl"
              size="md"
              className={classes.control}
              onClick={() => router.push("/create")}
            >
              Get started
            </Button>
            <Button
              variant="default"
              radius="xl"
              size="md"
              className={classes.control}
            >
              Source code
            </Button>
          </Group>
        </div>
        <Image src={image.src} className={classes.image} />
      </div>
    </Container>
  );
}
