export const getImageUrl = (args: { url: string; width: number }) =>
  `https://conorroberts.com/cdn-cgi/image/width=${args.width}/${args.url}`;
