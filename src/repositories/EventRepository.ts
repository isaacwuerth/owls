import {BaseRepository} from "./base/BaseRepository";
import {GeneralEvent} from '../model/GeneralEvent'
import {firestore} from "../firebase";

export class EventRepository extends BaseRepository<GeneralEvent>{

    constructor() {
        super("events", firestore);
    }
}