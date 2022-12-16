import { useLoaderData } from '@remix-run/react';
import prisma from '../../../../personal-data-collection/infrastructure/prisma-client';

export const loader = async() => {
  const data = await prisma.recurringQuestion.findMany();

  return data;
}

export default function Index() {
  const data = useLoaderData<typeof loader>();

  return (
    <div style={{ fontFamily: "system-ui, sans-serif", lineHeight: "1.4" }}>
      <ul>
        {data.map(question => (
          <p>{question.question}</p>
        ))}
      </ul>
    </div>
  );
}
