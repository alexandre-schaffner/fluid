"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const client_1 = require("@prisma/client");
const sync_1 = require("./sync/sync");
const prisma = new client_1.PrismaClient();
async function main() {
    const users = await prisma.user.findMany({
        where: { sync: true },
        include: { Platform: true, Youtube: true },
    });
    for (const user of users) {
        try {
            await (0, sync_1.sync_v2)(user, prisma);
        }
        catch (err) {
            console.error(err);
            continue;
        }
    }
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
//# sourceMappingURL=main.js.map