// import  {PrismaClient} from "@prisma/client"


// // const  createPrismaClient =()=>{
// //     new PrismaClient({})
// // }
// // const globalForPrisma = globalThis as unknown as {prisma: ReturnType<typeof createPrismaClient> | undefined  }

// // export const db = globalForPrisma.prisma ?? createPrismaClient()

// // globalForPrisma.prisma = db
// export const userRoles = ["admin", "user"]  as const
// export type UserRole = (typeof userRoles)[number] 

// export const db = new PrismaClient()

// server/db.ts
// import { PrismaClient } from '@prisma/client';

// const globalForPrisma = globalThis as unknown as {
//   prisma?: PrismaClient;
// };

// export const db =
//   globalForPrisma.prisma ??
//   new PrismaClient({
//     log: ['warn', 'error'],
//   });
// export const userRoles = ["admin", "user"]  as const
// export type UserRole = (typeof userRoles)[number] 

// if (process.env.NODE_ENV !== 'production') {
//   globalForPrisma.prisma = db;
// }


import { PrismaClient } from '@prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'

const globalForPrisma = global as unknown as {
    prisma: PrismaClient
}

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL,
})

export const db = globalForPrisma.prisma || new PrismaClient({
  adapter,
})

export const userRoles = ["admin", "user"]  as const
export type UserRole = (typeof userRoles)[number] 


