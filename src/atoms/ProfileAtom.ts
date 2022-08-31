import {atom} from "recoil";
import {ProfilModel} from "../model/ProfilModel";

let sampleData: ProfilModel = {
    id: "1",
    firstName: "John",
    lastName: "Dow",
    eMail: "jowhn@doe.com",
    avatar: "/spongbob.jpg"
}


export let profileAtom = atom<ProfilModel>({
    key: 'profileAtom',
    default: sampleData,
});