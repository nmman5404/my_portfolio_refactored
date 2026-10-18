// Case studies retain their existing typography; ordinary blogs use blog CSS.
// Raw HTML remains available for styled tables, image captions and custom UI.
export function configureMarkdown(markdown) {
  const classes = {
    heading_open: 'text-2xl font-bold text-gray-900 dark:text-white mt-8 mb-4 border-b border-gray-200 dark:border-gray-700 pb-2',
    bullet_list_open: 'list-disc pl-5 space-y-2',
  };
  for (const [rule, className] of Object.entries(classes)) {
    const original = markdown.renderer.rules[rule];
    markdown.renderer.rules[rule] = (tokens, index, options, data, renderer) => {
      if (data.kind === 'project' && (rule !== 'heading_open' || tokens[index].tag === 'h2')) {
        tokens[index].attrSet('class', className);
      }
      return original
        ? original(tokens, index, options, data, renderer)
        : renderer.renderToken(tokens, index, options);
    };
  }
}
