import { promptQueue } from '../../../../personal-data-collection/domain/index';
import { useLoaderData } from '@remix-run/react';
import { json } from "@remix-run/node";

export const loader = async() => {
  return json ({
    data: await promptQueue.query()
  })
}

export default function Index() {
  const data = useLoaderData<typeof loader>();
  console.log(data);
  return (
    <div style={{ fontFamily: "system-ui, sans-serif", lineHeight: "1.4" }}>
      <p>{data.data}</p>
    </div>
  );
}
