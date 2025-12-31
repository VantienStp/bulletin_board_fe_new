import { authFetch } from "@/lib/auth";

export const fetcher = (url) => authFetch(url).then((res) => res.json());