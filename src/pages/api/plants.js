import {
  createPlant,
  updatePlant,
  getAllPlants,
  getPlant,
  getPlantByScientificName,
  deletePlant,
  getPlantsByPage,
  getPlantsByPageBack,
  searchPlants, // function for search by type/common_name
} from "../../../libs/plantsFuncHandler";

export default async function handle(req, res) {
  try {
    switch (req.method) {
      case "GET": {
        if (req.query.id) {
          // Fetch a specific plant by id
          const plant = await getPlant(req.query.id);
          return res.status(200).json(plant);
        } else if (req.query.search && req.query.field) {
          // Search for plants based on the search query and the specified field, including the pagination.
          const searchQuery = req.query.search.toString();
          const searchField = req.query.field.toString(); // Get the specified field from the query parameter
          const page = Number(req.query.page); //For the pagination
          const pageSize = Number(req.query.pageSize || 10); //For the pagination
          const searchResults = await searchPlants(searchQuery, searchField, page, pageSize);
          return res.status(200).json(searchResults);
        } else if (req.query.scientific_name) {
          // http://localhost:3000/api/plants?scientific_name=rose
          const plant = await getPlantByScientificName(
            req.query.scientific_name
          );
          if (!plant) {
            return res.status(404).end();
          } else {
            return res.status(200).json(plant);
          }
        }
        // else {
        //   // Otherwise, fetch all plants
        //   const plants = await getAllPlants();
        //   return res.json(plants);
        // }

        // GET pagenation********************
        else {
          const page = parseInt(req.query.page); // Get the requested page number from the query
          const pageSize = parseInt(req.query.pageSize); // Get the requested page size from the query

          const plants = await getPlantsByPage(page, pageSize);
          return res.status(200).json(plants); // Send the fetched plants as a response
        }
      }



      case "POST": {
        const trefle_id = req.body.trefle_id;
        const common_name = req.body.common_name;
        const scientific_name = req.body.scientific_name;
        const image_url = req.body.image_url;
        const type = req.body.type;
        const lighting = req.body.lighting;
        const diseases = req.body.diseases;
        const description = req.body.description;
        const blooming_period = req.body.blooming_period;
        const dimensions = req.body.dimensions;
        const hardiness = req.body.hardiness;
        const soil_ph_min = req.body.soil_ph_min;
        const soil_ph_max = req.body.soil_ph_max;
        const life_cycle = req.body.life_cycle;
        const care_advice = req.body.care_advice;
        const plantId = req.body.plantId;

        const plant = await createPlant(
          trefle_id,
          common_name,
          scientific_name,
          image_url,
          type,
          lighting,
          diseases,
          description,
          blooming_period,
          dimensions,
          hardiness,
          soil_ph_min,
          soil_ph_max,
          life_cycle,
          care_advice,
          plantId
        );

        return res.json(plant);
      }

      case "PUT": {
        const { id, ...updateData } = req.body;
        const updatedPlant = await updatePlant(id, updateData);
        return res.json(updatedPlant);
      }
      case "DELETE": {
        const id = req.query.id;
        const plantDelete = await deletePlant(id);
        return res.json(plantDelete);
      }
      default:
        break;
    }
  } catch (error) {
    return res.status(500).json({ ...error, message: error.message });
  }
}
