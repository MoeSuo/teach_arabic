// handle crud operations on user/s
import prisma from "./prismadb";

// READ
export const getAllUsers = async () => {
  const users = await prisma.user.findMany({});

  const formattedUsers = [];

  for (const user of users) {
    formattedUsers.push({
      id: user.id,
      name: user.name,
      email: user.email,
      image: user.image,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    });
  }
  return formattedUsers;
};

export const getUser = async (id) => {
  const user = await prisma.user.findUnique({
    where: { id },
  });
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    image: user.image,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  };
};

// CREATE
export const createUser = async (email, name, image) => {
  const user = await prisma.user.create({
    data: {
      email,
      name,
      image,
    },
  });
  return user;
};

// UPDATE
export const updateUser = async (id, updateData) => {
  const user = await prisma.user.update({
    where: {
      id,
    },
    data: {
      ...updateData,
    },
  });
  return user;
};

// DELETE
export const deleteUser = async (id) => {
  const user = await prisma.user.delete({
    where: {
      id,
    },
  });
  return user;
};
