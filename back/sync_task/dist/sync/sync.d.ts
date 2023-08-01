import { Platform, PrismaClient, User, Youtube } from "@prisma/client";
export declare function sync_v2(user: User & {
    Platform: Platform;
    Youtube: Youtube;
}, prisma: PrismaClient): Promise<void>;
