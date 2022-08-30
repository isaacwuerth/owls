// that class only can be extended
import {IWrite} from "../interfaces/IWrite";
import {IRead} from "../interfaces/IRead";
import {addDoc, collection, getDocs } from "firebase/firestore";

export abstract class BaseRepository<T> implements IWrite<T>, IRead<T> {
    name: string;
    db: any;

    constructor(name: string, db: any) {
        this.name = name;
        this.db = db;
    }

    async create(item: T): Promise<string> {
        let obj = JSON.parse(JSON.stringify(item))
        const docRef = await addDoc(collection(this.db, this.name), obj);
        return docRef.id
    }

    update(id: string, item: T): Promise<string> {
        throw new Error("Method not implemented.");
    }

    delete(id: string): Promise<string> {
        throw new Error("Method not implemented.");
    }

    async find(item?: T): Promise<T[]> {
        let docs = await getDocs(collection(this.db, this.name));
        // @ts-ignore
        return docs.docs;
    }

    findOne(id: string): Promise<T> {
        throw new Error("Method not implemented.");
    }
}