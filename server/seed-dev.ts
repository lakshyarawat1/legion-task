import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  // 1. Get the first user to find the active orgId
  const users = await prisma.user.findMany({
    orderBy: { userId: "asc" }
  });
  
  if (users.length === 0) {
    console.log("No users found. Please log into the app first to create your local user.");
    return;
  }

  // Find the first user that has an orgId (or just use the first user's orgId)
  const firstUser = users.find(u => u.orgId) || users[0];
  const orgId = firstUser.orgId || "org_test123";

  if (!firstUser.orgId) {
    console.log(`User ${firstUser.username} has no orgId, assigning dummy orgId: ${orgId}`);
    await prisma.user.update({
      where: { userId: firstUser.userId },
      data: { orgId }
    });
  }

  console.log(`Seeding users for org: ${orgId}`);

  // 2. Create dummy users with different roles
  const dummyUsers = [
    { username: "dummy_admin", role: "ADMIN" },
    { username: "dummy_pm", role: "PROJECT_MANAGER" },
    { username: "dummy_po", role: "PRODUCT_OWNER" },
    { username: "dummy_member", role: "MEMBER" },
    { username: "dummy_guest", role: "GUEST" }
  ];

  for (const dummy of dummyUsers) {
    const clerkId = `mock_${dummy.username}`;
    
    // Check if exists
    const existing = await prisma.user.findUnique({
      where: { clerkUserId: clerkId }
    });

    if (existing) {
      await prisma.user.update({
        where: { userId: existing.userId },
        data: { role: dummy.role, orgId }
      });
      console.log(`Updated ${dummy.username}`);
    } else {
      await prisma.user.create({
        data: {
          clerkUserId: clerkId,
          username: dummy.username,
          role: dummy.role,
          orgId
        }
      });
      console.log(`Created ${dummy.username}`);
    }
  }

  console.log("Seeding complete!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
