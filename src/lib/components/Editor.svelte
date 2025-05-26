<script>
	import { onMount, onDestroy, createEventDispatcher, tick } from 'svelte';
	import { Editor } from '@tiptap/core';
	import StarterKit from '@tiptap/starter-kit';
  	import Bold from '@tiptap/extension-bold';
	import Italic from '@tiptap/extension-italic';
	import Underline from '@tiptap/extension-underline';
	import Heading from '@tiptap/extension-heading';
	import Paragraph from '@tiptap/extension-paragraph';
	import BulletList from '@tiptap/extension-bullet-list';
	import OrderedList from '@tiptap/extension-ordered-list';
	import ListItem from '@tiptap/extension-list-item';
	import Link from '@tiptap/extension-link';
	import Code from '@tiptap/extension-code';
	import TextAlign from '@tiptap/extension-text-align';
	import History from '@tiptap/extension-history';
	import Subscript from '@tiptap/extension-subscript';
	import Superscript from '@tiptap/extension-superscript';
	import Placeholder from '@tiptap/extension-placeholder';

	const dispatch = createEventDispatcher()
	let element;
	let editor;
	let editorState = {}
	
	onMount(async () => {
	    await tick()
	    editor = new Editor({
	      element,
	      extensions: [
	      Placeholder.configure({
		    placeholder: 'Type here...',
		  }),
		StarterKit.configure({
		    heading: false,       // prevent duplicate if you're configuring it separately
		    bold: false,
		    italic: false,
		    code: false,
		    history: false,
		    paragraph: false,
		    bulletList: false,
		    orderedList: false,
		    listItem: false
		}),
		Bold,
		Italic,
		Underline,
		Heading.configure({ levels: [1, 2, 3] }),
		Paragraph,
		BulletList,
		OrderedList,
		ListItem,
		Link,
		Code,
		History,
		Subscript,
		Superscript,
		TextAlign.configure({ types: ['heading', 'paragraph'] }),
	      ],
	      content: '',
	      editorProps: {
		attributes: {
		  class: 'prose focus:outline-none'
		}
	      },
	      onUpdate: ({ editor }) => {
		dispatch('update', editor.getHTML());
	      },
	      onTransaction: ({ editor }) => updateEditorState(editor),
	    });
	  });

	onDestroy(() => {
		if (editor) {
			editor.destroy();
		}
	});

	function updateEditorState(editor) {
	    editorState = {
	      bold: editor.isActive('bold'),
	      italic: editor.isActive('italic'),
	      underline: editor.isActive('underline'),
	      center: editor.isActive({ textAlign: 'center' }),
	      h1: editor.isActive('heading', { level: 1 }),
	      h2: editor.isActive('heading', { level: 2 }),
	      bulletList: editor.isActive('bulletList'),
	      orderedList: editor.isActive('orderedList'),
	      code: editor.isActive('code'),
	      superscript: editor.isActive('superscript'),
	      subscript: editor.isActive('subscript'),
	      left: editor.isActive({ textAlign: 'left' }),
	      right: editor.isActive({ textAlign: 'right' })
	    }
        };
</script>

{#if editor}
  <div class="flex flex-wrap gap-1 mb-4">
    <button on:click={() => editor.chain().focus().undo().run()}>↶</button>
    <button on:click={() => editor.chain().focus().redo().run()}>↷</button>
    <button on:click={() => editor.chain().focus().toggleHeading({ level: 1 }).run()} class:active={editorState.h1} >H1</button>
    <button on:click={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} class:active={editorState.h2}>H2</button>
    <button on:click={() => editor.chain().focus().toggleBulletList().run()} class:active={editorState.bulletList}>• List</button>
    <button on:click={() => editor.chain().focus().toggleOrderedList().run()} class:active={editor.orderedList}>1. List</button>
    <button on:click={() => editor.chain().focus().toggleBold().run()} class:active={editorState.bold}>B</button>
    <button on:click={() => editor.chain().focus().toggleItalic().run()} class:active={editorState.italic}>I</button>
    <button on:click={() => editor.chain().focus().toggleUnderline().run()} class:active={editorState.underline}>U</button>
    <button on:click={() => editor.chain().focus().toggleCode().run()} class:active={editorState.code}>Code</button>
    <button on:click={() => editor.chain().focus().toggleSuperscript().run()} class:active={editorState.superscript}>x²</button>
    <button on:click={() => editor.chain().focus().toggleSubscript().run()} class:active={editorState.subscript}>x₂</button>
    <button on:click={() => editor.chain().focus().setTextAlign('left').run()} class:active={editorState.left}>Left</button>
    <button
	  on:click={() => editor.chain().focus().setTextAlign('center').run()}
	  class:active={editorState.center}
	>
	  Center
    </button>
    <button on:click={() => editor.chain().focus().setTextAlign('right').run()} class:active={editorState.right}>Right</button>
  </div>
<p>{editorState.bold}</p>
{/if}

<div bind:this={element} class="tiptap prose max-w-none min-h-[80vh] p-6 border rounded shadow bg-white" />

<style lang="postcss">
@reference "tailwindcss";
  button {
    padding: 4px 8px;
    border: 1px solid #ddd;
    border-radius: 4px;
    background: #f8f8f8;
  }
  .active {
    @apply bg-green-400;  
  }

</style>


