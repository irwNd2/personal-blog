// src/routes/api/posts/+server.ts
import { json } from '@sveltejs/kit';
import { prisma } from '$lib/db/client';
import slugify from '$lib/utils/slugify';

export async function POST({ request }) {
  try {
    const { title, content, categoryIds } = await request.json();

    const slug = slugify(title);

    const post = await prisma.post.create({
      data: {
        title,
        slug,
        content,
        categories: {
          connect: categoryIds.map((id: string) => ({ id }))
        }
      }
    });

    return json({ success: true, post });
  } catch (err) {
    console.error('Post creation error:', err);
    return json({ success: false, error: 'Failed to create post' }, { status: 500 });
  }
}

