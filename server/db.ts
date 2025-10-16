import  {PrismaClient} from "@/generated/prisma"


// const  createPrismaClient =()=>{
//     new PrismaClient({})
// }
// const globalForPrisma = globalThis as unknown as {prisma: ReturnType<typeof createPrismaClient> | undefined  }

// export const db = globalForPrisma.prisma ?? createPrismaClient()

// globalForPrisma.prisma = db
export const userRoles = ["admin", "user"]  as const
export type UserRole = (typeof userRoles)[number] 

export const db = new PrismaClient()
