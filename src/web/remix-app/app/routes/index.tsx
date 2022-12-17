import { useLoaderData } from '@remix-run/react';
// import promptQueueInstance from 'utils/db.server';
import prisma from '../../../../personal-data-collection/infrastructure/prisma-client';

export const loader = async () => {
  const data = await prisma.recurringQuestion.findMany({
    include: {
      answers: true,
    }
  });

  return data;
}

export default function Index() {
  const data = useLoaderData<typeof loader>();

  return (
    <div style={{ fontFamily: "system-ui, sans-serif", lineHeight: "1.4" }}>
      {data.map(question => {
        let answers = question.answers.map(answer => {
          return <p>{answer.timestamp}: {String(answer.response)}</p>
        });
        return (
          <div>
            <h2>{question.question}</h2>
            <h3>{answers}</h3>
          </div>
        );
      })}
    </div>
  );
}
