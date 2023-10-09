import { Handler } from "@netlify/functions";
import { getUserEmail, verifySlackRequest } from "./util/slack";
import { addNotionPage } from "./util/notion";

export const handler: Handler = async (event) => {
  const valid = verifySlackRequest(event);

  if (!valid) {
    console.log("Invalid request");

    return {
      statusCode: 400,
      body: "Invalid request",
    };
  }

  const body = JSON.parse(event.body ?? "") as
    | SlackURLVerificationEventPayload
    | SlackEventPayload;

  if (body.type === "url_verification") {
    return {
      statusCode: 200,
      "Content-Type": "text/plain",
      body: body.challenge,
    };
  }

  if (body.event.subtype === "file_share") {
    const userEmail = await getUserEmail(body.event.user);

    const data = {
      user_id: body.event.user,
      user_email: userEmail,
      text: body.event.text,
      files: body.event.files?.map((item) => ({
        id: item.id,
        created: item.created,
        name: item.name,
        mimetype: item.mimetype,
        user: item.user,
        size: item.size,
        url_private: item.url_private,
        url_private_download: item.url_private_download,
      })),
    };

    const result = await addNotionPage({
      태그: {
        multi_select: [
          {
            name: "photo",
            color: "red",
          },
        ],
      },
      이름: {
        title: [
          {
            text: {
              content: data.text,
            },
          },
        ],
      },
      URL: {
        url: data.files[0].url_private,
      },
      이메일: {
        email: data.user_email,
      },
    });
  }

  return {
    statusCode: 200,
    "Content-Type": "text/plain",
    body: body.challenge,
  };
};
