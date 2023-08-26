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
import { SHOW_LOCATION_HOURS_THRESHOLD } from "~/config/constants";
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
          Your ticket will display the event location{" "}
          {SHOW_LOCATION_HOURS_THRESHOLD} hours before the designated event
          start time.
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
