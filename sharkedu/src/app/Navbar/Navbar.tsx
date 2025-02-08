"use client";

import React, { useEffect, useState } from "react";
import {
  IconUser,
  IconLogout,
  IconFilePlus,
  IconHome,
  IconSwitchHorizontal,
  IconCards,
} from "@tabler/icons-react";
import { usePathname, useRouter } from "next/navigation";
import { Code, Group, Title } from "@mantine/core";
import { MantineLogo } from "@mantinex/mantine-logo";
import classes from "./Navbar.module.css";

export function Navbar() {
  const router = useRouter();
  const [path, setPath] = useState("");
  const pathname = usePathname();

  useEffect(() => {
    setPath(pathname);
    console.log(pathname === "/create");
  }, [pathname]);

  const data = [
    {
      active: path === "/",
      link: "",
      label: "Home",
      icon: IconHome,
      onClick: (event: React.MouseEvent) => handleLinkClick(event, "/"),
    },
    {
      active: path === "/create",
      link: "",
      label: "Create",
      icon: IconFilePlus,
      onClick: (event: React.MouseEvent) => handleLinkClick(event, "/create"),
    },
    {
      active: path === "/profile",
      link: "",
      label: "Profile",
      icon: IconUser,
      onClick: (event: React.MouseEvent) => handleLinkClick(event, "/profile"),
    },
    {
      active: path === "/flashcard",
      link: "",
      label: "Flashcards",
      icon: IconCards,
      onClick: (event: React.MouseEvent) =>
        handleLinkClick(event, "/flashcard"),
    },
  ];

  const handleLinkClick = (event: React.MouseEvent, link: string) => {
    event.preventDefault();
    if (link) {
      router.push(link);
    }
  };

  const links = data.map((item) => (
    <a
      className={classes.link}
      data-active={item.active ? "true" : undefined}
      href={item.link}
      key={item.label}
      onClick={item.onClick}
    >
      <item.icon className={classes.linkIcon} stroke={1.5} />
      <span>{item.label}</span>
    </a>
  ));

  return (
    <nav className={classes.navbar}>
      <div className={classes.navbarMain}>
        <Group className={classes.header} justify="space-between">
          <img src="logo.png" width="60" />
          <Title order={5}>Sharkedu</Title>
          <Code fw={700}>v1.0.0</Code>
        </Group>
        {links}
      </div>

      <div className={classes.footer}>
        <a
          href="#"
          className={classes.link}
          onClick={(event) => event.preventDefault()}
        >
          <IconSwitchHorizontal className={classes.linkIcon} stroke={1.5} />
          <span>Change account</span>
        </a>

        <a
          href="#"
          className={classes.link}
          onClick={(event) => event.preventDefault()}
        >
          <IconLogout className={classes.linkIcon} stroke={1.5} />
          <span>Logout</span>
        </a>
      </div>
    </nav>
  );
}
