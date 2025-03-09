import { PrismaClient, Prisma } from "@prisma/client";
import fs from 'fs';
import path from "path"

async function deleteAllData(orderedFileNames: string[]) {
    const modelNames = orderedFileNames.map((filename) => {
        const modelName = path.basename(filename, path.extname(filename))
        return modelName.charAt(0).toUpperCase() + modelName.slice(1);
    });

    for (const modelName of modelNames) {
        const model: any = Prisma[modelName as keyof typeof Prisma];
        try {
            await model.deleteMany({});
            console.log(`Cleared data from ${modelName}`);
        }
        catch (err) {
            console.error(`Failed to clear data from ${modelName}`);
        }
    }
}

async function main() {
    const dataDirectory = path.join(__dirname, "data");

    const orderedFileNames = [
            "team.json",
    "project.json",
    "projectTeam.json",
    "user.json",
    "task.json",
    "attachment.json",
    "comment.json",
    "taskAssignment.json",
    ]
    await deleteAllData(orderedFileNames);

    for (const fileName of orderedFileNames) {
        const filePath = path.join(dataDirectory, fileName);
        const jsonData = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
        const modelName = path.basename(fileName, path.extname(fileName));
        const model: any = Prisma[modelName as keyof typeof Prisma];

        try {
            for (const data of jsonData) {
                await model.create({ data });
            }
            console.log(`seeded data from ${modelName}`);
        } catch (err) {
            console.error(`Failed to seed data from ${modelName}`);
        }
    }
}

const prisma = new PrismaClient();

main().catch((e) => console.error(e)).finally(async () => await prisma.$disconnect());