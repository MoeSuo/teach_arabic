import { authOptions } from "../../pages/api/auth/[...nextauth]";
import { getServerSession } from "next-auth/next";
import {
  createUserPlant,
  updateUserPlant,
  getAllUserPlants,
  getUserPlant,
  deleteUserPlant,
} from "../../../libs/userPlantsFuncHandler.js";

export default async function handle(req, res) {
  try {
    const session = await getServerSession(req, res, authOptions); 
    console.log("The Session:", session);
    console.log("Request body:", req.body);
    if (!session) {
      return res.status(401).json({ error: "Unauthorized" });
    }
    const userId = session.user.id;
    switch (req.method) {
      case "GET": {
        if (req.query.id) {
          const plant = await getUserPlant(req.query.id);

          // http://localhost:3000/api/userPlants?id=64cc7bd111649b052b2bd9b1
          return res.status(200).json(plant);
        } else {
          const plants = await getAllUserPlants(userId);
          console.log(plants);
          return res.json(plants);
        }
      }
      case "POST": {
        const userId = req.body.userId;
        const common_name = req.body.common_name;
        const scientific_name = req.body.scientific_name;
        const image = req.body.image;
        const plant_age = req.body.plant_age;
        const planting_date = req.body.planting_date;
        const individual_advice = req.body.individual_advice;
        // const notes = req.body.notes;
        // const library = req.body.library;
        //  const plantId = req.body.plantId;

        const plant = await createUserPlant(
          userId,
          common_name,
          scientific_name,
          image,
          plant_age,
          planting_date,
          individual_advice
          // notes,
          // library,
          // plantId,
        );

        return res.json(plant);
      }

      case "PUT": {
        const { id, ...updateData } = req.body;
        const updatedPlant = await updateUserPlant(id, updateData);
        return res.json(updatedPlant);
      }
      case "DELETE": {
        const id = req.query.id;
        const plantDelete = await deleteUserPlant(id);
        return res.json(plantDelete);
      }
      default:
        break;
    }
  } catch (error) {
    return res.status(500).json({ ...error, message: error.message });
  }
}
