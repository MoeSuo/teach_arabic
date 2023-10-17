// to handle reuests related to user/s
import {
  createUser,
  getAllUsers,
  getUser,
  deleteUser,
  updateUser,
} from "../../../libs/usersFuncHandler";

export default async function handle(req, res) {
  try {
    switch (req.method) {
      case "GET": {
        if (req.query.id) {
          //http://localhost:3000/api/users?id=64a95a8d5efe31c392445f33

          const user = await getUser(req.query.id);
          return res.status(200).json(user);
        } else {
          const users = await getAllUsers();
          console.log(users);
          return res.json(users);
        }
      }
      case "POST": {
        const { email, name, image } = req.body;
        const user = await createUser(email, name, image);
        return res.json(user);
      }
     
      
      case "PUT": {
        const { id, image, ...updateData } = req.body;

        // Handle image data if it's provided
        let imageData = null;
        if (image) {
          // Assuming image is a Base64 string, store it directly as a string
          imageData = image;
        }

        // Merge updateData with image data if available
        const updatedUser = await updateUser(id, {
          ...updateData,
          image: imageData, // Store the Base64 image data as a string
        });

        return res.json(updatedUser);
      }

      
      case "DELETE": {
        const id = req.query.id;
        const user = await deleteUser(id);
        return res.json(user);
      }
      default:
        break;
    }
  } catch (error) {
    return res.status(500).json({ ...error, message: error.message });
  }
}