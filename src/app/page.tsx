import { db } from '@/db';
import { drizzleTransactions } from '@/db/schema';
import { asc, eq } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';

export default async function Page() {
  const rows = await db.query.drizzleTransactions.findMany({
    orderBy: asc(drizzleTransactions.id),
  });

  return (
    <div>
      <h1>Insert new rows</h1>
      <form
        action={async (formData) => {
          'use server';
          await db.insert(drizzleTransactions).values({
            value: formData.get('value') as string,
          });
          revalidatePath('/drizzle');
        }}
      >
        <input name="value"></input>
        <button type="submit">Insert new row</button>
      </form>

      <h1>Update current rows, no transactions</h1>
      {rows.map(({ id, value }) => {
        return (
          <div key={id}>
            <p>
              Row ID: {id}, Value: {value}
            </p>
            <form
              action={async (formData) => {
                'use server';
                await db
                  .update(drizzleTransactions)
                  .set({ value: formData.get('value') as string })
                  .where(
                    eq(drizzleTransactions.id, formData.get('id') as string),
                  );
                revalidatePath('/drizzle');
              }}
            >
              <input name="id" type="hidden" value={id}></input>
              <input name="value"></input>
              <button type="submit">Change value</button>
            </form>
          </div>
        );
      })}

      <h1>Update current rows, with transactions</h1>
      {rows.map(({ id, value }) => {
        return (
          <div key={id}>
            <p>
              Row ID: {id}, Value: {value}
            </p>
            <form
              action={async (formData) => {
                'use server';
                await db.transaction(async (tx) => {
                  tx.update(drizzleTransactions)
                    .set({ value: formData.get('value') as string })
                    .where(
                      eq(drizzleTransactions.id, formData.get('id') as string),
                    );
                });
                revalidatePath('/drizzle');
              }}
            >
              <input name="id" type="hidden" value={id}></input>
              <input name="value"></input>
              <button type="submit">Change value</button>
            </form>
          </div>
        );
      })}
    </div>
  );
}
