import { Configuration, OpenAIApi } from "openai";
import {
  // plantLibraryEntry,
  // plantLibraryEntryFunction,
  // plantOrNot,
  // plantOrNotFunction,
  // provideScientificName,
  // provideScientificNameFunction,
  recommendPlant,
  recommendPlantFunction,
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
  console.log("trying to recommend");
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

  const area = req.body.area || "";
  const lighting = req.body.lighting || ["full sun"];
  const lightingStr = lighting.join(", ");
  const types = req.body.types || ["flower", "herb", "shrub", "vegetable"];
  const typesStr = types.join(", ");
  const soil = req.body.soil || "medium";
  const location = req.body.location || "Southern Finland";
  const display = req.body.display || "namesOnly";
  const requested_amount = req.body.amount || 10;
  const waterTimes = req.body.waterTimes || "2";
  const waterPeriod = req.body.waterPeriod || "week";
  const composition = req.body.composition || false;
  const experience = req.body.experience || "";
  let recs = [];
  let current = 0;

  const funcs = [recommendPlant];
  let requestMessages = [
    {
      role: "system",
      content:
        "You are a gardening advisor. Write in clear, plain English, accessible to novice gardeners.",
    },
    {
      role: "user",
      content:
        `Suggest a hardy plant (${typesStr}) that a ${experience} gardener could grow in a personal garden in ${location}. Soil: ${soil}, lighting conditions: ${lightingStr}. The plant can be watered up to ${waterTimes} times per ${waterPeriod}.` +
          (composition && recs.length > 0
          ? ` Recommend a plant that goes well together with ${recs.join(
              ", "
            )}.`
          : "") + (area
          ? ` The area is ${area} square meters.`
          : ``),
    },
  ];

  async function recommend() {
    console.log(requestMessages[1])
    const complete = await openai.createChatCompletion({
      // model: "gpt-4",
      model: "gpt-3.5-turbo",
      messages: requestMessages,
      functions: funcs,
      // function_call: "auto",
      function_call: {
        name: "recommendPlantFunction",
      },
      temperature: 0.5,
      max_tokens: 2000,
      // stream: false
    });
    return complete;
  }

  //recursive function to request more recommendations until target amount is reached
  async function followup(message, output, current_amount, target_amount) {
    console.log("Followup!")
    requestMessages.push(message);
    // requestMessages.push({
    //   role: "function",
    //   name: "recommendPlantFunction",
    //   content: output,
    // });
    requestMessages.push({
      role: "user",
      content: "Now recommend one more plant to add to the garden.",
    });
    console.log("Request messages:")
    console.log(...requestMessages)
    const complete = await openai.createChatCompletion({
      // model: "gpt-4",
      model: "gpt-3.5-turbo",
      messages: requestMessages,
      functions: funcs,
      // function_call: "auto",
      function_call: {
        name: "recommendPlantFunction",
      },
      temperature: 0.1,
      max_tokens: 3000,
    });
    console.log("Response to followup: " + complete.data)
    const response_message = complete.data.choices[0].message;
    
    if (response_message.function_call) {
      current++;
      console.log("Amount: "+current)
      const function_args = JSON.parse(
        response_message.function_call.arguments
      );
      const function_response = await recommendPlantFunction({
        ...function_args,
      });
      recs.push(function_response)
      // console.log(response_message)
      if (current < target_amount) {
        return followup(
          response_message,
          function_response,
          current,
          requested_amount
        );
      }
      else {
        console.log("Reached the end")
        return res.status(200).json({ type: "Recommendations", result: recs });
      }
    } else {
      console.log("Didn't reach the end")
      return res.status(200).json({ type: "Recommendations", result: recs });
    }
  }

  try {
    console.log("Trying to create completion...");
    const completion = await recommend();
    console.log("Prompt tokens: " + completion.data.usage.prompt_tokens);
    const response_message = completion.data.choices[0].message;
    if (response_message.function_call) {
      current = 1;
      console.log(
        "Completion tokens: " + completion.data.usage.completion_tokens
      );
      console.log(completion.data)
      console.log(response_message)
      //if the AI is calling the function correctly
      try {
        // const available_functions = {
        //   recommendPlantFunction: recommendPlantFunction,
        // };
        // const function_name = response_message.function_call.name;
        // console.log("Calling function: " + function_name);
        // const function_to_call = available_functions[function_name];
        const function_args = JSON.parse(
          response_message.function_call.arguments
        );
        // console.log("arguments: " + JSON.stringify(function_args))
        const function_response = await recommendPlantFunction({
          ...function_args,
        });
        recs.push(function_response)
        // console.log("Function response: " + JSON.stringify(function_response))
        if (current<requested_amount) {
          console.log(current+" out of "+requested_amount)
          return followup(
            response_message,
            function_response,
            current,
            requested_amount
          );
        } else {
          return res
          .status(200)
          .json({ type: "Recommendations", result: function_response });
        }
        
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
      console.log("Finish reason: " + completion.data.choices[0].finish_reason);
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
      return res
        .status(error.response.status)
        .json({ error: error.response.data });
    } else {
      console.error(`Error with OpenAI API request: ${error.message}`);
      return res.status(500).json({
        error: {
          message: "An error occurred during your request.",
        },
      });
    }
  }
}
