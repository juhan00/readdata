//i18n
import { useTranslation } from "next-i18next";

//styles
import styles from "./popupCost.module.scss";
import className from "classnames/bind";
const cx = className.bind(styles);

export default function PopupCost() {
  const { t } = useTranslation("popup");

  return (
    <div className={cx("cost")}>
      <div className={cx("cost-wrap")}>
        <table>
          <thead>
            <tr>
              <th>{t("cost.title1")}</th>
              <th>{t("cost.title2")}</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>
                <strong>{t("cost.cost_1")}</strong>
                {t("cost.unit")}
                <p>{t("cost.vat")}</p>
              </td>
              <td>
                <strong>{t("cost.cost_2")}</strong>
                {t("cost.unit")}
                <p>{t("cost.vat")}</p>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
