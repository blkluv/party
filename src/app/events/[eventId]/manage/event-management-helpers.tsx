"use client";

import { useUser } from "@clerk/nextjs";
import {
  ArrowPathIcon,
  ChartBarIcon,
  ClipboardIcon,
  LinkIcon,
  PlusIcon,
  TrashIcon,
} from "@heroicons/react/24/outline";
import { zodResolver } from "@hookform/resolvers/zod";
import type { inferProcedureOutput } from "@trpc/server";
import copy from "copy-to-clipboard";
import dayjs from "dayjs";
import Image from "next/image";
import Link from "next/link";
import type { FC } from "react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useDebounce } from "use-debounce";
import type { z } from "zod";
import { LoadingSpinner } from "~/app/_components/LoadingSpinner";
import { EditEventForm } from "~/app/_components/event-form-variants";
import { Button } from "~/app/_components/ui/button";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "~/app/_components/ui/command";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from "~/app/_components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "~/app/_components/ui/dropdown-menu";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/app/_components/ui/form";
import { Input } from "~/app/_components/ui/input";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/app/_components/ui/table";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "~/app/_components/ui/tabs";
import { useToast } from "~/app/_components/ui/use-toast";
import type { AppRouter } from "~/app/api/trpc/trpc-router";
import { env } from "~/config/env";
import type { EventRole } from "~/db/schema";
import { createPromotionCodeFormSchema } from "~/utils/createPromotionCodeFormSchema";
import { trpc } from "~/utils/trpc";

type FormData = z.infer<typeof createPromotionCodeFormSchema>;

export const ManagePromotionCodes: FC<{ eventId: string }> = (props) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const {
    data: codes = [],
    refetch: refetchCodes,
    isLoading,
  } = trpc.events.promotionCodes.getAllPromotionCodes.useQuery({
    eventId: props.eventId,
  });

  const { mutateAsync: createPromotionCode } =
    trpc.events.promotionCodes.createPromotionCode.useMutation({
      onSuccess: () => {
        refetchCodes();
        setIsDialogOpen(false);
      },
    });

  const form = useForm<FormData>({
    resolver: zodResolver(createPromotionCodeFormSchema),
    defaultValues: {
      name: "",
      code: "",
      percentageDiscount: 0,
    },
  });

  const onSubmit = async (values: FormData) => {
    await createPromotionCode({ ...values, eventId: props.eventId });
  };

  return (
    <div className="flex flex-col">
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogTrigger asChild>
          <Button className="ml-auto mb-2 mr-2">
            <p>Create Promotion Code</p>
            <PlusIcon className="ml-2 w-4 h-4" />
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogTitle>Create Promotion Code</DialogTitle>
          <DialogDescription>
            Create a promotion code that uses an existing coupon. This code
            applies to all tickets sold for your event.
          </DialogDescription>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Promotion code name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="code"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Code</FormLabel>
                    <FormControl>
                      <Input placeholder="Code" {...field} />
                    </FormControl>
                    <FormDescription>
                      This is the promotion code used to apply discounts.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="percentageDiscount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Percentage Discount</FormLabel>
                    <FormControl>
                      <Input placeholder="Discount" type="number" {...field} />
                    </FormControl>
                    <FormDescription>
                      This percentage amount will be deducted from the sale
                      price of the tickets.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button type="submit">
                <p>Create Promotion Code</p>
                {form.formState.isSubmitting && (
                  <ArrowPathIcon className="ml-2 animate-spin w-4 h-4" />
                )}
              </Button>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      <Table>
        <TableCaption>A list of promotion codes for your event.</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Code</TableHead>
            <TableHead>Discount</TableHead>
            <TableHead className="hidden sm:table-cell">Created At</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {codes.map((e) => (
            <PromotionCodeRow
              key={`promo code ${e.id}`}
              data={e}
              eventId={props.eventId}
            />
          ))}
        </TableBody>
      </Table>
      {isLoading && <LoadingSpinner className="mx-auto mt-8" size={30} />}
    </div>
  );
};

