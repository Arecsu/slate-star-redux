import type { WP_REST_API_Posts } from 'wp-types';

async function fetchAndSortPosts(): Promise<WP_REST_API_Posts> {
  console.log('Fetching all posts from the API…');
  const baseUrl = 'https://slatestarcodex.com/wp-json/wp/v2/posts?per_page=100';

  const firstPageResponse = await fetch(`${baseUrl}&page=1`);
  if (!firstPageResponse.ok) {
    throw new Error('Failed to fetch posts');
  }

  // Parse total pages header
  const totalPages = parseInt(
    firstPageResponse.headers.get('X-WP-TotalPages') ?? '0',
    10
  );

  // Tell TS this JSON is the array-of-posts shape
  const firstPagePosts = (await firstPageResponse.json()) as WP_REST_API_Posts;
  const allPosts: WP_REST_API_Posts = [...firstPagePosts];

  if (totalPages > 1) {
    const fetchPromises: Promise<WP_REST_API_Posts>[] = [];

    for (let page = 2; page <= totalPages; page++) {
      fetchPromises.push(
        fetch(`${baseUrl}&page=${page}`)
          .then(res => {
            if (!res.ok) throw new Error(`Failed to fetch page ${page}`);
            return res.json();
          })
          .then(json => json as WP_REST_API_Posts)
      );
    }

    // Flatten all the pages into one array
    const otherPages = await Promise.all(fetchPromises);
    allPosts.push(...otherPages.flat());
  }

  // Sort by `date` field (newest first)
  return allPosts.sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );
}

// Export the promise; Astro (or your framework) can await it when importing.
export const posts = fetchAndSortPosts();
