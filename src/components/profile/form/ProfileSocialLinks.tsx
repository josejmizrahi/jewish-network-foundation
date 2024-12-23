import { Input } from "@/components/ui/input";
import { Link } from "lucide-react";
import type { Profile } from "@/types/profile";

interface ProfileSocialLinksProps {
  profile: Profile;
  onProfileChange: (profile: Profile) => void;
}

export function ProfileSocialLinks({ profile, onProfileChange }: ProfileSocialLinksProps) {
  const handleSocialLinkChange = (platform: string, value: string) => {
    const currentLinks = (profile.social_links as Record<string, string>) || {};
    const updatedLinks = {
      ...currentLinks,
      [platform]: value,
    };
    onProfileChange({ ...profile, social_links: updatedLinks });
  };

  const getSocialLink = (platform: string): string => {
    const links = (profile.social_links as Record<string, string>) || {};
    return links[platform] || "";
  };

  return (
    <div className="space-y-4">
      <label className="text-sm font-medium flex items-center gap-2">
        <Link className="h-4 w-4" />
        Social Links
      </label>
      <div className="space-y-2">
        <Input
          type="url"
          placeholder="Twitter URL"
          value={getSocialLink("twitter")}
          onChange={(e) => handleSocialLinkChange("twitter", e.target.value)}
        />
        <Input
          type="url"
          placeholder="LinkedIn URL"
          value={getSocialLink("linkedin")}
          onChange={(e) => handleSocialLinkChange("linkedin", e.target.value)}
        />
        <Input
          type="url"
          placeholder="GitHub URL"
          value={getSocialLink("github")}
          onChange={(e) => handleSocialLinkChange("github", e.target.value)}
        />
      </div>
    </div>
  );
}