const PromotionCodeRow: FC<{
  data: inferProcedureOutput<
    AppRouter["events"]["promotionCodes"]["getAllPromotionCodes"]
  >[number];
  eventId: string;
}> = (props) => {
  const { data: ticketPrices = [], isLoading } =
    trpc.events.getOpenTicketPrices.useQuery({
      eventId: props.eventId,
    });
  const { mutateAsync: deletePromotionCode, isLoading: isDeleteLoading } =
    trpc.events.promotionCodes.deletePromotionCode.useMutation();
  const { toast } = useToast();

  const handleTicketPriceSelect = (id: string) => {
    const url = `${env.NEXT_PUBLIC_WEBSITE_URL}/events/${props.eventId}/tickets/purchase/${id}?code=${props.data.code}`;
    copy(url);
    toast({
      title: "Copied purchase link to clipboard",
    });
  };

  return (
    <TableRow>
      <TableCell>{props.data.name}</TableCell>
      <TableCell>{props.data.code}</TableCell>
      <TableCell>{props.data.percentageDiscount}%</TableCell>
      <TableCell className="hidden sm:table-cell">
        {dayjs(props.data.createdAt).format("D/MM/YYYY")}
      </TableCell>
      <TableCell>
        <div className="flex justify-center items-center gap-1 flex-col sm:flex-row">
          <Link
            href={`/events/${props.eventId}/promotion-codes/${props.data.id}`}
          >
            <Button variant="secondary" size="sm">
              <ChartBarIcon className="w-4 h-4" />
            </Button>
          </Link>
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="secondary" size="sm">
                <LinkIcon className="w-4 h-4" />
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogTitle>Create Purchase Link</DialogTitle>
              <DialogDescription>
                Generate a link for customers to purchase tickets directly using
                this promotion code.
              </DialogDescription>

              {ticketPrices.map((price) => (
                <Button
                  key={price.id}
                  variant="outline"
                  className="justify-between gap-2"
                  size="sm"
                  onClick={() => handleTicketPriceSelect(price.id)}
                >
                  <p>{price.name}</p>
                  <ClipboardIcon className="w-4 h-4" />
                </Button>
              ))}
              {isLoading && <LoadingSpinner size={20} className="mx-auto" />}
            </DialogContent>
          </Dialog>
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="secondary" size="sm">
                <TrashIcon className="w-4 h-4" />
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogTitle>Delete Promotion Code</DialogTitle>
              <DialogDescription>
                Deleting this promotion code prevents it from being used.
              </DialogDescription>

              <div className="flex justify-end gap-2">
                <Button variant="ghost">Go Back</Button>
                <Button
                  variant="destructive"
                  className="gap-2"
                  onClick={async () => {
                    await deletePromotionCode({
                      eventId: props.eventId,
                      promotionCodeId: props.data.id,
                    });
                  }}
                >
                  <p>Delete</p>
                  {isDeleteLoading && <LoadingSpinner />}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </TableCell>
    </TableRow>
  );
};

