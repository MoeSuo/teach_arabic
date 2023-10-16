import { Configuration, OpenAIApi } from "openai";
import {
  plantLibraryEntry,
  plantLibraryEntryFunction,
  plantOrNot,
  plantOrNotFunction,
  provideScientificName,
  provideScientificNameFunction,
} from "../../../libs/ai_functions";
import {
  getPlantByScientificName,
  createPlant,
  getPlant,
} from "../../../libs/plantsFuncHandler";

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

export default async function handle(req, res) {
  // console.log("trying to generate");
  if (!configuration.apiKey) {
    console.log("no API key");
    res.status(500).json({
      error: {
        message:
          "OpenAI API key not configured, please follow instructions in README.md",
      },
    });
    return;
  }
  const plant = req.body.name || "";
  const action = req.body.action || "";
  const forced = req.body.force || false;
  console.log("Name entered: " + plant);
  console.log("Action requested: " + action);
  //save plant data that was sent to this endpoint; this is essentially the same as createPlant
  if (action === "saveData") {
    const {
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
    } = { ...req.body.plantData };
    const saved = await createPlant(
      0,
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
      care_advice
      //""
    );
    return res.status(200).json({
      type: "Saved data",
      result: saved,
    });
  }

  if (plant.trim().length === 0) {
    console.log("zero length name");
    return res.status(400).json({
      error: {
        message: "No plant name entered",
      },
    });
  }

  //check that request contains a plant name (GPT interprets too generously, maybe check with Wikipedia instead)
  const checkValidity = await openai.createChatCompletion({
    model: "gpt-3.5-turbo",
    functions: [plantOrNot],
    messages: [
      {
        role: "system",
        content: "You are a gardening advisor.",
      },
      {
        role: "user",
        content: `Determine whether "${plant}" is or isn't a name of a plant.`,
      },
    ],
    function_call: {
      name: "plantOrNotFunction",
    },
  });
  // console.log(checkValidity.data.choices[0].message)
  const validPlant = await plantOrNotFunction({
    ...JSON.parse(
      checkValidity.data.choices[0].message.function_call.arguments
    ),
  });
  console.log("Valid name: " + validPlant);

  if (!validPlant) {
    console.log("Invalid name");
    return res.status(400).json({
      error: {
        message: "Invalid plant name",
      },
    });
  }

  //provide the scientific name
  const checkLatinName = await openai.createChatCompletion({
    model: "gpt-3.5-turbo",
    functions: [provideScientificName],
    messages: [
      {
        role: "system",
        content: "You are a gardening advisor.",
      },
      {
        role: "user",
        content: `Provide the scientific name of {${plant}}.`,
      },
    ],
    function_call: {
      name: "provideScientificNameFunction",
    },
  });

  const latinName = await provideScientificNameFunction({
    ...JSON.parse(
      checkLatinName.data.choices[0].message.function_call.arguments
    ),
  });
  console.log(latinName);

  //check whether a db entry with the same scientific name already exists
  const existingEntry = await getPlantByScientificName(latinName);
  // const existingEntry = false;
  if (existingEntry && !forced) {
    //return existing entry
    console.log("Existing entry found");
    return res
      .status(200)
      .json({ type: "Existing entry", result: existingEntry });
  } else {
    //generate new entry and add to db
    const funcs = [plantLibraryEntry];
    const requestMessages = [
      {
        role: "system",
        content:
          "You are a gardening advisor. Write in clear, plain English, accessible to novice gardeners.",
      },
      {
        role: "user",
        content: `Write a knowledge library entry for ${latinName}.`,
      },
    ];
    try {
      console.log("Trying to create completion...");
      const completion = await openai.createChatCompletion({
        //model: "gpt-4-0613",
        model: "gpt-3.5-turbo",
        messages: requestMessages,
        functions: funcs,
        // function_call: "auto",
        function_call: {
          name: "plantLibraryEntryFunction",
        },
        temperature: 0,
        // max_tokens: 1000,
        // stream: false
      });
      console.log("Prompt tokens: " + completion.data.usage.prompt_tokens);
      const response_message = completion.data.choices[0].message;
      if (response_message.function_call) {
        console.log(
          "Completion tokens: " + completion.data.usage.completion_tokens
        );
        //if the AI is calling the function correctly
        try {
          //I'm leaving it like this because I might want to try letting GPT choose functions
          const available_functions = {
            plantLibraryEntryFunction: plantLibraryEntryFunction,
          };
          const function_name = response_message.function_call.name;
          // console.log("Calling function: " + function_name);
          const function_to_call = available_functions[function_name];
          const function_args = JSON.parse(
            response_message.function_call.arguments
          );
          // console.log("arguments: " + JSON.stringify(function_args))
          const function_response = await function_to_call({
            ...function_args,
          });
          // console.log("Function response: " + JSON.stringify(function_response))
          if (action === "generateAndSave") {
            //if we want to save generated content to library db immediately
            const {
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
            } = { ...function_response };
            await createPlant(
              0,
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
              care_advice
              //""
            );
          }
          return res
            .status(200)
            .json({ type: "New entry", result: function_response });
        } catch (error) {
          console.log("Function called but does not work");
          console.log(error);
          return res.status(400).json({
            error: {
              message:
                "Function called but does not work: " +
                JSON.stringify(completion.data.choices[0].message),
            },
          });
        }
      } else {
        //if the AI is not calling the function
        console.log(
          "Finish reason: " + completion.data.choices[0].finish_reason
        );
        return res.status(400).json({
          error: {
            message:
              "AI refuses to call the function: " +
              JSON.stringify(completion.data.choices[0].message),
          },
        });
      }
    } catch (error) {
      // Consider adjusting the error handling logic for your use case
      if (error.response) {
        console.error(error.response.data);
        res.status(error.response.status).json({ error: error.response.data });
      } else {
        console.error(`Error with OpenAI API request: ${error.message}`);
        res.status(500).json({
          error: {
            message: "An error occurred during your request.",
          },
        });
      }
    }
  }
}
