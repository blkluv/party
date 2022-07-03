import PartyBoxEvent from "~/types/PartyBoxEvent";

interface Props {
  event: PartyBoxEvent;
}

const EventPreview = ({ event }: Props) => {
  return (
    <div>
      <p>{event.name}</p>
    </div>
  );
};

export default EventPreview;
