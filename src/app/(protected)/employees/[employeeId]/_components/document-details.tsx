import ConfirmationPopup from "@/components/confirmation-popup";
import FileManager from "@/components/file-manager";
import useAxios from "@/hooks/useAxios";
import { MAX_SIZE } from "@/lib/constant";
import {
  useDeleteEmployeeDocumentMutation,
  useGetEmployeeDocumentQuery,
} from "@/redux/features/employeeDocumentApiSlice/employeeDocumentSlice";
import { useAppSelector } from "@/redux/hook";
import { Button } from "@/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/ui/card";
import { Dialog, DialogTrigger } from "@/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/ui/dropdown-menu";
import { Ellipsis, Loader2, Upload } from "lucide-react";
import { useSession } from "next-auth/react";
import { useParams } from "next/navigation";
import UploadDialog from "./upload-dialog";

export default function Document() {
  const { company_name } =
    useAppSelector((state) => state["setting-slice"]) || {};

  const { data: session } = useSession();
  const axios = useAxios({
    data: session,
  });
  const params = useParams<{ employeeId: string }>();
  let employeeId = params?.employeeId ?? "";
  if (!employeeId) {
    employeeId = session?.user.id as string;
  }

  const { data, isLoading } = useGetEmployeeDocumentQuery(employeeId);
  const [deleteDocument] = useDeleteEmployeeDocumentMutation();

  if (isLoading) {
    return (
      <Card>
        <CardContent className="py-20">
          <Loader2 className="animate-spin size-6 mx-auto" />
        </CardContent>
      </Card>
    );
  }

  return (
    <div>
      <Card>
        <CardHeader className="border-0 flex-row pb-0 w-full flex items-center justify-between">
          <CardTitle>Documents</CardTitle>
          <UploadDialog className="mt-0">
            <Upload className="size-4 mr-2" />
            Upload
          </UploadDialog>
        </CardHeader>
        <CardContent>
          {data?.result && data?.result?.documents.length > 0 ? (
            <ul className="grid md:grid-cols-3 sm:grid-cols-2 2xl:grid-cols-4 gap-4">
              {data.result.documents.map((document, index) => (
                <li
                  key={index}
                  className="col-span-1 rounded bg-light dark:bg-muted p-3 border border-border flex flex-col h-[290px] shadow-sm"
                >
                  <img
                    src={document._id}
                    alt={document.name}
                    className="w-full h-full object-contain"
                  />

                  <div className="w-full bg-border/40 rounded mb-3 flex items-center justify-center h-[150px] overflow-hidden">
                    <FileManager
                      setFile={() => {}}
                      enable={false}
                      existingFile={document.file}
                      folder={`${company_name.replace(/\s/g, "-").toLowerCase()}`}
                      maxSize={MAX_SIZE}
                      permission="public-read"
                      className="w-full h-full object-contain"
                    />
                  </div>
                  <p className="text-xs text-text-light dark:text-text-dark line-clamp-1 break-all mb-2 text-center">
                    {document.name}
                  </p>
                  <div className="flex justify-between items-center mt-auto gap-1">
                    <DropdownMenu>
                      <DropdownMenuTrigger>
                        <Ellipsis className="size-4" />
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem asChild>
                          <UploadDialog
                            size="sm"
                            type="button"
                            file={document.file}
                            variant="outline"
                            className="h-auto p-1.5 border-none w-full justify-start bg-transparent max-w-sm"
                          >
                            Preview
                          </UploadDialog>
                        </DropdownMenuItem>
                        {(session?.user.role === "admin" ||
                          session?.user.role === "moderator") && (
                          <DropdownMenuItem asChild>
                            <Dialog>
                              <DialogTrigger asChild>
                                <Button
                                  size="sm"
                                  className="border-none w-full bg-transparent text-left justify-start text-xs h-auto py-1.5 px-1.5 text-destructive hover:text-white"
                                  variant="destructive"
                                  type="button"
                                >
                                  Delete
                                </Button>
                              </DialogTrigger>
                              <ConfirmationPopup
                                handleConfirmation={async () => {
                                  const encodedKey = encodeURIComponent(
                                    document.file
                                  );
                                  const res = await axios.delete(
                                    `bucket/delete/${encodedKey}`
                                  );
                                  if (res.status !== 200) return;
                                  deleteDocument({
                                    documentId: document._id!,
                                    employeeId: employeeId,
                                  });
                                }}
                              />
                            </Dialog>
                          </DropdownMenuItem>
                        )}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p className="py-4 text-center text-text-light dark:text-text-dark">
              لا توجد مستندات مرفوعة
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
