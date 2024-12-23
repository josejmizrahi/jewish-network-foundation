import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { formatDistanceToNow } from "date-fns";

interface Post {
  id: string;
  title: string;
  content: string;
  created_at: string;
  profiles: {
    username: string;
    full_name: string;
  };
}

export function PostsList() {
  const { data: posts, isLoading } = useQuery({
    queryKey: ["posts"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("posts")
        .select(`
          *,
          profiles (
            username,
            full_name
          )
        `)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data as Post[];
    },
  });

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <Card key={i}>
            <CardHeader>
              <Skeleton className="h-4 w-[250px]" />
              <Skeleton className="h-4 w-[200px]" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-20 w-full" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {posts?.map((post) => (
        <Card key={post.id}>
          <CardHeader>
            <CardTitle>{post.title}</CardTitle>
            <CardDescription>
              Posted by {post.profiles.full_name || post.profiles.username}{" "}
              {formatDistanceToNow(new Date(post.created_at), { addSuffix: true })}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground whitespace-pre-wrap">{post.content}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}