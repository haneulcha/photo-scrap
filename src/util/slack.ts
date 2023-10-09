import type { HandlerEvent } from "@netlify/functions";

import { createHmac } from "crypto";

export function slackApi(
  endpoint: SlackApiEndpoint,
  body: SlackApiRequestBody | null = null,
  method: "POST" | "GET" = "POST"
) {
  return fetch(`https://slack.com/api/${endpoint}`, {
    method,
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      Authorization: `Bearer ${process.env.SLACK_BOT_OAUTH_TOKEN}`,
    },
    ...(body && { body: JSON.stringify(body) }),
  }).then((response) => response.json());
}

export function verifySlackRequest(request: HandlerEvent) {
  const secret = process.env.SLACK_SIGNING_SECRET!;
  const signature = request.headers["x-slack-signature"];
  const timestamp = Number(request.headers["x-slack-request-timestamp"]);
  const now = Math.floor(Date.now() / 1000);

  if (Math.abs(now - timestamp) > 60 * 5) {
    return false;
  }

  const hash = createHmac("sha256", secret)
    .update(`v0:${timestamp}:${request.body}`)
    .digest("hex");

  return `v0=${hash}` === signature;
}

export async function getUserEmail(userId: string) {
  const params = new URLSearchParams({
    user: userId,
  });

  try {
    const response: SlackUserInfoResponse = await slackApi(
      `users.info?${params.toString()}`,
      null,
      "GET"
    );

    if (!response || !response.ok) {
      console.log("Failed to get user info", response);
      return null;
    }

    return response.user.profile.email;
  } catch (error) {
    console.log(error);
  }
}

export const blocks = {
  markdown: ({ text }: SectionBlockArgs): SlackBlockSection => ({
    type: "section",
    text: {
      type: "mrkdwn",
      text,
    },
  }),
  input: ({
    id,
    label,
    placeholder,
    initial_value = "",
  }: InputBlockArgs): SlackBlockInput => ({
    type: "input",
    block_id: `${id}_input`,
    label: {
      type: "plain_text",
      text: label,
      emoji: true,
    },
    element: {
      type: "plain_text_input",
      action_id: id,
      placeholder: {
        type: "plain_text",
        text: placeholder,
        emoji: true,
      },
      initial_value: initial_value,
    },
  }),
  select: ({
    id,
    label,
    placeholder,
    options,
  }: SelectBlockArgs): SlackBlockInput => ({
    block_id: `${id}-block`,
    type: "input",
    label: {
      type: "plain_text",
      text: label,
      emoji: true,
    },
    element: {
      type: "static_select",
      action_id: id,
      placeholder: {
        type: "plain_text",
        text: placeholder,
        emoji: true,
      },
      options: options.map(({ label, value }) => ({
        text: {
          type: "plain_text",
          text: label,
          emoji: true,
        },
        value,
      })),
    },
  }),
  datepicker: ({
    id,
    initial_date,
  }: {
    id: string;
    initial_date: string;
  }): SlackBlockInput => ({
    block_id: `${id}_block`,
    type: "input",
    element: {
      type: "datepicker",
      initial_date,
      placeholder: {
        type: "plain_text",
        text: "이번 주 챕터 미팅 날짜를 선택해주세요.",
        emoji: true,
      },
      action_id: "datepicker_action",
    },
    label: {
      type: "plain_text",
      text: "이번 주 챕터 미팅",
      emoji: true,
    },
  }),
};

export const views = {
  modal: ({
    trigger_id,
    id,
    title,
    submit_text = "확인",
    blocks,
  }: ModalArgs) => ({
    trigger_id,
    view: {
      type: "modal",
      callback_id: id,
      title: {
        type: "plain_text",
        text: title,
        emoji: true,
      },
      submit: {
        type: "plain_text",
        text: submit_text,
        emoji: true,
      },
      blocks,
    },
  }),
};
