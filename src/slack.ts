import type { Handler } from "@netlify/functions";

import { parse } from "querystring";
import { slackApi, verifySlackRequest, blocks, views } from "./util/slack";
import { getNotionDatabase, notionApi } from "./util/notion";

async function handleInteractivity(payload: SlackModalPayload) {
  const callback_id = payload.callback_id ?? payload.view.callback_id;

  console.log({ callback_id });
  switch (callback_id) {
    case "ham-modal":
      const values = payload.view.state.values;
      console.log({ values });

      const fields = {
        ham: values.ham_input_input.ham_input.value,
        date: values.ham_datepicker_block.datepicker_action.selected_date,
      };
      console.log({ fields });

      const response = await slackApi("chat.postMessage", {
        channel: payload.channel?.id ?? "C060DRD4W6L",
        text: `🐖 loves ${fields.ham} on ${fields.date}`,
      });

      if (!response.ok) {
        console.log(response);
        return {
          statusCode: 400,
          text: `Error: ${response.error}`,
        };
      }
      break;
  }

  return {
    statusCode: 200,
    body: "",
  };
}

async function handleSlashCommand(payload: SlackSlashCommandPayload) {
  // TODO handle slash commands
  switch (payload.command) {
    case "/ham":
      // const response = await slackApi("chat.postMessage", {
      //   channel: payload.channel_id,
      //   text: "🐖 did you call me",
      // });

      // const response = await slackApi(
      //   "views.open",
      //   views.modal({
      //     id: "ham-modal",
      //     title: "🐖 loves what",
      //     trigger_id: payload.trigger_id,
      //     blocks: [
      //       blocks.markdown({ text: ":pig: loves what" }),
      //       blocks.input({
      //         label: "🐖 loves",
      //         placeholder: "🐖 loves",
      //         id: "ham_input",
      //       }),
      //       blocks.datepicker({
      //         id: "ham_datepicker",
      //         initial_date: new Date().toISOString().split("T")[0].toString(),
      //       }),
      //     ],
      //   })
      // );

      const response = await getNotionDatabase();

      if (!response.ok) {
        console.log(response);
        return {
          statusCode: 400,
          text: `Error: ${response.error}`,
        };
      }
      break;

    default:
      return {
        statusCode: 200,
        text: `Unknown command: ${payload.command}`,
      };
  }

  return {
    statusCode: 200,
    body: "",
  };
}

export const handler: Handler = async (event) => {
  // TODO validate the Slack request
  const valid = verifySlackRequest(event);

  if (!valid) {
    console.log("Invalid request");

    return {
      statusCode: 400,
      body: "Invalid request",
    };
  }

  const body = parse(event.body ?? "") as SlackPayload;

  if (body.command) {
    return handleSlashCommand(body as SlackSlashCommandPayload);
  }

  if (body.payload) {
    const payload = JSON.parse(body.payload) as SlackModalPayload;
    return handleInteractivity(payload);
  }

  return {
    statusCode: 200,
    body: "TODO: handle Slack commands and interactivity",
  };
};
