import { useGlobalState } from "@/context/globalStateContext";

//i18n
import { useTranslation } from "next-i18next";

//styles
import className from "classnames/bind";
import styles from "./popupSearch.module.scss";
import Link from "next/link";
const cx = className.bind(styles);

export default function PopupSearch() {
    const [{ popupState }, setGlobalState] = useGlobalState();

console.log("@@@여기오긴오니");

    return (
        <>

            <h1 style={{color:"red"}}>gdgdgdg</h1>

        </>
    );
}
