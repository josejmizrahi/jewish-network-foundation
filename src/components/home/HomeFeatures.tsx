import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Share2, Users } from "lucide-react";
import { FeaturedEvents } from "./FeaturedEvents";

export function HomeFeatures() {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, delay: 0.9 }}
      className="grid gap-8 md:grid-cols-2 lg:grid-cols-3"
    >
      <FeaturedEvents />

      <Card className="relative overflow-hidden">
        <CardContent className="p-6 space-y-4">
          <Share2 className="h-12 w-12 text-primary" />
          <h3 className="text-xl font-semibold">Easy Sharing</h3>
          <p className="text-muted-foreground">
            Share events with friends and family across any platform. 
            Invite others to join and grow our community together.
          </p>
          <div className="flex flex-wrap gap-2">
            <Badge variant="secondary">WhatsApp</Badge>
            <Badge variant="secondary">Email</Badge>
            <Badge variant="secondary">Social Media</Badge>
          </div>
        </CardContent>
      </Card>

      <Card className="relative overflow-hidden">
        <CardContent className="p-6 space-y-4">
          <Users className="h-12 w-12 text-primary" />
          <h3 className="text-xl font-semibold">Private Events</h3>
          <p className="text-muted-foreground">
            Create private events for select groups. Manage invitations 
            and RSVPs with our intuitive event management system.
          </p>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Users className="h-4 w-4" />
            <span>Invitation-only Access</span>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}