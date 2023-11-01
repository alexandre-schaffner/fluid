/*
| Developed by Fluid
| Filename : main.ts
| Author : Alexandre Schaffner (alexandre.schaffner@icloud.com)
*/

import "dotenv/config";

import { Platform, User, Youtube } from "@prisma/client";

import { sync } from "./sync/sync";
import { prisma } from "./utils/prismaClient";

/*
|--------------------------------------------------------------------------
| Entry point
|--------------------------------------------------------------------------
*/

async function main() {
  const users = await prisma.user.findMany({
    where: { sync: true },
    include: { platform: true, youtube: true },
  });

  await Promise.all(
    users.map((user: User & { youtube: Youtube; platform: Platform }) =>
      sync(user).catch((err: unknown) => console.error(err))
    )
  );
  console.log("Sync done");
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
