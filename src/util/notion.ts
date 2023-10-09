// TODO create Notion utilities

export async function notionApi(
  endpoint: string,
  body: {} | null,
  method: "GET" | "POST" = "POST"
) {
  const res = await fetch(`https://api.notion.com/v1/${endpoint}`, {
    method,
    headers: {
      "Content-Type": "application/json",
      "Notion-Version": "2022-06-28",
      Authorization: `Bearer ${process.env.NOTION_SECRET}`,
    },
    ...(body && { body: JSON.stringify(body) }),
  }).catch((err) => console.error(err));

  if (!res || !res.ok) {
    console.error(res);
    throw new Error(`Error: ${res}`);
  }

  return res.json();
}

export async function getNotionDatabase(databaseId?: string) {
  const db = databaseId ?? process.env.NOTION_DATABASE_ID;
  const res = await notionApi(`databases/${db}/query`, {
    page_size: 100,
  });

  return res;
}

export async function addNotionPage(properties: {} = {}) {
  const db = process.env.NOTION_DATABASE_ID;
  const res = await notionApi("pages", {
    parent: {
      database_id: db,
    },
    properties,
  });

  return res;
}
