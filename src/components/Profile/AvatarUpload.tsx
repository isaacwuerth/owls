import {ProfileAvatar} from "../ProfileAvatar";
import {Box, Button} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import UploadFileIcon from "@mui/icons-material/UploadFile";
import React, {ChangeEvent} from "react";
import {useRecoilState, useRecoilValue, useSetRecoilState} from "recoil";
import {profileAtom} from "../../atoms/ProfileAtom";


export function AvatarUpload() {
    let setProfile = useSetRecoilState(profileAtom)
    function handleFileUpload(e: ChangeEvent<HTMLInputElement>) {
        if(!e.target.files) return;
        console.debug(e.target.files[0])
        e.target.value = ""
    }

    function handleDeleteProfileImage() {
        setProfile(oldProfile => {
            let newProfile = {...oldProfile}
            newProfile.avatar = undefined
            return newProfile
        })
    }

    return (<Box display="flex">
            <ProfileAvatar/>
            <Button
                component="label"
                variant="outlined"
                startIcon={<UploadFileIcon />}
                sx={{ marginRight: "1rem" }}
            >
                Upload CSV
                <input type="file" accept="*.*" hidden onChange={handleFileUpload} />
            </Button>
            <Button
                variant="outlined"
                startIcon={<DeleteIcon />}
                onClick={handleDeleteProfileImage}
            >
                Löschen
            </Button>
        </Box>
    )
}