import { Handler } from "@netlify/functions";
import { getUserEmail, slackApi, verifySlackRequest } from "./util/slack";
import { addNotionPage } from "./util/notion";
import { uploadFile } from "./util/db";
import { today } from "./util/parse";

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

  // return {
  //   statusCode: 200,
  //   body: "OK",
  // };

  // handle message with file, especially photo
  if (body.event.subtype === "file_share") {
    const fileData = body.event.files?.map((item) => ({
      id: item.id,
      created: item.created,
      name: item.name,
      mimetype: item.mimetype,
      user: item.user,
      url_private_download: item.url_private_download,
    }));

    try {
      const blobs = await Promise.all(
        fileData.map(
          async (item) =>
            await fetch(item.url_private_download, {
              headers: {
                Authorization: `Bearer ${process.env.SLACK_BOT_OAUTH_TOKEN}`,
              },
            }).then((res) => res.blob())
        )
      );

      const uploadResult = await Promise.all(
        blobs.map(async (blob, index) => {
          const { user, created, id } = fileData[index];
          const result = await uploadFile({
            name: `${today()}/${user}/${created}_${id}`,
            blob,
          });
          return result;
        })
      );

      const userEmail = await getUserEmail(body.event.user);

      const data = {
        user_slack_id: body.event.user,
        user_email: userEmail,
        text: body.event.text,
        files: fileData,
        filePath: uploadResult
          .map((item) => item?.path)
          .filter((item) => !!item),
      };

      await addNotionPage({
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
          url: data.filePath.join(","),
        },
        이메일: {
          email: data.user_email,
        },
      });

      return {
        statusCode: 200,
      };
    } catch (e) {
      console.log(e);
      return {
        statusCode: 400,
        body: "Invalid request",
      };
    }
  }

  return {
    statusCode: 200,
  };
};
