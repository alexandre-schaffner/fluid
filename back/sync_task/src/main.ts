/*
| Developed by Fluid
| Filename : main.ts
| Author : Alexandre Schaffner (alexandre.schaffner@icloud.com)
*/

import "dotenv/config";

import { Platform, PrismaClient, User, Youtube } from "@prisma/client";

import { sync } from "./sync/sync";

/*
|--------------------------------------------------------------------------
| Entry point
|--------------------------------------------------------------------------
*/

const prisma = new PrismaClient();

async function main() {
  const users = await prisma.user.findMany({
    where: { sync: true },
    include: { Platform: true, Youtube: true },
  });

  // for (const user of users) {
  //   try {
  //     await sync(
  //       user as User & { Youtube: Youtube; Platform: Platform },
  //       prisma
  //     );
  //   } catch (err: unknown) {
  //     console.error(err);
  //     continue;
  //   }
  // }
  await Promise.all(
    users.map((user) =>
      sync(user as User & { Youtube: Youtube; Platform: Platform }, prisma)
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
