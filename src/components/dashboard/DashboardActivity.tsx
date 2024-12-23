import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CreatePostForm } from "@/components/posts/CreatePostForm";
import { PostsList } from "@/components/posts/PostsList";

export function DashboardActivity({ user }: { user: any }) {
  return (
    <Card className="col-span-3">
      <CardHeader>
        <CardTitle>Recent Activity</CardTitle>
      </CardHeader>
      <CardContent>
        {user && <CreatePostForm />}
        <PostsList />
      </CardContent>
    </Card>
  );
}