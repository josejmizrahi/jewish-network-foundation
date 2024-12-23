import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Check, X, AlertCircle } from "lucide-react";
import { format } from "date-fns";
import type { VerificationRequest } from "@/types/verification";

export function VerificationHistory() {
  const { data: requests, isLoading } = useQuery({
    queryKey: ["verification-requests"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("verification_requests")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data as VerificationRequest[];
    },
  });

  if (isLoading) {
    return <div>Loading verification history...</div>;
  }

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">Verification History</h3>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Status</TableHead>
            <TableHead>Submitted</TableHead>
            <TableHead>Reviewed</TableHead>
            <TableHead>Notes</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {requests?.map((request) => (
            <TableRow key={request.id}>
              <TableCell>
                <Badge
                  variant={
                    request.status === "approved"
                      ? "success"
                      : request.status === "rejected"
                      ? "destructive"
                      : "secondary"
                  }
                  className="flex items-center gap-1"
                >
                  {request.status === "approved" ? (
                    <Check className="h-3 w-3" />
                  ) : request.status === "rejected" ? (
                    <X className="h-3 w-3" />
                  ) : (
                    <AlertCircle className="h-3 w-3" />
                  )}
                  {request.status}
                </Badge>
              </TableCell>
              <TableCell>
                {format(new Date(request.submitted_at), "MMM d, yyyy")}
              </TableCell>
              <TableCell>
                {request.reviewed_at
                  ? format(new Date(request.reviewed_at), "MMM d, yyyy")
                  : "-"}
              </TableCell>
              <TableCell>{request.reviewer_notes || "-"}</TableCell>
            </TableRow>
          ))}
          {!requests?.length && (
            <TableRow>
              <TableCell colSpan={4} className="text-center">
                No verification requests found
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}