const ManageRoles: FC<{ eventId: string }> = (props) => {
  const [usersQuery, setUsersQuery] = useState("");
  const [open, setOpen] = useState(false);

  const [debouncedUsersQuery] = useDebounce(usersQuery, 150);
  const user = useUser();
  const utils = trpc.useContext();

  const {
    mutateAsync: createEventRole,
    isLoading: isCreateRoleLoading,
    variables: createEventRoleVariables,
  } = trpc.events.roles.createEventRole.useMutation();

  const { data: existingRoles = [], isLoading: isRolesLoading } =
    trpc.events.roles.getAllEventRoles.useQuery({ eventId: props.eventId });
  const { data: users = [], isFetching } = trpc.auth.searchUsers.useQuery(
    {
      query: debouncedUsersQuery,
    },
    {
      keepPreviousData: true,
      // Filter out users that already have roles attached
      select: (data) =>
        data.filter(
          (e) =>
            e.id !== user.user?.id &&
            !existingRoles.some((r) => r.userId === e.id)
        ),
    }
  );
  const {
    mutateAsync: updateEventRole,
    isLoading: isUpdateRoleLoading,
    variables: updateRoleVariables,
  } = trpc.events.roles.updateEventRole.useMutation();

  const handleUpdateEventRole = async (args: {
    roleId: string;
    role: EventRole["role"];
  }) => {
    utils.events.roles.getAllEventRoles.setData(
      { eventId: props.eventId },
      (data) =>
        data?.map((e) => (e.id === args.roleId ? { ...e, role: args.role } : e))
    );
    await updateEventRole({ ...args, eventId: props.eventId });
  };

  return (
    <div className="flex flex-col">
      <Button className="ml-auto" onClick={() => setOpen(true)}>
        <PlusIcon className="w-4 h-4 mr-2" />
        <p>Add User</p>
      </Button>
      <CommandDialog
        open={open}
        onOpenChange={setOpen}
        commandProps={{ shouldFilter: false }}
      >
        <div className="relative">
          <CommandInput
            placeholder="Search for a user "
            onValueChange={setUsersQuery}
            value={usersQuery}
          />
          {isFetching && (
            <div className="absolute right-10 top-1/2 -translate-y-1/2 flex items-center justify-center">
              <LoadingSpinner size={16} />
            </div>
          )}
        </div>
        <CommandList>
          <CommandEmpty>No results found.</CommandEmpty>
          <CommandGroup>
            {users.map((e) => (
              <CommandItem
                key={`user ${e.id}`}
                value={e.id}
                onSelect={async () => {
                  if (isCreateRoleLoading) {
                    return;
                  }

                  await createEventRole({
                    eventId: props.eventId,
                    userId: e.id,
                    role: "manager",
                  });

                  setOpen(false);
                }}
              >
                <div className="rounded-full overflow-hidden w-8 h-8 mr-4">
                  <Image
                    src={e.imageUrl}
                    loading="eager"
                    width={50}
                    height={50}
                    alt=""
                    className="object-cover h-full w-full"
                  />
                </div>
                <div className="flex flex-col justify-center items-start gap-1">
                  <p>{e.name}</p>
                  <p className="text-neutral-500 text-xs">{e.id}</p>
                </div>
                {createEventRoleVariables?.userId === e.id &&
                  isCreateRoleLoading && (
                    <div className="flex items-center justify-center ml-auto">
                      <LoadingSpinner size={16} />
                    </div>
                  )}
              </CommandItem>
            ))}
          </CommandGroup>
        </CommandList>
      </CommandDialog>
      <Table>
        <TableCaption>
          A list of users with special roles for this event.
        </TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>User</TableHead>
            <TableHead>Role</TableHead>
            <TableHead className="hidden sm:table-cell">Created At</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {existingRoles.map((e) => (
            <TableRow key={`event role user ${e.id}`}>
              <TableCell>
                <div className="flex items-center">
                  <div className="rounded-full overflow-hidden w-8 h-8 mr-4 hidden sm:table-cell">
                    <Image
                      src={e.userImageUrl}
                      loading="eager"
                      width={50}
                      height={50}
                      alt=""
                      className="object-cover h-full w-full"
                    />
                  </div>
                  <p>{e.userName}</p>
                </div>
              </TableCell>
              <TableCell>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="capitalize gap-2">
                      <p>{e.role}</p>
                      {isUpdateRoleLoading &&
                        updateRoleVariables?.roleId === e.id && (
                          <LoadingSpinner />
                        )}
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuItem
                      onClick={() =>
                        handleUpdateEventRole({ roleId: e.id, role: "admin" })
                      }
                    >
                      Admin
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() =>
                        handleUpdateEventRole({ roleId: e.id, role: "manager" })
                      }
                    >
                      Ticket Rep
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
              <TableCell className="hidden sm:table-cell">
                {dayjs(e.createdAt).format("D/MM/YYYY")}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      {isRolesLoading && <LoadingSpinner className="mx-auto mt-8" size={30} />}
    </div>
  );
};

export const ManagementContainer: FC<{
  eventId: string;
}> = (props) => {
  return (
    <div>
      <Tabs defaultValue="details">
        <TabsList className="w-full flex">
          <TabsTrigger value="details" className="flex-1">
            Details
          </TabsTrigger>
          <TabsTrigger value="roles" className="flex-1">
            Roles
          </TabsTrigger>
        </TabsList>
        <TabsContent value="roles">
          <ManageRoles eventId={props.eventId} />
        </TabsContent>
        <TabsContent value="details">
          <ManageEventDetails eventId={props.eventId} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

const ManageEventDetails: FC<{ eventId: string }> = (props) => {
  const { data: eventData, isLoading } = trpc.events.getFullEvent.useQuery({
    eventId: props.eventId,
  });

  if (isLoading || !eventData) {
    return (
      <div className="flex justify-center">
        <LoadingSpinner size={30} />
      </div>
    );
  }

  return (
    <EditEventForm
      eventId={props.eventId}
      type={eventData.type}
      initialValues={{
        ...eventData,
        startDate: new Date(eventData.startTime),
        startTime: dayjs(eventData.startTime).format("HH:mm"),
        eventMedia: eventData.eventMedia.map((e) => ({
          __type: "url",
          id: e.id,
          url: e.url,
          isPoster: e.isPoster,
        })),
      }}
    />
  );
};
