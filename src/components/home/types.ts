// Interface untuk Post API
export type iPost = {
  userId: number;
  id: number;
  title: string;
  body: string;
};

// Props untuk komponen Home
export type iHomeProps = {
  posts: iPost[];
};
