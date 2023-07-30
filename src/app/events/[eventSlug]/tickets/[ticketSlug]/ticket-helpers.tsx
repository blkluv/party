"use client";

import { InformationCircleIcon, MapPinIcon } from "@heroicons/react/24/outline";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { FC, useEffect, useRef, useState } from "react";
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

export const TicketInfoButton = () => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="ghost">
          <p>Info</p>
          <InformationCircleIcon className="ml-2 w-5 h-5" />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogTitle>Ticket Information</DialogTitle>
        <DialogDescription>
          Here&apos;s what you need to know about your ticket.
        </DialogDescription>
        <p>
          The event location will be released {SHOW_LOCATION_HOURS_THRESHOLD}h
          before the event begins
        </p>
      </DialogContent>
    </Dialog>
  );
};

export const LocationDialog: FC<{ location: string }> = (props) => {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost">
          <p>View Location</p>
          <MapPinIcon className="ml-2 w-4 h-4" />
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

const MapView: FC<{ location: string }> = (props) => {
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
        style: "mapbox://styles/mapbox/streets-v12",
        center: [geocodingLat, geocodingLong],
        accessToken: env.NEXT_PUBLIC_MAPBOX_TOKEN,
        zoom: 14,
      });

      const marker = new mapboxgl.Marker({});

      marker.setLngLat([geocodingLat, geocodingLong]).addTo(newMap);

      map.current = newMap;
    })();
  }, [props.location]);

  return !error && <div ref={mapContainer} className="w-full h-96 mb-8 mt-4" />;
};
