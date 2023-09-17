"use client";

import { InformationCircleIcon, MapPinIcon } from "@heroicons/react/24/outline";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import type { ComponentProps, FC } from "react";
import { useEffect, useRef, useState } from "react";
import { Button } from "~/app/_components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from "~/app/_components/ui/dialog";
import { env } from "~/config/env";
import { getForwardGeocoding } from "~/utils/getForwardGeocoding";
import { cn } from "~/utils/shadcn-ui";

export const TicketInfoButton = () => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="ghost">
          <InformationCircleIcon className="mr-2 w-5 h-5" />
          <p>Info</p>
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogTitle>Ticket Information</DialogTitle>
        <DialogDescription>
          Here&apos;s what you need to know about your ticket.
        </DialogDescription>
        <p>
          Welcome to our “Neon Nerfs/NEON NURFSS” event. We&apos;re thrilled to
          have you join us for a day of exciting fun and camaraderie. Please
          take a moment to read the following disclaimer carefully:
          <br />
          Participation at Your Own Risk:
          <br />
          By purchasing a ticket to this event and participating in the Nerf
          battles, you acknowledge and agree to the following:
          <br />
          Assumption of Risk: Nerf battles involve physical activity and the use
          of toy blasters. While we prioritize safety, there is a potential risk
          of minor injuries such as bumps, bruises, or scratches. Participants
          are responsible for their own safety during the event.
          <br />
          Safety Guidelines: We have established safety guidelines and rules for
          the Nerf battles to minimize risks. Please follow these guidelines at
          all times, including the use of eye protection provided by the event
          organizers.
          <br />
          Personal Responsibility: Participants are responsible for their
          actions and conduct during the event. Any deliberate or unsafe
          behavior may result in removal from the event without a refund.
          <br />
          Liability Waiver: By participating in this event, you waive any claims
          against the event organizers, hosts, and the venue for any injuries or
          damages sustained during the Nerf battles.
          <br />
          Emergency Services: In case of any medical emergency, please
          immediately seek assistance from event staff. We have trained
          personnel on-site to assist if needed.
          <br />
          By purchasing a ticket and participating in “Neon Nerfs/NEON NURFSS”,
          you confirm that you have read, understood, and accepted this
          disclaimer. Your safety is our top priority, and we want you to have a
          fantastic time while being mindful of your well-being.
          <br />
          Thank you for joining us, and let the Nerf battles begin!
        </p>
      </DialogContent>
    </Dialog>
  );
};

export const LocationDialog: FC<{
  location: string;
  variant?: ComponentProps<typeof Button>["variant"];
  showLabel?: boolean;
}> = ({ showLabel = true, ...props }) => {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant={props.variant} className="gap-2">
          <MapPinIcon className="w-4 h-4" />
          {showLabel && <p>View Location</p>}
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogTitle>Event Location</DialogTitle>
        <DialogDescription>
          This event is located at {props.location}
        </DialogDescription>
        <MapView location={props.location} />
      </DialogContent>
    </Dialog>
  );
};

export const MapView: FC<{ location: string; className?: string }> = (
  props
) => {
  const map = useRef<mapboxgl.Map | null>(null);
  const mapContainer = useRef<HTMLDivElement>(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    (async () => {
      if (!mapContainer.current || map.current) return;
      const geocoding = await getForwardGeocoding(props.location);
      if (!geocoding.features[0]) {
        setError(true);
        return;
      }

      const [geocodingLat, geocodingLong] = geocoding.features[0].center;

      const newMap = new mapboxgl.Map({
        container: mapContainer.current,
        style: "mapbox://styles/mapbox/dark-v11",
        center: [geocodingLat, geocodingLong],
        accessToken: env.NEXT_PUBLIC_MAPBOX_TOKEN,
        zoom: 14,
      });

      const marker = new mapboxgl.Marker({});

      marker.setLngLat([geocodingLat, geocodingLong]).addTo(newMap);

      map.current = newMap;
    })();
  }, [props.location]);

  return (
    !error && (
      <div
        ref={mapContainer}
        className={cn("w-full h-96 mb-8 mt-4", props.className)}
      />
    )
  );
};
