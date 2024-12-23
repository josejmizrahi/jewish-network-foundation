import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";

export function CreatePostForm() {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setIsSubmitting(true);
    try {
      const { error } = await supabase.from("posts").insert({
        title,
        content,
        author_id: user.id,
      });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Your post has been published",
      });

      setTitle("");
      setContent("");
      queryClient.invalidateQueries({ queryKey: ["posts"] });
    } catch (error) {
      console.error("Error creating post:", error);
      toast({
        title: "Error",
        description: "Failed to create post. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Create a Post</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Input
              placeholder="Post title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              disabled={isSubmitting}
            />
          </div>
          <div className="space-y-2">
            <Textarea
              placeholder="Write your post content..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              required
              disabled={isSubmitting}
              className="min-h-[100px]"
            />
          </div>
          <Button type="submit" disabled={isSubmitting} className="w-full">
            {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Publish Post
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}