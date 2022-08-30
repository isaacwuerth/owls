import addDays from "date-fns/addDays";
import {atom} from "recoil";
import {GeneralEvent} from "../model/GeneralEvent";

const sampleData: GeneralEvent[] = [
    {id: 1, title: "Event 1", start: new Date(), end: addDays(new Date(), 10)}
]

export const eventListState = atom({
    key: 'eventListState',
    default: sampleData,
});
