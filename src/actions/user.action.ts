"use server";

import prisma from "@/lib/prisma";
import { auth, currentUser } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";

export async function syncUser() {
  try {
    const { userId } = await auth();
    const user = await currentUser();
    if (!userId || !user) return;
    const existingUser = await prisma.user.findUnique({
      where: {
        clerkId: userId,
      },
    });
    if (existingUser) return existingUser;
    const dbUser = await prisma.user.create({
      data: {
        clerkId: userId,
        name: `${user.firstName || ""} ${user.lastName || ""}`,
        username:
          user.username ?? user.emailAddresses[0].emailAddress.split("@")[0],
        email: user.emailAddresses[0].emailAddress,
        image: user.imageUrl,
      },
    });
    return dbUser;
  } catch (error) {
    console.log("Error in syncUser", error);
  }
}

export async function getUserByClerkId(clerkId: string) {
  return prisma.user.findUnique({
    where: {
      clerkId,
    },
    include: {
      _count: {
        select: {
          followers: true,
          following: true,
          posts: true,
        },
      },
    },
  });
}

export async function getRandomUser(){
  try {
    const userId = await getDbUserId();
    if(!userId) return [];
    const randomUsers = await prisma.user.findMany({
      where:{
        AND:[
          {NOT:{id:userId}},
          {NOT:{
            followers:{
              some:{
                followerId:userId
              }
            }
          }}
        ]
      },
      select:{
        id:true,
        name:true,
        username:true,
        image:true,
        _count:{
          select:{
            followers:true,
          }
        }
      },
      take:3,
    })
    return randomUsers;
  } catch (error) {
    console.log('user action randomUsers error',error)
    return [];
  }
}

export async function toggleFollow(targetId:string){
    try {
      const userId = await getDbUserId();
      if(!userId) return;
      if(userId === targetId) throw new Error("You cannot follow yourself")
      const existingFollow = await prisma.follows.findUnique({
        where:{
          followerId_followingId:{
            followerId:userId,
            followingId:targetId
          }
        }
      })
      if(existingFollow){
        await prisma.follows.delete({
          where:{
            followerId_followingId:{
              followerId:userId,
              followingId:targetId
            }
          }
        })
      }else{
          await prisma.$transaction([
            prisma.follows.create({
              data:{
                followerId:userId,
                followingId:targetId
              }
            }),
            prisma.notification.create({
              data:{
                type:"FOLLOW",
                userId:targetId,
                creatorId:userId,
              }
            })
          ])
      }
      revalidatePath('/')
      return {success:true}
    } catch (error) {
      console.log('Error in togglefollow',error)
      return {success:false}
    }
}

export async function getDbUserId() {
    const { userId: clerkId } = await auth();
    if (!clerkId) return null;
    const user = await getUserByClerkId(clerkId);
    if (!user) return null;
    return user.id;
}
