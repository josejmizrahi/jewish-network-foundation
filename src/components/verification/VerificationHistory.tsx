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
import { Check, X, AlertCircle, FileText } from "lucide-react";
import { format } from "date-fns";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
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
            <TableHead>Documents</TableHead>
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
                {format(new Date(request.submitted_at || ''), "MMM d, yyyy")}
              </TableCell>
              <TableCell>
                {request.reviewed_at
                  ? format(new Date(request.reviewed_at), "MMM d, yyyy")
                  : "-"}
              </TableCell>
              <TableCell>
                {request.documents && request.documents.length > 0 ? (
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="ghost" size="sm">
                        <FileText className="h-4 w-4 mr-2" />
                        View ({request.documents.length})
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-4xl">
                      <DialogHeader>
                        <DialogTitle>Submitted Documents</DialogTitle>
                      </DialogHeader>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                        {request.documents.map((url, index) => (
                          <div key={url} className="aspect-square rounded-lg border bg-muted flex items-center justify-center overflow-hidden">
                            {url.toLowerCase().endsWith('.pdf') ? (
                              <a 
                                href={url} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="text-center p-4"
                              >
                                <FileText className="h-8 w-8 mx-auto mb-2" />
                                <p className="text-sm">View PDF</p>
                              </a>
                            ) : (
                              <img 
                                src={url} 
                                alt={`Document ${index + 1}`}
                                className="object-cover w-full h-full"
                              />
                            )}
                          </div>
                        ))}
                      </div>
                    </DialogContent>
                  </Dialog>
                ) : (
                  "-"
                )}
              </TableCell>
              <TableCell>{request.reviewer_notes || "-"}</TableCell>
            </TableRow>
          ))}
          {!requests?.length && (
            <TableRow>
              <TableCell colSpan={5} className="text-center">
                No verification requests found
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}