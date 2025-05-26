<script lang="ts">
  import Editor from '$lib/components/Editor.svelte';

  let title = '';
  let content = '';

  async function savePost() {
    console.log(content)
    return
    const res = await fetch('/api/posts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title, content, categoryIds: [] })
    });

    const data = await res.json();
    if (data.success) {
      alert('Post saved!');
    } else {
      alert('Error saving post.');
    }
  }
</script>
<div class="max-w-[80%] mx-auto">
	<h1 class="text-xl font-bold mb-4">New Post</h1>
	<div class="flex justify-between items-center gap-2 mb-4">
		<input
		  bind:value={title}
		  placeholder="Post title"
		  class="w-full p-2 border rounded"
		/>
		<button on:click={savePost} class="bg-blue-500 text-white px-4 py-2 rounded">
		  Save
		</button>
	</div>

	<Editor bind:content on:update={(html) => content = html.detail} />
</div>

